---
name: shape-section
description: Use when a user asks to run the Design OS /shape-section workflow to define a section spec and generate aligned data/types.
---

# shape-section

This skill is a Warp wrapper around the canonical command workflow in `.claude/commands/design-os/shape-section.md`.

## Execution rules

1. Read `.claude/commands/design-os/shape-section.md` fully before acting.
2. Follow that workflow exactly, including prerequisite checks, stop conditions, and required user-facing copy.
3. Keep `.claude/commands/design-os/shape-section.md` unchanged unless the user explicitly asks to edit it.
4. If this wrapper conflicts with the command file, the command file is the source of truth.
