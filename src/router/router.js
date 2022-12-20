import { createRouter, createWebHistory } from 'vue-router';
import Start from '@/pages/Start';
import Form from '@/pages/Form';
import Sent from '@/pages/Sent';
import NotFound from '@/pages/NotFound';

const routes = [
	{
		path: '/',
		component: Start,
		name: 'start',
	},
	{
		path: '/form',
		component: Form,
		name: 'form',
	},
	{
		path: '/sent',
		component: Sent,
		name: 'sent',
	},
	{
		path: '/:pathMatch(.*)*',
		component: NotFound,
		name: '404',
	},
];

const router = createRouter({
	routes,
	history: createWebHistory(process.env.BASE_URL),
});

export default router;
