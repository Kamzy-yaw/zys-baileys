import { randomBytes } from 'node:crypto'
import type { proto } from '../../WAProto/index.js'
import type { BinaryNode } from '../WABinary'

const NATIVE_FLOW_NAMES_REQUIRING_EXPLICIT_NAME = new Set([
	'mpm',
	'cta_catalog',
	'send_location',
	'call_permission_request',
	'wa_payment_transaction_details',
	'automated_greeting_message_view_catalog'
])

/** Sairi-compatible <biz> node builder, kept private for the relay A/B experiment. */
export const getNativeFlowBizBinaryNode = (message: proto.IMessage): BinaryNode | undefined => {
	const flowMessage = message.interactiveMessage?.nativeFlowMessage
	if (!flowMessage) return

	const firstButtonName = flowMessage.buttons?.[0]?.name
	const attrs: BinaryNode['attrs'] = {
		actual_actors: '2',
		host_storage: '2',
		privacy_mode_ts: `${(Date.now() / 1_000) | 0}`
	}
	const qualityControl: BinaryNode = {
		tag: 'quality_control',
		attrs: {
			decision_id: randomBytes(20).toString('hex'),
			source_type: 'third_party'
		},
		content: [{ tag: 'decision_source', attrs: { value: 'df' } }]
	}

	if (firstButtonName === 'review_and_pay' || firstButtonName === 'payment_info') {
		attrs.native_flow_name = firstButtonName === 'review_and_pay' ? 'order_details' : firstButtonName
		return { tag: 'biz', attrs, content: [qualityControl] }
	}

	if (firstButtonName && NATIVE_FLOW_NAMES_REQUIRING_EXPLICIT_NAME.has(firstButtonName)) {
		return {
			tag: 'biz',
			attrs,
			content: [
				{
					tag: 'interactive',
					attrs: { type: 'native_flow', v: '1' },
					content: [{ tag: 'native_flow', attrs: { v: '2', name: firstButtonName } }]
				},
				qualityControl
			]
		}
	}

	return {
		tag: 'biz',
		attrs,
		content: [
			{
				tag: 'interactive',
				attrs: { type: 'native_flow', v: '1' },
				content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
			},
			qualityControl
		]
	}
}
