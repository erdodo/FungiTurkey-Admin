<template>
  <el-dialog v-model="state" title="Şifre değiştir" width="300px" :before-close="handleClose">
    <label for="">Eski şifreniz</label>
    <el-input v-model="oldPass" show-password type="password" placeholder="Eski Şifreniz" />
    <label for="">Yeni şifreniz</label>
    <el-input v-model="newPass" show-password type="password" placeholder="Eski Şifreniz" />
    <label for="">Yeni şifreniz Tekrar</label>
    <el-input v-model="checkPass" show-password type="password" placeholder="Eski Şifreniz" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="newPassword()">Onayla</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { ElNotification } from "element-plus";
export default {
  props: ["dialogVisible"],
  data() {
    return {
      sozlesme: "",
      state: this.dialogVisible,
      oldPass: "",
      newPass: "",
      checkPass: "",
    };
  },
  computed: {
    ...mapGetters(["getProfile"]),
  },
  watch: {
    dialogVisible() {
      console.log(this.dialogVisible);
      this.state = this.dialogVisible;
    },
  },
  methods: {
    newPassword() {
      axios
        .post("new-password", {
          oldPass: this.oldPass,
          newPass: this.newPass,
          checkPass: this.checkPass,
        })
        .then((res) => {
          if (res.data.status == "success") {
            this.$emit("success");
            ElNotification({
              title: "Başarılı",
              message: res.data.message,
              type: "success",
            });
          } else {
            ElNotification({
              title: "Dikkat",
              message: res.data.message,
              type: "info",
            });
          }
        });
    },
  },
};
</script>

<style></style>
