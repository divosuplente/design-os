# Warp Task Tracking

## Active Spec
Enable platform-aware generated artifacts (`react`, `svelte`, `astro`) across Design OS section/shell previews, with Astro fullscreen support and React→Astro conversion guidance for generated screens.

## Implementation Phase

- Completed: platform-aware artifact discovery and metadata in section/shell loaders
- Completed: Astro fullscreen renderers for section and shell preview routes
- Completed: command specs and docs updated for platform-specific extensions and workflows

## Closure Phase

- Completed: final validation rerun (`npm run build`, `npm run check`, `npm run lint`) after documentation updates
- Completed (available routes): smoke verification for fullscreen and shell preview flows via successful static route generation (`/shell/design`, `/shell/design/fullscreen`); section fullscreen smoke requires generated section previews
- Completed: final implementation summary with constraints and follow-up notes (conversion guidance targets Design OS-generated patterns; section fullscreen smoke expands automatically as section previews are generated)
