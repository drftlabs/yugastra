'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertRow, deleteRow } from '@/lib/actions/admin';

const toKV = (o) => Object.entries(o || {}).map(([k, v]) => `${k}: ${v}`).join('\n');
const fromKV = (s) => Object.fromEntries(String(s || '').split('\n').map((l) => l.split(/:(.*)/s)).filter((a) => a[0]?.trim()).map((a) => [a[0].trim(), (a[1] || '').trim()]));

export default function Crud({ table, fields, rows, columns, pk = 'id', title = 'item' }) {
  const [edit, setEdit] = useState(null); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false); const r = useRouter();
  const blank = () => Object.fromEntries(fields.map((f) => [f.k, f.type === 'bool' ? !!f.def : f.type === 'images' ? [] : f.type === 'kv' ? {} : f.type === 'list' ? [] : f.def ?? '']));
  const open = (row) => setEdit(row ? { ...row, _new: false } : { ...blank(), _new: true });
  const set = (k, v) => setEdit((e) => ({ ...e, [k]: v }));
  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg('');
    const row = {};
    for (const f of fields) { let v = edit[f.k]; if (f.type === 'list' && typeof v === 'string') v = v.split('\n').map((x) => x.trim()).filter(Boolean); if (f.type === 'number') v = v === '' || v == null ? null : Number(v); if (f.type === 'select' && v === '') v = null; if (f.type === 'date') v = v ? new Date(v).toISOString() : null; row[f.k] = v; }
    if (edit[pk] && !edit._new) row[pk] = edit[pk];
    const res = await upsertRow(table, row); setBusy(false);
    if (res.error) return setMsg(res.error);
    setEdit(null); r.refresh();
  }
  async function del(row) { if (!confirm(`Delete this ${title}?`)) return; const res = await deleteRow(table, row[pk]); if (res.error) alert(res.error); else r.refresh(); }
  async function upload(file, cb) { const fd = new FormData(); fd.append('file', file); const d = await fetch('/api/admin/upload', { method: 'POST', body: fd }).then((x) => x.json()); d.url ? cb(d.url) : alert(d.error); }

  return (
    <>
      <div className="bar"><button className="btn btn-gold sm" onClick={() => open(null)}>+ Add {title}</button></div>
      {edit && (
        <form className="drawer-form" onSubmit={save}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '0 18px' }}>
            {fields.map((f) => (
              <div className="field" key={f.k} style={f.wide || ['textarea', 'images', 'kv', 'list'].includes(f.type) ? { gridColumn: '1/-1' } : null}>
                <label>{f.label || f.k}</label>
                {f.type === 'textarea' ? <textarea className="inp" value={edit[f.k] ?? ''} onChange={(e) => set(f.k, e.target.value)} style={{ minHeight: f.tall ? 240 : 100 }} />
                  : f.type === 'bool' ? <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" checked={!!edit[f.k]} onChange={(e) => set(f.k, e.target.checked)} /> Yes</label>
                  : f.type === 'select' ? <select className="inp" value={edit[f.k] ?? ''} onChange={(e) => set(f.k, e.target.value)}><option value="">—</option>{f.options.map((o) => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}</select>
                  : f.type === 'list' ? <textarea className="inp" placeholder="One item per line" value={Array.isArray(edit[f.k]) ? edit[f.k].join('\n') : (edit[f.k] ?? '')} onChange={(e) => set(f.k, e.target.value)} onBlur={(e) => set(f.k, e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))} />
                  : f.type === 'kv' ? <textarea className="inp" placeholder="Key: value (one per line)" value={typeof edit[f.k] === 'string' ? edit[f.k] : toKV(edit[f.k])} onChange={(e) => set(f.k, e.target.value)} onBlur={(e) => set(f.k, fromKV(e.target.value))} />
                  : f.type === 'images' ? (<div><div className="imgs">{(edit[f.k] || []).map((u, i) => <div key={i}><img src={u} alt="" /><button type="button" onClick={() => set(f.k, edit[f.k].filter((_, n) => n !== i))}>✕</button></div>)}</div>
                      <div style={{ display: 'flex', gap: 8 }}><input className="inp" placeholder="Paste image URL, press Enter" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (e.target.value) { set(f.k, [...(edit[f.k] || []), e.target.value]); e.target.value = ''; } } }} /><label className="btn sm" style={{ whiteSpace: 'nowrap' }}>Upload<input type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && upload(e.target.files[0], (u) => set(f.k, [...(edit[f.k] || []), u]))} /></label></div></div>)
                  : f.type === 'image' ? (<div>
                    {edit[f.k] ? <div style={{ marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-end' }}><img src={edit[f.k]} alt="" style={{ maxWidth: 220, maxHeight: 150, border: '1px solid var(--line)', background: '#000', objectFit: 'contain' }} /><button type="button" className="btn sm" onClick={() => set(f.k, '')}>Remove image</button></div> : null}
                    <div style={{ display: 'flex', gap: 8 }}><input className="inp" value={edit[f.k] ?? ''} onChange={(e) => set(f.k, e.target.value)} placeholder="Image URL" /><label className="btn sm">{edit[f.k] ? 'Replace' : 'Upload'}<input type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && upload(e.target.files[0], (u) => set(f.k, u))} /></label></div>
                    {f.hint ? <small style={{ color: 'var(--muted)', display: 'block', marginTop: 6 }}>{f.hint}</small> : null}</div>)
                  : <input className="inp" type={f.type === 'number' ? 'number' : f.type === 'date' ? 'datetime-local' : 'text'} step="any" required={f.req} disabled={f.k === pk && !edit._new} value={f.type === 'date' ? (edit[f.k] ? String(edit[f.k]).slice(0, 16) : '') : edit[f.k] ?? ''} onChange={(e) => set(f.k, e.target.value)} />}
              </div>
            ))}
          </div>
          {msg && <div className="err">{msg}</div>}
          <div className="bar"><button className="btn btn-gold sm" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button><button type="button" className="btn sm" onClick={() => setEdit(null)}>Cancel</button></div>
        </form>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl"><thead><tr>{columns.map((c) => <th key={c.k}>{c.label || c.k}</th>)}<th /></tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row[pk]}>{columns.map((c) => <td key={c.k}>{c.bool ? <span className={`pill ${row[c.k] ? 'on' : 'off'}`}>{row[c.k] ? 'on' : 'off'}</span> : c.money ? '₹' + Number(row[c.k] || 0).toLocaleString('en-IN') : String(row[c.k] ?? '').slice(0, 60)}</td>)}
              <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}><button className="btn sm" onClick={() => open(row)}>Edit</button> <button className="btn sm" onClick={() => del(row)}>Delete</button></td></tr>))}
            {!rows.length && <tr><td colSpan={columns.length + 1} style={{ color: 'var(--muted)', textAlign: 'center', padding: 30 }}>Nothing here yet.</td></tr>}</tbody></table>
      </div>
    </>
  );
}
