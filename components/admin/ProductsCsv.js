'use client';
import { useState } from 'react';
import { importProducts } from '@/lib/actions/admin';
const COLS = ['slug', 'name', 'sku', 'collection', 'tagline', 'hindi_line', 'tags', 'case_color', 'strap_color', 'price', 'compare_price', 'stock', 'stock_mode', 'weight_g', 'description', 'long_description', 'tagline_hi', 'description_hi', 'long_description_hi', 'features', 'seo_title', 'seo_description', 'images', 'video', 'featured', 'active', 'sort'];
export default function ProductsCsv({ products = [], collections = [] }) {
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  const cs = Object.fromEntries(collections.map(c => [c.id, c.slug]));
  const flat = (p) => COLS.map(k => k === 'collection' ? (cs[p.collection_id] || '') : k === 'features' ? (p.features || []).join(' | ') : k === 'tags' ? (p.tags || []).join(' | ') : k === 'images' ? (p.images || []).join(' | ') : p[k] ?? '');
  async function save(kind, rows, name) {
    const X = await import('xlsx'); const ws = X.utils.aoa_to_sheet([COLS, ...rows]);
    const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, ws, 'Products');
    if (kind === 'xlsx') X.writeFile(wb, name + '.xlsx');
    else { const b = new Blob(['﻿' + X.utils.sheet_to_csv(ws)], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name + '.csv'; a.click(); }
  }
  const tpl = [['yg-example', 'Example Watch', 'YG-DHR-BK-BK', 'dhruv', 'A tagline', 'अचल ध्रुव', 'New | Limited', 'Black', 'Black', 3999, 5999, 10, 'in_stock', 85, '', '', '', '', '', 'Miyota movement | 5 ATM', '', '', 'https://…/YG-DHR-BK-BK-1.png | https://…/YG-DHR-BK-BK-2.png', '', 'no', 'yes', 0]];
  async function onFile(f) {
    if (!f) return; setBusy(true); setMsg('Reading file…');
    try {
      const X = await import('xlsx');
      const wb = /\.csv$/i.test(f.name) ? X.read((await f.text()).replace(/^﻿/, ''), { type: 'string' }) : X.read(await f.arrayBuffer(), { type: 'array' });
      const all = X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '', raw: false });
      const rows = all.map(r => Object.fromEntries(Object.entries(r).map(([k, v]) => [k.trim().toLowerCase().replace(/[\s-]+/g, '_'), v]))).filter(r => Object.values(r).some(v => String(v).trim()));
      if (!rows.length) { setMsg('No rows found.'); setBusy(false); return; }
      let n = 0;
      for (let i = 0; i < rows.length; i += 20) {
        const r = await importProducts(rows.slice(i, i + 20));
        if (r?.error) { setMsg(`${n} saved. Stopped: ${r.error}`); setBusy(false); return; }
        n += r.count;
      }
      setMsg(`Done — ${n} products added or updated. Refresh to see them.`);
    } catch (e) { setMsg('Could not read the file: ' + (e?.message || e)); }
    setBusy(false);
  }
  return (
    <div className="box" style={{ marginBottom: 30 }}>
      <b>Bulk import / export (CSV or Excel)</b>
      <p style={{ color: 'var(--muted)', margin: '8px 0 14px' }}>Download all products, edit in Excel, upload back. Rows match on slug (or SKU). Blank cells leave the current value unchanged. Features and images: separate items with “ | ”. Collection: its slug, e.g. dhruv.</p>
      <p style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: 0 }}>
        <button className="btn" type="button" onClick={() => save('xlsx', products.map(flat), 'yugastra-products')}>Export Excel</button>
        <button className="btn" type="button" onClick={() => save('csv', products.map(flat), 'yugastra-products')}>Export CSV</button>
        <button className="btn" type="button" onClick={() => save('xlsx', tpl, 'yugastra-products-template')}>Blank template</button>
      </p>
      <p><input type="file" accept=".csv,.xlsx,.xls" disabled={busy} onChange={e => { onFile(e.target.files[0]); e.target.value = ''; }} /></p>
      {msg && <p style={{ margin: 0 }}>{msg}</p>}
    </div>
  );
}
