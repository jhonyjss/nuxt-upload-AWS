import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    preLoad: 1.0,
    loading: 'https://gifimage.net/wp-content/uploads/2018/04/loading-spinner-animated-gif-10.gif',
    attempt: 1
})
