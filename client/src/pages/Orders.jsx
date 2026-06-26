import React, { useState, useEffect } from 'react';
import { getOrders } from '../lib/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => { getOrders().then(res => setOrders(res.data)); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      {orders.length === 0 && <p className="text-gray-400">No orders yet</p>}
      {orders.map(order => (
        <div key={order._id} className="p-4 mb-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Order #{order._id.slice(-6)}</span>
            <span className="text-sm text-primary">${order.total}</span>
          </div>
          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} - {order.status}</p>
          <div className="mt-2 text-sm">
            {order.items.map(item => (
              <span key={item._id} className="mr-2">{item.product?.name} x{item.quantity}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
