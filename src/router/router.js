import { createRouter, createWebHistory } from 'vue-router';
import Start from '@/pages/Start';
import Form from '@/pages/Form';
import Sent from '@/pages/Sent';
import Error from '@/pages/Error';
import NotFound from '@/pages/NotFound';

const routes = [
	{
		path: '/',
		component: Start,
		name: 'Анонимные жалобы',
	},
	{
		path: '/form',
		component: Form,
		name: 'Написать жалобу',
	},
	{
		path: '/sent',
		component: Sent,
		name: 'Отправлено',
	},
	{
		path: '/error',
		component: Error,
		name: 'Ошибка',
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
