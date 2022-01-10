import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/KeMathJax',
		name: 'KeMathJax',
		component: () => import('../views/KeMathJax.vue'),
	},
]

export const constRoutes = routes.filter(i => i.meta?.isConstRoute)

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes,
})

export default router
