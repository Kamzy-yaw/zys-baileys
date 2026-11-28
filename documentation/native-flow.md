# Native Flow

Native Flow is an experimental interactive-message implementation in ZysBaileys. It builds a WhatsApp `interactiveMessage` containing `nativeFlowMessage` quick-reply buttons.

> **Experimental:** Successful button rendering and interaction have not been confirmed for this Whiskey implementation. Previous manual compatibility reports said WhatsApp Desktop displayed “This message couldn't load. Open the message on your phone to view it.” and WhatsApp mobile showed a blank message without visible buttons. Treat these as reported failures, not successful compatibility tests, and use this feature for experimentation only.

## Basic Usage

Native Flow messages can be sent through the regular `sendMessage()` method.

```ts
await sock.sendMessage(jid, {
  text: 'Choose an option:',
  footer: 'ZysBaileys Native Flow',
  nativeFlow: [
    {
      text: 'Option A',
      id: 'option_a'
    },
    {
      text: 'Option B',
      id: 'option_b'
    }
  ]
})
```

The TypeScript message content requires a `text` string. It also permits an optional `footer` and an optional `nativeFlow` array of quick-reply button definitions. `nativeFlow` is optional in the public type; when present, the generator takes the Native Flow path.

## Button Properties

Each item in `nativeFlow` supports the following properties:

| Property | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | Yes | Button display text |
| `id` | `string` | Yes | Button identifier |
| `icon` | `string` | No | Optional icon value; a non-empty value is converted to uppercase during message generation |

## Message Properties

| Property | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | Yes | Main message body |
| `footer` | `string` | No | Optional footer text |
| `nativeFlow` | `Array<{ text: string; id: string; icon?: string }>` | No | Quick-reply button definitions; optional in the TypeScript type |

## How It Works

The message generator checks for the `nativeFlow` property and constructs an interactive message.

Each button becomes a `nativeFlowMessage.buttons` entry whose `name` is `quick_reply`. Its `buttonParamsJson` contains:

- `display_text`: The button's visible text.
- `id`: The button identifier.
- `icon`: The optional uppercase icon value.

The generated message uses:

- `interactiveMessage`
- `nativeFlowMessage`
- `messageVersion: 3`

The generator always assigns `interactiveMessage.body.text` from the required `text` value. It adds `interactiveMessage.footer.text` only when `footer` is truthy, so an empty footer is omitted. An empty `nativeFlow` array is accepted and produces a Native Flow message with no buttons; the implementation does not validate button count or button field values at runtime.

## Incoming Responses

The protobuf schema defines incoming responses under `interactiveResponseMessage.nativeFlowResponseMessage`, with optional `name`, `paramsJson`, and `version` fields. Generic incoming messages are decoded into the message protobuf, but this codebase does not add Native Flow-specific response parsing, a callback API, or an outgoing response mechanism.

If an incoming message contains that protobuf field, application code can inspect its raw values:

```js
const response =
  msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage

if (response) {
  console.log('Native Flow response:', response)
}
```

The library does not guarantee that a client will send a response, that `name` will be `quick_reply`, or that `paramsJson` will contain a particular payload. Inspect actual received messages before relying on their contents.

## Current Limitations

- Native Flow is experimental.
- Rendering has not been successfully verified in the current implementation.
- Previous manual compatibility reports described a WhatsApp Desktop loading error and a blank WhatsApp mobile message without visible buttons.
- Successful button rendering and interaction have not been confirmed.
- Native Flow-specific response handling and callbacks are not implemented.
- Compatibility may vary between WhatsApp clients and versions.

Do not rely on Native Flow for production-critical interactions until successful client-side testing has been completed.

## Implementation Notes

The current implementation is located in:

- `src/Types/Message.ts` — Native Flow message type.
- `src/Utils/messages.ts` — Interactive message generation.
- `WAProto/WAProto.proto` — Interactive message and response protobuf definitions.

The generator currently creates `quick_reply` buttons only. Available tests do not verify Native Flow generation or WhatsApp client rendering and interaction; the protobuf schema and generated message shape describe structure, not client compatibility.

