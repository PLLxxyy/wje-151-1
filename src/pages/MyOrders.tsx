import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getOrders } from '../utils/storage';
import { OrderStatus } from '../types';

const statusLabels: Record<OrderStatus, { text: string; className: string }> = {
  pending: { text: '待确认', className: 'status-pending' },
  'in-progress': { text: '服务中', className: 'status-in-progress' },
  completed: { text: '已完成', className: 'status-completed' },
  cancelled: { text: '已取消', className: 'status-cancelled' },
};

type TabKey = 'all' | OrderStatus;

export default function MyOrders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('all');

  const orders = useMemo(() => {
    const all = getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (tab === 'all') return all;
    return all.filter((o) => o.status === tab);
  }, [tab]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待确认' },
    { key: 'in-progress', label: '服务中' },
    { key: 'completed', label: '已完成' },
  ];

  return (
    <div>
      <div className="header">
        <span className="title-main">我的订单</span>
      </div>

      <div className="tab-bar">
        {tabs.map((t) => (
          <button key={t.key} className={`tab-item ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-text">暂无订单</div>
            <button className="btn btn-primary" onClick={() => navigate('/')}>去预约服务</button>
          </div>
        ) : (
          orders.map((order) => {
            const st = statusLabels[order.status];
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">{order.id}</span>
                  <span className={`status-badge ${st.className}`}>{st.text}</span>
                </div>
                <div className="order-body">
                  <div className="order-service">{order.serviceName}</div>
                  <div className="order-detail">
                    {order.auntAvatar} {order.auntName} | {order.date} {order.timeSlot}
                  </div>
                  <div className="order-detail" style={{ marginTop: 4 }}>
                    📍 {order.address}
                  </div>
                </div>
                <div className="order-footer">
                  <span className="order-price">¥{order.totalPrice}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {order.status === 'completed' && !order.rating && (
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/rate/${order.id}`)}>
                        去评价
                      </button>
                    )}
                    {order.rating && (
                      <span className="text-warning text-sm">{'⭐'.repeat(order.rating)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
