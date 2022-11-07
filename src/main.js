import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import CKEditor from "@ckeditor/ckeditor5-vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
app.config.globalProperties.baseImg = "https://api2.fungiturkey.org/uploads/";
app.config.globalProperties.Simple = "fungitu2_test_Simple";
app.config.globalProperties.Fungi = "fungitu2_test_fungiturkey";
app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(CKEditor);
app.mount("#app");
