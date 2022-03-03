import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'pc',
		component: () => import('../views/TestImgMark.vue'),
	},
	{
		path: '/multi',
		name: 'multi',
		component: () => import('../views/TestImgMarkMulti.vue'),
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
