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
      <!--el-tab-pane label="Mail Sistemi" name="ucuncu" class="p-3">
        <label for="">Başlık</label>
        <input v-model="mail.title" type="text" placeholder="Başlık" class="form-control" />
        <label for="">Mesaj</label>
        <ckeditor :editor="editor" v-model="mail.message" :config="editorConfig"></ckeditor>
        <el-button type="primary" class="mt-3" @click="onSubmit">Gönder</el-button>
      </!--el-tab-pane-->
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
        activity_id: this.$route.params.id,
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
      await add("fungitu2_Simple", "mail", this.mail).then((res) => {
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
      await list("fungitu2_fungiturkey", "ActivityRecord", params).then((res) => {
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
