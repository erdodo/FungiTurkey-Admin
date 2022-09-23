<template>
  <div v-loading="loading">
    <template v-for="(c, name) in columns" :key="name">
      <label class="mt-3">{{ c.display }}: </label>
      <el-select v-if="name == 'auths_group_id'" v-model="prm[name]" class="w-100" size="large" placeholder="Select">
        <el-option label="Admin" :value="1" />
        <el-option label="Kullanıcı" :value="2" />
      </el-select>
      <div v-else>
        <div v-if="c.type == 'file'" class="row">
          <div v-if="prm[name]" class="position-relative col-12 col-md-6">
            <el-button type="danger" style="" class="image-remover" circle @click="imageRemove(name)"> X </el-button>
            <img :src="baseImg + prm[name]" class="rounded" style="max-height: 250px; max-width: 100%" alt="" />
          </div>
          <div class="mt-2 mt-md-0 col-12 col-md-6 text-center">
            <input type="file" :ref="name" :placeholder="c.display" class="form-control" />
          </div>
        </div>

        <input
          v-else-if="c.type == 'varchar'"
          v-model="prm[name]"
          type="text"
          :ref="name"
          :placeholder="c.display"
          class="form-control"
        />
        <input
          v-else-if="c.type == 'int' || c.type == 'smallint'"
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
          v-else-if="c.type == 'datetime'"
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
        <div v-else-if="c.type == 'tinyint' || c.type == 'bit'">
          <el-switch v-model="prm[name]" :ref="name" />
        </div>
      </div>
    </template>
    <button class="btn btn-primary mt-3" @click="onSubmit()">Gönder</button>
  </div>
</template>

<script>
import { edit, update } from "@/hooks/iletisim.js";
import { ElNotification } from "element-plus";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  props: ["database", "table_name", "id"],
  data() {
    return {
      editor: ClassicEditor,
      image: null,
      title: null,
      columns: [],
      prm: {},
      loading: true,
    };
  },
  mounted() {
    this.getEdit();
  },
  methods: {
    getEdit() {
      this.loading = true;
      edit(this.database, this.table_name, this.id).then((response) => {
        this.columns = response.data.columns;
        this.prm = response.data.data;
        for (const clm of Object.values(this.columns)) {
          if (clm.type == "tinyint" || clm.type == "bit") {
            this.prm[clm.name] = this.prm[clm.name] == "1" ? true : false;
          }
        }

        this.loading = false;
      });
    },
    async onSubmit() {
      this.loading = true;
      const formData = new FormData();

      for (const [key, val] of Object.entries(this.columns)) {
        if (val.type == "file") {
          if (this.$refs.image?.[0]?.files[0] != undefined) {
            formData.append(key, this.$refs.image?.[0]?.files[0]);
          } else {
            formData.append(key, this.prm[key] == undefined ? "" : this.prm[key]);
          }
        } else if (val.type == "tinyint" || val.type == "bit") {
          formData.append(key, this.prm[key] == undefined ? "" : this.prm[key] ? "1" : "0");
        } else {
          formData.append(key, this.prm[key] == undefined ? "" : this.prm[key]);
        }
      }
      await update(this.database, this.table_name, this.id, formData).then((res) => {
        if (res.data.status == "success") {
          ElNotification({
            title: "Başarılı!",
            message: "Düzenleme işlemi başarıyla gerçekleşti.",
            type: "success",
          });
          this.loading = false;
          this.prm = res.data.data;
          for (const clm of Object.values(this.columns)) {
            if (clm.type == "tinyint" || clm.type == "bit") {
              this.prm[clm.name] = this.prm[clm.name] == "1" ? true : false;
            }
          }
        }
      });
    },
    imageRemove(name) {
      this.prm[name] = "";
    },
  },
};
</script>

<style>
.image-remover {
  padding-left: 10px !important;
  padding-right: 10px !important;
  position: absolute;
  margin-top: 10px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
