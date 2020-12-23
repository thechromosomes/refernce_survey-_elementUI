<template>
  <v-app>
  <gpexheader></gpexheader>
  <div>
    <v-content>
<router-view></router-view>
    </v-content>
    </div>
  </v-app>
</template>

<script>
var username=localStorage.username;
import {
  mapGetters,
  mapState,
} from 'vuex'
export default {
  data () {
    return {
      title:"Survey",
      currentuser:null,
    }
  },
  name: 'App',
  computed: {
    ...mapGetters(['isAuthenticated', 'menus']),
    ...mapState(['user']),
    name () {
      return this.user ? this.user.name : ''
    }
  },
  created(){
    axios.interceptors.response.use(undefined, function (err) {
    return new Promise(function (resolve, reject) {
      if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
        this.$store.dispatch('logout').then(()=>{
          this.$router.push('/login')
        })
      }
      throw err;
    });
  });

  },
  watch: {
    currentuser: function(olddata, newdata) {
      return this.newdata;
    }
  }

}

</script>
<script>
   import gpexheader from './components/includes/gpexheader.vue'

  export default {
    components: {
      gpexheader: gpexheader
    }
  }
</script>
