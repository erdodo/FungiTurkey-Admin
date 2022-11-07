<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Yorumlar" name="first">
        <Table v-if="activeName == 'first'" database="this.Fungi" table_name="ActivityComment" :filters="filters"></Table>
      </el-tab-pane>
      <el-tab-pane label="Kayıtlar" name="second">
        <Table v-if="activeName == 'second'" database="this.Fungi" table_name="ActivityRecord" :filters="filters"></Table>
      </el-tab-pane>
      <el-tab-pane label="Odalar" name="ucuncu">
        <Table
          v-if="activeName == 'ucuncu'"
          database="fungitu2_fungiturkey"
          table_name="ActivityRoom"
          :filters="filters"
        ></Table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Table from "@/components/list/table.vue";
//import { add, list } from "@/hooks/iletisim.js";
//import { ElNotification } from "element-plus";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  components: {
    Table,
  },
  data() {
    return {
      editor: ClassicEditor,
      activeName: "first",
      filters: {
        activity_id: parseInt(this.$route.params.id),
      },
      mail: {
        title: "",
        message: "",
        users: "",
      },
    };
  },
  methods: {
    /*async onSubmit() {
      await this.getUsers();
      await add(this.Simple, "mail", this.mail).then((res) => {
        if (res.data.status == "success") {
          ElNotification({
            title: "Başarılı!",
            message: "Ekleme işlemi başarıyla gerçekleşti.",
            type: "success",
          });
          this.loading = false;
          this.$router.push("/list/" + this.database + "/" + this.table_name);
        }
      });
    },
    async getUsers() {
      let params = {
        filters: {
          activity_id: this.$route.params.id,
          price_status: "1",
        },
      };
      let users = [];
      await list(this.Fungi, "ActivityRecord", params).then((res) => {
        for (const val of Object.values(res.data.data)) {
          users.push(val.email);
        }
        this.mail.users = users.toString();
      });
    },*/
  },
};
</script>

<style></style>
