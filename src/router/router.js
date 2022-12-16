import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/pages/Main';
import About from '@/pages/About';
import Sent from '@/pages/Sent';
import NotFound from '@/pages/NotFound';

const routes = [
	{
		path: '/',
		component: Main,
	},
	{
		path: '/sent',
		component: Sent,
	},
	{
		path: '/about',
		component: About,
	},
	{
		path: '/:pathMatch(.*)*',
		component: NotFound,
	},
];

const router = createRouter({
	routes,
	history: createWebHistory(process.env.BASE_URL),
});

export default router;
