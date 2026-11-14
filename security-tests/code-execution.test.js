// Requirement : REQ-010 (adapted for Lab 10) — GPA input must be treated as data, never executed as JavaScript.
// Property : executable input => no side effect and HTTP 400; valid numeric input => HTTP 200.
// Proves : the supplied JavaScript expression cannot set a marker, while a numeric GPA still works.
// Does NOT prove: safety against every JavaScript payload, other endpoints, or every invalid GPA value.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { start, stop, get } = require('./helpers');

test.before(start);
test.after(stop);

test('REQ-010: GPA input cannot execute JavaScript', async () => {
  delete globalThis.__lab10GpaExecuted;

  const payload = '(globalThis.__lab10GpaExecuted = true, 3.7)';

  try {
    const res = await get(
      `/api/gpa?expr=${encodeURIComponent(payload)}`
    );
    await res.text();

    assert.equal(
      globalThis.__lab10GpaExecuted,
      undefined,
      'User input executed JavaScript and changed server state'
    );

    assert.equal(
      res.status,
      400,
      'Executable input must be rejected'
    );
  } finally {
    delete globalThis.__lab10GpaExecuted;
  }
});

test('REQ-010: numeric GPA input remains usable', async () => {
  const res = await get('/api/gpa?expr=3.7');

  assert.equal(res.status, 200);

  const body = await res.json();
  assert.equal(body.estimate, 3.7);
});
