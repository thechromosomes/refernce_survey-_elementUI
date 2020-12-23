// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex';
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import HighCharts from 'v-highcharts'
import axios from 'axios'
import 'vuetify/dist/vuetify.min.css'
window._ = require('lodash');
import store from './store/index'
// import VEditor from 'yimo-vue-editor'
import tinymce from 'vue-tinymce-editor'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';
import 'vue-search-select/dist/VueSearchSelect.css'
// import HoneybadgerVue from '@honeybadger-io/vue'
import { VueReCaptcha } from 'vue-recaptcha-v3'
// window.recaptch_sitekey = "6LcT878UAAAAALlVTbvAxcsuX1_8DidlN8JiBGaS";
// Vue.use(VueReCaptcha, { siteKey: '6LcT878UAAAAALlVTbvAxcsuX1_8DidlN8JiBGaS' })
import * as VueGoogleMaps from 'vue2-google-maps'
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
// Init plugin
Vue.use(Loading);
Vue.component('tinymce', tinymce)

require('vuetify/dist/vuetify.min.css')
require('animate.css/animate.css')
require('@/assets/css/main.css');

window.Bus=new Vue;
window.axios=axios;
window.token= localStorage.getItem('token');
window.user= localStorage.getItem('user');



// const Honeyconfig = {apiKey: '21cefcedede9786f8426efb272f79b2d89dff92a42d0d258bc3a39096c132838',environment: 'production',revision: 'git SHA/project version'}
// window.publicfileurl = "https://survey.gpex.org.au/public?file=";
// window.siteurl = "https://survey.gpex.org.au/";
// axios.defaults.baseURL = 'https://survey.gpex.org.au/api';
// window.gpexone = "https://one.gpex.com.au";

// const Honeyconfig = {apiKey: 'project api key',environment: 'developemnt',revision: 'git SHA/project version'}
// window.publicfileurl = "https://surveydev.gpex.org.au/public?file=";
// // window.siteurl = "https://surveydev.gpex.org.au/";
// window.siteurl = "http://localhost:8080/";
// axios.defaults.baseURL = 'https://surveydev.gpex.org.au/api';
// window.gpexone = "https://onedev3.gpex.com.au";

const Honeyconfig = {apiKey: 'project api key',environment: 'developemnt',revision: 'git SHA/project version'}
window.publicfileurl = "http://localhost:3000/public?file=";
window.siteurl = "http://localhost:8080/";
axios.defaults.baseURL = 'http://localhost:3000/api';
window.gpexone = "https://onedev3.gpex.com.au";



// Vue.use(HoneybadgerVue, Honeyconfig)

axios.defaults.headers.common['Authorization'] = "Bearer " + window.token;
axios.defaults.headers.common['x-access-token'] = window.token;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['loginuser'] = localStorage.getItem('loginuser');
Vue.use(Vuetify)
Vue.use(VueToast);
Vue.use(HighCharts,{
  colors: ['#A7226E', '#EC2049', '#F26B38', '#F7DB4F','#2F9599','#E1F5C4','#EDE574', '#  F9D423', '#FC913A', '#FF4E50']
})
Vue.use(Vuex)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBTO7xNJJcjMdwG28tVRZtAY2mLSo8cZXs',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
  installComponents: true
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
