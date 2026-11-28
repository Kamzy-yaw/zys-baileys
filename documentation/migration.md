# Migration Guide

This guide helps existing Baileys users transition to ZysBaileys.

## Overview

ZysBaileys is built on top of the WhiskeySockets/Baileys codebase and includes additional experimental features.

Existing projects may require adjustments depending on the version of Baileys they currently use and the APIs they rely on.

## Before Migrating

Before making changes:

1. Back up your existing project.
2. Back up your WhatsApp authentication/session data securely. Do not assume credentials from every Baileys release or fork can be reused without verification.
3. Review your current Baileys version.
4. Check whether your project uses custom patches or third-party extensions.
5. Confirm your runtime meets the package requirement: Node.js 20 or later.
6. Review the ZysBaileys documentation for experimental features.

## Installation

The package name remains `@whiskeysockets/baileys`. Install the repository's current GitHub version with npm:

```bash
npm install github:Kamzy-yaw/zys-baileys
```

The README also documents adding the GitHub spec under `@whiskeysockets/baileys` in `package.json`. The package's `prepare` script builds the project when installed from Git. The main import remains:

```ts
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
```

Use the GitHub repository URL and package name above; simply renaming the dependency to a different package name is not part of this migration.

## Update the Connection Setup

The core socket, authentication, and event pattern remains familiar. For example, this uses the public socket and auth exports:

```ts
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'

const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
const sock = makeWASocket({ auth: state })

sock.ev.on('creds.update', saveCreds)
sock.ev.on('connection.update', ({ connection, qr, lastDisconnect }) => {
  if (qr) console.log('Scan this QR code to log in:', qr)
  if (connection === 'open') console.log('WhatsApp connection opened')
  if (connection === 'close') console.error('WhatsApp connection closed:', lastDisconnect?.error)
})

sock.ev.on('messages.upsert', ({ messages, type }) => {
  if (type === 'notify') {
    for (const message of messages) {
      console.log('Received message:', message.key.id)
    }
  }
})
```

Send ordinary messages through the existing `sendMessage()` pattern:

```ts
await sock.sendMessage(jid, { text: 'Hello' })
```

This example demonstrates the current API shape; add your application's pairing, reconnection, logging, and message-processing policies as needed. Keep the authentication directory private.

## API Compatibility

The current source retains familiar Baileys entry points such as the default `makeWASocket` export, `useMultiFileAuthState`, `sock.ev`, and `sock.sendMessage()`. This supports carrying over many core Baileys examples, but does not establish complete compatibility with every upstream release, fork, plugin, or internal API. Check examples against the installed package's public exports and types, then verify your application's flow with the version you install.

Pay special attention to:

- Message generation and sending.
- Authentication and session management.
- Event handling.
- Custom message types.
- Third-party plugins and extensions.

Code that depends on upstream internals, custom patches, or APIs added in a different Baileys version may need adaptation. The repository is an experimental fork, so test your normal login, reconnect, receive, and send paths before switching production traffic.

## Additional Features

ZysBaileys includes these additional message capabilities. They are experimental, not drop-in replacements for ordinary text messages; review each feature's API and limitations before adopting it:

- [Rich Response](rich-response.md) — experimental structured content; rendering may vary by WhatsApp client.
- [HTML App](html-app.md) — experimental HTML content sent to recipient devices; Android rendering for this implementation is unverified, and client restrictions may apply.
- [Native Flow](native-flow.md) — experimental interactive messages; successful button rendering and interaction are unconfirmed, with previous manual reports of display failures on Desktop and mobile.

## Migration Checklist

- [ ] Back up the existing project.
- [ ] Back up authentication/session data.
- [ ] Install ZysBaileys.
- [ ] Confirm imports use `@whiskeysockets/baileys` and public exports available in the installed version.
- [ ] Verify existing message-sending functionality.
- [ ] Verify authentication using a protected backup and test reconnection behavior.
- [ ] Test custom plugins and integrations.
- [ ] Review experimental feature limitations before using them.

## Troubleshooting

If something does not work after migration:

1. Check the installed package version and confirm Node.js is 20 or later.
2. Review the terminal output and error messages.
3. Confirm the GitHub dependency resolved to the intended repository and that npm completed the package build.
4. Test the affected feature with a minimal example.
5. Check the repository's issues and current documentation for known limitations.

## Important Notes

- This guide does not guarantee drop-in compatibility with every Baileys fork or release.
- Custom modifications from other forks may need manual adaptation.
- Keep your authentication data secure.
- Experimental features should be tested before being used in production.

## Credits

ZysBaileys builds upon the work of [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys).

Additional implementations and adaptations are credited in their respective documentation and source files.

Please preserve applicable upstream copyright notices and license requirements.
