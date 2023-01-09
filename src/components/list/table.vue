<template>
  <div v-if="loading == false">
    <div class="d-flex justify-content-end mb-3">
      <el-button type="primary" plain @click="filtreDialog = true">Filtrele</el-button>
      <el-button type="primary" v-if="getAuths?.[table_name]?.['create_access'] == '1'" @click="yonlendir('create')"
        >Ekle</el-button
      >
    </div>
    <el-table :data="datas?.data" height="75vh" style="width: 100%" v-loading="loading">
      <el-table-column
        v-for="clm in datas.columns"
        :key="clm"
        :prop="clm.name"
        :label="clm.display"
        :min-width="clm.name == 'id' ? 50 : 120"
      >
        <template #default="props">
          <div v-if="clm.type == 'file' || clm.type == 'tinyint' || clm.type == 'bit'">
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
          </div>
          <div v-else-if="clm.ref_state == true && props.row[clm.name] > 0">
            <el-button @click="(ref_detail = clm.ref), (ref_state = true), (ref_id = props.row[clm.name])">Detay</el-button>
          </div>
          <div v-else-if="clm.ref_state == true && props.row[clm.name] <= 0">Boş</div>
          <div v-else v-html="props.row[clm.name]"></div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="İşlemler" width="100px">
        <template #default="props">
          <div class="d-none d-md-flex flex-column justify-content-center">
            <el-button class="text-primary" @click="detayAc(props.row?.id)">Detay</el-button>
            <el-button
              v-if="getAuths?.[table_name]?.['edit_access'] == '1'"
              type="success"
              @click="yonlendir('edit', props.row?.id)"
              size=""
              class="m-0 my-1"
              >Düzenle</el-button
            >
            <el-button
              v-if="getAuths?.[table_name]?.['delete_access'] == '1'"
              type="danger"
              class="m-0 my-1"
              size=""
              @click="sil(props.row?.id)"
              >Sil</el-button
            >

            <router-link
              :to="'/activity/' + props.row?.id"
              class="btn btn-primary m-0 my-1 btn-sm text-nowrap"
              v-if="table_name == 'Activity'"
              >Etk Detay</router-link
            >

            <router-link :to="'/blog/' + props.row?.id" class="btn btn-primary m-0 my-1 btn-sm" v-if="table_name == 'Blog'"
              >Yorumlar</router-link
            >
          </div>
          <div class="d-block d-md-none">
            <el-dropdown>
              <el-button plain type="success">
                <i class="bi bi-pencil-square"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item class="text-primary" @click="detayAc(props.row?.id)">Detay</el-dropdown-item>
                  <el-dropdown-item
                    v-if="getAuths?.[table_name]?.['edit_access'] == '1'"
                    @click="yonlendir('edit', props.row.id)"
                  >
                    Düzenle
                  </el-dropdown-item>
                  <el-dropdown-item v-if="table_name == 'Activity'">
                    <router-link :to="'/activity/' + props.row?.id" class="text-dark text-decoration-none">
                      Etk Detay</router-link
                    >
                  </el-dropdown-item>
                  <el-dropdown-item v-if="table_name == 'Blog'">
                    <router-link :to="'/blog/' + props.row?.id" class="text-dark text-decoration-none">Yorumlar</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item divided class="text-danger" @click="sil(props.row?.id)">Sil</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-content-center mt-2">
      <el-pagination
        background
        :currentPage="page"
        :page-size="limit"
        :pager-count="5"
        layout="prev, pager, next"
        :total="datas.count"
        @current-change="currentChange"
      />
    </div>
    <ref-detail-dialog :state="ref_state" @state="ref_state = $event" :detail="ref_detail" :id="ref_id"></ref-detail-dialog>
    <filtre-dialog
      :filtreDialog="filtreDialog"
      @state="filtreDialog = $event"
      :columns="datas.columns"
      @filter="filter($event)"
    ></filtre-dialog>
    <detail v-model:visible="detail_visible" :id="detay_id" :database="database" :table_name="table_name"></detail>
  </div>
</template>

<script>
import { list, deleted, update, first, add } from "@/hooks/iletisim.js";
import { mapGetters } from "vuex";
import { ElNotification, ElMessageBox } from "element-plus";
import refDetailDialog from "./ref-detail.vue";
import FiltreDialog from "./filtre-dialog.vue";
import detail from "@/components/detail";
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
      referans: [],
      ref_detail: {},
      ref_state: false,
      ref_id: 0,
      filtreDialog: false,
      like: {},
      detail_visible: false,
      detay_id: 0,
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
    detayAc(id) {
      this.detay_id = id;
      this.detail_visible = true;
    },
    currentChange(e) {
      console.log(e);
      this.page = e;
      this.getData();
    },
    filter(e) {
      this.like = e;
      this.getData();
    },
    getData() {
      this.loading = true;
      let params = {
        limit: this.limit,
        page: this.page,
        order: {
          name: "id",
          type: "DESC",
        },
        filter: this.filters,
        like: this.like,
      };
      list(this.database, this.table_name, params).then((res) => {
        this.datas = res.data;
        this.loading = false;
        this.getRef();
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
        console.log(this.datas.columns);
        for (const val of Object.values(this.referans)) {
          if (val.COLUMN_NAME == "id") continue;
          this.datas.columns[val?.COLUMN_NAME]["ref"] = val;
          this.datas.columns[val?.COLUMN_NAME]["ref_state"] = true;
        }
        console.log(this.datas.columns);
      });
    },
    sil(id) {
      ElMessageBox.confirm("Emin misiniz!", "Veri siliniyor.", {
        confirmButtonText: "Sil",
        cancelButtonText: "Vazgeç",
        type: "warning",
        callback: (action) => {
          if (action == "confirm") {
            if (this.table_name == "ActivityRecord" && this.datas.data.find((e) => e.id == id).room_id > 0) {
              console.log(this.datas.data.find((e) => e.id == id));
              let form_data = {
                rent_status: false,
                member_id: null,
              };
              update("fungitu2_fungiturkey", "ActivityRoom", this.datas.data.find((e) => e.id == id).room_id, form_data);
            }
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
          }
        },
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
      this.loading = true;
      console.log(data);
      if (this.table_name == "ActivityRecord" && clm == "status" && data[clm] == "1") {
        first(this.Fungi, "Settings").then((res) => {
          console.log(res.data.data.record_confirm);
          add(this.Simple, "mail", {
            users: data.email,
            title: "Fungi Turkey",
            message: res.data.data.record_confirm,
          }).then((res) => {
            if (res.data.status == "success") {
              ElNotification({
                title: "Başarılı!",
                message: "Mail başarıyla gönderildi.",
                type: "success",
              });
              this.loading = false;
            }
          });
        });
      }
      if (this.table_name == "ActivityRecord" && clm == "price_status" && data[clm] == "1") {
        first(this.Fungi, "Settings").then((res) => {
          console.log(res.data.data.price_confirm);
          add(this.Simple, "mail", {
            users: data.email,
            title: "Fungi Turkey",
            message: res.data.data.price_confirm,
          }).then((res) => {
            if (res.data.status == "success") {
              ElNotification({
                title: "Başarılı!",
                message: "Mail başarıyla gönderildi.",
                type: "success",
              });
              this.loading = false;
            }
          });
        });
      }
      let params = {};
      params[clm] = data[clm];
      update(this.database, this.table_name, data["id"], params);
      this.loading = false;
    },
  },
  components: {
    refDetailDialog,
    FiltreDialog,
    detail,
  },
};
</script>

<style></style>
