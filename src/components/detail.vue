<template>
  <el-dialog v-model="dialogVisible" title="Detaylar" :width="width" :before-close="handleClose">
    <div v-for="c in datas.columns" :key="c.name">
      <div class="d-flex align-items-center">
        <label class="m-0 me-2 text-nowrap"> {{ c.display }}: </label>
        <div v-if="c.type == 'file' || c.type == 'tinyint' || c.type == 'bit'">
          <div class="w-100 text-center" v-if="c.type == 'file'">
            <img :src="baseImg + datas.data[c.name]" alt="" height="80" />
          </div>
          <div class="w-100 text-center" v-if="c.type == 'tinyint' || c.type == 'bit'">
            <el-tag class="mx-1" size="large" type="success" v-if="datas.data[c.name] == 1"
              ><i class="bi bi-check-circle"></i>
            </el-tag>
            <el-tag class="mx-1" size="large" type="danger" v-if="datas.data[c.name] == 0"
              ><i class="bi bi-x-circle"></i>
            </el-tag>
          </div>
        </div>
        <span v-else v-html="datas.data[c.name]" class="fs-6"></span>
      </div>
      <el-divider border-style="dashed" class="my-3"> </el-divider>
    </div>
  </el-dialog>
</template>

<script>
import { detail } from "@/hooks/iletisim";
export default {
  props: ["visible", "table_name", "database", "id"],
  data() {
    return {
      dialogVisible: false,
      datas: {},
      width: "",
    };
  },
  mounted() {
    this.setWidth();
    document.addEventListener("resize", this.setWidth());
  },
  watch: {
    visible() {
      this.dialogVisible = this.visible;
      if (this.visible == true) this.getData();
    },
    dialogVisible() {
      this.$emit("update:visible", this.dialogVisible);
    },
  },
  methods: {
    getData() {
      detail(this.database, this.table_name, this.id).then((res) => {
        this.datas = res.data;
      });
    },
    setWidth() {
      if (window.innerWidth < 368) {
        this.width = "100%";
      } else if (window.innerWidth < 768) {
        this.width = "80%";
      } else if (window.innerWidth < 992) {
        this.width = "70%";
      } else if (window.innerWidth < 1200) {
        this.width = "55%";
      } else if (window.innerWidth < 1400) {
        this.width = "50%";
      } else {
        this.width = "40%";
      }
    },
  },
};
</script>

<style></style>
