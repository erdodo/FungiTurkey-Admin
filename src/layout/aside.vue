<template>
  <div v-loading="loading" class="py-3 card h-100">
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
    </el-menu>
  </div>
</template>

<script>
import { list } from "@/hooks/iletisim";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tables: {},
      databases: {},
      loading: true,
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
    list("fungitu2_Simple", "table_group", paramstg)
      .then((res) => {
        this.databases = res.data.data;
        list("fungitu2_Simple", "tables", params).then((res) => {
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
      .catch((e) => {
        if (e.response.data.message == "Unauthorized") {
          this.$store.commit("setToken", "");
          this.$store.commit("setProfile", "");
        }
      });
  },
};
</script>

<style></style>
