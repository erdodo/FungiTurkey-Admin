<template>
  <div style="height: 100vh; width: 100vw" class="d-flex justify-content-center align-items-center">
    <div class="card">
      <div class="card-body">
        <h3>Hoş geldiniz</h3>
        <label for="">Eposta adresiniz</label>
        <el-input v-model="email" placeholder="Eposta adresiniz"></el-input>
        <label class="mt-3" for="">Şifreniz</label>
        <el-input v-model="password" type="password" placeholder="Şifreniz"></el-input>
        <el-button type="primary" class="mt-2" @click="giris()">Giriş yap </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ElNotification } from "element-plus";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    giris() {
      axios.defaults.headers.common["token"] = "";
      axios
        .post("/login", {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          if (res.data.status == "success") {
            this.$store.commit("setToken", res.data.token);
            this.state = false;
            this.email = "";
            this.password = "";
            axios.defaults.headers.common["token"] = res.data.token;
            axios.post("/profile").then((res2) => {
              if (
                res2.data.status == "success" &&
                (res2.data.data?.auths_group_id == 1 || res2.data.data?.auths_group_id == 0)
              ) {
                ElNotification({
                  title: "Başarılı",
                  message: res.data.message,
                  type: "success",
                });
                this.$store.commit("setProfile", JSON.stringify(res2.data.data));
              }
            });

            axios.post("/auths").then((res2) => {
              let auths = {};
              for (const val of Object.values(res2.data.data)) {
                auths[val.table_name] = val;
              }
              this.$store.commit("setAuths", JSON.stringify(auths));
            });
          } else {
            ElNotification({
              title: "Hata",
              message: "Eposta yada şifre hatalı",
              type: "error",
            });
          }
        })
        .catch(() => {
          ElNotification({
            title: "Hata",
            message: "Eposta yada şifre hatalı",
            type: "error",
          });
        });
    },
  },
};
</script>

<style></style>
