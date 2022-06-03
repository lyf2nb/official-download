import * as VueRouter from 'vue-router';
// 1. 定义路由组件.
// 也可以从其他文件导入
// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    { path: '/', component: ()=>import("./components/index.vue") },
    { path: '/about_me', component: ()=>import("./components/about_me.vue") },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
    // https://router.vuejs.org/zh/api/#router-view-%E7%9A%84-v-slot
    history: VueRouter.createWebHistory(),
    routes, // `routes: routes` 的缩写
})


// 现在，应用已经启动了！
export default router;
