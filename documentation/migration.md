# Migration Guide

This guide helps existing Baileys users transition to ZysBaileys.

## Overview

ZysBaileys is built on top of the WhiskeySockets/Baileys codebase and includes additional experimental features.

Existing projects may require adjustments depending on the version of Baileys they currently use and the APIs they rely on.

## Before Migrating

Before making changes:

1. Back up your existing project.
2. Back up your WhatsApp authentication/session data.
3. Review your current Baileys version.
4. Check whether your project uses custom patches or third-party extensions.
5. Review the ZysBaileys documentation for experimental features.

## Installation

Install ZysBaileys using the installation instructions in the main README.

Do not assume that replacing the package name alone is sufficient for every project.

## API Compatibility

ZysBaileys retains much of its upstream Baileys foundation, but compatibility should be checked against the exact version and implementation being used.

Pay special attention to:

- Message generation and sending.
- Authentication and session management.
- Event handling.
- Custom message types.
- Third-party plugins and extensions.

## Additional Features

ZysBaileys includes additional message capabilities:

- [Rich Response](rich-response.md)
- [HTML App](html-app.md)
- [Native Flow](native-flow.md)

Some of these features are experimental and may have client-side compatibility limitations.

## Migration Checklist

- [ ] Back up the existing project.
- [ ] Back up authentication/session data.
- [ ] Install ZysBaileys.
- [ ] Review import paths and package references.
- [ ] Verify existing message-sending functionality.
- [ ] Test authentication and reconnection.
- [ ] Test custom plugins and integrations.
- [ ] Review experimental feature limitations.

## Troubleshooting

If something does not work after migration:

1. Check the installed ZysBaileys version.
2. Review the terminal output and error messages.
3. Verify that your dependencies are compatible.
4. Test the affected feature with a minimal example.
5. Check the repository for known issues or updates.

## Important Notes

- This guide does not guarantee drop-in compatibility with every Baileys fork or release.
- Custom modifications from other forks may need manual adaptation.
- Keep your authentication data secure.
- Experimental features should be tested before being used in production.

## Credits

ZysBaileys builds upon the work of [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys).

Additional implementations and adaptations are credited in their respective documentation and source files.

Please preserve applicable upstream copyright notices and license requirements.
