<template>
    <v-layout align-center>
        <textarea class="xs12textarea" disabled v-model="answer" rows="8"></textarea>
    </v-layout>
</template>
<script>  
export default {
  props:['textinput'],
    data() {
        return {
            answer: ""
        }
    },
    methods :{
    },
    watch:{
    },
    created: function () {
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.textinput._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.answer = JSON.parse(response.data.data.answer)
          }
        }
    })
    .catch(e => {
      this.errors.push(e)
    })
  }

}
</script>
<style scoped>
.xs12textarea{
  margin: 10px 0px;
}
</style>

