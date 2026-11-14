// Requirement : LAB10-ROBUST-01 — Registration parsing must handle hostile input without throwing.
// Property : each supplied input => parseRegistration returns without an exception.
// Proves : no exceptions occur for the fixed cases and 300 reproducible generated strings.
// Does NOT prove: correctness of returned data, HTTP availability, or safety for all inputs; the generator excludes Unicode, long inputs, and deeply nested JSON.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseRegistration } = require('../app/parse');

test('LAB10-ROBUST-01: fixed hostile inputs do not throw', () => {
  const inputs = [
    '',
    'not json',
    'null',
    '{}',
    '{"course":42}',
    '[]',
    '{"course":null}',
    '{"course":"CPS5981","credits":3}'
  ];

  const failures = [];

  for (const input of inputs) {
    try {
      assert.doesNotThrow(
  () => parseRegistration(input),
  `Parser must not throw for input: ${JSON.stringify(input)}`
);
    } catch (error) {
      failures.push({ input, error: error.message });
    }
  }

  assert.deepEqual(failures, [], 'Parser threw for fixed inputs');
});

test('LAB10-ROBUST-01: 300 generated strings do not throw', () => {
  let seed = 5981;

  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789{}[]":, ';
  const failures = [];

  for (let i = 0; i < 300; i++) {
    const length = 1 + Math.floor(random() * 80);
    let input = '';

    for (let j = 0; j < length; j++) {
      input += alphabet[Math.floor(random() * alphabet.length)];
    }

    try {
      assert.doesNotThrow(
  () => parseRegistration(input),
  `Parser must not throw for input: ${JSON.stringify(input)}`
);
    } catch (error) {
      failures.push({ index: i, input, error: error.message });
    }
  }

  assert.deepEqual(failures, [], 'Parser threw for generated inputs');
});
