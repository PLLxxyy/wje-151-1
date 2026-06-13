import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import ServiceList from './pages/ServiceList';
import ServiceDetail from './pages/ServiceDetail';
import MyOrders from './pages/MyOrders';
import RateOrder from './pages/RateOrder';
import AddressBook from './pages/AddressBook';
import AuntDashboard from './pages/AuntDashboard';
import Profile from './pages/Profile';
import { UserRole } from './types';
import { useState } from 'react';

function BottomNav({ role, onSwitch }: { role: UserRole; onSwitch: (r: UserRole) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  if (role === 'aunt') {
    return (
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          <button className={`nav-item ${path === '/aunt' ? 'active' : ''}`} onClick={() => navigate('/aunt')}>
            <span className="nav-icon">📋</span>
            <span>待接订单</span>
          </button>
          <button className={`nav-item ${path === '/profile' ? 'active' : ''}`} onClick={() => navigate('/profile')}>
            <span className="nav-icon">👤</span>
            <span>个人中心</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <button className={`nav-item ${path === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span>
          <span>首页</span>
        </button>
        <button className={`nav-item ${path === '/orders' ? 'active' : ''}`} onClick={() => navigate('/orders')}>
          <span className="nav-icon">📦</span>
          <span>订单</span>
        </button>
        <button className={`nav-item ${path === '/addresses' ? 'active' : ''}`} onClick={() => navigate('/addresses')}>
          <span className="nav-icon">📍</span>
          <span>地址</span>
        </button>
        <button className={`nav-item ${path === '/profile' ? 'active' : ''}`} onClick={() => navigate('/profile')}>
          <span className="nav-icon">👤</span>
          <span>我的</span>
        </button>
      </div>
    </nav>
  );
}

function AppRoutes() {
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem('wje_role') as UserRole) || 'customer');

  const switchRole = (r: UserRole) => {
    setRole(r);
    localStorage.setItem('wje_role', r);
  };

  return (
    <div className="app">
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home role={role} onSwitchRole={switchRole} />} />
          <Route path="/services/:categoryId" element={<ServiceList />} />
          <Route path="/service/:serviceId" element={<ServiceDetail />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/rate/:orderId" element={<RateOrder />} />
          <Route path="/addresses" element={<AddressBook />} />
          <Route path="/aunt" element={<AuntDashboard />} />
          <Route path="/profile" element={<Profile role={role} onSwitchRole={switchRole} />} />
        </Routes>
      </div>
      <BottomNav role={role} onSwitch={switchRole} />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
