# Requirements

## Running Design OS

Design OS runs locally on your machine. You'll need:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **An AI coding assistant** — Design OS uses slash commands to guide the design process. Claude Code is recommended, but you can invoke the Design OS commands from any AI coding tool that supports custom commands or prompts (Cursor, Windsurf, Codex, etc.)

## Installing Your Exported Components

When you export your designs, you get production-ready components for the platform you selected in Design OS. Your target codebase needs:

### Required

- **One supported frontend target**:
  - **React** (v18 or higher), or
  - **Svelte**, or
  - **Astro**
- **Tailwind CSS** (v4) — Components use Tailwind utility classes for styling

### Backend

Your backend can be anything—Rails, Laravel, Next.js API routes, Python, Go, whatever. Design OS only handles the frontend design layer.
