# HTML App

HTML App is an experimental feature in ZysBaileys that allows developers to send HTML-based interactive content through WhatsApp messages.

The implementation packages HTML markup inside a WhatsApp Rich Response message using a dedicated HTML primitive.

## Basic Usage

```js
await sock.sendMessage(jid, {
  htmlApp: {
    title: 'ZysBaileys HTML App',
    markup: `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Hello World!</h1>
          <p>Welcome to ZysBaileys.</p>
        </body>
      </html>
    `,
    height: 750
  }
})
```

## API Reference

The `htmlApp` property accepts the following options:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `markup` | `string` | Yes | HTML markup to include in the message |
| `title` | `string` | No | Disclaimer label displayed with the forwarded card |
| `height` | `number` | No | Fixed card height in CSS pixels |
| `maxBytes` | `number` | No | Maximum UTF-8 markup size in bytes |
| `bypassDownload` | `boolean` | No | Attempts an additional reference-style message edit after sending |

## Height Configuration

The `height` property accepts integer values from 1 to 4096.

When provided, ZysBaileys prepends CSS that sets the HTML document and body height, limits their maximum height, removes margins, and hides overflow.

```js
await sock.sendMessage(jid, {
  htmlApp: {
    markup: '<h1>Custom Height</h1>',
    height: 600
  }
})
```

## Markup Size Limit

The default maximum markup size is 256 KB.

You can override this limit using `maxBytes`.

```js
await sock.sendMessage(jid, {
  htmlApp: {
    markup: '<h1>Large HTML App</h1>',
    maxBytes: 512 * 1024
  }
})
```

The limit is measured using the UTF-8 byte length of the original markup.

## Download Bypass

The optional `bypassDownload` property enables an additional message-edit operation after the initial HTML App message has been relayed.

```js
await sock.sendMessage(jid, {
  htmlApp: {
    title: 'ZysBaileys Arcade',
    markup: '<h1>Arcade</h1>',
    height: 750,
    bypassDownload: true
  }
})
```

When enabled, ZysBaileys creates a reference-style `MESSAGE_EDIT` operation referencing the original message ID.

The edit is sent after the initial message. If the additional edit fails, the original HTML App message remains sent.

**Note:** This behavior is experimental and is not guaranteed to work consistently across WhatsApp clients.

## Validation

The implementation performs the following checks:

- `markup` must be a non-empty string.
- `height`, when provided, must be an integer between 1 and 4096.
- `maxBytes`, when provided, must be a positive integer.
- The original markup must not exceed the configured byte limit.

Invalid values cause an error before the message is sent.

## Security Considerations

HTML markup is included verbatim in the message payload.

- Only use trusted HTML markup.
- Never interpolate credentials, API keys, session tokens, or other secrets.
- Escape untrusted values before inserting them into HTML.
- Do not assume external network access or browser APIs are available inside the WhatsApp client.
- Content Security Policy (CSP) and client-side restrictions may prevent external resources or scripts from working.

## Implementation Details

HTML App is packaged using:

- `AIRichResponseMessage`
- `GenAISingleLayoutViewModel`
- `GenAIaeacdsnwHtmlPrimitive`

The HTML markup is stored in the primitive payload inside the unified response structure.

## Limitations

- HTML App is experimental.
- Rendering behavior depends on WhatsApp client compatibility.
- Android rendering has not been verified for this implementation.
- The additional download-bypass edit is best-effort.
- External scripts, resources, and network requests may be restricted by the client.

## Credits

The HTML App implementation is adapted from [Zeative/Zaileys](https://github.com/zeative/zaileys).

Please preserve the original attribution notices and applicable license requirements.
