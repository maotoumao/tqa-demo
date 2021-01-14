import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import routers from './router';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: routers
})

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
