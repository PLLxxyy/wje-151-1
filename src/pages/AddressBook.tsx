import { useState, useEffect } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../utils/storage';
import { Address } from '../types';

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('家');

  useEffect(() => {
    setAddresses(getAddresses());
  }, []);

  const reload = () => setAddresses(getAddresses());

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setAddress('');
    setLabel('家');
    setShowForm(false);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setName(addr.name);
    setPhone(addr.phone);
    setAddress(addr.address);
    setLabel(addr.label);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!name || !phone || !address) {
      alert('请填写完整信息');
      return;
    }
    if (editingId) {
      updateAddress(editingId, { name, phone, address, label });
    } else {
      const newAddr: Address = {
        id: 'addr_' + Date.now(),
        name,
        phone,
        address,
        label,
        isDefault: addresses.length === 0,
      };
      addAddress(newAddr);
    }
    resetForm();
    reload();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该地址？')) {
      deleteAddress(id);
      reload();
    }
  };

  const handleSetDefault = (id: string) => {
    addresses.forEach((a) => {
      updateAddress(a.id, { isDefault: a.id === id });
    });
    reload();
  };

  const getIcon = (lbl: string) => {
    if (lbl === '家') return '🏠';
    if (lbl === '公司') return '🏢';
    return '📍';
  };

  return (
    <div>
      <div className="header">
        <span className="title-main">常用地址</span>
      </div>

      <div style={{ padding: 16 }}>
        {addresses.length === 0 && !showForm ? (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <div className="empty-text">还没有保存地址</div>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>添加地址</button>
          </div>
        ) : (
          <>
            {addresses.map((a) => (
              <div key={a.id} className="address-card">
                <span className="addr-icon">{getIcon(a.label)}</span>
                <div className="addr-info">
                  <div className="addr-name">
                    {a.name}
                    <span className="text-sm text-secondary" style={{ marginLeft: 8 }}>{a.label}</span>
                    {a.isDefault && <span style={{ marginLeft: 6, fontSize: 11, background: 'var(--primary)', color: '#fff', padding: '1px 6px', borderRadius: 10 }}>默认</span>}
                  </div>
                  <div className="addr-detail">{a.address}</div>
                  <div className="addr-phone">{a.phone}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    {!a.isDefault && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleSetDefault(a.id)}>设为默认</button>
                    )}
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>编辑</button>
                    <button className="btn btn-sm" style={{ background: '#fee2e2', color: 'var(--danger)' }} onClick={() => handleDelete(a.id)}>删除</button>
                  </div>
                </div>
              </div>
            ))}

            <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => { resetForm(); setShowForm(true); }}>
              + 添加新地址
            </button>
          </>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              {editingId ? '编辑地址' : '添加地址'}
              <button className="close-btn" onClick={resetForm}>✕</button>
            </h3>

            <div className="form-group">
              <label className="required">联系人</label>
              <input type="text" placeholder="请输入姓名" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="required">手机号</label>
              <input type="tel" placeholder="请输入手机号" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="required">详细地址</label>
              <textarea placeholder="请输入详细地址" value={address} onChange={(e) => setAddress(e.target.value)} style={{ minHeight: 70 }} />
            </div>

            <div className="form-group">
              <label>标签</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['家', '公司', '其他'].map((l) => (
                  <button
                    key={l}
                    className={`btn btn-sm ${label === l ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setLabel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-block" onClick={handleSave} style={{ marginTop: 8 }}>
              保存地址
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
