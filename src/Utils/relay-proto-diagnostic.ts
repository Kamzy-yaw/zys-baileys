import { proto } from '../../WAProto/index.js'
import { unpadRandomMax16 } from './generics'

const capturedSamples = new Set<'text' | 'native-flow'>()

const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !ArrayBuffer.isView(value)

// Keep structure while discarding all scalar values, including content and identifiers.
const structureShape = (value: unknown): unknown => {
	if (value === null) return null
	if (ArrayBuffer.isView(value)) return { byteLength: value.byteLength }
	if (Array.isArray(value)) return value.map(structureShape)
	if (isObject(value)) {
		return Object.fromEntries(
			Object.keys(value)
				.sort()
				.map(key => [key, structureShape(value[key])])
		)
	}

	return typeof value
}

const unwrapDeviceSentMessage = (message: proto.IMessage): proto.IMessage =>
	message.deviceSentMessage?.message ?? message

/** Temporary, opt-in relay diagnostic. It logs structure and encoded size only. */
export const captureRelayProtoDiagnostic = (
	message: proto.IMessage,
	bytes: Uint8Array,
	logger: { info: (obj: object, msg: string) => void }
) => {
	if (process.env.BAILEYS_RELAY_PROTO_DIAGNOSTICS !== '1') return

	try {
		const decoded = proto.Message.decode(unpadRandomMax16(bytes))
		const inspected = unwrapDeviceSentMessage(message)
		const decodedInspected = unwrapDeviceSentMessage(decoded)
		const isNativeFlow = !!decodedInspected.interactiveMessage?.nativeFlowMessage
		const isText = !!(decodedInspected.conversation || decodedInspected.extendedTextMessage)
		const sample = isNativeFlow ? 'native-flow' : isText ? 'text' : undefined
		if (!sample || capturedSamples.has(sample)) return

		const beforeShape = structureShape(
			proto.Message.toObject(proto.Message.fromObject(inspected), { bytes: String, longs: String })
		)
		const afterShape = structureShape(
			proto.Message.toObject(proto.Message.fromObject(decodedInspected), { bytes: String, longs: String })
		)
		const nativeFlow = decodedInspected.interactiveMessage?.nativeFlowMessage

		capturedSamples.add(sample)
		logger.info(
			{
				sample,
				topLevelFields: Object.keys(decoded).sort(),
				hasNativeFlow: !!nativeFlow,
				nativeFlowButtonCount: nativeFlow?.buttons?.length ?? 0,
				encodedByteLength: bytes.byteLength,
				decodedStructureMatches: JSON.stringify(beforeShape) === JSON.stringify(afterShape)
			},
			'relay protobuf diagnostic (sensitive values redacted)'
		)
	} catch {
		// Diagnostics must never change whether the message is encrypted or sent.
	}
}
