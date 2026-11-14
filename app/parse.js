'use strict';
// Parses and validates a course-registration request.
// Expected shape: { "course": "CPS5981", "credits": 3 }
function parseRegistration(raw) {
  try {
    const body = JSON.parse(raw);

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return { ok: false, error: 'Registration must be a JSON object' };
    }

    if (typeof body.course !== 'string' || !body.course.trim()) {
      return { ok: false, error: 'Course must be a non-empty string' };
    }

    if (
      typeof body.credits !== 'number' ||
      !Number.isFinite(body.credits) ||
      body.credits <= 0
    ) {
      return { ok: false, error: 'Credits must be a positive number' };
    }

    return {
      ok: true,
      value: {
        course: body.course.trim().toUpperCase(),
        credits: body.credits
      }
    };
  } catch {
    return { ok: false, error: 'Invalid registration JSON' };
  }
}

module.exports = { parseRegistration };
