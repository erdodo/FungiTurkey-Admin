<template>
  <div class="card h-100 px-2">
    <div class="d-flex justify-content-between h-100 align-items-center">
      <el-button type="primary" class="d-md-none" :icon="Menu" circle @click="menu_state = !menu_state" />

      <div>
        <div v-if="this.Simple == 'fungitu2_test_Simple'" class="h1 text-danger">TEST</div>
      </div>

      <el-dropdown>
        <span class="el-dropdown-link">
          <h4 class="mb-0"><i class="bi bi-person-circle"></i>Profil</h4>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="routeToProfile()">Profil</el-dropdown-item>
            <el-dropdown-item @click="passState = true">Şifre Değiştir</el-dropdown-item>
            <el-dropdown-item divided @click="cikis"><span class="text-danger">Çıkış</span></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <password-change :dialogVisible="passState" @success="passState = false"></password-change>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import passwordChange from "../modals/passwordChange.vue";
import { Menu } from "@element-plus/icons-vue";
export default {
  props: ["menuState"],
  data() {
    return {
      passState: false,
      menu_state: false,
      Menu,
    };
  },
  components: { passwordChange },
  computed: {
    ...mapGetters(["getProfile"]),
  },
  methods: {
    cikis() {
      this.$store.commit("setToken", "");
      this.$store.commit("setProfile", "");
    },
    routeToProfile() {
      this.$router.push("/profil");
    },
  },
  watch: {
    menu_state() {
      this.$emit("menu_state", this.menu_state);
    },
    menuState() {
      this.menu_state = this.menuState;
    },
  },
};
</script>

<style></style>
