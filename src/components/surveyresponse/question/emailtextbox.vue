<template>
    <div class="emailinput">
      <v-text-field @blur="animatenow" :id="`email${question._id}`" label="Email: " v-model="answer" :rules="[rules.email]" ></v-text-field>
      <input type="hidden" v-model="questionpotres" />
    </div>
</template>
<script>
var animate = require('../../../models/cssAnimation.js');
export default {
   props:['question'],
  data () {
      return {
        questionpotres:"",
        rules: {
          required: value => !!value || 'Required.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        },
        answer: ""
      }
    },
    methods :{
      animatenow(){
        this.validatedform(true);
      },
      validatedform(animation = false){
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(this.question.required == "0"){
          if(this.answer != "" && !pattern.test(this.answer)){
            // animate.ErrorInput("#email"+this.question._id, "error");
            if(animation){
              animate.animateCSS("#email"+this.question._id, "shake");
            }
            this.$parent.validatedform(false);
          } else {
            this.$parent.validatedform(true);
            animate.ErrorInput("#email"+this.question._id, "success");
          }
        } else {
          if(this.answer == "" || !pattern.test(this.answer)){
            animate.ErrorInput("#email"+this.question._id, "error");
            if(animation){
              animate.animateCSS("#email"+this.question._id, "shake");
            }
            this.$parent.validatedform(false);
          } else {
            animate.ErrorInput("#email"+this.question._id, "success");
            this.$parent.validatedform(true);
          }
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
                  'surveyId':this.question.surveyid,
                  'userId':this_user._id,
                  'questionId':this.question._id,
                  'attemptId':this_attempt._id,
                  }).then(response => {
              }).catch(e => {})
          } else {
            axios.post(`/updateattemptanswer`,{
              'surveyid':this.question.surveyid,
              'userid':this_user._id,
              'questionid':this.question._id,
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
            'surveyid':this.question.surveyid,
            'userid':this_user._id,
            'questionid':this.question._id,
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
      this.debouncedupdateattemptanswer = _.debounce(this.updateattemptanswer, 200)
    var this_user = window.surveyuser
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'surveyid':this.question.surveyid,
      'userid':this_user._id,
      'questionid':this.question._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.answer = JSON.parse(response.data.data.answer)
          }
        }
          this.validatedform()
    })
    .catch(e => {
      this.errors.push(e)
    })  
  }
}
</script>
<style scoped>
  .emailinput{
    padding: 0px 10px 10px 10px;
    margin-top: 10px;
  }
  .emailinput:hover{
    background-color: #ebebeb;
  }
</style>
