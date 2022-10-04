import axios from "axios";
import store from "@/store";
axios.defaults.headers.common["token"] = store.getters.getToken == undefined ? 1 : store.getters.getToken;
axios.defaults.headers.common["Content-Type"] = "application/json";

const base_url = "https://api2.fungiturkey.org/api/";

const list = async (db, table, params) => {
  return await axios.post(base_url + db + "/" + table, params);
};
const first = async (db, table, params) => {
  return await axios.post(base_url + db + "/" + table + "/first", params);
};
const create = async (db, table) => {
  return await axios.post(base_url + db + "/" + table + "/create");
};
const add = async (db, table, params) => {
  return await axios.post(base_url + db + "/" + table + "/store", params);
};
const edit = async (db, table, id) => {
  return await axios.post(base_url + db + "/" + table + "/" + id + "/edit");
};
const update = async (db, table, id, form) => {
  return await axios.post(base_url + db + "/" + table + "/" + id + "/update", form);
};
const deleted = async (db, table, id) => {
  return await axios.post(base_url + db + "/" + table + "/" + id + "/delete");
};
export { list, first, create, add, edit, update, deleted };
