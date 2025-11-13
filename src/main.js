import Vue from 'vue'
import App from './App.vue'
import '@/assets/css/common.css'
Vue.config.productionTip = false
//引入router
import router from './router/index.js'
// 引入Element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 使用Element UI
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
