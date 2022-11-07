<template>
  <el-dialog v-model="dialogVisible" title="Filtrele" width="400px" :before-close="handleClose">
    <template v-for="(c, name) in columns" :key="name">
      <label class="mt-3">{{ c.display }}: </label>

      <template v-if="c.type == 'file'"> Dosya araması yapılamaz </template>
      <div v-else-if="name == 'users' && table_name == 'mail'" class="overflow-auto" style="max-height: 200px">
        <el-button type="primary" @click="tumunuSec">Tümünü seç</el-button>
        <el-button type="primary" @click="bultenSec">Bülten Kullanıcıları</el-button>
        <div v-for="(u, key) in users" :key="u">
          <el-switch v-model="users[key]['mail']" class="me-3"></el-switch>{{ u.name }} {{ u.surname }}
        </div>
      </div>
      <input
        v-else-if="c.type == 'varchar' || c.type == 'text'"
        v-model="filter[name]"
        type="text"
        :ref="name"
        :placeholder="c.display"
        class="form-control"
      />
      <input
        v-if="c.type == 'int' || c.type == 'smallint'"
        type="number"
        v-model="filter[name]"
        :ref="name"
        :placeholder="c.display"
        class="form-control"
      />
      <input
        v-else-if="c.type == 'double'"
        type="number"
        v-model="filter[name]"
        :ref="name"
        :placeholder="c.display"
        class="form-control"
      />
      <input
        v-if="c.type == 'datetime'"
        type="datetime-local"
        v-model="filter[name]"
        :ref="name"
        :placeholder="c.display"
        class="form-control"
      />
      <div>
        <el-switch v-if="c.type == 'tinyint' || c.type == 'bit'" v-model="filter[name]" :ref="name" />
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="filtrele()">Filtrele</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: ["filtreDialog", "detail", "id", "columns"],
  data() {
    return {
      dialogVisible: false,
      filter: {},
    };
  },
  watch: {
    filtreDialog() {
      this.dialogVisible = this.filtreDialog;
    },
    dialogVisible() {
      this.$emit("state", this.dialogVisible);
    },
  },
  methods: {
    filtrele() {
      this.$emit("filter", this.filter);
    },
  },
  components: {},
};
</script>

<style></style>
