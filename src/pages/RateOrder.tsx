import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getOrderById, updateOrder, addReview } from '../utils/storage';
import { Order } from '../types';

export default function RateOrder() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    if (orderId) {
      const o = getOrderById(orderId);
      if (o) setOrder(o);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div>
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/orders')}>←</button>
          <span className="title">评价</span>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-text">未找到该订单</div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (rating === 0) {
      alert('请选择评分');
      return;
    }
    const now = new Date().toISOString();
    updateOrder(order.id, { rating, review: text, reviewedAt: now });
    addReview({
      orderId: order.id,
      serviceName: order.serviceName,
      auntName: order.auntName,
      rating,
      text,
      createdAt: now,
    });
    alert('评价成功，感谢您的反馈！');
    navigate('/orders');
  };

  return (
    <div>
      <div className="header">
        <button className="back-btn" onClick={() => navigate('/orders')}>←</button>
        <span className="title">评价</span>
      </div>

      <div className="detail-section">
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div className="flex-between mb-8">
            <span style={{ fontWeight: 600 }}>{order.serviceName}</span>
            <span className="text-secondary text-sm">{order.date}</span>
          </div>
          <div className="text-secondary text-sm">
            {order.auntAvatar} {order.auntName}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>请为本次服务评分</div>
          <div className="star-rating" style={{ justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
          </div>
          <div className="text-secondary text-sm" style={{ marginTop: 8 }}>
            {rating === 0 ? '点击星星评分' : ['', '非常差', '较差', '一般', '满意', '非常满意'][rating]}
          </div>
        </div>

        <div className="form-group">
          <label>评价内容（可选）</label>
          <textarea
            placeholder="分享您的服务体验，帮助其他用户参考..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ minHeight: 120 }}
          />
        </div>

        <button className="btn btn-primary btn-block" onClick={handleSubmit} style={{ marginTop: 8 }}>
          提交评价
        </button>
      </div>
    </div>
  );
}
