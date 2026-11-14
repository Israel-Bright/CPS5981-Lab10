// Requirement : REQ-014 (adapted for Lab 10) — A logged-in student may read only their own ledger.
// Property : another student's ledger => 403 with no balance; own ledger => 200.
// Proves : S1001 cannot read S1002's ledger and can still read their own.
// Does NOT prove: authorization holds for every student, route, or session state.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { start, stop, login, get } = require('./helpers');

test.before(start);
test.after(stop);

test('REQ-014: student cannot read another student’s ledger', async () => {
  const token = await login('S1001', '4417');
  assert.ok(token, 'Login must succeed before testing authorization');

  const res = await get('/api/students/S1002/ledger', token);
  const body = await res.json();

  assert.equal(body.balance, undefined, 'Another student’s balance leaked');
  assert.equal(res.status, 403);
});

test('REQ-014: student can still read their own ledger', async () => {
  const token = await login('S1001', '4417');
  assert.ok(token, 'Login must succeed');

  const res = await get('/api/students/S1001/ledger', token);
  assert.equal(res.status, 200);

  const body = await res.json();
  assert.equal(body.studentId, 'S1001');
  assert.ok(Object.hasOwn(body, 'balance'), 'Own ledger must include balance');
});
