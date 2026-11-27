import { randomUUID } from 'crypto'
import { proto } from '../../WAProto/index.js'
import type { HtmlAppMessageContent, WAMessageContent } from '../Types/Message'

const DEFAULT_MAX_BYTES = 256 * 1024
const MAX_HEIGHT = 4096
const HTML_PRIMITIVE = 'GenAIaeacdsnwHtmlPrimitive'

export const prepareHtmlAppMessage = ({ markup, title, height, maxBytes }: HtmlAppMessageContent): WAMessageContent => {
	if (typeof markup !== 'string' || markup.trim().length === 0) {
		throw new TypeError('htmlApp.markup must be a non-empty HTML string')
	}

	if (height !== undefined && (!Number.isInteger(height) || height <= 0 || height > MAX_HEIGHT)) {
		throw new RangeError(`htmlApp.height must be an integer from 1 to ${MAX_HEIGHT}`)
	}

	if (maxBytes !== undefined && (!Number.isInteger(maxBytes) || maxBytes <= 0)) {
		throw new RangeError('htmlApp.maxBytes must be a positive integer')
	}

	const byteLimit = maxBytes ?? DEFAULT_MAX_BYTES
	const markupBytes = Buffer.byteLength(markup, 'utf8')
	if (markupBytes > byteLimit) {
		throw new RangeError(`htmlApp.markup is ${markupBytes} bytes, over the ${byteLimit} byte limit`)
	}

	const payload =
		height === undefined
			? markup
			: `<style>html,body{margin:0;height:${height}px;max-height:${height}px;overflow:hidden}</style>${markup}`
	const unifiedResponse = {
		response_id: randomUUID(),
		sections: [
			{
				view_model: {
					primitive: {
						payload,
						trusted_sources: [],
						__typename: HTML_PRIMITIVE
					},
					__typename: 'GenAISingleLayoutViewModel'
				}
			}
		]
	}

	const richResponseMessage = proto.AIRichResponseMessage.create({
		messageType: proto.AIRichResponseMessageType.AI_RICH_RESPONSE_TYPE_STANDARD,
		submessages: [],
		unifiedResponse: {
			data: Buffer.from(JSON.stringify(unifiedResponse), 'utf8')
		},
		contextInfo: {
			forwardingScore: 1,
			isForwarded: true,
			forwardedAiBotMessageInfo: { botJid: '0@bot' },
			forwardOrigin: 4
		}
	})

	return {
		messageContextInfo: {
			deviceListMetadata: {},
			deviceListMetadataVersion: 2,
			botMetadata: {
				messageDisclaimerText: title ?? '',
				richResponseSourcesMetadata: { sources: [] }
			}
		},
		botForwardedMessage: {
			message: { richResponseMessage }
		}
	}
}

export const createHtmlAppDownloadBypassEdit = (
	remoteJid: string,
	originalMessageId: string,
	editedMessage: proto.IMessage
): proto.IMessage => ({
	botForwardedMessage: {
		message: {
			protocolMessage: {
				key: { remoteJid, fromMe: true, id: originalMessageId },
				type: proto.Message.ProtocolMessage.Type.MESSAGE_EDIT,
				editedMessage
			}
		}
	}
})
