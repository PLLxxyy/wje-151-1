import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getServiceById, addOrder, getAddresses } from '../utils/storage';
import { Service, Address } from '../types';

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [remark, setRemark] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showAddrPicker, setShowAddrPicker] = useState(false);

  useEffect(() => {
    if (serviceId) {
      const s = getServiceById(serviceId);
      if (s) setService(s);
    }
    setSavedAddresses(getAddresses());
  }, [serviceId]);

  if (!service) {
    return (
      <div>
        <div className="header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <span className="title">服务详情</span>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-text">未找到该服务</div>
        </div>
      </div>
    );
  }

  const pickAddress = (addr: Address) => {
    setAddress(addr.address);
    setContactName(addr.name);
    setContactPhone(addr.phone);
    setShowAddrPicker(false);
  };

  const handleSubmit = () => {
    if (!date || !timeSlot || !address || !contactName || !contactPhone) {
      alert('请填写完整的预约信息');
      return;
    }
    const orderId = 'WJ' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    addOrder({
      id: orderId,
      serviceId: service.id,
      serviceName: service.name,
      auntId: service.aunt.id,
      auntName: service.aunt.name,
      auntAvatar: service.aunt.avatar,
      date,
      timeSlot,
      address,
      contactName,
      contactPhone,
      remark,
      totalPrice: service.priceMin,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    setShowBooking(false);
    alert('预约成功！订单号：' + orderId);
    navigate('/orders');
  };

  return (
    <div>
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <span className="title">服务详情</span>
      </div>

      <div className="detail-hero">
        <div className="detail-avatar">{service.aunt.avatar}</div>
        <div className="detail-name">{service.aunt.name}</div>
        <div className="detail-rating-line">
          ⭐ {service.aunt.rating} | {service.aunt.orderCount}单 | {service.aunt.specialties.join(' / ')}
        </div>
      </div>

      <div className="detail-section">
        <h3>📋 {service.name}</h3>
        <p className="detail-bio" style={{ marginBottom: 16 }}>{service.description}</p>

        <h3>📝 服务项目</h3>
        <ul className="detail-items">
          {service.items.map((item) => (
            <li key={item.id}>
              <span>{item.name} <span className="text-secondary text-sm">({item.duration})</span></span>
              <span className="text-danger">¥{item.price}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="detail-section" style={{ paddingTop: 0 }}>
        <h3>💰 价格明细</h3>
        {service.priceDetails.map((pd, i) => (
          <div key={i} className="detail-price-row">
            <span>{pd.label}</span>
            <span className={pd.amount >= 0 ? 'text-danger' : ''} style={pd.amount < 0 ? { color: 'var(--success)' } : {}}>
              {pd.amount >= 0 ? '+' : ''}{pd.amount}元
            </span>
          </div>
        ))}
        <div className="detail-price-row" style={{ fontWeight: 600, fontSize: 16, borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
          <span>预估总价</span>
          <span className="text-danger">¥{service.priceMin} - ¥{service.priceMax}</span>
        </div>
      </div>

      <div className="detail-section" style={{ paddingTop: 0 }}>
        <h3>👩 阿姨介绍</h3>
        <p className="detail-bio">{service.aunt.bio}</p>
      </div>

      <div style={{ height: 80 }} />

      <div className="bottom-action">
        <div className="bottom-action-inner">
          <div>
            <div className="text-sm text-secondary">预计费用</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--danger)' }}>¥{service.priceMin}起</div>
          </div>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowBooking(true)}>
            立即预约
          </button>
        </div>
      </div>

      {showBooking && (
        <div className="booking-overlay" onClick={() => setShowBooking(false)}>
          <div className="booking-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>
              预约服务
              <button className="close-btn" onClick={() => setShowBooking(false)}>✕</button>
            </h3>

            <div className="form-group">
              <label className="required">选择日期</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="form-group">
              <label className="required">选择时段</label>
              <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                <option value="">请选择时段</option>
                <option value="08:00-11:00">08:00 - 11:00（上午）</option>
                <option value="11:00-14:00">11:00 - 14:00（中午）</option>
                <option value="14:00-17:00">14:00 - 17:00（下午）</option>
                <option value="17:00-20:00">17:00 - 20:00（晚间）</option>
              </select>
            </div>

            <div className="form-group">
              <label className="required">服务地址</label>
              {savedAddresses.length > 0 && (
                <button className="btn btn-outline btn-sm mb-8" style={{ marginBottom: 8 }} onClick={() => setShowAddrPicker(true)}>
                  📍 从常用地址选择
                </button>
              )}
              <input type="text" placeholder="请输入详细地址" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="required">联系人</label>
                <input type="text" placeholder="姓名" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="required">手机号</label>
                <input type="tel" placeholder="手机号码" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>备注</label>
              <textarea placeholder="如需特别说明请填写" value={remark} onChange={(e) => setRemark(e.target.value)} />
            </div>

            <button className="btn btn-primary btn-block" onClick={handleSubmit} style={{ marginTop: 8 }}>
              确认预约
            </button>
          </div>
        </div>
      )}

      {showAddrPicker && (
        <div className="modal-overlay" onClick={() => setShowAddrPicker(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              选择地址
              <button className="close-btn" onClick={() => setShowAddrPicker(false)}>✕</button>
            </h3>
            {savedAddresses.map((a) => (
              <div key={a.id} className="address-card" onClick={() => pickAddress(a)}>
                <span className="addr-icon">{a.label === '家' ? '🏠' : a.label === '公司' ? '🏢' : '📍'}</span>
                <div className="addr-info">
                  <div className="addr-name">{a.name} <span className="text-sm text-secondary">{a.label}</span></div>
                  <div className="addr-detail">{a.address}</div>
                  <div className="addr-phone">{a.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
