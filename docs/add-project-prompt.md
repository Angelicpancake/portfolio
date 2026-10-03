# Prompt: add or update portfolio projects

Paste everything below the line into Claude Code, then attach/point to your source (PDF, doc, or notes).
Fill in the `<…>` placeholders; delete any line that doesn't apply.

---

You are updating the project data for this Next.js portfolio. Source material: `<path to PDF / pasted notes>`.

**Goal:** add (or update) the projects in the source so each appears on the 3D wall and on its own `/projects/[slug]` page, with the write-up displayed *exactly as written*.

**Steps**
1. Extract the source text. For PDFs on macOS with no poppler, use PDFKit via `swift` (`PDFDocument(url:)` → `page.string`). Read all pages.
2. Split into projects. For each, map to the `Project` type in `src/data/projects.ts`:
   - `title` + `tagline`: the heading split at the first colon (`Itadaki: Japanese Kanji…` → title `Itadaki`, tagline `Japanese Kanji…`).
   - `slug`/`id`: kebab-case of the title.
   - `sections`: one per labelled paragraph (`Inspiration`, `What it does`, …). Use `p` for prose, `list` for bullets (`label` = text before the colon), `group` for titled sub-lists (e.g. "Stage 1", "How X is built").
   - `builtWith`: the verbatim "Built with" text, including trailing notes. `stack`: the technologies split into short chips.
   - `links`: GitHub / demo / website URLs. `youtube`: `{ id, short? }` from watch/shorts URLs.
   - `tags` and `category`: only what the source implies; reuse existing tags where possible (`src/data/projects.ts` → `allTags`).
3. Add a thumbnail: add the slug to `scripts/gen-placeholders.mjs` and run `node scripts/gen-placeholders.mjs`, or put a real image at `public/assets/projects/<slug>.<ext>` and point `thumbnailUrl` at it.
4. Run `npm run type-check && npm run lint && npm run build`.

**Rules**
- Keep the author's wording verbatim. The only edits allowed are repairing extraction artifacts: dropped ligatures (`fi`, `fl`, `ff`, `ffi` often vanish: "ll out" → "fill out", "speci c" → "specific", "re ection" → "reflection"), line-wrap hyphen/space splits, and stray quote/newline characters. Don't paraphrase, summarize, reorder, or "improve" copy.
- URLs wrapped across lines (`…/itadaki` / `_` / `ocb`) must be rejoined; list every rejoined URL in your report so I can verify it.
- Never invent links, dates, tags, metrics, or screenshots. Leave `year` unset and `links: []` when the source has none.
- Don't touch components unless the data can't be represented by the existing `Block` types — if so, say why first.

**Report back** with: the projects added, every rejoined URL, every ligature repair that wasn't obvious, inferred tags/categories, and anything missing (video, images, links).

**New project template** (if typing it in directly instead of attaching a file):
```
Title: <Name>: <tagline>
GitHub: <url>   Video: <url>   Website: <url>
Inspiration: <text>
What it does: <text>
  <Label>: <text>
Built with: <text>
```
