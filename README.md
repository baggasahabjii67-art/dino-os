# 🦕 Dino OS

Dino OS is a lightweight, browser-based desktop prototype designed around the supplied Dino Core concept. It is deliberately dependency-free so it loads quickly on low-end PCs and can later become a Progressive Web App or a Linux shell.

## Run

Open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Included

- Dino Core launcher with a catalog of 100 optimization-focused capabilities
- Responsive glass desktop, wallpaper glow, dock, clock, battery indicator, and boot screen
- Draggable application windows
- File Explorer, Gallery, Games, Notes, Settings, and Search mock applications
- Local autosave for notes
- Keyboard shortcut: `Ctrl/⌘ + K` opens Search; `Esc` closes windows
- No dependencies, build step, trackers, or network requests

This is a desktop UI foundation, not yet a bootable operating system kernel. Native hardware integration, drivers, package management, and a real filesystem would be the next implementation layer.
