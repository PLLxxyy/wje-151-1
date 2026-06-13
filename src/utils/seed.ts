import { Service, Order, Address, Review } from '../types';
import { saveServices, saveOrders, saveAddresses, isSeeded, markSeeded } from './storage';

const auntPool = [
  { id: 'a1', name: '王阿姨', avatar: '👩', rating: 4.9, orderCount: 328, bio: '从事家政服务8年，擅长深度保洁、收纳整理。做事认真细致，获得众多客户好评。持有高级家政服务员证书。', specialties: ['深度保洁', '收纳整理', '精细清洁'] },
  { id: 'a2', name: '李阿姨', avatar: '👩‍🦰', rating: 4.8, orderCount: 256, bio: '家政经验丰富，性格开朗，善于沟通。擅长日常保洁和家电清洗，手脚麻利，效率高。', specialties: ['日常保洁', '家电清洗', '开荒保洁'] },
  { id: 'a3', name: '张师傅', avatar: '👨', rating: 4.7, orderCount: 189, bio: '专业水电维修技师，15年从业经验。精通水电维修、管道疏通，持证上岗。', specialties: ['水电维修', '管道疏通', '灯具安装'] },
  { id: 'a4', name: '赵师傅', avatar: '👨‍🦱', rating: 4.6, orderCount: 142, bio: '搬家团队负责人，带领专业搬家团队。经验丰富，物品零损坏率高。', specialties: ['居民搬家', '公司搬迁', '钢琴搬运'] },
  { id: 'a5', name: '陈阿姨', avatar: '👵', rating: 4.9, orderCount: 412, bio: '退休酒店主厨，30年烹饪经验。擅长家常菜、川菜、粤菜，注重营养搭配。', specialties: ['家常菜', '川菜', '粤菜', '烘焙'] },
  { id: 'a6', name: '刘阿姨', avatar: '👩‍🦳', rating: 4.5, orderCount: 178, bio: '勤奋踏实，有耐心。擅长家庭深度清洁和衣物洗护，服务周到。', specialties: ['深度清洁', '衣物洗护', '地毯清洁'] },
  { id: 'a7', name: '孙师傅', avatar: '🧔', rating: 4.8, orderCount: 203, bio: '家电维修工程师，精通各类家电维修。服务态度好，维修质量有保证。', specialties: ['空调维修', '洗衣机维修', '热水器维修'] },
  { id: 'a8', name: '周阿姨', avatar: '👩‍🍳', rating: 4.7, orderCount: 287, bio: '擅长北方家常面食和炖菜，为人热情，注重食材新鲜与卫生。', specialties: ['面食', '炖菜', '早餐'] },
];

const servicesData: Service[] = [
  // Cleaning
  { id: 's1', categoryId: 'cleaning', name: '日常保洁', description: '全屋日常保洁服务，包含客厅、卧室、厨房、卫生间的日常清洁打扫。', priceMin: 80, priceMax: 150, aunt: auntPool[0], items: [
    { id: 'i1', name: '客厅清洁', duration: '30分钟', price: 30 },
    { id: 'i2', name: '卧室清洁', duration: '20分钟', price: 20 },
    { id: 'i3', name: '厨房清洁', duration: '30分钟', price: 40 },
    { id: 'i4', name: '卫生间清洁', duration: '20分钟', price: 30 },
  ], priceDetails: [{ label: '基础服务费', amount: 80 }, { label: '面积加费(>80m²)', amount: 30 }, { label: '材料费', amount: 20 }] },
  { id: 's2', categoryId: 'cleaning', name: '深度保洁', description: '全屋深度清洁，包含油烟机清洗、冰箱消毒、卫生间除垢等精细清洁。', priceMin: 200, priceMax: 380, aunt: auntPool[0], items: [
    { id: 'i5', name: '油烟机深度清洗', duration: '40分钟', price: 80 },
    { id: 'i6', name: '冰箱消毒除味', duration: '30分钟', price: 50 },
    { id: 'i7', name: '卫生间除垢', duration: '30分钟', price: 50 },
    { id: 'i8', name: '全屋除尘消毒', duration: '60分钟', price: 100 },
  ], priceDetails: [{ label: '深度清洁费', amount: 200 }, { label: '面积加费(>100m²)', amount: 80 }, { label: '消毒材料费', amount: 50 }] },
  { id: 's3', categoryId: 'cleaning', name: '开荒保洁', description: '新房装修后的首次全面保洁服务，清除建筑垃圾和装修痕迹。', priceMin: 300, priceMax: 600, aunt: auntPool[1], items: [
    { id: 'i9', name: '建筑垃圾清理', duration: '60分钟', price: 120 },
    { id: 'i10', name: '玻璃清洁', duration: '40分钟', price: 80 },
    { id: 'i11', name: '地面清洁', duration: '50分钟', price: 100 },
    { id: 'i12', name: '全面除尘', duration: '40分钟', price: 80 },
  ], priceDetails: [{ label: '基础服务费', amount: 300 }, { label: '面积加费', amount: 150 }, { label: '材料工具费', amount: 80 }] },
  { id: 's4', categoryId: 'cleaning', name: '家电清洗', description: '专业家电深度清洗服务，包含空调、洗衣机、油烟机等家用电器。', priceMin: 120, priceMax: 260, aunt: auntPool[5], items: [
    { id: 'i13', name: '空调清洗(挂机)', duration: '30分钟', price: 80 },
    { id: 'i14', name: '洗衣机清洗', duration: '30分钟', price: 60 },
    { id: 'i15', name: '油烟机清洗', duration: '40分钟', price: 80 },
  ], priceDetails: [{ label: '单台清洗', amount: 80 }, { label: '多台优惠', amount: -20 }, { label: '深度除菌', amount: 40 }] },

  // Repair
  { id: 's5', categoryId: 'repair', name: '水电维修', description: '专业水电维修服务，包含水管漏水、电路故障、开关插座更换等。', priceMin: 80, priceMax: 300, aunt: auntPool[2], items: [
    { id: 'i16', name: '水管漏水维修', duration: '40分钟', price: 100 },
    { id: 'i17', name: '电路故障排查', duration: '30分钟', price: 80 },
    { id: 'i18', name: '开关插座更换', duration: '20分钟', price: 50 },
    { id: 'i19', name: '水龙头更换', duration: '20分钟', price: 60 },
  ], priceDetails: [{ label: '上门费', amount: 30 }, { label: '维修工费', amount: 80 }, { label: '材料费(预估)', amount: 50 }] },
  { id: 's6', categoryId: 'repair', name: '管道疏通', description: '厨房、卫生间下水管道专业疏通服务，快速解决堵塞问题。', priceMin: 100, priceMax: 250, aunt: auntPool[2], items: [
    { id: 'i20', name: '厨房下水疏通', duration: '30分钟', price: 100 },
    { id: 'i21', name: '卫生间疏通', duration: '40分钟', price: 120 },
    { id: 'i22', name: '马桶疏通', duration: '30分钟', price: 100 },
  ], priceDetails: [{ label: '上门费', amount: 30 }, { label: '疏通费用', amount: 100 }, { label: '特殊工具费', amount: 40 }] },
  { id: 's7', categoryId: 'repair', name: '家电维修', description: '各类家用电器维修服务，包含空调、冰箱、洗衣机、热水器等。', priceMin: 100, priceMax: 500, aunt: auntPool[6], items: [
    { id: 'i23', name: '空调维修', duration: '60分钟', price: 150 },
    { id: 'i24', name: '冰箱维修', duration: '50分钟', price: 130 },
    { id: 'i25', name: '洗衣机维修', duration: '40分钟', price: 100 },
    { id: 'i26', name: '热水器维修', duration: '40分钟', price: 120 },
  ], priceDetails: [{ label: '上门检测费', amount: 50 }, { label: '维修工费', amount: 100 }, { label: '配件费(预估)', amount: 80 }] },

  // Moving
  { id: 's8', categoryId: 'moving', name: '居民搬家', description: '专业居民搬家服务，包含物品打包、搬运、运输、摆放。', priceMin: 300, priceMax: 800, aunt: auntPool[3], items: [
    { id: 'i27', name: '物品打包', duration: '60分钟', price: 100 },
    { id: 'i28', name: '家具搬运', duration: '90分钟', price: 200 },
    { id: 'i29', name: '运输费用', duration: '按距离', price: 150 },
    { id: 'i30', name: '新居摆放', duration: '60分钟', price: 100 },
  ], priceDetails: [{ label: '基础搬运费', amount: 300 }, { label: '楼层费', amount: 80 }, { label: '距离加费', amount: 100 }] },
  { id: 's9', categoryId: 'moving', name: '小型搬家', description: '适合单身公寓、学生搬家等少量物品搬运服务。', priceMin: 150, priceMax: 400, aunt: auntPool[3], items: [
    { id: 'i31', name: '物品整理打包', duration: '30分钟', price: 50 },
    { id: 'i32', name: '搬运上车', duration: '40分钟', price: 80 },
    { id: 'i33', name: '运输配送', duration: '按距离', price: 100 },
  ], priceDetails: [{ label: '基础费', amount: 150 }, { label: '人工费', amount: 60 }, { label: '运输费', amount: 80 }] },

  // Cooking
  { id: 's10', categoryId: 'cooking', name: '家常菜上门', description: '上门烹饪家常菜服务，可根据口味偏好定制菜单，食材自备或代买。', priceMin: 100, priceMax: 200, aunt: auntPool[4], items: [
    { id: 'i34', name: '菜品烹饪(4菜1汤)', duration: '60分钟', price: 100 },
    { id: 'i35', name: '菜品烹饪(6菜1汤)', duration: '90分钟', price: 150 },
    { id: 'i36', name: '厨房清洁', duration: '20分钟', price: 30 },
  ], priceDetails: [{ label: '厨师服务费', amount: 100 }, { label: '菜品加量费', amount: 50 }, { label: '代买食材费', amount: 30 }] },
  { id: 's11', categoryId: 'cooking', name: '月子餐/营养餐', description: '专业营养搭配月子餐、病后恢复餐等定制营养餐服务。', priceMin: 150, priceMax: 300, aunt: auntPool[7], items: [
    { id: 'i37', name: '营养评估与菜单定制', duration: '20分钟', price: 30 },
    { id: 'i38', name: '营养餐制作(3餐)', duration: '120分钟', price: 200 },
    { id: 'i39', name: '餐后清洁', duration: '20分钟', price: 30 },
  ], priceDetails: [{ label: '厨师服务费', amount: 150 }, { label: '营养定制费', amount: 50 }, { label: '食材代购费', amount: 60 }] },
  { id: 's12', categoryId: 'cooking', name: '聚餐宴请', description: '家庭聚餐、生日宴会等上门烹饪服务，提供多道菜品和特色菜。', priceMin: 300, priceMax: 800, aunt: auntPool[4], items: [
    { id: 'i40', name: '菜单设计(10人)', duration: '30分钟', price: 50 },
    { id: 'i41', name: '宴席烹饪(10道菜)', duration: '180分钟', price: 400 },
    { id: 'i42', name: '摆盘装饰', duration: '30分钟', price: 50 },
    { id: 'i43', name: '餐后清理', duration: '40分钟', price: 60 },
  ], priceDetails: [{ label: '厨师服务费', amount: 300 }, { label: '菜品加工费', amount: 150 }, { label: '摆盘装饰费', amount: 50 }] },
];

const sampleAddresses: Address[] = [
  { id: 'addr1', name: '张三', phone: '13800138001', address: '北京市朝阳区建国路88号SOHO现代城A座1205室', label: '家', isDefault: true },
  { id: 'addr2', name: '张三', phone: '13800138001', address: '北京市海淀区中关村大街1号海龙大厦6楼601', label: '公司', isDefault: false },
];

function genOrderId(): string {
  return 'WJ' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

const now = Date.now();
const sampleOrders: Order[] = [
  { id: genOrderId(), serviceId: 's1', serviceName: '日常保洁', auntId: 'a1', auntName: '王阿姨', auntAvatar: '👩', date: '2026-06-10', timeSlot: '09:00-12:00', address: '北京市朝阳区建国路88号SOHO现代城A座1205室', contactName: '张三', contactPhone: '13800138001', remark: '请自带拖鞋', totalPrice: 130, status: 'completed', createdAt: new Date(now - 3 * 86400000).toISOString(), rating: 5, review: '非常满意！阿姨打扫得很干净，下次还会预约。', reviewedAt: new Date(now - 2 * 86400000).toISOString() },
  { id: genOrderId(), serviceId: 's5', serviceName: '水电维修', auntId: 'a3', auntName: '张师傅', auntAvatar: '👨', date: '2026-06-12', timeSlot: '14:00-17:00', address: '北京市海淀区中关村大街1号海龙大厦6楼601', contactName: '张三', contactPhone: '13800138001', remark: '厨房水龙头漏水', totalPrice: 160, status: 'in-progress', createdAt: new Date(now - 1 * 86400000).toISOString() },
  { id: genOrderId(), serviceId: 's10', serviceName: '家常菜上门', auntId: 'a5', auntName: '陈阿姨', auntAvatar: '👵', date: '2026-06-14', timeSlot: '11:00-13:00', address: '北京市朝阳区建国路88号SOHO现代城A座1205室', contactName: '张三', contactPhone: '13800138001', remark: '少油少盐，家里有老人', totalPrice: 180, status: 'pending', createdAt: new Date(now - 0.5 * 86400000).toISOString() },
  { id: genOrderId(), serviceId: 's8', serviceName: '居民搬家', auntId: 'a4', auntName: '赵师傅', auntAvatar: '👨‍🦱', date: '2026-06-08', timeSlot: '08:00-12:00', address: '北京市朝阳区建国路88号SOHO现代城A座1205室', contactName: '张三', contactPhone: '13800138001', remark: '', totalPrice: 500, status: 'completed', createdAt: new Date(now - 5 * 86400000).toISOString(), rating: 4, review: '搬家师傅很辛苦，东西都搬得很仔细。', reviewedAt: new Date(now - 4 * 86400000).toISOString() },
];

const sampleReviews: Review[] = [
  { orderId: sampleOrders[0].id, serviceName: '日常保洁', auntName: '王阿姨', rating: 5, text: '非常满意！阿姨打扫得很干净，下次还会预约。', createdAt: new Date(now - 2 * 86400000).toISOString() },
  { orderId: sampleOrders[3].id, serviceName: '居民搬家', auntName: '赵师傅', rating: 4, text: '搬家师傅很辛苦，东西都搬得很仔细。', createdAt: new Date(now - 4 * 86400000).toISOString() },
];

export function seedData(): void {
  if (isSeeded()) return;
  saveServices(servicesData);
  saveOrders(sampleOrders);
  saveAddresses(sampleAddresses);
  localStorage.setItem('wje_reviews', JSON.stringify(sampleReviews));
  markSeeded();
}
