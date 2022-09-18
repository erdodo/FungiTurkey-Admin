<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Yorumlar" name="first">
        <Table
          v-if="activeName == 'first'"
          database="fungitu2_fungiturkey"
          table_name="ActivityComment"
          :filters="filters"
        ></Table>
      </el-tab-pane>
      <el-tab-pane label="Kayıtlar" name="second">
        <Table
          v-if="activeName == 'second'"
          database="fungitu2_fungiturkey"
          table_name="ActivityRecord"
          :filters="filters"
        ></Table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Table from "@/components/list/table.vue";
export default {
  components: {
    Table,
  },
  data() {
    return {
      activeName: "first",
      filters: {
        activity_id: this.$route.params.id,
      },
    };
  },
};
</script>

<style></style>
