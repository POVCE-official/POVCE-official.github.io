import {newestFirst} from './collection-order.mjs';

/** Keep each shelf separate, place a collection at its newest member's date. */
export function groupEntries(items) {
  const groups = new Map();
  for (const item of [...items].sort(newestFirst)) {
    const key = `${item.kind}:${item.groupId ? 'group:'+item.groupId : 'entry:'+item.id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.values()].map(members => members.sort((a, b) =>
    (a.groupOrder ?? Number.MAX_SAFE_INTEGER) - (b.groupOrder ?? Number.MAX_SAFE_INTEGER) || newestFirst(a, b)));
}

export function matchesCollection(search, itemStatus, query, status) {
  return (!query || search.includes(query)) && (!status || itemStatus === status);
}
