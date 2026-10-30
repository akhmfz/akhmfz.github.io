# Final Portfolio Release Review

**Tanggal review:** 29 Oktober 2026\
**Repository:** `/home/akhmfz/apps/web/akhmfz.github.io`\
**Branch:** `main`

## 1. Executive Summary

Local portfolio candidate was reviewed with the two supplied LinkedIn posts integrated into the articles archive and homepage selection. Article URL/date validation, canonical URL policy, generated metadata, sitemap, manifest/icons, social card, and responsive routes were checked. The local build and publish workflow completed; browser smoke checks covered all main routes and requested viewport sizes.

The LinkedIn item URLs and dates follow the supplied addendum; the post text was not available as a fully public LinkedIn article during this review. The copy is therefore identified as owner-supplied, not independently verified. The MSCI and OJK reference links were checked and returned HTTP 200.

## 2. Release Status

**READY_WITH_NON_BLOCKING_FINDINGS**

No confirmed local routing, build, metadata, generated asset, or responsive blocker remains. Personal-post wording/dates are sourced from the supplied addendum and should receive owner confirmation before claiming independent verification. The public site is still on the previous release: `/activities/` returns 404 and the current 1200×630 card is not live. This is expected because this work has not been deployed, not a local defect.

## 3. Repository Baseline

- Working tree root: `/home/akhmfz/apps/web/akhmfz.github.io`
- Branch: `main`
- HEAD and `origin/main`: `5589fa83c05d211350a1fc65358a6e42d318a43e`
- Upstream distance after fetch: `0 0`
- Initial local candidate contained uncommitted source and generated output from prior work. These changes were preserved.
- Final state: no staged files, no commit, no push, no deployment.
- Final local status after changes: **91 entries** — 52 tracked (31 modified, 21 generated deletions) and 39 untracked (7 source/public assets plus generated output). No unrelated change detected.
- `git diff --check`: passed.

## 4. Scope Reviewed

- Source config, articles/posts, activities, homepage, profile/experience, navbar, route metadata, shared meta helper, root canonical logic, publishing script, manifest, sitemap, image and icon assets.
- Generated homepage, Activities, Articles, Contact, Details, three project pages, 404, sitemap, manifest, and `assets/` references.
- Public branch/live URLs checked separately from local candidate.
- Existing author/template license arrangement inspected; `site/LICENSE` remains the MIT license attributed to Hamish Williams. No new root license was added.

## 5. LinkedIn Content Mapping

| Item | Date | Activity URL | Mapping result | Evidence status |
|---|---|---|---|---|
| ISO 9001: Apa yang Sebenarnya Dinilai? | 2026-10-23 | `https://www.linkedin.com/feed/update/urn:li:activity:7519306697467949056/` | Matches addendum’s ISO activity URN. Short links were swapped in the addendum fields; short link `efWmkBb2` actually resolved to MSCI, and `ecwdMPvR` to ISO. We use the URN to avoid that mismatch. | Owner-provided title/date/summary from supplied addendum. URL returned HTTP 200; accessible HTML title matched ISO, but full public post contents were not independently inspected. |
| MSCI Indonesia: Proposal Reclassification dan Isu Integritas Pasar | 2026-10-21 | `https://www.linkedin.com/feed/update/urn:li:activity:7518599219725950976/` | Matches addendum’s MSCI activity URN. | Owner-provided post/date/summary. URL returned HTTP 200, public body was access-limited. MSCI source and OJK source below were independently accessible. |

The separate short link `https://lnkd.in/g6EER9Xh` returned 404; it is not used. No short link is used in the cards.

MSCI/OJK sources rendered below the MSCI card:
- MSCI consultation press release, 15 October 2026: `https://www.msci.com/downloads/documents/press-releases/media-room/Indonesia_PR_Oct_26.pdf` — HTTP 200, PDF.
- OJK press release, 16 October 2026: `https://www.ojk.go.id/en/berita-dan-kegiatan/siaran-pers/Pages/OJK-Reaffirms-Commitment-to-Advancing-Indonesias-Capital-Market-Reform.aspx` — HTTP 200.

The copy labels MSCI’s action as a proposal/consultation, not a final reclassification. It carries the supplied feedback deadline (30 April 2027) and decision deadline (30 June 2027). No attendance, role, or performance claims were introduced.

## 6. Article Data Validation

`site/app/data/posts.js` keeps LinkedIn items manual and Kompasiana items imported from `posts.json`.

Executed focused Node assertions confirmed:
- Three unique valid posts render, newest first: Kompasiana 2026-10-28, ISO 2026-10-23, MSCI 2026-10-21.
- ISO date parser accepts real `YYYY-MM-DD` dates, rejects impossible dates/unsupported formats, and missing dates sort last.
- URLs use HTTP(S), invalid protocols are rejected, and duplicate hrefs are removed.
- Both LinkedIn URNs map to their intended title; MSCI has two source records.
- Homepage shows three writing cards and its “View all writing” CTA; archive page displays all three.
- Missing article description/date fallbacks and empty states remain present.

## 7. SEO/PWA Findings

- Canonical policy is root `/` and trailing slashes for nested directory routes.
- Generated HTML has one canonical and one matching `og:url` on each checked route.
- Unique static OG titles/descriptions and Twitter card metadata exist for homepage, Activities, Articles, Contact, Details, and project pages.
- Project descriptions now use summaries rather than terse technical metadata.
- Sitemap XML is valid, has eight unique canonical routes, includes Activities and all three projects, and has no fabricated `lastmod`.
- Source and generated sitemap match.
- Social image measures **1200×630 RGB**; static OG width/height metadata is 1200×630. New image is maintained under `site/public/social-image.png` and copied by publisher.
- Manifest JSON is valid, `lang` is `en`, `start_url` is `/`; all listed icons exist, including 192×192 and 512×512 maskable. Maskable icon uses a solid background and a mark inset within the central safe area.
- No service worker/offline claims added.
- Static shell title remains `Loading...`; browser title becomes page-specific after hydration with no observed errors. This known non-JS title limitation remains because replacing the shell node is still a hydration risk.

## 8. UI/UX Findings

- Articles page visually checked at 390, 768, and 1440px. All three cards, dates, platform labels, external source links, and footers were readable; no horizontal overflow.
- Homepage writing selection shows exactly three cards at 390 and 1440px.
- Existing Activities, Contact, Details, and all three project pages rendered without horizontal overflow at 390, 768, and 1440px.
- Mobile navigation was checked at 390px; Work/Writing links remain usable.
- Focus-visible rules and semantic headings/alt attributes were not reported as a full WCAG audit; no compliance claim is made.

## 9. Test and Browser QA Results

| Command/method | Routes/viewports | Result |
|---|---|---|
| `npm run publish` from `site/` | Build plus generated output | Passed. Existing Vite CJS deprecation and Remix/React Router future-flag warnings remain. |
| Article focused Node assertions | Three current entries; invalid date/URL/duplicate cases | Passed. |
| Playwright `articles-final.cjs` | `/articles/`, 390/768/1440px | 3 cards each, no page errors or overflow. |
| Playwright `home-writing.cjs` | `/`, 390/1440px | 3 cards, CTA present, no page errors. |
| Playwright static smoke `release-final.cjs` | Home, Activities, Articles, Contact, Details, 3 projects, nonexistent route; 390/768/1440px | Intended routes 200, nonexistent route 404, no overflow, missing requested images, or page errors. |
| Playwright `title-meta-final.cjs` | Home, Activities, Articles, Papan Instrumen | Titles change from shell `Loading...` to route-specific title; no page errors; runtime canonical/OG URL match. |
| Python/ElementTree/Pillow assertions | Sitemap, manifest, icon/social dimensions, generated canonical/assets | Passed. |

No formal project test suite is configured. These are build, assertion, and browser automation checks, not a formal suite.

## 10. Findings by Severity

### P0/P1
None confirmed in local candidate.

### P2
1. **LinkedIn post bodies are not independently readable from public HTTP.** Dates, titles, and summaries follow the supplied addendum; page status 200 does not prove full contents were public. Keep them owner-supplied and ask the owner to confirm the rendered summaries before release. No invented facts were added.
2. **Generic pre-hydration title remains.** Raw static title is `Loading...`; route-specific OG/Twitter title is present and hydrated browser titles are correct. Longer-term static rendering would be needed to remove this limitation safely.
3. **Public deployment is stale.** Public `/activities/` returned 404 and live social image still served the previous 1280×800 asset. This is expected because no deployment occurred; local output is not live.

### P3 / optional
- Lighthouse/Core Web Vitals were not measured: Lighthouse is unavailable. Prior browser network measurements showed a heavier homepage due to Three.js; lazy chunking exists. No speculative performance change made.
- A full WCAG contrast/keyboard audit was outside the checks run.

## 11. Fixes Applied

- Added the two owner-provided LinkedIn entries to manual article data using their activity URNs, preserving correct mapping.
- Reworded summaries to retain ISO certification/system distinction and MSCI proposal/deadline context.
- Added verified MSCI and OJK source links to the MSCI article card.
- Increased homepage selected writing from two to three cards.
- Rebuilt generated output with `npm run publish`.

## 12. Remaining Risks and Unverified Items

- Confirm the exact personal post wording/date and summaries against the original LinkedIn posts before describing them as independently verified.
- MSCI/OJK sources confirm underlying public facts, not every personal interpretation in the LinkedIn post.
- Public site remains on old release until a separately authorized deployment.
- `site/app/routes/home/home.jsx` uses `projects[0]`; current project data contains the three expected projects. Empty-project-list behavior was not changed or tested because it is not part of current data.

## 13. Changed Files

Source changes from this task:
- `site/app/data/posts.js`
- `site/app/routes/articles.jsx`
- `site/app/pages/articles.module.css`
- `site/app/routes/home/home.jsx`

Generated output changed by publisher:
- `articles/index.html`
- `index.html`, `404.html`, `contact/index.html`, `details/index.html`, `activities/index.html`, project route HTML
- Current `assets/` bundle files; old hashed assets deleted by the established publisher workflow
- Sitemap, manifest, social image, PWA icons (from prior local SEO work)

The full local working tree also retains earlier uncommitted source/output changes from the portfolio revision and SEO/PWA work; none were discarded.

## 14. Release Recommendation

**READY_WITH_NON_BLOCKING_FINDINGS**, contingent on owner confirmation of LinkedIn post content before treating those summaries as independently verified. Review the complete source and generated diff together, then stage/commit/push only in a separately authorized release operation.

## 15. Explicit Non-Actions

- No commit.
- No push.
- No deployment.
- No Git history rewrite or destructive cleanup.
- No new dependencies.

Final status: local changes remain uncommitted and undeployed. The public website does not yet contain this candidate. No commit, push, or deployment was performed.
