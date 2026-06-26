import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Admin from './pages/Admin';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  return (
    <AuthContext.Provider value={{ user, setUser, cartCount, setCartCount }}>
      <div className="min-h-screen">
        <nav className="fixed top-0 w-full z-50 bg-[var(--card)]/80 backdrop-blur border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="font-bold text-lg text-primary">ShopMind</Link>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="hover:text-primary">Products</Link>
              <Link to="/cart" className="hover:text-primary">Cart ({cartCount})</Link>
              {user ? <Link to="/orders" className="hover:text-primary">Orders</Link> : null}
              {user?.role === 'admin' ? <Link to="/admin" className="text-yellow-400">Admin</Link> : null}
              {user ? <button onClick={() => setUser(null)} className="hover:text-primary">Logout</button> : <Link to="/login" className="hover:text-primary">Login</Link>}
            </div>
          </div>
        </nav>
        <div className="pt-14">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
