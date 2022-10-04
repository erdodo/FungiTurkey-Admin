<template>
  <el-dialog v-model="dialogVisible" title="Detaylar / Düzenle" width="400px" :before-close="handleClose">
    <edit
      :database="this.detail?.REFERENCED_TABLE_SCHEMA"
      :table_name="this.detail?.REFERENCED_TABLE_NAME"
      :id="this.id"
    ></edit>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Kapat</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import edit from "@/components/edit/edit";
export default {
  props: ["state", "detail", "id"],
  data() {
    return {
      dialogVisible: false,
      edit_data: {},
    };
  },
  watch: {
    state() {
      this.dialogVisible = this.state;
      if (this.state == true) {
        //this.getEditData();
      }
    },
    dialogVisible() {
      this.$emit("state", this.dialogVisible);
    },
  },
  methods: {
    /*getEditData() {
      console.log(this.detail);
      edit(this.detail.REFERENCED_TABLE_SCHEMA, this.detail.REFERENCED_TABLE_NAME, this.id);
    },*/
  },
  components: {
    edit,
  },
};
</script>

<style></style>
