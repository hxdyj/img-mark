import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'pc',
		component: () => import('../views/TestImgMark.vue'),
	},
	{
		path: '/test1',
		name: 'test1',
		component: () => import('../views/TestImgMark1.vue'),
	},
	{
		path: '/multi',
		name: 'multi',
		component: () => import('../views/TestImgMarkMulti.vue'),
	},
	{
		path: '/multi1',
		name: 'multi1',
		component: () => import('../views/TestImgMarkMulti1.vue'),
	},
	{
		path: '/mobile',
		name: 'mobile',
		component: () => import('../views/TestImgMarkMobile.vue'),
	},
]

export const constRoutes = routes.filter(i => i.meta?.isConstRoute)

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes,
})

export default router
