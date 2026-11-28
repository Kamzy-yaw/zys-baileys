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
| `markup` | `string` | Yes | Non-empty HTML markup included verbatim in the message payload |
| `title` | `string` | No | Disclaimer label displayed with the forwarded card; defaults to an empty string |
| `height` | `number` | No | Integer card height in CSS pixels, from 1 to 4096; when omitted, no height CSS is added |
| `bypassDownload` | `boolean` | No | When `true`, attempts an additional reference-style message edit after the initial send; defaults to `false` |
| `maxBytes` | `number` | No | Positive integer limit on the original markup's UTF-8 byte size; defaults to 262144 bytes (256 KiB) |

## Height Configuration

The `height` property accepts integer values from 1 to 4096. The markup is not otherwise parsed or resized.

When provided, ZysBaileys prepends a `<style>` element setting `html` and `body` to that height and maximum height, removing margins, and hiding overflow. This CSS is placed before the supplied markup.

```js
await sock.sendMessage(jid, {
  htmlApp: {
    markup: '<h1>Custom Height</h1>',
    height: 600
  }
})
```

## Markup Size Limit

The default maximum markup size is 262144 bytes (256 KiB).

You can override this limit using `maxBytes`, which must be a positive integer. There is no additional upper bound in the implementation.

```js
await sock.sendMessage(jid, {
  htmlApp: {
    markup: '<h1>Large HTML App</h1>',
    maxBytes: 512 * 1024
  }
})
```

The limit is measured using the UTF-8 byte length of the original `markup` string before any height CSS is prepended. The markup must fit within the configured limit; the generated CSS is not included in this check.

## Download Bypass

Set `bypassDownload` to `true` to request an additional reference-style message edit. The edit is attempted only after the initial HTML App relay succeeds and an original message ID and message are available.

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

When enabled, ZysBaileys creates a `MESSAGE_EDIT` protocol operation referencing the original message ID and containing the generated HTML App message.

The edit is relayed after the initial message. If that additional relay fails, its error is swallowed and the initial HTML App message remains sent. This is best-effort behavior; it does not guarantee that download prompts are suppressed.

This behavior is experimental and is not guaranteed to work consistently across WhatsApp clients. It should not be treated as universally disabling download prompts.

## Validation

The implementation performs the following checks:

- `markup` must be a string that is not empty or whitespace-only. It is not otherwise checked for valid or well-formed HTML, and its contents are not sanitized or trimmed before being sent.
- `height`, when provided, must be an integer between 1 and 4096.
- `maxBytes`, when provided, must be a positive integer.
- The original markup's UTF-8 byte length must not exceed the configured byte limit.

These checks run during message generation, before the initial message is relayed. Invalid values cause an error.

## Security Considerations

HTML markup is included verbatim in the message payload and sent to recipient devices, where it may be rendered and executed by the client.

- Only use trusted HTML markup.
- Never interpolate secrets or untrusted user input into the markup.
- External resources and network requests may be restricted by the recipient's WebView or Content Security Policy (CSP).
- Do not assume support for `localStorage`, external scripts, arbitrary APIs, or a custom JavaScript bridge; these capabilities are not established by this implementation.

## Implementation Details

HTML App is packaged using:

- `AIRichResponseMessage`
- `GenAISingleLayoutViewModel`
- `GenAIaeacdsnwHtmlPrimitive`

The HTML markup is stored in the primitive payload inside the unified response structure.

## Limitations

- HTML App is experimental.
- Rendering behavior depends on WhatsApp client compatibility.
- WhatsApp Android rendering has not been verified for this Whiskey implementation.
- The additional download-bypass edit is best-effort.
- External resources and network requests may be restricted by the recipient's WebView or CSP.
- Support for `localStorage`, external scripts, arbitrary APIs, and a custom JavaScript bridge is not verified and should not be assumed.

## Credits

The HTML App implementation is adapted from [Zeative/Zaileys](https://github.com/zeative/zaileys).

Please preserve the original attribution notices and applicable license requirements.
