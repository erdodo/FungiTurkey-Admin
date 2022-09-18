<template>
  <div>
    <template v-for="(c, name) in columns" :key="name">
      <label class="mt-3">{{ c.display }}: </label>

      <input v-if="c.type == 'file'" type="file" :ref="name" :placeholder="c.display" class="form-control" />
      <input
        v-else-if="c.type == 'varchar'"
        v-model="prm[name]"
        type="text"
        :ref="name"
        :placeholder="c.display"
        class="form-control"
      />
      <input
        v-if="c.type == 'int' || c.type == 'smallint'"
        type="number"
        v-model="prm[name]"
        :ref="name"
        :placeholder="c.display"
        class="form-control"
      />
      <input
        v-else-if="c.type == 'double'"
        type="number"
        v-model="prm[name]"
        :ref="name"
        :placeholder="c.display"
        class="form-control"
      />
      <input
        v-if="c.type == 'datetime'"
        type="datetime-local"
        v-model="prm[name]"
        :ref="name"
        :placeholder="c.display"
        class="form-control"
      />
      <ckeditor
        v-if="c.type == 'text'"
        :placeholder="c.display"
        :editor="editor"
        v-model="prm[name]"
        :ref="name"
        :config="editorConfig"
      ></ckeditor>
      <div>
        <el-switch v-if="c.type == 'tinyint' || c.type == 'bit'" v-model="prm[name]" :ref="name" />
      </div>
    </template>
    <button class="btn btn-primary mt-3" @click="onSubmit()">Gönder</button>
  </div>
</template>

<script>
import { create, add } from "@/hooks/iletisim.js";
import { ElNotification } from "element-plus";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  props: ["database", "table_name"],
  data() {
    return {
      editor: ClassicEditor,
      image: null,
      title: null,
      columns: [],
      prm: {},
    };
  },
  mounted() {
    this.getCreate();
  },
  methods: {
    getCreate() {
      create(this.database, this.table_name).then((response) => {
        this.columns = response.data.columns;
      });
    },
    async onSubmit() {
      this.loading = true;
      const formData = new FormData();

      for (const [key, val] of Object.entries(this.columns)) {
        if (val.name == "status") {
          formData.append("status", "0");
        } else if (val.type == "file") {
          if (this.$refs.image?.[0]?.files[0] != undefined) {
            formData.append("image", this.$refs.image?.[0]?.files[0]);
          } else {
            formData.append("image", this.prm[key] == undefined ? "" : this.prm[key]);
          }
        } else if (val.type == "tinyint" || val.type == "bit") {
          formData.append(key, this.prm[key] == undefined ? "" : this.prm[key] ? "1" : "0");
        } else {
          formData.append(key, this.prm[key] == undefined ? "" : this.prm[key]);
        }
      }
      await add(this.database, this.table_name, formData).then((res) => {
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
  },
};
</script>

<style></style>
