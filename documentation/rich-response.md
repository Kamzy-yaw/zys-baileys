# Rich Response

Rich Response is an experimental structured messaging feature in ZysBaileys. It allows developers to send formatted text, syntax-highlighted code blocks, tables, and links through WhatsApp messages.

## Features

- Structured text content
- Syntax-highlighted code blocks
- Tabular data
- Link citations
- Optional header and footer text
- Multiple content sections through `richResponse`

## Basic Usage

```js
await sock.sendMessage(jid, {
  richResponse: [
    {
      text: 'Hello from ZysBaileys!'
    }
  ]
})
```

## Text Content

```js
await sock.sendMessage(jid, {
  richResponse: [
    {
      text: 'Welcome to ZysBaileys Rich Response.'
    },
    {
      text: 'This is another content section.'
    }
  ]
})
```

## Code Blocks

Use the `code` property to send a syntax-highlighted code block.

```js
await sock.sendMessage(jid, {
  code: `
async function hello() {
  console.log('Hello, ZysBaileys!')
}
`,
  language: 'javascript'
})
```

Supported languages:

- JavaScript
- TypeScript
- Python
- Bash
- PowerShell
- CSS
- HTML
- Go
- C++
- C
- C#
- Rust
- CMD

Common aliases such as `js`, `ts`, `py`, `sh`, and `ps1` are also supported.

## Tables

```js
await sock.sendMessage(jid, {
  title: 'ZysBaileys Features',
  table: [
    ['Feature', 'Status'],
    ['Rich Response', 'Available'],
    ['HTML App', 'Experimental'],
    ['Native Flow', 'Experimental']
  ]
})
```

The first row is treated as a heading by default.

Set `noHeading: true` to disable the heading behavior.

## Links

```js
await sock.sendMessage(jid, {
  links: [
    {
      text: 'Project Documentation',
      url: 'https://example.com',
      title: 'Documentation',
      displayName: 'Documentation'
    }
  ]
})
```

A link must provide a URL through `url` or through one of its `sources` entries.

## Header and Footer

```js
await sock.sendMessage(jid, {
  headerText: 'Project Update',
  contentText: 'ZysBaileys is an experimental Baileys fork.',
  footerText: 'Powered by ZysBaileys.'
})
```

## Structured Content

Use `richResponse` to combine different content item types in one message.

Supported item types:

- Text: `{ text: '...' }`
- Code: `{ code: [...], language: 'javascript' }`
- Table: `{ table: [...], title: '...' }`

Code items inside `richResponse` require `RichCodeBlock[]`, unlike the top-level `code` property which accepts a string.

## Important Notes

- Rich Response is experimental.
- Rendering may differ between WhatsApp clients.
- Syntax highlighting uses a lightweight tokenizer.
- `disclaimerText` is currently defined in the type but is not processed by the Rich Response utility.
- The separate `code`, `links`, and `table` properties are handled as alternatives, not combined automatically.
- Some advanced rendering behavior may depend on WhatsApp client support.

## Credits

The Rich Response implementation is adapted from [@sairidev/baileys](https://github.com/sairidev/baileys-new).

Please preserve the original attribution notice and applicable license requirements.
