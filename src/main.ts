import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import Toast, { POSITION, TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";
import type { PluginOptions } from "vue-toastification";

const app = createApp(App);
const pinia = createPinia();

const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  icon: true,
  transition: "Vue-Toastification__fade",
  maxToasts: 5,
  newestOnTop: true,
};

app.use(pinia);
app.use(Toast, toastOptions);
app.mount("#app");
