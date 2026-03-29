---
name: sample-data
description: Use when a user asks to run the Design OS /sample-data workflow or create/update section sample data and TypeScript types.
---

# sample-data

This skill is a Warp wrapper around the canonical command workflow in `.claude/commands/design-os/sample-data.md`.

## Execution rules

1. Read `.claude/commands/design-os/sample-data.md` fully before acting.
2. Follow that workflow exactly, including prerequisite checks, stop conditions, and required user-facing copy.
3. Keep `.claude/commands/design-os/sample-data.md` unchanged unless the user explicitly asks to edit it.
4. If this wrapper conflicts with the command file, the command file is the source of truth.
