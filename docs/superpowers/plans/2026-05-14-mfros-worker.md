# mfros.com Image Worker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Cloudflare Worker that serves a minimal HTML image page for each `*.mfros.com` subdomain, backed by a KV namespace that is auto-synced from `static/img/mfros/` on every push to `main`.

**Architecture:** A single Cloudflare Worker reads a KV namespace to map subdomain names to image filenames; it returns an HTML page pointing the browser at `koolaid.info/img/mfros/<filename>` (no image proxying). A GitHub Actions workflow syncs `static/img/mfros/` to KV on every push to `main`, using a scoped Cloudflare API token. A wildcard AAAA DNS record routes all `*.mfros.com` traffic through the worker.

**Tech Stack:** Cloudflare Workers (ES module), Cloudflare KV, Wrangler v3, Vitest 2, GitHub Actions

---

## File Map

| Path | Purpose |
|---|---|
| `workers/mfros-image-server/package.json` | Worker project config, wrangler + vitest deps |
| `workers/mfros-image-server/wrangler.toml` | Worker name, KV binding, route, compatibility date |
| `workers/mfros-image-server/src/index.js` | Worker fetch handler + HTML renderer |
| `workers/mfros-image-server/test/worker.test.js` | Vitest tests for fetch handler |
| `.github/workflows/sync-mfros-kv.yml` | Sync `static/img/mfros/` → KV on push to `main` |

---

## Task 1: Create the Cloudflare KV Namespace

This is a one-time CLI step. The namespace ID produced here goes into `wrangler.toml` and GitHub Secrets.

- [ ] **Step 1: Authenticate wrangler if not already logged in**

```bash
npx wrangler whoami
```

If it shows "not authenticated", run:

```bash
npx wrangler login
```

- [ ] **Step 2: Create the namespace**

```bash
npx wrangler kv namespace create mfros-images
```

Expected output (ID will differ):

```
✅ Successfully created KV namespace "mfros-image-server-mfros-images"
Add the following to your wrangler.toml:
{ binding = "MFROS_IMAGES", id = "abc123def456789abc123def456789ab" }
```

- [ ] **Step 3: Save the namespace ID**

Copy the `id` value from the output. You will need it in Task 2 (wrangler.toml) and Task 7 (GitHub Secrets). It will be referred to as `<KV_NAMESPACE_ID>` throughout this plan.

---

## Task 2: Scaffold the Worker Project

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p workers/mfros-image-server/src workers/mfros-image-server/test
```

- [ ] **Step 2: Create `workers/mfros-image-server/package.json`**

```json
{
  "name": "mfros-image-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "deploy": "wrangler deploy",
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "wrangler": "^3.0.0"
  }
}
```

- [ ] **Step 3: Create `workers/mfros-image-server/wrangler.toml`**

Replace `<KV_NAMESPACE_ID>` with the ID from Task 1.

```toml
name = "mfros-image-server"
main = "src/index.js"
compatibility_date = "2024-09-23"

[[kv_namespaces]]
binding = "MFROS_IMAGES"
id = "<KV_NAMESPACE_ID>"

[[routes]]
pattern = "*.mfros.com/*"
zone_name = "mfros.com"
```

- [ ] **Step 4: Install dependencies**

```bash
cd workers/mfros-image-server && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 5: Create an empty `src/index.js` placeholder so the test import resolves**

```js
export default { async fetch() {} };
```

- [ ] **Step 6: Commit**

```bash
git add workers/
git commit -m "scaffold mfros-image-server worker project"
```

---

## Task 3: Write Failing Worker Tests

- [ ] **Step 1: Create `workers/mfros-image-server/test/worker.test.js`**

```js
import { describe, it, expect } from 'vitest';
import worker from '../src/index.js';

const mockEnv = {
  MFROS_IMAGES: {
    async get(key) {
      const registry = { ian: 'ian.jpeg', jim: 'jim.jpeg' };
      return registry[key] ?? null;
    },
  },
};

const brokenEnv = {
  MFROS_IMAGES: {
    async get() {
      throw new Error('KV unavailable');
    },
  },
};

describe('known subdomain', () => {
  it('returns 200 with HTML content-type', async () => {
    const res = await worker.fetch(new Request('https://ian.mfros.com/'), mockEnv);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
  });

  it('includes the correct koolaid.info image URL', async () => {
    const res = await worker.fetch(new Request('https://ian.mfros.com/'), mockEnv);
    const html = await res.text();
    expect(html).toContain('https://koolaid.info/img/mfros/ian.jpeg');
  });

  it('sets the page title to the subdomain name', async () => {
    const res = await worker.fetch(new Request('https://ian.mfros.com/'), mockEnv);
    const html = await res.text();
    expect(html).toContain('<title>ian</title>');
  });

  it('ignores any path after the subdomain', async () => {
    const res = await worker.fetch(new Request('https://jim.mfros.com/some/path'), mockEnv);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('jim.jpeg');
  });
});

describe('unknown or missing subdomain', () => {
  it('redirects unknown subdomain to koolaid.info', async () => {
    const res = await worker.fetch(new Request('https://nobody.mfros.com/'), mockEnv);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://koolaid.info');
  });

  it('redirects root domain (no subdomain) to koolaid.info', async () => {
    const res = await worker.fetch(new Request('https://mfros.com/'), mockEnv);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://koolaid.info');
  });
});

describe('KV failure', () => {
  it('redirects to koolaid.info when KV throws', async () => {
    const res = await worker.fetch(new Request('https://ian.mfros.com/'), brokenEnv);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://koolaid.info');
  });
});
```

- [ ] **Step 2: Run the tests — verify they all fail**

```bash
cd workers/mfros-image-server && npm test
```

Expected: 7 tests fail (placeholder `fetch` returns `undefined`).

- [ ] **Step 3: Commit**

```bash
git add workers/mfros-image-server/test/
git commit -m "add failing tests for mfros-image-server worker"
```

---

## Task 4: Implement the Worker

- [ ] **Step 1: Replace `workers/mfros-image-server/src/index.js` with the full implementation**

```js
const REDIRECT_URL = 'https://koolaid.info';
const IMAGE_BASE = 'https://koolaid.info/img/mfros';

export default {
  async fetch(request, env) {
    const hostname = new URL(request.url).hostname;
    const parts = hostname.split('.');

    if (parts.length < 3) {
      return Response.redirect(REDIRECT_URL, 301);
    }

    const name = parts[0];
    let filename;

    try {
      filename = await env.MFROS_IMAGES.get(name);
    } catch {
      return Response.redirect(REDIRECT_URL, 301);
    }

    if (!filename) {
      return Response.redirect(REDIRECT_URL, 301);
    }

    return new Response(renderPage(name, `${IMAGE_BASE}/${filename}`), {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  },
};

function renderPage(name, imageUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${name}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:100%;height:100%;background:#111;display:flex;align-items:center;justify-content:center}
    img{max-width:100%;max-height:100vh;object-fit:contain}
  </style>
</head>
<body>
  <img src="${imageUrl}" alt="${name}">
</body>
</html>`;
}
```

- [ ] **Step 2: Run tests — verify they all pass**

```bash
cd workers/mfros-image-server && npm test
```

Expected:

```
✓ test/worker.test.js (7)
  ✓ known subdomain (4)
  ✓ unknown or missing subdomain (2)
  ✓ KV failure (1)

Test Files  1 passed (1)
Tests  7 passed (7)
```

- [ ] **Step 3: Commit**

```bash
git add workers/mfros-image-server/src/index.js
git commit -m "implement mfros-image-server worker"
```

---

## Task 5: Deploy the Worker to Cloudflare

Deployment uses your wrangler login credentials (not `CF_KV_API_TOKEN`, which is KV-scoped only). Make sure you are logged in (`npx wrangler whoami`).

- [ ] **Step 1: Deploy**

```bash
cd workers/mfros-image-server && npm run deploy
```

Expected output includes:

```
✅ Successfully published your Worker to mfros-image-server
   *.mfros.com/* (zone: mfros.com)
```

If you see a zone error, confirm `mfros.com` is active in your Cloudflare account under the same account wrangler is authenticated to.

- [ ] **Step 2: Verify the worker appears in the Cloudflare dashboard**

Go to **Cloudflare Dashboard → Workers & Pages → mfros-image-server**. Confirm it shows the route `*.mfros.com/*`.

---

## Task 6: Create the Cloudflare API Token

This token is scoped to KV only — it cannot deploy workers or change DNS. It is used exclusively by the GitHub Actions KV sync workflow.

- [ ] **Step 1: Open the Cloudflare API token creation page**

Go to: **Cloudflare Dashboard → Profile (top-right avatar) → API Tokens → Create Token → Create Custom Token**

- [ ] **Step 2: Configure the token**

| Field | Value |
|---|---|
| Token name | `koolaid-hugo github actions kv sync` |
| Permissions | Account → Workers KV Storage → Edit |
| Account resources | Include → your account |
| Zone resources | (leave as default / not needed) |

Click **Continue to summary**, then **Create Token**.

- [ ] **Step 3: Copy the token value**

This is shown only once. Save it — you will add it to GitHub in the next task.

---

## Task 7: Add GitHub Repository Secrets

You need three secrets. Navigate to: **GitHub → k00laidIT/koolaid-hugo → Settings → Secrets and variables → Actions → New repository secret**

- [ ] **Step 1: Add `CF_KV_API_TOKEN`**

Value: the token created in Task 6.

- [ ] **Step 2: Add `CF_ACCOUNT_ID`**

Value: your Cloudflare account ID. Find it at **Cloudflare Dashboard → (any zone) → Overview → right sidebar → Account ID**, or run:

```bash
npx wrangler whoami
```

Copy the account ID shown.

- [ ] **Step 3: Add `CF_KV_NAMESPACE_ID`**

Value: the KV namespace ID from Task 1.

---

## Task 8: Create the GitHub Actions KV Sync Workflow

- [ ] **Step 1: Create `.github/workflows/sync-mfros-kv.yml`**

```yaml
name: Sync mfros images to Cloudflare KV

on:
  push:
    branches: [main]
    paths:
      - 'static/img/mfros/**'

jobs:
  sync-kv:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install wrangler
        run: npm install -g wrangler@3

      - name: Write current images to KV
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_KV_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
        run: |
          for filepath in static/img/mfros/*; do
            [ -f "$filepath" ] || continue
            filename=$(basename "$filepath")
            ext="${filename##*.}"
            case "$ext" in
              jpeg|jpg|png|webp|gif)
                name="${filename%.*}"
                echo "Writing: $name -> $filename"
                wrangler kv key put --namespace-id="${{ secrets.CF_KV_NAMESPACE_ID }}" "$name" "$filename"
                ;;
            esac
          done

      - name: Delete stale KV keys
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_KV_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
        run: |
          current_names=""
          for filepath in static/img/mfros/*; do
            [ -f "$filepath" ] || continue
            filename=$(basename "$filepath")
            ext="${filename##*.}"
            case "$ext" in
              jpeg|jpg|png|webp|gif)
                name="${filename%.*}"
                current_names="$current_names $name"
                ;;
            esac
          done

          wrangler kv key list --namespace-id="${{ secrets.CF_KV_NAMESPACE_ID }}" 2>/dev/null \
            | jq -r '.[].name // empty' \
            | while read -r key; do
                if [[ ! " $current_names " =~ " $key " ]]; then
                  echo "Deleting stale key: $key"
                  wrangler kv key delete --namespace-id="${{ secrets.CF_KV_NAMESPACE_ID }}" "$key"
                fi
              done
```

- [ ] **Step 2: Commit and push**

```bash
git add .github/workflows/sync-mfros-kv.yml
git commit -m "add github actions workflow to sync mfros images to cloudflare kv"
git push origin main
```

- [ ] **Step 3: Verify the workflow ran**

Go to **GitHub → k00laidIT/koolaid-hugo → Actions → Sync mfros images to Cloudflare KV**. The workflow fires because `static/img/mfros/` files exist at HEAD but this is the first run — check that the run succeeded.

If it didn't fire (no files changed in the push), trigger it manually: **Actions → Sync mfros images to Cloudflare KV → Run workflow**.

- [ ] **Step 4: Verify KV entries were written**

```bash
npx wrangler kv key list --namespace-id=<KV_NAMESPACE_ID>
```

Expected:

```json
[
  { "name": "ian" },
  { "name": "jim" },
  { "name": "joe" }
]
```

---

## Task 9: Add the Wildcard DNS Record

This routes all `*.mfros.com` traffic through Cloudflare's proxy so the worker can intercept it.

- [ ] **Step 1: Open DNS settings for mfros.com**

Go to: **Cloudflare Dashboard → mfros.com → DNS → Records → Add record**

- [ ] **Step 2: Add the wildcard record**

| Field | Value |
|---|---|
| Type | AAAA |
| Name | `*` |
| IPv6 address | `100::` |
| Proxy status | Proxied (orange cloud ON) |
| TTL | Auto |

Click **Save**.

- [ ] **Step 3: Confirm the record appears**

The DNS list should show `* AAAA 100:: Proxied`.

---

## Task 10: End-to-End Test

- [ ] **Step 1: Test a known subdomain**

Open a browser and navigate to `https://ian.mfros.com`.

Expected: dark page, `ian.jpeg` centered. Page title is `ian`.

- [ ] **Step 2: Test another known subdomain**

Navigate to `https://jim.mfros.com`.

Expected: dark page, `jim.jpeg` centered.

- [ ] **Step 3: Test an unknown subdomain**

Navigate to `https://nobody.mfros.com`.

Expected: 301 redirect to `https://koolaid.info`.

- [ ] **Step 4: Test adding a new image**

Copy any image into `static/img/mfros/` with a new name (e.g. `test.jpeg`), then:

```bash
git add static/img/mfros/test.jpeg
git commit -m "add test image"
git push origin main
```

Wait for the **Sync mfros images to Cloudflare KV** Action to complete (~30 seconds), then navigate to `https://test.mfros.com`. Expected: the image is served.

- [ ] **Step 5: Remove the test image**

```bash
git rm static/img/mfros/test.jpeg
git commit -m "remove test image"
git push origin main
```

Wait for the Action, then navigate to `https://test.mfros.com` again. Expected: redirect to `https://koolaid.info`.
