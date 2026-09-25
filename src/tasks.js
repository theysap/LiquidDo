'use strict';

// Pure helpers for tasks and due dates — no DOM, no storage. Loaded by the popup as a classic
// script (window.LiquidDoTasks) and by the unit tests through require().
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LiquidDoTasks = api;
})(typeof self !== 'undefined' ? self : this, () => {
  const MINUTE = 60000;
  const DAY = 86400000;

  const localZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function timeAgo(ts, now = Date.now()) {
    const m = Math.floor((now - ts) / MINUTE);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const partsCache = new Map();
  const partsFormatter = (tz) => {
    if (!partsCache.has(tz)) {
      partsCache.set(
        tz,
        new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hourCycle: 'h23',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }),
      );
    }
    return partsCache.get(tz);
  };

  /** Wall-clock parts of instant `ts` in time zone `tz` (month is 1-based). */
  function zonedParts(ts, tz) {
    const p = {};
    for (const { type, value } of partsFormatter(tz).formatToParts(ts)) p[type] = Number(value);
    return { year: p.year, month: p.month, day: p.day, hour: p.hour % 24, minute: p.minute };
  }

  /** Minutes `tz` is ahead of UTC at instant `ts` (e.g. 330 for Asia/Kolkata). */
  function zoneOffset(ts, tz) {
    const p = zonedParts(ts, tz);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
    return Math.round((asUtc - Math.floor(ts / MINUTE) * MINUTE) / MINUTE);
  }

  /**
   * The instant at which the wall clock in `tz` reads the given date and time. Times skipped by
   * a daylight-saving jump resolve to the moment just after it.
   */
  function zonedToEpoch({ year, month, day, hour = 0, minute = 0 }, tz) {
    const wall = Date.UTC(year, month - 1, day, hour, minute);
    let ts = wall - zoneOffset(wall, tz) * MINUTE;
    ts = wall - zoneOffset(ts, tz) * MINUTE;
    return ts;
  }

  /** Whole calendar days from `from` to `to` (both {year, month, day}). */
  const dayDiff = (from, to) =>
    Math.round(
      (Date.UTC(to.year, to.month - 1, to.day) - Date.UTC(from.year, from.month - 1, from.day)) /
        DAY,
    );

  /** Adds `n` days to a {year, month, day} date. */
  function addDays({ year, month, day }, n) {
    const d = new Date(Date.UTC(year, month - 1, day + n));
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
  }

  /** "GMT+5:30"-style offset label for `tz` at instant `ts`. */
  function offsetLabel(tz, ts = Date.now()) {
    const off = zoneOffset(ts, tz);
    if (off === 0) return 'GMT';
    const sign = off > 0 ? '+' : '−';
    const h = Math.floor(Math.abs(off) / 60);
    const m = Math.abs(off) % 60;
    return `GMT${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
  }

  /** Every IANA time zone the browser knows, with the local zone guaranteed to be present. */
  function timeZones(local = localZone()) {
    const all =
      typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : [];
    return all.includes(local) ? all : [local, ...all];
  }

  /**
   * Describes a due date for display: `label` like "Today, 5:30 PM" (in the task's zone, with
   * the zone's offset appended when it differs from the viewer's), and `state` of
   * "overdue" | "soon" (within 24 h) | "later".
   */
  function describeDue(dueAt, tz, { now = Date.now(), local = localZone(), locale } = {}) {
    const zone = tz || local;
    const due = zonedParts(dueAt, zone);
    const today = zonedParts(now, zone);
    const diff = dayDiff(today, due);
    const time = new Intl.DateTimeFormat(locale, {
      timeZone: zone,
      hour: 'numeric',
      minute: '2-digit',
    }).format(dueAt);

    let day;
    if (diff === 0) day = 'Today';
    else if (diff === 1) day = 'Tomorrow';
    else if (diff === -1) day = 'Yesterday';
    else if (diff > 1 && diff < 7) {
      day = new Intl.DateTimeFormat(locale, { timeZone: zone, weekday: 'long' }).format(dueAt);
    } else {
      day = new Intl.DateTimeFormat(locale, {
        timeZone: zone,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        ...(due.year !== today.year ? { year: 'numeric' } : {}),
      }).format(dueAt);
    }

    const sameOffset = zoneOffset(dueAt, zone) === zoneOffset(dueAt, local);
    const label = `${day}, ${time}${zone !== local && !sameOffset ? ` ${offsetLabel(zone, dueAt)}` : ''}`;
    const state = dueAt < now ? 'overdue' : dueAt - now <= DAY ? 'soon' : 'later';
    return { label, state };
  }

  return {
    uid,
    timeAgo,
    escapeHtml,
    localZone,
    zonedParts,
    zoneOffset,
    zonedToEpoch,
    dayDiff,
    addDays,
    offsetLabel,
    timeZones,
    describeDue,
  };
});
