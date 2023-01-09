import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import CKEditor from "@ckeditor/ckeditor5-vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { tr } from "element-plus/es/locale";

const app = createApp(App);

let api = "https://api.fungiturkey.org/";
app.config.globalProperties.baseImg = api + "uploads/";
app.config.globalProperties.api = api;

app.config.globalProperties.baseImg = "https://api.fungiturkey.org/uploads/";
app.config.globalProperties.Simple = "fungitu2_Simple";
app.config.globalProperties.Fungi = "fungitu2_fungiturkey";

app.use(router);
app.use(store);
app.use(ElementPlus, {
  locale: tr,
});
app.use(CKEditor);
app.mount("#app");
