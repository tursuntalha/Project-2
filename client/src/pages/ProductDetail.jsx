import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getRecommendations, addToCart } from '../lib/api';
import { useAuth } from '../App';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const { setCartCount } = useAuth();

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data));
    getRecommendations(id).then(res => setRecommendations(res.data.recommendations || [])).catch(() => {});
  }, [id]);

  const handleAdd = async () => {
    await addToCart(id, 1);
    const cart = await (await import('../lib/api')).getCart();
    setCartCount(cart.data.items?.length || 0);
  };

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl text-primary font-bold mb-4">${product.price}</p>
        <p className="text-gray-400 mb-4">{product.description}</p>
        <p className="text-sm mb-4">Category: {product.category} | Stock: {product.stock}</p>
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Specifications</h3>
            {Object.entries(product.specs).map(([k, v]) => (
              <p key={k} className="text-sm text-gray-400">{k}: {v}</p>
            ))}
          </div>
        )}
        <button onClick={handleAdd} className="px-6 py-2 bg-primary rounded-lg font-semibold">Add to Cart</button>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">AI Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendations.map(r => (
              <div key={r._id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-sm text-primary">${r.price}</p>
                {r.explanation && <p className="text-xs text-gray-400 mt-2">{r.explanation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
