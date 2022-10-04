<template>
  <div>
    <el-select v-model="vl" class="w-100" placeholder="Seçiniz..." size="large">
      <el-option v-for="item in options" :key="item.id" :label="item.text" :value="item.id" />
    </el-select>
  </div>
</template>

<script>
import { list } from "@/hooks/iletisim.js";
export default {
  props: ["referance", "value"],
  data() {
    return {
      options: [],
      page: 1,
      loading: true,
      vl: this.value,
    };
  },
  watch: {
    vl() {
      console.log(this.vl);
      this.$emit("change", this.vl);
    },
  },
  mounted() {
    this.getDatas();
    var el = document.getElementsByClassName("el-select-dropdown__wrap");
    el[0].addEventListener("scroll", (e) => {
      if (e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight) {
        this.page += 1;
        this.getDatas();
      }
    });
  },
  methods: {
    getDatas() {
      this.loading = true;
      let params = {
        limit: 50,
        page: this.page,
      };
      list(this.referance.REFERENCED_TABLE_SCHEMA, this.referance.REFERENCED_TABLE_NAME, params).then((res) => {
        if (this.referance.CONSTRAINT_NAME.split("-")[1]?.split(",").length > 1) {
          let columns = this.referance.CONSTRAINT_NAME.split("-")[1]?.split(",");
          for (const val of Object.values(res.data.data)) {
            var veri = "";
            for (const clm of Object.values(columns)) {
              veri = veri + " " + val[clm];
            }
            this.options.push({
              id: val.id,
              text: veri,
            });
          }
        } else {
          let column = this.referance.CONSTRAINT_NAME.split("-")[1];
          for (const val of Object.values(res.data.data)) {
            this.options.push({
              id: val.id,
              text: val[column],
            });
          }
        }
        this.vl = this.value;
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
