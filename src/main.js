import { createApp } from 'vue';
import App from './App';
import components from '@/components/UI';
import router from '@/router/router';
import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp(App);
components.forEach((component) => {
	app.component(component.name, component);
});

app.use(router, VueAxios, axios).mount('#app');
