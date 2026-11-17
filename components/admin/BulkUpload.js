'use client';
import { useState } from 'react';
export default function BulkUpload() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [copied, setCopied] = useState(false);

  async function run(files) {
    files = [...files]; if (!files.length) return;
    setBusy(true); setDone(0); setTotal(files.length);
    const out = files.map(f => ({ name: f.name, url: '', err: '' })); setRows([...out]);
    let next = 0, n = 0;
    const worker = async () => {
      while (next < files.length) {
        const i = next++; const fd = new FormData(); fd.append('file', files[i]); fd.append('keep', '1');
        try {
          const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
          const j = await r.json().catch(() => ({}));
          if (r.ok && j.url) out[i].url = j.url; else out[i].err = j.error || `Failed (${r.status})`;
        } catch { out[i].err = 'Network error'; }
        setDone(++n); setRows([...out]);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    setBusy(false);
  }
  const ok = rows.filter(r => r.url);
  const text = () => ok.map(r => `${r.name}\t${r.url}`).join('\n');
  const copy = async () => { try { await navigator.clipboard.writeText(text()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} };
  const csv = () => {
    const b = new Blob(['filename,url\n' + ok.map(r => `${r.name},${r.url}`).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'yugastra-image-links.csv'; a.click();
  };
  const xlsx = async () => {
    const X = await import('xlsx'); const ws = X.utils.aoa_to_sheet([['filename', 'sku', 'angle', 'url'], ...ok.map(r => { const m = r.name.match(/^(YG-[A-Z]{3}-[A-Z]{2}-[A-Z]{2})-(\d)/); return [r.name, m ? m[1] : '', m ? Number(m[2]) : '', r.url]; })]);
    const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, ws, 'Links'); X.writeFile(wb, 'yugastra-image-links.xlsx');
  };
  return (
    <div className="box">
      <p style={{ color: 'var(--muted)', marginTop: 0 }}>Select many images at once (up to 4.4 MB each). Each keeps its file name, e.g. YG-DHR-BK-BK-1.png. Copy or download the links and send them to be added to the product catalog.</p>
      <input type="file" accept="image/*" multiple disabled={busy} onChange={e => run(e.target.files)} />
      {total > 0 && <p><b>{done} / {total}</b> uploaded{ok.length < done ? ` · ${done - ok.length} failed` : ''}</p>}
      {ok.length > 0 && <p style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn" type="button" onClick={copy}>{copied ? 'Copied ✓' : `Copy all ${ok.length} links`}</button>
        <button className="btn" type="button" onClick={xlsx}>Download links (Excel)</button>
        <button className="btn" type="button" onClick={csv}>Download links (CSV)</button>
      </p>}
      {rows.length > 0 && <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', fontSize: 13 }}><thead><tr><th align="left">File</th><th align="left">Link</th></tr></thead><tbody>
        {rows.map((r, i) => <tr key={i}><td>{r.name}</td><td style={{ wordBreak: 'break-all' }}>{r.url ? <a href={r.url} target="_blank">{r.url}</a> : r.err ? <span style={{ color: '#c0392b' }}>{r.err}</span> : 'Uploading…'}</td></tr>)}
      </tbody></table></div>}
    </div>
  );
}
