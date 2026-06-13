import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getOrders, updateOrder } from '../utils/storage';
import { Order, OrderStatus } from '../types';

const statusLabels: Record<OrderStatus, { text: string; className: string }> = {
  pending: { text: '待确认', className: 'status-pending' },
  'in-progress': { text: '服务中', className: 'status-in-progress' },
  completed: { text: '已完成', className: 'status-completed' },
  cancelled: { text: '已取消', className: 'status-cancelled' },
};

const cancelReasons = [
  '时间安排有变动',
  '找到了更合适的阿姨',
  '价格太贵',
  '服务内容不需要了',
  '其他原因',
];

type TabKey = 'all' | OrderStatus;

export default function MyOrders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('all');
  const [tick, setTick] = useState(0);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  void tick;
  const refresh = () => setTick((t) => t + 1);

  const orders = useMemo(() => {
    const all = getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (tab === 'all') return all;
    return all.filter((o) => o.status === tab);
  }, [tab, tick]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待确认' },
    { key: 'in-progress', label: '服务中' },
    { key: 'completed', label: '已完成' },
    { key: 'cancelled', label: '已取消' },
  ];

  const openCancelModal = (order: Order) => {
    setCancellingOrder(order);
    setSelectedReason('');
    setCustomReason('');
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setCancellingOrder(null);
    setSelectedReason('');
    setCustomReason('');
  };

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    const reason = selectedReason === '其他原因' ? customReason.trim() : selectedReason;
    if (!reason) return;

    updateOrder(cancellingOrder.id, {
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: new Date().toISOString(),
    });
    refresh();
    closeCancelModal();
  };

  const canSubmitCancel = () => {
    if (!selectedReason) return false;
    if (selectedReason === '其他原因') return customReason.trim().length > 0;
    return true;
  };

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
                  {order.status === 'cancelled' && order.cancelReason && (
                    <div className="order-detail" style={{ color: 'var(--danger)', marginTop: 6 }}>
                      ❌ 取消原因：{order.cancelReason}
                    </div>
                  )}
                </div>
                <div className="order-footer">
                  <span className="order-price">¥{order.totalPrice}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {order.status === 'pending' && (
                      <button className="btn btn-danger btn-sm" onClick={() => openCancelModal(order)}>
                        取消订单
                      </button>
                    )}
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

      {cancelModalOpen && cancellingOrder && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              <span>取消订单</span>
              <button className="close-btn" onClick={closeCancelModal}>✕</button>
            </h3>
            <div className="form-group">
              <label className="required">请选择取消原因</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cancelReasons.map((reason) => (
                  <label
                    key={reason}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      border: '1px solid',
                      borderColor: selectedReason === reason ? 'var(--primary)' : 'var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      background: selectedReason === reason ? 'var(--primary-light)' : 'transparent',
                      fontSize: 14,
                    }}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      style={{ width: 'auto', margin: 0 }}
                    />
                    {reason}
                  </label>
                ))}
              </div>
            </div>
            {selectedReason === '其他原因' && (
              <div className="form-group">
                <label className="required">请说明原因</label>
                <textarea
                  placeholder="请输入取消原因"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  maxLength={100}
                />
                <div className="text-sm text-secondary" style={{ textAlign: 'right', marginTop: 4 }}>
                  {customReason.length}/100
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn btn-outline btn-block" onClick={closeCancelModal}>
                再想想
              </button>
              <button className="btn btn-danger btn-block" onClick={handleConfirmCancel} disabled={!canSubmitCancel()}>
                确认取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
