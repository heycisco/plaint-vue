import { createRouter, createWebHistory } from 'vue-router';
import Start from '@/pages/Start';
import Form from '@/pages/Form';
import Sent from '@/pages/Sent';
import NotFound from '@/pages/NotFound';

const routes = [
	{
		path: '/',
		component: Start,
	},
	{
		path: '/form',
		component: Form,
	},
	{
		path: '/sent',
		component: Sent,
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
