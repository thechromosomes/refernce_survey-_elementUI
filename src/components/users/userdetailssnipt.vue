<template>
    <span v-if="utype == 'span_nameonly' && user != null" >
      {{user.firstname}} {{user.lastname}}
    </span>
</template>
<script>
var datetime = new Date();
var username=localStorage.username;
import axios from 'axios';
  export default {
  props:['uid', 'utype'],
   data() {
    return {
      user:null,
      errors: []
    }
  },
    methods: {
    
    },
 created() {
    axios.post(`/getuserbyid`,{'userid':this.uid}).then(response => {
      this.user = response.data.user
    })
}
 
}
</script>
