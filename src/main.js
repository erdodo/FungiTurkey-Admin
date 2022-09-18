import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import CKEditor from "@ckeditor/ckeditor5-vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
app.config.globalProperties.baseImg = "https://api.fungiturkey.org/uploads/";
app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(CKEditor);
app.mount("#app");
