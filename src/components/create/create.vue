<template>
  <div v-loading="loading">
    <template v-for="(c, name) in columns" :key="name">
      <label class="mt-3">{{ c.display }}: </label>

      <input v-if="c.type == 'file'" type="file" :ref="name" :placeholder="c.display" class="form-control" />
      <select-component v-else-if="c.ref_state" :referance="c?.ref" @change="selectChange(name, $event)"></select-component>
      <div v-else-if="name == 'users' && table_name == 'mail'" class="overflow-auto" style="max-height: 200px">
        <el-button type="primary" @click="tumunuSec">Tümünü seç</el-button>
        <el-button type="primary" @click="bultenSec">Bülten Kullanıcıları</el-button>
        <div v-for="(u, key) in users" :key="u">
          <el-switch v-model="users[key]['mail']" class="me-3"></el-switch>{{ u.name }} {{ u.surname }}
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
      <VueEditor v-else-if="c.type == 'text'" v-model="prm[name]" />

      <div v-else-if="c.type == 'tinyint' || c.type == 'bit'">
        <el-switch v-model="prm[name]" :ref="name" />
      </div>
    </template>

    <button class="btn btn-primary mt-3" @click="onSubmit()">Gönder</button>
  </div>
</template>

<script>
import { create, add, list } from "@/hooks/iletisim.js";
import { ElNotification } from "element-plus";

import { VueEditor } from "vue3-editor";
import SelectComponent from "../select-component.vue";

export default {
  props: ["database", "table_name"],
  data() {
    return {
      image: null,
      title: null,
      columns: [],
      prm: {},
      users: {},
      loading: true,
      referans: [],
    };
  },
  mounted() {
    this.getCreate();
    this.getRef();
  },
  methods: {
    getCreate() {
      this.loading = true;
      create(this.database, this.table_name).then((response) => {
        this.columns = response.data.columns;
        this.loading = false;
      });
      if (this.table_name == "mail") {
        list("fungitu2_Simple", "users", { limit: 1000 }).then((res) => {
          this.users = res.data.data;
        });
      }
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
        console.log(this.columns);
        for (const val of Object.values(this.referans)) {
          if (val.COLUMN_NAME == "id") continue;
          if (this.columns[val?.COLUMN_NAME] == undefined) {
            continue;
          }
          this.columns[val?.COLUMN_NAME]["ref"] = val;
          this.columns[val?.COLUMN_NAME]["ref_state"] = true;
        }
        console.log(this.columns);
      });
    },
    async onSubmit() {
      this.loading = true;
      let formData = new FormData();
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
          this.prm[key] = this.prm[key] == undefined ? 0 : this.prm[key] == true ? 1 : 0;
          formData.append(key, this.prm[key] == 1 ? true : false);
        } else {
          formData.append(key, this.prm[key] == undefined ? "" : this.prm[key]);
        }
      }
      let mail_user = [];
      if (this.table_name == "mail") {
        for (const val of Object.values(this.users)) {
          if (val["mail"] == true) {
            mail_user.push(val.email);
          }
        }
        console.log(mail_user);
        formData.append("users", mail_user.toString());
        this.prm["users"] = mail_user.toString();
      }
      await add(this.database, this.table_name, imageStatus ? formData : this.prm).then((res) => {
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
    tumunuSec() {
      for (const key of Object.keys(this.users)) {
        this.users[key]["mail"] = true;
      }
    },
    bultenSec() {
      for (const [key, val] of Object.entries(this.users)) {
        if (val.bulletin_state == "1") {
          this.users[key]["mail"] = true;
        } else {
          this.users[key]["mail"] = false;
        }
      }
    },
    selectChange(clm, e) {
      this.prm[clm] = e;
    },
  },
  components: {
    VueEditor,
    SelectComponent,
  },
};
</script>

<style></style>
