<template>
  <div v-if="loading == false">
    <div class="d-flex justify-content-end" v-if="getAuths?.[table_name]?.['create_access'] == '1'">
      <el-button type="primary" @click="yonlendir('create')">Ekle</el-button>
    </div>
    <el-table :data="datas?.data" height="80vh" style="width: 100%" v-loading="loading">
      <el-table-column v-for="clm in datas.columns" :key="clm" :prop="clm.name" :label="clm.display" min-width="200">
        <template #default="props" v-if="clm.type == 'file' || clm.type == 'tinyint' || clm.type == 'bit'">
          <div class="w-100 text-center" v-if="clm.type == 'file'">
            <img :src="baseImg + props.row.image" alt="" height="80" />
          </div>
          <div class="w-100 text-center" v-if="clm.type == 'tinyint' || clm.type == 'bit'">
            <el-tag class="mx-1" size="large" type="success" v-if="props.row[clm.name] == 1"
              ><i class="bi bi-check-circle"></i>
            </el-tag>
            <el-tag class="mx-1" size="large" type="danger" v-if="props.row[clm.name] == 0"
              ><i class="bi bi-x-circle"></i>
            </el-tag>
            <template>
              {{ (props.row[clm.name] = props.row[clm.name] == "1" ? true : false) }}
            </template>

            <el-switch v-model="props.row[clm.name]" @click="switchChange(clm.name, props.row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="İşlemler" width="100">
        <template #default="props">
          <div class="d-flex flex-column">
            <el-button
              v-if="getAuths?.[table_name]?.['edit_access'] == '1'"
              type="success"
              @click="yonlendir('edit', props.row.id)"
              size=""
              >Düzenle</el-button
            >
            <el-popconfirm
              v-if="getAuths?.[table_name]?.['delete_access'] == '1'"
              confirm-button-text="Evet"
              cancel-button-text="Vazgeç"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="Silmek istediğinize emin misiniz?"
              @confirm="sil(props.row.id)"
            >
              <template #reference>
                <el-button type="danger" class="mt-2" size="">Sil</el-button>
              </template>
            </el-popconfirm>
            <router-link
              :to="'/activity/' + props.row.id"
              class="btn btn-primary m-1 btn-sm mt-2"
              v-if="table_name == 'Activity'"
              >Detay</router-link
            >

            <router-link :to="'/blog/' + props.row.id" class="btn btn-primary m-1 btn-sm mt-2" v-if="table_name == 'Blog'"
              >Yorumlar</router-link
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-content-center mt-2">
      <el-pagination
        background
        :page-size="limit"
        :pager-count="5"
        layout="prev, pager, next"
        :total="datas.count"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import { list, deleted, update } from "@/hooks/iletisim.js";
import { mapGetters } from "vuex";
import { ElNotification } from "element-plus";
export default {
  props: {
    database: String,
    table_name: String,
    filters: Object,
  },
  data() {
    return {
      datas: {},
      loading: true,
      limit: 10,
      page: 1,
    };
  },
  computed: {
    ...mapGetters(["getAuths", "getProfile"]),
  },
  watch: {
    table_name() {
      this.getData();
    },
  },
  mounted() {
    if (this.table_name != undefined) {
      this.getData();
    }
  },
  methods: {
    currentChange(e) {
      console.log(e);
      this.page = e;
      this.getData();
    },
    getData() {
      this.loading = true;
      const params = {
        limit: this.limit,
        page: this.page,
        sort: {
          name: "id",
          type: "DESC",
        },
        filter: this.filters,
      };
      list(this.database, this.table_name, params).then((res) => {
        this.datas = res.data;
        this.loading = false;
      });
    },
    sil(id) {
      deleted(this.database, this.table_name, id).then((res) => {
        if (res.data.status == "success") {
          ElNotification({
            title: "Başarılı!",
            message: "Ekleme işlemi başarıyla gerçekleşti.",
            type: "success",
          });
          this.loading = true;
          this.getData();
        }
      });
    },
    yonlendir(state, id) {
      if (state == "edit") {
        this.$router.push("/edit/" + this.database + "/" + this.table_name + "/" + id);
      } else if (state == "create") {
        this.$router.push("/create/" + this.database + "/" + this.table_name);
      }
    },
    switchChange(clm, data) {
      let params = {};
      params[clm] = data[clm];
      update(this.database, this.table_name, data["id"], params);
    },
  },
};
</script>

<style></style>
