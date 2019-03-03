import Vue from 'vue';
import VueRouter from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue';
import Login from '@/components/Login.vue';
import Logout from '@/components/Logout.vue';
import App from '@/components/App.vue';

Vue.use(VueRouter);

let Auth = {
  loggedIn: false,
  login: function() { this.loggedIn = true },
  logout: function() { this.loggedIn = false }
};

const routes = [
    {
      path: '/',
      component: HelloWorld,
      meta: { isPublic: true }
    },
    {
      path: '/login',
      component: Login,
      props: () => ({ auth: Auth }),
      meta: { isPublic: true }
    },
    {
      path: '/logout',
      component: Logout,
      props: () => ({ auth: Auth }),
      meta: { isPublic: true }
    },
    {
      path: '/app',
      component: App
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
  // isPublic でない場合(=認証が必要な場合)、かつ、ログインしていない場合
  if (to.matched.some(record => !record.meta.isPublic) && !Auth.loggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath }});
  } else {
    next();
  }
});

export default router;
