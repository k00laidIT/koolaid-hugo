const REDIRECT_URL = 'https://koolaid.info';
const IMAGE_BASE = 'https://koolaid.info/img/mfros';

function createRedirect(url, status = 301) {
  return new Response(null, {
    status,
    headers: { location: url },
  });
}

export default {
  async fetch(request, env) {
    const hostname = new URL(request.url).hostname;
    const parts = hostname.split('.');

    if (parts.length < 3) {
      return createRedirect(REDIRECT_URL);
    }

    const name = parts[0];
    let filename;

    try {
      filename = await env.MFROS_IMAGES.get(name);
    } catch {
      return createRedirect(REDIRECT_URL);
    }

    if (!filename) {
      return createRedirect(REDIRECT_URL);
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
  <meta name="referrer" content="no-referrer">
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
