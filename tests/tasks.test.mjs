import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const t = require('../src/tasks.js');

const MIN = 60000;
const HOUR = 60 * MIN;

test('timeAgo', () => {
  const now = Date.UTC(2026, 8, 25, 12);
  assert.equal(t.timeAgo(now - 20000, now), 'just now');
  assert.equal(t.timeAgo(now - 5 * MIN, now), '5m ago');
  assert.equal(t.timeAgo(now - 3 * HOUR, now), '3h ago');
  assert.equal(t.timeAgo(now - 50 * HOUR, now), '2d ago');
});

test('escapeHtml', () => {
  assert.equal(t.escapeHtml('<b a="1">&</b>'), '&lt;b a=&quot;1&quot;&gt;&amp;&lt;/b&gt;');
});

test('zoneOffset handles fractional and DST zones', () => {
  const winter = Date.UTC(2026, 0, 15, 12);
  const summer = Date.UTC(2026, 6, 15, 12);
  assert.equal(t.zoneOffset(winter, 'Asia/Kolkata'), 330);
  assert.equal(t.zoneOffset(winter, 'America/New_York'), -300);
  assert.equal(t.zoneOffset(summer, 'America/New_York'), -240);
  assert.equal(t.zoneOffset(summer, 'UTC'), 0);
  assert.equal(t.zoneOffset(winter, 'Asia/Kathmandu'), 345);
});

test('zonedToEpoch round-trips wall-clock times', () => {
  const wall = { year: 2026, month: 9, day: 30, hour: 17, minute: 30 };
  assert.equal(t.zonedToEpoch(wall, 'Asia/Kolkata'), Date.UTC(2026, 8, 30, 12, 0));
  assert.equal(t.zonedToEpoch(wall, 'America/New_York'), Date.UTC(2026, 8, 30, 21, 30));
  for (const tz of ['Europe/London', 'Australia/Sydney', 'Pacific/Chatham', 'UTC']) {
    const ts = t.zonedToEpoch(wall, tz);
    assert.deepEqual(t.zonedParts(ts, tz), wall, tz);
  }
});

test('zonedToEpoch across a DST change', () => {
  // New York springs forward on 2026-03-08 at 02:00 → 03:00.
  const before = t.zonedToEpoch(
    { year: 2026, month: 3, day: 8, hour: 1, minute: 30 },
    'America/New_York',
  );
  const after = t.zonedToEpoch(
    { year: 2026, month: 3, day: 8, hour: 3, minute: 30 },
    'America/New_York',
  );
  assert.equal(after - before, HOUR);
});

test('addDays and dayDiff cross month and year boundaries', () => {
  assert.deepEqual(t.addDays({ year: 2026, month: 12, day: 30 }, 3), {
    year: 2027,
    month: 1,
    day: 2,
  });
  assert.deepEqual(t.addDays({ year: 2028, month: 3, day: 1 }, -1), {
    year: 2028,
    month: 2,
    day: 29,
  });
  assert.equal(t.dayDiff({ year: 2026, month: 9, day: 25 }, { year: 2026, month: 10, day: 2 }), 7);
});

test('offsetLabel', () => {
  const ts = Date.UTC(2026, 0, 15);
  assert.equal(t.offsetLabel('Asia/Kolkata', ts), 'GMT+5:30');
  assert.equal(t.offsetLabel('America/New_York', ts), 'GMT−5');
  assert.equal(t.offsetLabel('UTC', ts), 'GMT');
});

test('describeDue: relative day words, state and zone suffix', () => {
  const opts = { now: Date.UTC(2026, 8, 25, 6, 0), local: 'Asia/Kolkata', locale: 'en-US' }; // 11:30 IST
  const at = (d, h, m = 0) =>
    t.zonedToEpoch({ year: 2026, month: 9, day: d, hour: h, minute: m }, 'Asia/Kolkata');

  assert.deepEqual(t.describeDue(at(25, 17, 30), 'Asia/Kolkata', opts), {
    label: 'Today, 5:30 PM',
    state: 'soon',
  });
  assert.deepEqual(t.describeDue(at(26, 9), 'Asia/Kolkata', opts), {
    label: 'Tomorrow, 9:00 AM',
    state: 'soon',
  });
  assert.deepEqual(t.describeDue(at(24, 9), 'Asia/Kolkata', opts), {
    label: 'Yesterday, 9:00 AM',
    state: 'overdue',
  });
  assert.deepEqual(t.describeDue(at(29, 9), 'Asia/Kolkata', opts), {
    label: 'Tuesday, 9:00 AM',
    state: 'later',
  });
  const oct10 = t.zonedToEpoch(
    { year: 2026, month: 10, day: 10, hour: 9, minute: 0 },
    'Asia/Kolkata',
  );
  assert.equal(t.describeDue(oct10, 'Asia/Kolkata', opts).label, 'Sat, Oct 10, 9:00 AM');

  // A task due in another zone shows that zone's wall clock and offset.
  const ny = t.zonedToEpoch(
    { year: 2026, month: 9, day: 25, hour: 9, minute: 0 },
    'America/New_York',
  );
  assert.equal(t.describeDue(ny, 'America/New_York', opts).label, 'Today, 9:00 AM GMT−4');
  // The same offset as the viewer's zone needs no suffix.
  assert.equal(t.describeDue(at(25, 17, 30), 'Asia/Calcutta', opts).label, 'Today, 5:30 PM');
});

test('timeZones includes the local zone', () => {
  assert.ok(t.timeZones('Mars/Olympus').includes('Mars/Olympus'));
  assert.ok(t.timeZones('UTC').length > 100);
});
