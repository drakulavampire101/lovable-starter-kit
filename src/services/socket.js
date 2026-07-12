// Realtime shim — same subscribe API as the old Socket.IO wrapper,
// backed by Supabase Realtime (Postgres CDC + broadcast).
import { supabase } from '@/integrations/supabase/client';

const channels = new Map();

function getChannel(name) {
  if (!channels.has(name)) {
    const ch = supabase.channel(name);
    channels.set(name, { ch, subs: 0, ready: false });
  }
  return channels.get(name);
}

function subscribeTable({ table, event = '*', name, filter }, handler) {
  const entry = getChannel(name);
  const cfg = { event, schema: 'public', table };
  if (filter) cfg.filter = filter;
  entry.ch.on('postgres_changes', cfg, handler);
  if (!entry.ready) {
    entry.ch.subscribe();
    entry.ready = true;
  }
  entry.subs += 1;
  return () => {
    entry.subs -= 1;
    if (entry.subs <= 0) {
      supabase.removeChannel(entry.ch);
      channels.delete(name);
    }
  };
}

export function getSocket() {
  return { connected: true };
}

export function disconnectSocket() {
  channels.forEach(({ ch }) => supabase.removeChannel(ch));
  channels.clear();
}

export function joinAdminRoom() {
  /* no-op: Realtime is channel-based */
}

export const onSosNew = (fn) =>
  subscribeTable({ table: 'sos_alerts', event: 'INSERT', name: 'sos-new' }, (p) => fn(p.new));

export const onSosResolved = (fn) =>
  subscribeTable({ table: 'sos_alerts', event: 'UPDATE', name: 'sos-updates' }, (p) => {
    if (p.new?.status === 'RESOLVED') fn(p.new);
  });

export const onSosClaimed = (fn) =>
  subscribeTable({ table: 'sos_alerts', event: 'UPDATE', name: 'sos-updates' }, (p) => {
    if (p.new?.status === 'CLAIMED') fn(p.new);
  });

export const onNotification = (fn) =>
  subscribeTable({ table: 'notifications', event: 'INSERT', name: 'notifications' }, (p) => fn(p.new));

export const onVoteCast = (electionId, fn) =>
  subscribeTable(
    { table: 'votes', event: 'INSERT', name: `election-${electionId}`, filter: `election_id=eq.${electionId}` },
    (p) => fn(p.new),
  );
