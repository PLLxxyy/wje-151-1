import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrder } from '../utils/storage';
import { Order, OrderStatus } from '../types';

const statusLabels: Record<OrderStatus, { text: string; className: string }> = {
  pending: { text: '待确认', className: 'status-pending' },
  'in-progress': { text: '服务中', className: 'status-in-progress' },
  completed: { text: '已完成', className: 'status-completed' },
  cancelled: { text: '已取消', className: 'status-cancelled' },
};

type TabKey = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export default function AuntDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('pending');
  const [tick, setTick] = useState(0);

  const allOrders = getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  void tick;
  const orders = allOrders.filter((o) => o.status === tab);

  const refresh = () => setTick((t) => t + 1);

  const handleAccept = (order: Order) => {
    updateOrder(order.id, { status: 'in-progress' });
    refresh();
    setTab('in-progress');
  };

  const handleComplete = (order: Order) => {
    updateOrder(order.id, { status: 'completed' });
    refresh();
    setTab('completed');
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'pending', label: '待接单' },
    { key: 'in-progress', label: '服务中' },
    { key: 'completed', label: '已完成' },
    { key: 'cancelled', label: '已取消' },
  ];

  const emptyText = () => {
    switch (tab) {
      case 'pending':
        return '暂无待接订单';
      case 'in-progress':
        return '暂无进行中的服务';
      case 'completed':
        return '暂无已完成的订单';
      case 'cancelled':
        return '暂无已取消的订单';
    }
  };

  const emptyIcon = () => {
    switch (tab) {
      case 'pending':
        return '📭';
      case 'in-progress':
        return '🔧';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
    }
  };

  return (
    <div>
      <div className="header">
        <span style={{ fontSize: 24 }}>👩‍🔧</span>
        <span className="title-main">阿姨工作台</span>
        <div className="role-switcher">
          <button className="role-btn" onClick={() => navigate('/')}>用户</button>
          <button className="role-btn active">阿姨</button>
        </div>
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
            <div className="empty-icon">{emptyIcon()}</div>
            <div className="empty-text">{emptyText()}</div>
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
                    📅 {order.date} {order.timeSlot}
                  </div>
                  <div className="order-detail">
                    👤 {order.contactName} {order.contactPhone}
                  </div>
                  <div className="order-detail">
                    📍 {order.address}
                  </div>
                  {order.remark && (
                    <div className="order-detail" style={{ color: 'var(--warning)' }}>
                      💬 备注：{order.remark}
                    </div>
                  )}
                  {order.status === 'cancelled' && order.cancelReason && (
                    <div className="order-detail" style={{ color: 'var(--danger)', marginTop: 6 }}>
                      ❌ 取消原因：{order.cancelReason}
                    </div>
                  )}
                </div>
                <div className="order-footer">
                  <span className="order-price">¥{order.totalPrice}</span>
                  <div className="order-actions">
                    {order.status === 'pending' && (
                      <button className="btn btn-success btn-sm" onClick={() => handleAccept(order)}>
                        接单
                      </button>
                    )}
                    {order.status === 'in-progress' && (
                      <button className="btn btn-info btn-sm" onClick={() => handleComplete(order)}>
                        完成服务
                      </button>
                    )}
                    {order.status === 'completed' && order.rating && (
                      <div>
                        <span className="text-warning">{'⭐'.repeat(order.rating)}</span>
                        {order.review && (
                          <div className="text-sm text-secondary" style={{ marginTop: 4 }}>{order.review}</div>
                        )}
                      </div>
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
