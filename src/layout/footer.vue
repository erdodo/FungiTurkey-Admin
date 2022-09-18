<template>
  <div class="border-bottom d-flex justify-content-end">
    <a @click="cacheClear()" class="me-2 text-danger cursor-pointer">Cache temizle</a>
    <a href="https://github.com/erdodo">Erdoğan Yeşil</a>
  </div>
</template>

<script>
import axios from "axios";
export default {
  methods: {
    cacheClear() {
      axios.post("/auths").then((res2) => {
        let auths = {};
        for (const val of Object.values(res2.data.data)) {
          auths[val.table_name] = val;
        }
        this.$store.commit("setAuths", JSON.stringify(auths));
      });
    },
  },
};
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
</style>
