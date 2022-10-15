<template>
  <div v-if="id > 0" v-loading="loading">
    <template v-for="(c, name) in columns" :key="name">
      <label class="mt-3">{{ c.display }}: </label>

      <el-select v-if="name == 'auths_group_id'" v-model="prm[name]" class="w-100" size="large" placeholder="Select">
        <el-option label="Admin" :value="1" />
        <el-option label="Kullanıcı" :value="2" />
      </el-select>
      <select-component
        v-else-if="c.ref_state"
        :referance="c?.ref"
        :value="prm[name]"
        @change="prm[name] = $event"
      ></select-component>
      <div v-else-if="c.type == 'file'" class="row">
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
      <VueEditor v-else-if="c.type == 'text'" v-model="prm[name]" :ref="name" theme="snow" toolbar="full" />
      <div v-else-if="c.type == 'tinyint' || c.type == 'bit'">
        <el-switch v-model="prm[name]" :ref="name" />
      </div>
    </template>
    <button class="btn btn-primary mt-3" @click="onSubmit()">Gönder</button>
  </div>
  <div v-else>Kayıt bulunamadı</div>
</template>

<script>
import { edit, update, list } from "@/hooks/iletisim.js";
import { ElNotification } from "element-plus";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { VueEditor } from "vue3-editor";
import SelectComponent from "../select-component.vue";

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
      referans: [],
    };
  },
  mounted() {
    if (this.id > 0) {
      this.getEdit();
      this.getRef();
    }
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
    getRef() {
      const params = {
        limit: 100,
        filter: {
          CONSTRAINT_SCHEMA: this.database,
          TABLE_NAME: this.table_name,
        },
      };
      list("information_schema", "KEY_COLUMN_USAGE", params).then((res) => {
        this.referans = res.data.data;
        for (const val of Object.values(this.referans)) {
          if (val.COLUMN_NAME == "id") continue;
          this.columns[val?.COLUMN_NAME]["ref"] = val;
          this.columns[val?.COLUMN_NAME]["ref_state"] = true;
        }
      });
    },
    async onSubmit() {
      this.loading = true;
      const formData = new FormData();
      let imageStatus = false;
      for (const [key, val] of Object.entries(this.columns)) {
        if (val.type == "file") {
          if (this.$refs.image?.[0]?.files[0] != undefined) {
            formData.append(key, this.$refs.image?.[0]?.files[0]);
            imageStatus = true;
          } else {
            formData.append(key, this.prm[key] == undefined ? "" : this.prm[key]);
          }
        } else if (val.type == "tinyint" || val.type == "bit") {
          this.prm[key] = this.prm[key] == true ? true : false;
          formData.append(key, this.prm[key] == undefined ? false : this.prm[key]);
        } else {
          formData.append(key, this.prm[key] == undefined ? "" : this.prm[key]);
        }
      }
      console.log(this.prm);
      await update(this.database, this.table_name, this.id, imageStatus ? formData : this.prm).then((res) => {
        if (res.data.status == "success") {
          ElNotification({
            title: "Başarılı!",
            message: "Düzenleme işlemi başarıyla gerçekleşti.",
            type: "success",
          });

          this.prm = res.data.data;
          for (const clm of Object.values(this.columns)) {
            if (clm.type == "tinyint" || clm.type == "bit") {
              this.prm[clm.name] = this.prm[clm.name] == "1" ? true : false;
            }
          }
          this.loading = false;
        }
      });
    },
    imageRemove(name) {
      this.prm[name] = "";
    },
  },
  watch: {
    id() {
      if (this.id > 0) {
        this.getEdit();
      }
    },
  },
  components: {
    VueEditor,
    SelectComponent,
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
