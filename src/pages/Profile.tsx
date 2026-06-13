import { useNavigate } from 'react-router-dom';
import { getReviews, getOrders } from '../utils/storage';
import { UserRole } from '../types';
import { useState } from 'react';

interface ProfileProps {
  role: UserRole;
  onSwitchRole: (r: UserRole) => void;
}

export default function Profile({ role, onSwitchRole }: ProfileProps) {
  const navigate = useNavigate();
  const [view, setView] = useState<'menu' | 'orders' | 'reviews'>('menu');

  const orders = getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const reviews = getReviews();

  if (view === 'orders') {
    return (
      <div>
        <div className="header">
          <button className="back-btn" onClick={() => setView('menu')}>←</button>
          <span className="title">我的订单</span>
        </div>
        <div style={{ padding: 16 }}>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-text">暂无订单</div>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">{order.id}</span>
                  <span className="text-secondary text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="order-body">
                  <div className="order-service">{order.serviceName}</div>
                  <div className="order-detail">{order.auntAvatar} {order.auntName} | ¥{order.totalPrice}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === 'reviews') {
    return (
      <div>
        <div className="header">
          <button className="back-btn" onClick={() => setView('menu')}>←</button>
          <span className="title">我的评价</span>
        </div>
        <div style={{ padding: 16 }}>
          {reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <div className="empty-text">暂无评价</div>
            </div>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <span style={{ fontWeight: 600 }}>{r.serviceName} - {r.auntName}</span>
                  <span className="review-stars">{'⭐'.repeat(r.rating)}</span>
                </div>
                <div className="review-text">{r.text || '用户未填写文字评价'}</div>
                <div className="text-sm text-secondary" style={{ marginTop: 8 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <span className="title-main">个人中心</span>
      </div>

      <div className="page-banner" style={{ paddingBottom: 30 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{role === 'aunt' ? '👩‍🔧' : '👤'}</div>
        <h2>{role === 'aunt' ? '家政阿姨' : '尊享用户'}</h2>
        <p>{role === 'aunt' ? '专业服务 温暖到家' : '感谢您选择温馨家政'}</p>
      </div>

      <div style={{ marginTop: -16 }}>
        <div className="card" style={{ margin: '0 20px', padding: '20px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{orders.length}</div>
            <div className="text-sm text-secondary">总订单</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{completedCount}</div>
            <div className="text-sm text-secondary">已完成</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{reviews.length}</div>
            <div className="text-sm text-secondary">评价数</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="profile-menu-item" onClick={() => setView('orders')}>
          <span className="menu-icon">📦</span>
          <span>我的订单</span>
          <span className="menu-arrow">›</span>
        </button>
        <button className="profile-menu-item" onClick={() => setView('reviews')}>
          <span className="menu-icon">⭐</span>
          <span>我的评价</span>
          <span className="menu-arrow">›</span>
        </button>
        <button className="profile-menu-item" onClick={() => navigate('/addresses')}>
          <span className="menu-icon">📍</span>
          <span>常用地址</span>
          <span className="menu-arrow">›</span>
        </button>
        <button className="profile-menu-item" onClick={() => {
          const newRole = role === 'customer' ? 'aunt' : 'customer';
          onSwitchRole(newRole);
          if (newRole === 'aunt') navigate('/aunt');
        }}>
          <span className="menu-icon">🔄</span>
          <span>切换到{role === 'customer' ? '阿姨' : '用户'}视角</span>
          <span className="menu-arrow">›</span>
        </button>
        <button className="profile-menu-item" onClick={() => {
          if (confirm('确定清除所有数据？此操作不可撤销。')) {
            localStorage.clear();
            window.location.reload();
          }
        }}>
          <span className="menu-icon">🗑️</span>
          <span>清除数据</span>
          <span className="menu-arrow">›</span>
        </button>
      </div>
    </div>
  );
}
