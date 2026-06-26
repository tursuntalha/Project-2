import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, searchProducts, addToCart } from '../lib/api';
import { useAuth } from '../App';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [semanticResults, setSemanticResults] = useState([]);
  const { setCartCount } = useAuth();

  useEffect(() => {
    getProducts().then(res => setProducts(res.data.products));
  }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length < 2) { setSemanticResults([]); return; }
    const res = await searchProducts(q);
    const results = res.data.semantic.length > 0 ? res.data.semantic : res.data.fallback;
    setSemanticResults(results);
  };

  const display = semanticResults.length > 0 ? semanticResults : products;

  const handleAdd = async (id) => {
    await addToCart(id, 1);
    const cart = await (await import('../lib/api')).getCart();
    setCartCount(cart.data.items?.length || 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="🔍 Search products... (semantic search)"
        className="w-full p-3 mb-8 rounded-lg bg-[var(--card)] border border-[var(--border)] focus:border-primary outline-none"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {display.map(p => (
          <div key={p._id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <Link to={`/products/${p._id}`}>
              <h3 className="font-semibold mb-1 hover:text-primary">{p.name}</h3>
            </Link>
            <p className="text-sm text-gray-400 mb-2">${p.price}</p>
            {p.similarityScore && (
              <p className="text-xs text-primary mb-1">Relevance: {(p.similarityScore * 100).toFixed(0)}%</p>
            )}
            <button onClick={() => handleAdd(p._id)} className="w-full py-1.5 bg-primary rounded-lg text-sm mt-2 hover:opacity-90">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
