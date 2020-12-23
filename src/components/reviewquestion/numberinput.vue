<template>
    <div class="maskedinput">
            <v-layout align-center >
            <v-text-field disabled  label="Answer" v-model="answer" :mask="maskedinput" ></v-text-field>
            </v-layout>
    </div>
</template>
<script>
export default {
    props:['maskformat','question'],
  computed: {
    // a computed getter
    maskedinput: function () {
      // `this` points to the vm instance
      var return_str = "";
      var i = 0;
      for(i = 0; i < this.maskformat; i++){
            return_str += "#"
      }
      return return_str
    }
  },
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
      'questionid':this.question._id,
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
    })  }
}
</script>
<style scoped>
.maskedinput{
  padding: 0px 10px 10px 10px;
}
.maskedinput:hover{
  background-color: #ebebeb;

}
</style>
