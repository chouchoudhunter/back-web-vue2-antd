// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Workplace'),
        meta: { title: '工作台', keepAlive: true, icon: 'home', permission: ['dashboard'] }
      },
      // service
      {
        path: '/service',
        name: 'service',
        component: () => import('@/views/service'),
        meta: { title: '服务管理', icon: 'form', permission: ['service'] }
      },

      // message
      {
        path: '/message',
        name: 'message',
        component: () => import('@/views/message'),
        meta: { title: '站内消息', icon: 'mail', permission: ['message'] }
      },

      // account
      {
        path: '/account',
        component: () => import('@/views/account/settings/Index'),
        name: 'account',
        hideChildrenInMenu: true,
        redirect: '/account/settings/basic',
        meta: { title: '个人信息', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [
          {
            path: '/account/settings/basic',
            name: 'BasicSettings',
            component: () => import('@/views/account/settings/BasicSetting'),
            meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['user'] }
          },
          {
            path: '/account/settings/security',
            name: 'SecuritySettings',
            component: () => import('@/views/account/settings/Security'),
            meta: {
              title: '修改密码',
              hidden: true,
              keepAlive: true,
              permission: ['user']
            }
          },
          {
            path: '/account/settings/notification',
            name: 'NotificationSettings',
            component: () => import('@/views/account/settings/Notification'),
            meta: {
              title: 'account.settings.menuMap.notification',
              hidden: true,
              keepAlive: true,
              permission: ['user']
            }
          }
        ]
      },
      // system
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        redirect: '/system/user',
        meta: { title: '系统管理', icon: 'setting', permission: ['system'] },
        children: [
          {
            path: '/system/user/:pageNo([1-9]\\d*)?', // 正则匹配数字
            name: 'user',
            component: () => import('@/views/system/UserList'),
            meta: { title: '员工管理', keepAlive: true }
          },
          {
            path: '/system/role',
            name: 'role',
            component: () => import('@/views/system/RoleList'),
            meta: { title: '角色管理', keepAlive: true }
          },
          {
            path: '/system/section',
            name: 'section',
            component: () => import('@/views/system/SectionList'),
            meta: { title: '部门管理', keepAlive: true }
          },
          {
            path: '/system/menu',
            name: 'menu',
            component: () => import('@/views/system/MenuList'),
            meta: { title: '菜单管理', keepAlive: true }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  // {
  //   path: '/user',
  //   component: UserLayout,
  //   redirect: '/user/login',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'login',
  //       name: 'login',
  //       component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  //     },
  //     {
  //       path: 'register',
  //       name: 'register',
  //       component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
  //     },
  //     {
  //       path: 'register-result',
  //       name: 'registerResult',
  //       component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
  //     },
  //     {
  //       path: 'recover',
  //       name: 'recover',
  //       component: undefined
  //     }
  //   ]
  // },
  {
    path: '/callback',
    name: 'callback'
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
