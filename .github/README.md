 <div align="center">
  <img
  src="https://raw.githubusercontent.com/Kamzy-yaw/zys-baileys/refs/heads/feature/rich-response/zysbaileys-banner.png"
  alt="ZysBaileys"
  width="100%"
/>
  
  <h3>Extending WhatsApp Web Experiences.</h3>

  <p>
    An experimental Baileys fork focused on extended messaging capabilities,
    interactive experiences, and custom WhatsApp Web functionality.
  </p>

  <p>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
    <img src="https://img.shields.io/badge/Status-Experimental-orange?style=flat-square" />
  </p>
</div>

---

## About

**ZysBaileys** is an experimental fork of [Baileys](https://github.com/WhiskeySockets/Baileys), a WebSockets-based TypeScript library for interacting with the WhatsApp Web API.

This fork explores additional messaging capabilities, custom message structures, and interactive experiences while maintaining the familiar Baileys development workflow.

## Features

- **Rich Response** — Extended WhatsApp messages with formatted content and code blocks.
- **HTML App** — Experimental HTML-based interactive experiences.
- **Native Flow** — Experimental support for interactive native-flow messages.
- **Baileys Compatibility** — Built on the Baileys codebase and its existing messaging architecture

## Documentation

Explore the detailed documentation for each feature:

| Documentation | Description |
| --- | --- |
| [Rich Response](documentation/rich-response.md) | Structured messages, code blocks, tables, and links. |
| [HTML App](documentation/html-app.md) | Experimental HTML-based interactive experiences. |
| [Native Flow](documentation/native-flow.md) | Experimental native-flow interactive messages. |
| [Migration Guide](documentation/migration.md) | Guide for migrating existing Baileys projects to ZysBaileys. |

For implementation details, examples, and limitations, refer to the corresponding documentation.

## Rich Response

Rich Response extends WhatsApp messaging with structured content, including formatted text, syntax-highlighted code blocks, tables, and links.

### Code Example

Send a code block with a specified programming language:

```js
await sock.sendMessage(jid, {
    headerText: 'JavaScript Example',
    code: 'const message = "Hello World";\nconsole.log(message);',
    language: 'javascript'
})
```

### Rich Content

Combine multiple content items in a single Rich Response message:

```js
await sock.sendMessage(jid, {
    richResponse: [
        {
            text: 'Welcome to ZysBaileys!'
        },
        {
            language: 'javascript',
            code: [
                {
                    highlightType: 1,
                    codeContent: 'const'
                },
                {
                    highlightType: 0,
                    codeContent: ' message = "Hello World";'
                }
            ]
        }
    ]
})
```

### Tables

Send structured tabular content:

```js
await sock.sendMessage(jid, {
    headerText: 'Feature Comparison',
    title: 'ZysBaileys Features',
    table: [
        ['Feature', 'Status'],
        ['Rich Response', 'Available'],
        ['Code Blocks', 'Available'],
        ['HTML App', 'Experimental']
    ]
})
```

### Links

Send links with titles and display names:

```js
await sock.sendMessage(jid, {
    headerText: 'Useful Links',
    links: [
        {
            text: 'Documentation',
            url: 'https://example.com',
            title: 'Project Documentation',
            displayName: 'Documentation'
        }
    ]
})
```

### Supported Content Properties

| Property | Description |
| --- | --- |
| `richResponse` | Multiple structured content items |
| `code` | Code block content |
| `language` | Programming language for code highlighting |
| `table` | Two-dimensional table data |
| `links` | Link collection |
| `headerText` | Message header |
| `title` | Content title |
| `footerText` | Footer text |

**Note:** Rich Response rendering may vary depending on the WhatsApp client and version. Test compatibility with your target devices.


## Installation

Install ZysBaileys directly from GitHub:

```bash
npm install github:Kamzy-yaw/zys-baileys
```

Or add it to your `package.json`:

```json
{
  "dependencies": {
    "@whiskeysockets/baileys": "github:Kamzy-yaw/zys-baileys"
  }
}
```

## Quick Start

```js
import makeWASocket from '@whiskeysockets/baileys'

const sock = makeWASocket({
    // Your connection configuration
})

sock.ev.on('connection.update', (update) => {
    console.log('Connection update:', update)
})
```

For authentication, message handling, and advanced usage, refer to the documentation inherited from the original Baileys project.



## Project Status

ZysBaileys is actively experimental. Features may change, behave differently across WhatsApp clients, or require further testing.

## Disclaimer

ZysBaileys is an unofficial, independently maintained fork. It is not affiliated with, endorsed by, or officially connected to WhatsApp, Meta, or WhiskeySockets.

Use this project responsibly and comply with WhatsApp's Terms of Service. Do not use it for spam, abusive automation, or unauthorized activities.


## Credits

ZysBaileys builds upon and adapts work from these open-source projects:

- **[WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)** — Original Baileys library and upstream foundation.
- **[Sairidev/Baileys](https://github.com/sairidev/baileys-new)** — Source of the Rich Response implementation adapted in ZysBaileys.
- **[Zeative/Zaileys](https://github.com/zeative/zaileys)** — Source of the HTML App implementation adapted in ZysBaileys.

We sincerely appreciate the original authors, maintainers, and contributors for their work.

Original copyright notices and applicable license terms are preserved. See the [MIT License](LICENSE) for details.

---
