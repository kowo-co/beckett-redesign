## Summary

Five genuinely distinct radical redesigns of Beckett's landing page, plus a gallery picker — all using faithful copy from 0xbeckett.me. Live at https://redesign.0xbeckett.me.

## Designs (one sentence each)

1. **Broadsheet** (`/1`) — A newspaper broadsheet where oversized serif type is the grid — columns, ruled lines, and drop caps on cream stock.
2. **Receipt** (`/2`) — Brutalist system-ui honesty — monospace on stark white, harsh 1px borders, like a government form that became art.
3. **Shell Session** (`/3`) — A live terminal session where every section is a man-page entry and phosphor-green text is the only decoration.
4. **Filmstrip** (`/4`) — Vertical scroll drives horizontal pan through narrative frames — a contact sheet where each scene is one panel.
5. **Constellation** (`/5`) — A generative particle field that responds to cursor movement, with content anchored in floating geometric zones.

## Screenshots

| Picker | 1 Broadsheet | 2 Receipt |
|--------|--------------|-----------|
| ![picker](screenshots/picker.png) | ![1](screenshots/1.png) | ![2](screenshots/2.png) |

| 3 Shell | 4 Filmstrip | 5 Constellation |
|---------|-------------|-----------------|
| ![3](screenshots/3.png) | ![4](screenshots/4.png) | ![5](screenshots/5.png) |

## Test plan

- [x] https://redesign.0xbeckett.me/picker loads and links to all five
- [x] `/1` through `/5` each load complete distinct landing pages
- [x] No banned AI-slop patterns (no purple gradients, glass cards, gradient text, orbs, etc.)
- [x] All six routes checked at 375px — no horizontal overflow
- [x] Keyboard-navigable with visible focus rings; reduced-motion respected
- [x] Deployed via `beckett deploy redesign --port 4321`
