
<template>
  <div :id="`answer${question._id}`">
    <v-radio-group v-model="answer" @change="updateattemptanswer" >
        <div v-for="(choice, index) in question.choice" v-bind:key="index">
            <v-container class="radiobutton">
                <v-radio 
                :key="qno"
                :label="choice.choicetext"
                :value="choice._id"
            ></v-radio>
            </v-container>
        </div>
    </v-radio-group>
    <div class="singlechoicecheck" v-if="question.other">
      <v-checkbox v-if="question.othertext != ''" v-model="extrafield" :label="question.othertext" ></v-checkbox>
      <v-checkbox v-else v-model="extrafield" :label="`Other, please specify`" ></v-checkbox>
    </div>
    <div class="extraoption" v-if="extrafield">
      <v-text-field  label="Please Specify" v-model="otheranswer" ></v-text-field>
    </div>
    <input type="hidden" v-model="questionpotres" />
  </div>
</template>
<script>
var animate = require('../../../models/cssAnimation.js');
export default {
    props:['question', 'ansno','qno'],
    data() {
        return {
            choicetext1:this.choicetext,
            ansno1:this.ansno,
            qno1:this.qno,
            answer:"",
            extrafield:false,
            otheranswer:"",
            questionpotres:""
        }
    },
    methods :{
      animatenow(){
        this.validatedform(true);
      },
      validatedform(animation = false){
        if(this.question.required == "1" && (this.answer.length == 0 && this.otheranswer.length == 0)){
          this.$parent.validatedform(false);
          animate.ErrorInput("#answer"+this.question._id, "error");
          if(animation){
            animate.animateCSS("#answer"+this.question._id, "shake");
          }
        } else {
          this.$parent.validatedform(true);
          animate.ErrorInput("#answer"+this.question._id, "success");
        }
      },
      updateattemptanswer(){
        this.animatenow();
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
                'answer':this.answer,
                'otheranswer':this.otheranswer
                }).then(response => {
                  var this_attempt = window.surveyattemptid
                  var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
                  surveyconfig = JSON.parse(surveyconfig)
                  if(surveyconfig.skipnext == '1'){
                    this.$parent.answersubmitted();
                  }
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
              'answer':this.answer,
              'otheranswer':this.otheranswer
              }).then(response => {
                var this_attempt = window.surveyattemptid
                var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
                surveyconfig = JSON.parse(surveyconfig)
                if(surveyconfig.skipnext == '1'){
                  this.$parent.answersubmitted();
                }
          })
          .catch(e => {
            console.log(e);
              // this.errors.push(e)
          })
        }
      },
      updateattemptanswerother(){
        this.animatenow();
        const this_user = window.surveyuser
        const this_attempt = window.surveyattemptid
        axios.post(`/updateattemptanswerother`,{
          'surveyid':this.question.surveyid,
          'userid':this_user._id,
          'questionid':this.question._id,
          'attemptid':this_attempt._id,
          'answer':this.answer,
          'otheranswer':this.otheranswer
          }).then(response => {
        })
        .catch(e => {
          this.errors.push(e)
        })
      },
    },
    watch:{
      answer: function (newQuestion, oldQuestion) {
      if (this.answer != "") {
        // this.debouncedupdateattemptanswer()
          this.extrafield  = false,
          this.otheranswer = ""          
      }
      // this.updateQuestion()
      },
      extrafield: function (newextrafield, oldextrafield) {
        if(this.extrafield){
          this.answer = "";
          this.otheranswer = " " 
        } else {
          this.extrafield  = false,
          this.otheranswer = "" 
        }
        this.debouncedupdateattemptanswerother()         
      },
      otheranswer: function (newotheranswer, oldotheranswer) {
        if(this.extrafield){
          this.answer = "";
          this.debouncedupdateattemptanswerother()

        }
      }
    },
    created: function () {
    this.debouncedupdateattemptanswer = _.debounce(this.updateattemptanswer, 200)
    this.debouncedupdateattemptanswerother = _.debounce(this.updateattemptanswerother, 200)
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
            if(response.data.data.otheranswer){
              this.extrafield = true;
            }
            this.otheranswer = response.data.data.otheranswer
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
.radiobutton{
    padding: 5px !important;
}
.radiobutton:hover{
    background-color: #ebebeb;
}
.singlechoicecheck{
  padding-left: 5px;
}
.extraoption {
    padding: 0px 15px;
}
</style>
