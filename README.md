# Mihon Web Reader

Dino OS has been replaced with a focused manga-reader web app. It is a dependency-free static site designed for GitHub Pages.

## Features

- Responsive dark reader interface
- Local library, search, reading status, and reader view
- Vertical image reader with lazy-loaded pages
- Extension manager with enable/disable state
- JSON extension manifest installation
- Local-only persistence through `localStorage`
- No server, account, tracking, or bundled copyrighted content

## Extension support

The app accepts source adapter manifests containing `id`, `name`, `version`, `lang`, `baseUrl`, and optional `capabilities`. A real source adapter should only connect to APIs you are authorized to use and must respect CORS, rate limits, licenses, and the source's terms. This frontend intentionally does not bypass paywalls, authentication, or anti-bot protections.

Run locally with `npx serve .` or publish the repository through GitHub Pages.
