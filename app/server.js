'use strict';
// Cougar Advising - CPS 5981 Unit 10 laboratory target.
// Run only inside your own GitHub Actions runner or on your own machine.
// Never deploy this lab application anywhere reachable by others.

const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');
const _ = require('lodash');
const { parseRegistration } = require('./parse');
const store = require('./store');

const PORT = process.env.PORT || 3000;
const advising_api_key = process.env.ADVISING_API_KEY || '';

const DEFAULTS = { term: '2026FA', status: 'pending' };

function send(res, code, body, type) {
  res.writeHead(code, {
    'Content-Type': type || 'application/json',
    'Content-Security-Policy':
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  });

  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function currentSession(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return store.sessions[token] || null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => resolve(data));
    req.on('error', reject);
    req.on('aborted', () => reject(new Error('Request aborted')));
  });
}

const HOME = `<!doctype html><html><head><title>Cougar Advising</title></head>
<body><h1>Cougar Advising</h1>
<p>Course advising for the 2026FA term.</p>
<ul>
  <li><a href="/search?q=software+assurance">Search the catalogue</a></li>
  <li><a href="/api/gpa?expr=3.7">Check a GPA estimate</a></li>
  <li><a href="/api/health">Service health</a></li>
</ul></body></html>`;

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  if (req.method === 'GET' && path === '/') {
    return send(res, 200, HOME, 'text/html');
  }

  if (req.method === 'GET' && path === '/api/health') {
    return send(res, 200, {
      ok: true,
      integration: advising_api_key ? 'configured' : 'not configured'
    });
  }

  // Catalogue search - HTML-encodes the query before rendering.
  if (req.method === 'GET' && path === '/search') {
    const q = url.searchParams.get('q') || '';
    const safeQuery = _.escape(q);
    const html = '<html><body><h1>Results for ' +
      safeQuery +
      '</h1><p>No courses matched.</p></body></html>';

    return send(res, 200, html, 'text/html');
  }

  // GPA estimate - accepts numeric input only.
  if (req.method === 'GET' && path === '/api/gpa') {
    const expr = url.searchParams.get('expr') || '0';

    if (!/^\d(\.\d{1,2})?$/.test(expr)) {
      return send(res, 400, { error: 'GPA must be a number' });
    }

    const value = Number(expr);
    return send(res, 200, { estimate: value });
  }

  // Login with student ID and PIN; returns a bearer token.
  if (req.method === 'POST' && path === '/api/login') {
    const body = JSON.parse((await readBody(req)) || '{}');

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return send(res, 400, { error: 'Invalid login request' });
    }

    const student = store.students[body.studentId];

    if (!student || student.pin !== body.pin) {
      return send(res, 401, { error: 'invalid credentials' });
    }

    const token = crypto.randomBytes(16).toString('hex');
    store.sessions[token] = { studentId: student.id };

    return send(res, 200, { token });
  }

  // A student may access only their own financial ledger.
  const m = path.match(/^\/api\/students\/([A-Z0-9]+)\/ledger$/);

  if (req.method === 'GET' && m) {
    const session = currentSession(req);

    if (!session) {
      return send(res, 401, { error: 'login required' });
    }

    if (session.studentId !== m[1]) {
      return send(res, 403, { error: 'access denied' });
    }

    const ledger = store.ledgers[m[1]];

    if (!ledger) {
      return send(res, 404, { error: 'not found' });
    }

    return send(res, 200, {
      studentId: m[1],
      ...ledger
    });
  }

  // Course registration.
  if (req.method === 'POST' && path === '/api/register') {
    const session = currentSession(req);

    if (!session) {
      return send(res, 401, { error: 'login required' });
    }

    const reg = parseRegistration(await readBody(req));

    if (!reg.ok) {
      return send(res, 400, { error: reg.error });
    }

    const record = _.merge({}, DEFAULTS, reg.value, {
      studentId: session.studentId
    });

    return send(res, 201, record);
  }

  return send(res, 404, { error: 'no such route' });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error('Request failed:', error.message);

    if (res.destroyed || res.writableEnded) {
      return;
    }

    if (!res.headersSent) {
      const status = error instanceof SyntaxError ? 400 : 500;

      return send(res, status, {
        error: status === 400 ? 'Invalid request' : 'Internal server error'
      });
    }

    res.end();
  });
});

module.exports = server;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Cougar Advising listening on http://localhost:${PORT}`);
  });
}
