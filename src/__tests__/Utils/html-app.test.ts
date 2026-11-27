import { proto } from '../../../WAProto/index.js'
import type { HtmlAppMessageContent } from '../../Types/Message'
import { createHtmlAppDownloadBypassEdit } from '../../Utils/html-app'
import { generateWAMessageContent } from '../../Utils/messages'

type UnifiedResponse = {
	response_id: string
	sections: Array<{
		view_model: {
			primitive: {
				payload: string
				trusted_sources: string[]
				__typename: string
			}
			__typename: string
		}
	}>
}

describe('HTML App message generation', () => {
	it('round-trips the bot-forwarded rich response and inline HTML JSON', async () => {
		const markup = '<html><body><button>Tap</button></body></html>'
		const input: HtmlAppMessageContent = {
			markup,
			title: 'Test HTML App',
			height: 600
		}
		const message = await generateWAMessageContent(
			{ htmlApp: input },
			{ upload: async () => ({ mediaUrl: '', directPath: '' }) }
		)
		const decoded = proto.Message.decode(proto.Message.encode(message).finish())

		expect(decoded.messageContextInfo?.botMetadata?.messageDisclaimerText).toBe(input.title)
		expect(decoded.messageContextInfo?.deviceListMetadataVersion).toBe(2)
		expect(decoded.messageContextInfo?.messageSecret).toHaveLength(32)

		const richResponse = decoded.botForwardedMessage?.message?.richResponseMessage
		expect(richResponse?.messageType).toBe(proto.AIRichResponseMessageType.AI_RICH_RESPONSE_TYPE_STANDARD)
		expect(richResponse?.submessages).toEqual([])
		expect(richResponse?.contextInfo?.isForwarded).toBe(true)
		expect(richResponse?.contextInfo?.forwardingScore).toBe(1)

		const encodedUnifiedResponse = richResponse?.unifiedResponse?.data
		expect(encodedUnifiedResponse).toBeDefined()
		const unifiedResponse = JSON.parse(Buffer.from(encodedUnifiedResponse ?? []).toString('utf8')) as UnifiedResponse
		const primitive = unifiedResponse.sections[0]?.view_model.primitive

		expect(unifiedResponse.response_id).toBeTruthy()
		expect(primitive?.__typename).toBe('GenAIaeacdsnwHtmlPrimitive')
		expect(primitive?.trusted_sources).toEqual([])
		expect(primitive?.payload).toBe(
			`<style>html,body{margin:0;height:600px;max-height:600px;overflow:hidden}</style>${markup}`
		)

		const edit = createHtmlAppDownloadBypassEdit('test@s.whatsapp.net', 'HTML-APP-TEST', decoded)
		const decodedEdit = proto.Message.decode(proto.Message.encode(edit).finish())
		const protocolMessage = decodedEdit.botForwardedMessage?.message?.protocolMessage
		expect(protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.MESSAGE_EDIT)
		expect(protocolMessage?.key?.id).toBe('HTML-APP-TEST')
		expect(protocolMessage?.editedMessage?.botForwardedMessage?.message?.richResponseMessage).toBeDefined()
	})

	it('measures markup limits in UTF-8 bytes and rejects invalid heights', async () => {
		await expect(
			generateWAMessageContent(
				{ htmlApp: { markup: 'x'.repeat(256 * 1024 + 1) } },
				{ upload: async () => ({ mediaUrl: '', directPath: '' }) }
			)
		).rejects.toThrow('over the 262144 byte limit')

		await expect(
			generateWAMessageContent(
				{ htmlApp: { markup: 'é', maxBytes: 1 } },
				{ upload: async () => ({ mediaUrl: '', directPath: '' }) }
			)
		).rejects.toThrow('2 bytes')

		await expect(
			generateWAMessageContent(
				{ htmlApp: { markup: '<div>test</div>', height: 4097 } },
				{ upload: async () => ({ mediaUrl: '', directPath: '' }) }
			)
		).rejects.toThrow('integer from 1 to 4096')
	})
})
