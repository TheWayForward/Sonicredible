import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import installElementPlus from "./plugins/element";
import "./assets/css/icon.css";
import VueCodemirror from "vue-codemirror";

const app = createApp(App)
installElementPlus(app)
app
    .use(store)
    .use(router)
    .use(VueCodemirror, {
        // optional default global options
        autofocus: true,
        disabled: false,
        indentWithTab: true,
        tabSize: 2,
        placeholder: 'Code goes here...',
        // ...
    })
    .mount('#app')