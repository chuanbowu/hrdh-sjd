import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import index from '@/views/layout'
import no from '@/views/404'
import ServerError from '@/views/500'

Vue.use(VueRouter)

export const routersMenu = [
  {
    path: '/Login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/',
    name: 'index',
    component: index,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard'),
        meta: { title: '个人资料' }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: no,
    meta: { title: '无权限' }
  },
  {
    path: '/500',
    name: '500',
    component: ServerError,
    meta: { title: '服务器错误' }
  },
  {
    path: '*',
    redirect: '/404'
  }
]
export const menu = [
  {
    path: '/goods',
    name: 'goods',
    component: index,
    redirect: '/CommissionGoodsList',
    meta: { title: '商品管理', icon: 'icon-shangwuhezuo' },
    children: [
      {
        path: '/CommissionGoodsList',
        name: 'CommissionGoodsList',
        component: () => import('@/views/goods/CommissionGoodsList'),
        meta: { title: '返佣商品列表' }
      },
      {
        path: '/TakeDeliveryGoodsList',
        name: 'TakeDeliveryGoodsList',
        component: () => import('@/views/goods/TakeDeliveryGoodsList'),
        meta: { title: '拿货商品列表' }
      }
    ]
  },
  {
    path: '/TakeDelivery',
    name: 'TakeDelivery',
    component: index,
    redirect: '/TakeDeliveryList',
    meta: { title: '取样管理', icon: 'icon-shangwuhezuo' },
    children: [
      {
        path: '/TakeDeliveryList',
        name: 'TakeDeliveryList',
        component: () => import('@/views/TakeDelivery/TakeDeliveryList'),
        meta: { title: '取样列表' }
      }
    ]
  }
]

export default new VueRouter({
  mode: 'history',
  base: '/business-web/', // 生产环境
  // base: '/', // 开发环境
  routes: routersMenu.concat(menu)
})
