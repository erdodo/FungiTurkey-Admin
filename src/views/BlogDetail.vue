<template>
  <div class="row">
    <div class="col-12">
      <h3>Yorumlar</h3>
      <Table database="fungitu2_fungiturkey" table_name="BlogComment" :filters="filters"></Table>
    </div>
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
      filters: {
        blog_id: this.$route.params.id,
      },
    };
  },
};
</script>

<style></style>
