# Native Flow

Native Flow is an experimental interactive-message implementation in ZysBaileys. It builds a WhatsApp `interactiveMessage` containing `nativeFlowMessage` quick-reply buttons.

> **Experimental:** The current implementation has not been verified to render correctly on WhatsApp clients. In testing, the message could not be displayed properly on WhatsApp Desktop, while WhatsApp mobile showed no visible buttons. Use this feature for experimentation only.

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

The implementation accepts a message body, an optional footer, and an array of quick-reply button definitions.

## Button Properties

Each item in `nativeFlow` supports the following properties:

| Property | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | Yes | Button display text |
| `id` | `string` | Yes | Button identifier |
| `icon` | `string` | No | Optional icon value; converted to uppercase during message generation |

## Message Properties

| Property | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | Yes | Main message body |
| `footer` | `string` | No | Optional footer text |
| `nativeFlow` | `Array` | Yes | Quick-reply button definitions |

## How It Works

The message generator checks for the `nativeFlow` property and constructs an interactive message.

Each button is mapped to a `quick_reply` entry with a JSON payload containing:

- `display_text`: The button's visible text.
- `id`: The button identifier.
- `icon`: The optional uppercase icon value.

The generated message uses:

- `interactiveMessage`
- `nativeFlowMessage`
- `messageVersion: 3`

The message body and footer are added to the interactive message when provided.

## Receiving Button Responses

WhatsApp native-flow responses use `interactiveResponseMessage.nativeFlowResponseMessage`.

A response can be inspected using the following pattern:

```js
const response =
  msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage

if (response?.name === 'quick_reply') {
  const params = JSON.parse(response.paramsJson || '{}')

  console.log('Button ID:', params.id)
}
```

The response structure and actual client behavior should be verified against the WhatsApp messages received by your application.

## Current Limitations

- Native Flow is experimental.
- Rendering has not been successfully verified in the current implementation.
- WhatsApp Desktop displayed a message loading error during testing.
- WhatsApp mobile did not display the expected buttons during testing.
- Button interaction and response handling have not been confirmed end-to-end.
- Compatibility may vary between WhatsApp clients and versions.

Do not rely on Native Flow for production-critical interactions until successful client-side testing has been completed.

## Implementation Notes

The current implementation is located in:

- `src/Types/Message.ts` — Native Flow message type.
- `src/Utils/messages.ts` — Interactive message generation.

The implementation currently supports `quick_reply` buttons only.

