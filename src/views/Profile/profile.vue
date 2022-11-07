<template>
  <div v-if="getProfile">
    Profil
    <edit database="this.Simple" table_name="users" :id="getProfile.id"></edit>
  </div>
</template>

<script>
import edit from "@/components/edit/edit.vue";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getProfile"]),
  },
  components: {
    edit,
  },
};
</script>

<style></style>
