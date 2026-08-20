# Beckett, ten ways

Ten homepages for [Beckett](https://0xbeckett.me), live at
**https://redesign.0xbeckett.me**.

Ten imagined design studios were each handed the same client and asked to make
its site. The author changes on every route. The subject never does. There are no
fictional firms, case studies or testimonials anywhere in the build.

Everything sits at one of two poles, because the middle between them is the thing
that keeps getting rejected: **severe minimal** or **chaotic**. One page is a till
receipt, which is the one look the owner said outright that he liked.

| Route | Codename | Pole | Fogg lever | The take |
|---|---|---|---|---|
| [/1](https://redesign.0xbeckett.me/1) | LEDGER | receipt | Self-monitoring | A till receipt for a night of work |
| [/2](https://redesign.0xbeckett.me/2) | MASS | severe | Reduction | Six words per screen, nothing else |
| [/3](https://redesign.0xbeckett.me/3) | NIGHT | severe | Suggestion | One video in a dark room |
| [/4](https://redesign.0xbeckett.me/4) | RULE | severe | Ability | A hairline, a serif, a wide margin |
| [/5](https://redesign.0xbeckett.me/5) | STEP | severe | Tunneling | One fact at a time, you advance it |
| [/6](https://redesign.0xbeckett.me/6) | FIELD | chaotic | Motivation | A shader that eats the photograph |
| [/7](https://redesign.0xbeckett.me/7) | OVERPRINT | chaotic | Conditioning | Riso collage, four inks, no grid |
| [/8](https://redesign.0xbeckett.me/8) | ATLAS | chaotic | Tailoring | Drag the page, the site is a map |
| [/9](https://redesign.0xbeckett.me/9) | STROBE | chaotic | Prompt | Split-flap board and a wall of video |
| [/10](https://redesign.0xbeckett.me/10) | DITHER | chaotic | Surveillance | Live 1-bit dither of a running build |

## Rules the build enforces

Every page: 8 words maximum in the h1, under 150 words in total, at least one
generated still and one generated clip, its Fogg lever named in visible copy, no
horizontal overflow at 375px, a skip link, exactly one `h1`, 44px touch targets,
visible focus, alt attributes everywhere, and reduced motion honoured.

`scripts/audit.mjs` checks all of that in a real browser and is the gate.

## Assets

Everything visual is generated, nothing is stock. `scripts/gen-assets.sh` drives
`beckett image` from two manifests (`scripts/assets.tsv`, `scripts/videos.tsv`),
then transcodes: stills to jpeg capped at 1600px, clips to silent h264 at 960px
with poster frames. 33 files, 4.6MB. Re-running skips anything already on disk.

```bash
./scripts/gen-assets.sh          # images then videos
./scripts/gen-assets.sh videos   # just the clips
```

## Develop

```bash
npm install
npm run dev                      # http://localhost:5173

npm run build
npm run serve                    # SPA on 127.0.0.1:4321, what the tunnel serves

BASE_URL=http://127.0.0.1:4321 node scripts/audit.mjs      # the gate
BASE_URL=http://127.0.0.1:4321 node scripts/thumbs.mjs     # gallery thumbnails
BASE_URL=http://127.0.0.1:4321 node scripts/shot.mjs 7 out.png 375
```

## Layout

```
src/gallery/        the index at /
src/designs/pN/     one folder per route, PageN.tsx + pN.css, selectors scoped .pN
src/lib/Reel.tsx    the only <video> wrapper, handles reduced motion
src/content/pages.ts  route table the gallery reads
.beckett/HOUSE.md   the floors every page obeys
.beckett/BRIEFS.md  the ten briefs, copy included, verbatim
```

No Tailwind utilities inside a page. Ten hand-written stylesheets is the point:
it is what stops the ten from quietly converging on the same site.
