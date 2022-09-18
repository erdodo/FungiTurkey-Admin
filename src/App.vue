<template>
  <div v-if="getToken && (getProfile?.auths_group_id == 1 || getProfile?.auths_group_id == 0)" class="common-layout">
    <el-container>
      <el-aside width="250px"><Aside></Aside></el-aside>

      <el-container style="height: 100vh">
        <el-header><HeaderVue></HeaderVue></el-header>
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
  components: { Aside, Footer, HeaderVue, Login },
  computed: {
    ...mapGetters(["getToken", "getProfile"]),
  },
  mounted() {
    axios.defaults.headers.common["token"] = this.getToken;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.baseURL = "https://api.fungiturkey.org/api/";
  },
};
</script>
<style>
.common-layout {
  height: 100vh;
}
</style>
