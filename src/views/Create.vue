<template>
  <div class="w-100">
    <el-button type="success" plain @click="routerList()">
      <el-icon><ArrowLeft /></el-icon>Liste
    </el-button>
  </div>
  <create :database="this.$route.params.db" :table_name="this.$route.params.table_name"></create>
</template>

<script>
import create from "@/components/create/create";
import { ArrowLeft } from "@element-plus/icons-vue";
export default {
  components: {
    create,
    ArrowLeft,
  },
  methods: {
    routerList() {
      this.$router.push("/list/" + this.$route.params.db + "/" + this.$route.params.table_name);
    },
  },
};
</script>

<style></style>
