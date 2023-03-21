import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { axiosInstance } from "./helpers/api";

const app = createApp(App);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

app.provide("$axios", axiosInstance);
app.mount("#app");
