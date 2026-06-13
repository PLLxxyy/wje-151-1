import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getServices } from '../utils/storage';
import { SortType } from '../types';

const categoryNames: Record<string, string> = {
  cleaning: '保洁服务',
  repair: '维修服务',
  moving: '搬家服务',
  cooking: '做饭服务',
};

export default function ServiceList() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortType>('default');

  const services = useMemo(() => {
    const all = getServices().filter((s) => s.categoryId === categoryId);
    switch (sort) {
      case 'price-asc':
        return [...all].sort((a, b) => a.priceMin - b.priceMin);
      case 'price-desc':
        return [...all].sort((a, b) => b.priceMin - a.priceMin);
      case 'rating-desc':
        return [...all].sort((a, b) => b.aunt.rating - a.aunt.rating);
      default:
        return all;
    }
  }, [categoryId, sort]);

  return (
    <div>
      <div className="header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <span className="title">{categoryNames[categoryId || ''] || '服务列表'}</span>
      </div>

      <div className="sort-bar">
        <button className={`sort-btn ${sort === 'default' ? 'active' : ''}`} onClick={() => setSort('default')}>综合排序</button>
        <button className={`sort-btn ${sort === 'price-asc' ? 'active' : ''}`} onClick={() => setSort('price-asc')}>价格↑</button>
        <button className={`sort-btn ${sort === 'price-desc' ? 'active' : ''}`} onClick={() => setSort('price-desc')}>价格↓</button>
        <button className={`sort-btn ${sort === 'rating-desc' ? 'active' : ''}`} onClick={() => setSort('rating-desc')}>评分↓</button>
      </div>

      <div className="service-list">
        {services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-text">暂无相关服务</div>
          </div>
        ) : (
          services.map((s) => (
            <div key={s.id} className="service-card" onClick={() => navigate(`/service/${s.id}`)}>
              <div className="service-avatar">{s.aunt.avatar}</div>
              <div className="service-info">
                <div className="service-name">{s.name}</div>
                <div className="service-desc">{s.description}</div>
                <div className="service-meta">
                  <span className="service-price">¥{s.priceMin}-{s.priceMax}</span>
                  <span className="service-rating">⭐ {s.aunt.rating}</span>
                  <span className="text-secondary text-sm">{s.aunt.orderCount}单</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
