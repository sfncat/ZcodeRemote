# NOTICE

This project is an **unofficial** companion client for the ZCode coding agent.

## Upstream

The wire protocol implemented by this client was documented by observing the
open-source ZCode client:

- Upstream project: <https://github.com/zai-org/ZCode>
- Upstream license: Apache-2.0 (with NOTICE.md)

The `probe/` directory contains small excerpts of ZCode's build output and
source tree that were captured during protocol research. Those excerpts remain
the property of the ZCode authors and are subject to the upstream Apache-2.0
license. They are included solely to document the protocol and are **not**
part of the MIT-licensed application code in `app/`.

## Trademarks

ZCode and related names are trademarks of their respective owners. This
project is not affiliated with, endorsed by, or sponsored by Z.ai. Use the
name "ZCode" only to describe compatibility.

## Security note

The pairing credential (`sid` + `hash`) shown in the desktop QR code grants
full access to your ZCode remote-control session. Never commit it, share it,
or scan QR codes from untrusted screens. See `app/README.md` for details.
