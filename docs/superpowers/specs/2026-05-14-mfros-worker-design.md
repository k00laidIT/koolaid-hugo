# mfros.com Image Worker — Design Spec

**Date:** 2026-05-14  
**Status:** Approved

## Overview

A Cloudflare Worker that serves a simple HTML image page for each subdomain of `mfros.com`. Each subdomain maps to an image stored in the Hugo site's `static/img/mfros/` directory. For example, `https://ian.mfros.com` displays the image at `https://koolaid.info/img/mfros/ian.jpeg`.

The worker reads a KV namespace to determine which subdomains are valid. That KV namespace is synced automatically from the `static/img/mfros/` directory on every push to `main` via GitHub Actions.

---

## Components

### 1. Image Directory — `static/img/mfros/`

The directory itself is the source of truth. Filename stem = subdomain name. Extension is preserved as-is. Adding or removing an image from this directory and pushing to `main` is the only action needed to add or remove a subdomain.

Accepted extensions (workflow whitelist): `.jpeg`, `.jpg`, `.png`, `.webp`, `.gif`

### 2. Cloudflare KV Namespace — `mfros-images`

Stores the active image registry. Each entry:
- **Key:** subdomain name (e.g. `ian`)
- **Value:** full filename including extension (e.g. `ian.jpeg`)

Created once via wrangler. Bound to the worker.

### 3. Cloudflare API Token — `CF_KV_API_TOKEN`

A Cloudflare API token scoped to **Account > Workers KV Storage > Edit** only. Stored as a GitHub Actions repository secret alongside:
- `CF_ACCOUNT_ID` — Cloudflare account ID
- `CF_KV_NAMESPACE_ID` — ID of the `mfros-images` KV namespace

### 4. GitHub Actions Workflow — `.github/workflows/sync-mfros-kv.yml`

Triggers on push to `main` when files under `static/img/mfros/**` change.

Steps:
1. List all files in `static/img/mfros/`, filter to accepted image extensions
2. For each image: write `stem → filename` to KV via wrangler
3. List all existing KV keys; delete any key that no longer has a matching file in the directory

### 5. Cloudflare Worker — `mfros-image-server`

Handles all `*.mfros.com` requests.

**Request flow:**
1. Extract subdomain from `request.url` hostname
2. If no subdomain (root domain) → 301 redirect to `https://koolaid.info`
3. Look up subdomain in KV namespace
4. **Found:** return HTML page (dark background, image centered, title = subdomain name), with `<img src="https://koolaid.info/img/mfros/<filename>">` — the worker does not proxy the image, just points the browser at it
5. **Not found or KV error:** 301 redirect to `https://koolaid.info`

Worker source lives at `workers/mfros-image-server/` in the Hugo repo.

### 6. Wildcard DNS Record

In the `mfros.com` Cloudflare zone:
- **Type:** AAAA
- **Name:** `*`
- **Value:** `100::` (Cloudflare proxy placeholder)
- **Proxy:** enabled (orange cloud)

Worker route: `*.mfros.com/*` → `mfros-image-server`

---

## Data Flow

### Push to `main`

```
Developer pushes image to static/img/mfros/
  → GitHub Actions detects change
  → Scans directory, builds key/value pairs
  → Writes all current entries to KV (upsert)
  → Deletes any KV keys with no matching file
```

### Visitor request

```
https://ian.mfros.com
  → Cloudflare routes *.mfros.com to worker
  → Worker extracts subdomain: "ian"
  → KV lookup: "ian" → "ian.jpeg"
  → Returns HTML page with <img src="https://koolaid.info/img/mfros/ian.jpeg">
  → Browser fetches image directly from koolaid.info (Cloudflare Pages)
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Unknown subdomain | 301 → `https://koolaid.info` |
| Root domain (`mfros.com`) | 301 → `https://koolaid.info` |
| KV unavailable | 301 → `https://koolaid.info` |
| Non-image file in directory | Skipped by GitHub Actions (extension whitelist) |
| Subdomain with path (`ian.mfros.com/foo`) | Path ignored; serves image page based on subdomain only |

---

## Out of Scope

- Custom styling beyond a dark background with centered image
- Image upload UI
- Authentication or access control
- Instagram or other social integrations
