<template>
    <div class="textinput">
            <v-layout align-center >
            <v-text-field @blur="animatenow" :id="`answer${textinput._id}`" label="Answer" v-model="answer" class="text_input" ></v-text-field>
            </v-layout>
            <input type="hidden" v-model="questionpotres" />
    </div>
</template>
<script>
var animate = require('../../../models/cssAnimation.js');
export default {
    props:['textinput'],
    data() {
        return {
            answer: "",
            questionpotres:""
        }
    },
    methods :{
      animatenow(){
        this.validatedform(true);
      },
      validatedform(animation = false){
        if(this.textinput.required == "1" && this.answer == ""){
          this.$parent.validatedform(false);
          animate.ErrorInput("#answer"+this.textinput._id, "error");
          if(animation){
            animate.animateCSS("#answer"+this.textinput._id, "shake");
          }
        } else {
          this.$parent.validatedform(true);
          animate.ErrorInput("#answer"+this.textinput._id, "success");
        }
      },
      updateattemptanswer(){
        this.validatedform(false);
        const this_user = window.surveyuser
        const this_attempt = window.surveyattemptid
        var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
        surveyconfig = JSON.parse(surveyconfig)
        if(surveyconfig.honeypot == '1'){
          if(this.questionpotres.length > 0){
              axios.post(`/postbotresponse`,{
                  'surveyId':this.textinput.surveyid,
                  'userId':this_user._id,
                  'questionId':this.textinput._id,
                  'attemptId':this_attempt._id,
                  }).then(response => {
              }).catch(e => {})
          } else {
            axios.post(`/updateattemptanswer`,{
                'surveyid':this.textinput.surveyid,
                'userid':this_user._id,
                'questionid':this.textinput._id,
                'attemptid':this_attempt._id,
                'answer':this.answer
                }).then(response => {
            })
            .catch(e => {
                this.errors.push(e)
            })
          }
        } else {
          axios.post(`/updateattemptanswer`,{
              'surveyid':this.textinput.surveyid,
              'userid':this_user._id,
              'questionid':this.textinput._id,
              'attemptid':this_attempt._id,
              'answer':this.answer
              }).then(response => {
          })
          .catch(e => {
              this.errors.push(e)
          })
        }
      }
    },
    watch:{
      answer: function (newQuestion, oldQuestion) {
      this.debouncedupdateattemptanswer()
      // this.updateQuestion()
      }
    },
    created: function () {
    this.debouncedupdateattemptanswer = _.debounce(this.updateattemptanswer, 500)
    var this_user = window.surveyuser
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'surveyid':this.textinput.surveyid,
      'userid':this_user._id,
      'questionid':this.textinput._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.answer = JSON.parse(response.data.data.answer)
            this.validatedform()
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
.textinput {
    padding: 0px 10px 10px 10px;
}
.textinput .input-group__input{
  background-color: white !important;
    border: 1px solid #8b784a;
}
.textinput:hover{
    background-color: #ebebeb;
} 
</style>

