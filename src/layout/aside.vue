<template>
  <div v-loading="loading" class="card py-3 h-100">
    <el-menu :default-active="this.$route.fullPath" class="el-menu-vertical-demo" router>
      <el-sub-menu v-for="db in databases" :key="db" :index="'/list/' + db.name">
        <template #title>
          <h5><i :class="db.icon" class="me-2"></i>{{ db.display }}</h5>
        </template>
        <el-menu-item v-for="tb in tables[db.id]" :key="tb" :index="'/list/' + db.name + '/' + tb.name">
          <template #title v-if="tb.table_group_id == db.id">
            <h5><i :class="tb.icon" class="me-2"></i> {{ tb.display }}</h5>
          </template>
        </el-menu-item>
      </el-sub-menu>
      <div class="text-center w-100">
        <el-button
          type="danger"
          plain
          class="d-md-none mt-2 mb-4 text-center"
          :index="this.$router.fullPath"
          @click="menu_state = !menu_state"
        >
          <i class="bi bi-x-square me-2"></i>Menü kapat
        </el-button>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { list } from "@/hooks/iletisim";
import { mapGetters } from "vuex";
export default {
  props: ["menuState"],
  data() {
    return {
      tables: {},
      databases: {},
      loading: true,
      menu_state: true,
    };
  },
  computed: {
    ...mapGetters(["getProfile"]),
  },
  mounted() {
    const paramstg = {
      limit: 100,
      filter: {
        auths_group_id: this.getProfile.auths_group_id,
      },
    };
    const params = {
      limit: 100,
    };
    list("fungitu2_test_Simple", "table_group", paramstg)
      .then((res) => {
        this.databases = res.data.data;
        if (res.data.status == "error") {
          this.$store.commit("setToken", "");
          this.$store.commit("setProfile", "");
        }
        list("fungitu2_test_Simple", "tables", params).then((res) => {
          if (res.data.status == "error") {
            this.$store.commit("setToken", "");
            this.$store.commit("setProfile", "");
          }
          for (const tb of Object.values(res.data.data)) {
            if (this.tables[tb.table_group_id] == undefined) {
              this.tables[tb.table_group_id] = [];
            }
            this.tables[tb.table_group_id].push(tb);
          }
          this.loading = false;
        });
      })
      .catch(() => {
        /*this.$store.commit("setToken", "");
        this.$store.commit("setProfile", "");*/
      });
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
