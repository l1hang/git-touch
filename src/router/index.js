import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/components/Home.vue')
    },
    {
        path: '/social',
        name: 'Social',
        component: () => import('@/components/Social.vue')
    },
    {
        path:'*',
        redirect:'/'
    }
]
const router = new VueRouter({
    mode: 'hash',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { x: 0, y: 0 }
    }
})

export default router