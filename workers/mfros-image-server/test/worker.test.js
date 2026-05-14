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
