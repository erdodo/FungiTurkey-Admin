import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/profil",
    name: "Profil",
    component: () => import("@/views/Profile/profile.vue"),
  },
  {
    path: "/list/:db/:table_name",
    name: "Liste",
    component: () => import("@/views/List.vue"),
  },
  {
    path: "/create/:db/:table_name",
    name: "Ekle",
    component: () => import("@/views/Create.vue"),
  },
  {
    path: "/edit/:db/:table_name/:id",
    name: "Düzenle",
    component: () => import("@/views/Edit.vue"),
  },
  {
    path: "/activity/:id",
    name: "Etkinlikdetay",
    component: () => import("@/views/ActivityDetail.vue"),
  },
  {
    path: "/blog/:id",
    name: "blogdetay",
    component: () => import("@/views/BlogDetail.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
