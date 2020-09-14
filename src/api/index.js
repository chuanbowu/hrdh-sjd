import request from '@/utils/request'

/* 系统模块 */

// 商家账号密码登录
export const passwordLogin = data => request.post('/business/businessLogin/passwordLogin', data, false)

// 退出登录
export const loginOut = data => request.post('/business/businessLogin/loginOut', data, false)

// 商家详情
export const businessInfo = data => request.post('/business/business/businessInfo', data, false)

// 商家完善信息
export const businessPerfect = data => request.post('/business/business/businessPerfect', data, false)

// 商家修改信息
export const updateBusiness = data => request.post('/business/business/updateBusiness', data, false)

// 修改密码
export const updatePassword = data => request.post('/business/business/updatePassword', data, false)

/* 公共管理 */

// 发送验证码接口
export const send = data => request.post('/business/common/sms/send', data, false)

// 上传图片
export const uploadImage = data => request.post('/business/currency/uploadImage', data, false)

// 图片多选上传
export const uploadImageList = data => request.post('/business/currency/uploadImageList', data, false)

// 快递公司列表
export const expressList = data => request.post('business/express/expressList', data, false)

/* 商品管理 */

// 返佣商品列表
export const commissionGoodsList = data => request.post('/business/goods/commissionGoodsList', data, true)

// 新增返佣商品
export const addCommissionGoods = data => request.post('/business/goods/addCommissionGoods', data, false)

// 修改返佣商品状态
export const updateCommissionGoodsStatus = data => request.post('/business/goods/updateCommissionGoodsStatus', data, false)

// 拿货商品列表
export const takeDeliveryGoodsList = data => request.post('/business/goods/takeDeliveryGoodsList', data, true)

// 新增拿货商品
export const addTakeDeliveryGoods = data => request.post('/business/goods/addTakeDeliveryGoods', data, false)

// 查询返佣商品列表
export const queryCommissionGoodsList = data => request.post('business/goods/queryCommissionGoodsList', data, true)

// 修改拿货商品状态
export const updateTakeDeliveryGoodsStatus = data => request.post('/business/goods/updateTakeDeliveryGoodsStatus', data, false)

// 编辑返佣商品
export const updateCommissionGoods = data => request.post('/business/goods/updateCommissionGoods', data, false)

// 商品分类
export const goodsTypeConfigList = data => request.post('/business/goodsTypeConfig/goodsTypeConfigList', data, false)

/* 取样管理 */

// 取样列表
export const orderList = data => request.post('/business/order/orderList', data, true)

// 审核取样
export const checkOrder = data => request.post('/business/order/checkOrder', data, false)

// 商家发样
export const sendOrder = data => request.post('/business/order/sendOrder', data, false)

// 商家收样
export const collectOrder = data => request.post('/business/order/collectOrder', data, false)
