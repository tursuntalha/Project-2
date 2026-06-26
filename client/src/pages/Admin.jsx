import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getProducts, getAnomalies, generateDescription } from '../lib/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => { getProducts().then(res => setProducts(res.data.products)); }, []);
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Product List</h2>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-gray-400 border-b border-[var(--border)]"><th className="pb-2">Name</th><th>Price</th><th>Stock</th><th>Category</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} className="border-b border-[var(--border)]">
              <td className="py-2">{p.name}</td><td>${p.price}</td><td>{p.stock}</td><td>{p.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AIDescriptionTool() {
  const [form, setForm] = useState({ name: '', specs: '', category: 'Electronics', price: '' });
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    const res = await generateDescription({ ...form, specs: form.specs.split('\n') });
    setResult(res.data);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">AI Description Generator</h2>
      <div className="space-y-3">
        <input placeholder="Product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 rounded bg-[var(--bg)] border border-[var(--border)]" />
        <textarea placeholder="Specs (one per line)" value={form.specs} onChange={e => setForm({ ...form, specs: e.target.value })} rows={4} className="w-full p-2 rounded bg-[var(--bg)] border border-[var(--border)]" />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full p-2 rounded bg-[var(--bg)] border border-[var(--border)]">
          {['Electronics', 'Clothing', 'Home', 'Sports', 'Books'].map(c => <option key={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full p-2 rounded bg-[var(--bg)] border border-[var(--border)]" />
        <button onClick={handleGenerate} className="w-full py-2 bg-primary rounded-lg">Generate Description</button>
        {result && (
          <div className="p-4 rounded bg-[var(--bg)] border border-[var(--border)] mt-4">
            <h3 className="font-bold">{result.title}</h3>
            <p className="text-sm mt-2">{result.description}</p>
            <ul className="mt-2 text-sm">{result.features?.map((f, i) => <li key={i}>• {f}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

function AnomalyPanel() {
  const [anomalies, setAnomalies] = useState([]);
  useEffect(() => { getAnomalies().then(res => setAnomalies(res.data)).catch(() => {}); }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Anomaly Alert Panel</h2>
      {anomalies.length === 0 && <p className="text-gray-400">No anomalies detected</p>}
      {anomalies.map((a, i) => (
        <div key={i} className={`p-3 mb-2 rounded-lg border ${a.type === 'spike' ? 'border-yellow-500 bg-yellow-500/10' : 'border-red-500 bg-red-500/10'}`}>
          <p className="font-semibold">{a.productName}</p>
          <p className="text-sm">{a.type === 'spike' ? '📈 Spike' : '📉 Drop'} - {Math.abs(a.deviation * 100).toFixed(0)}% deviation</p>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6 text-sm">
        <Link to="/admin" end className="px-3 py-1.5 rounded bg-[var(--card)] border border-[var(--border)] hover:border-primary">Products</Link>
        <Link to="/admin/ai-description" className="px-3 py-1.5 rounded bg-[var(--card)] border border-[var(--border)] hover:border-primary">AI Description</Link>
        <Link to="/admin/anomalies" className="px-3 py-1.5 rounded bg-[var(--card)] border border-[var(--border)] hover:border-primary">Anomalies</Link>
      </div>
      <Routes>
        <Route index element={<ProductList />} />
        <Route path="ai-description" element={<AIDescriptionTool />} />
        <Route path="anomalies" element={<AnomalyPanel />} />
      </Routes>
    </div>
  );
}
