import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, checkout } from '../lib/api';
import { useAuth } from '../App';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState({ street: '', city: '', country: '' });
  const { user, setCartCount } = useAuth();

  useEffect(() => {
    if (user) getCart().then(res => setCart(res.data));
  }, [user]);

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    const updated = await getCart();
    setCart(updated.data);
    setCartCount(updated.data.items?.length || 0);
  };

  const handleCheckout = async () => {
    try {
      const res = await checkout(address);
      setCart(null);
      setCartCount(0);
      alert('Order placed!');
    } catch (err) {
      alert('Checkout failed');
    }
  };

  if (!user) return <div className="p-8 text-center">Please login to view cart</div>;
  if (!cart || !cart.items?.length) return <div className="p-8 text-center">Cart is empty</div>;

  const total = cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cart</h1>
      {cart.items.map(item => (
        <div key={item.product._id} className="flex justify-between items-center p-4 mb-2 rounded-lg bg-[var(--card)] border border-[var(--border)]">
          <div>
            <h3 className="font-semibold">{item.product.name}</h3>
            <p className="text-sm text-gray-400">${item.product.price} x {item.quantity}</p>
          </div>
          <button onClick={() => handleRemove(item.product._id)} className="text-red-400 text-sm">Remove</button>
        </div>
      ))}
      <div className="text-xl font-bold mt-4">Total: ${total.toFixed(2)}</div>
      <div className="mt-6 space-y-2">
        <input placeholder="Street" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className="w-full p-2 rounded bg-[var(--card)] border border-[var(--border)]" />
        <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="w-full p-2 rounded bg-[var(--card)] border border-[var(--border)]" />
        <input placeholder="Country" value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} className="w-full p-2 rounded bg-[var(--card)] border border-[var(--border)]" />
        <button onClick={handleCheckout} className="w-full py-3 bg-primary rounded-lg font-semibold mt-4">Checkout</button>
      </div>
    </div>
  );
}
