import { useNavigate } from 'react-router-dom';
import { Category, UserRole } from '../types';
import { getServices } from '../utils/storage';

const categories: Category[] = [
  { id: 'cleaning', name: '保洁', icon: '🧹', description: '日常保洁、深度清洁' },
  { id: 'repair', name: '维修', icon: '🔧', description: '水电维修、家电维修' },
  { id: 'moving', name: '搬家', icon: '🚚', description: '居民搬家、小型搬家' },
  { id: 'cooking', name: '做饭', icon: '🍳', description: '家常菜、营养餐' },
];

interface HomeProps {
  role: UserRole;
  onSwitchRole: (r: UserRole) => void;
}

export default function Home({ role, onSwitchRole }: HomeProps) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="header">
        <span style={{ fontSize: 24 }}>🏠</span>
        <span className="title-main">温馨家政</span>
        <div className="role-switcher">
          <button className={`role-btn ${role === 'customer' ? 'active' : ''}`} onClick={() => onSwitchRole('customer')}>用户</button>
          <button className={`role-btn ${role === 'aunt' ? 'active' : ''}`} onClick={() => { onSwitchRole('aunt'); navigate('/aunt'); }}>阿姨</button>
        </div>
      </div>

      <div className="page-banner">
        <h2>专业家政 服务到家</h2>
        <p>保洁 / 维修 / 搬家 / 做饭 一站式服务</p>
      </div>

      <div className="section-title">服务分类</div>
      <div className="section-subtitle">选择您需要的服务类型</div>
      <div className="card" style={{ margin: '0 20px 20px' }}>
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="category-item"
              onClick={() => navigate(`/services/${cat.id}`)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section-title">热门推荐</div>
      <div className="section-subtitle">精选优质阿姨，好评如潮</div>
      <div style={{ padding: '0 20px 20px' }}>
        <HotServices />
      </div>
    </div>
  );
}

function HotServices() {
  const navigate = useNavigate();
  const all = getServices();
  const top = [...all].sort((a, b) => b.aunt.rating - a.aunt.rating).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {top.map((s) => (
        <div key={s.id} className="service-card" onClick={() => navigate(`/service/${s.id}`)}>
          <div className="service-avatar">{s.aunt.avatar}</div>
          <div className="service-info">
            <div className="service-name">{s.name}</div>
            <div className="service-desc">{s.description}</div>
            <div className="service-meta">
              <span className="service-price">¥{s.priceMin}-{s.priceMax}</span>
              <span className="service-rating">⭐ {s.aunt.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
