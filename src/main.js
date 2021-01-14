import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import routers from './router';
import App from './App.vue';

// import './mock';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/tqa-demo/',
  routes: routers
})

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
