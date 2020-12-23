<template>
    <span v-if="rtype == 'span_nameonly' && role != null" >
      {{role.roletitle}}
    </span>
</template>
<script>
import axios from 'axios';
  export default {
  props:['rid', 'rtype'],
   data() {
    return {
      role:null,
      errors: []
    }
  },
    methods: {
    
    },
 created() {
    axios.post(`/getrolebyid`,{'roleid':this.rid}).then(response => {
      this.role = response.data
    })
}
 
}
</script>
