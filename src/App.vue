<template>
  <div v-if="getToken && (getProfile?.auths_group_id == 1 || getProfile?.auths_group_id == 0)" class="common-layout">
    <el-container style="height: 100vh">
      <el-aside width="250px" class="d-none d-md-block">
        <Aside :menuState="menu" @menu_state="menu = $event"></Aside>
      </el-aside>
      <el-aside width="250px" v-if="menu == true" class="d-block d-md-none position-fixed h-100" style="z-index: 5">
        <Aside :menuState="menu" @menu_state="menu = $event"></Aside>
      </el-aside>
      <el-container style="min-height: 100vh">
        <el-header><HeaderVue :menuState="menu" @menu_state="menu = $event"></HeaderVue></el-header>
        <el-container class="d-flex justify-content-between h-100">
          <el-main class=""><router-view /></el-main>
          <el-footer><Footer></Footer></el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
  <div v-else>
    <login></login>
  </div>
</template>
<script>
import Aside from "@/layout/aside";
import Footer from "@/layout/footer";
import HeaderVue from "@/layout/header";
import { mapGetters } from "vuex";
import Login from "./views/Login/login.vue";
import axios from "axios";
export default {
  data() {
    return {
      menu: false,
    };
  },
  components: { Aside, Footer, HeaderVue, Login },
  computed: {
    ...mapGetters(["getToken", "getProfile"]),
  },
  mounted() {
    axios.defaults.headers.common["token"] = this.getToken;
    axios.defaults.headers.common["Content-Type"] = "application/json";

    axios.defaults.baseURL = this.api + "/api/";

  },
};
</script>
<style>
.common-layout {
  height: 100vh;
}
</style>
