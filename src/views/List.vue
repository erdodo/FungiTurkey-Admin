<template>
  <div class="w-100">
    <Table :database="this.$route.params.db" :table_name="this.$route.params.table_name"></Table>
  </div>
</template>

<script>
import Table from "@/components/list/table.vue";
export default {
  components: {
    Table,
  },
};
</script>

<style></style>
