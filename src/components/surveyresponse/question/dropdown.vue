<template>
  <div>
    <div class="dropdown-btn">
        <v-flex xs12 sm4>
          <v-select :id="`answer${question._id}`" :items="choices" @change="debouncedupdateattemptanswer"
          outline
          label="Select" v-model="answer" item-text="choicetext" 
            item-value="_id" ></v-select>
        </v-flex>
    </div>
    <div v-if="question.other" class="checkin">
      <v-checkbox v-if="question.othertext != ''" v-model="extrafield" :label="question.othertext" ></v-checkbox>
      <v-checkbox v-else v-model="extrafield" :label="`Other, please specify`" ></v-checkbox>
    </div>
    <div class="extraoption" v-if="extrafield">
      <v-text-field :id="`answer1${question._id}`"  label="Please Specify" v-model="otheranswer" ></v-text-field>
    </div>
    <input type="hidden" v-model="questionpotres" />
  </div>
</template>
<script>
var animate = require('../../../models/cssAnimation.js');
export default {
    props:['allchoice','question'],
    data() {
        return {
          questionpotres:"",
            choices:this.allchoice,
            answer: null,
            extrafield:false,
            otheranswer:""
        }
    },
    methods :{
      animatenow(){
        this.validatedform(true);
      },
      validatedform(animation = false){
        if(this.question.required == "1" && (this.answer.length == 0 && this.otheranswer.length == 0)){
          this.$parent.validatedform(false);
          if(this.extrafield){
            animate.ErrorInput("#answer"+this.question._id, "success");
            animate.ErrorInput("#answer1"+this.question._id, "error");
            if(animation){
              animate.animateCSS("#answer1"+this.question._id, "shake");
            }
          } else {
            animate.ErrorInput("#answer1"+this.question._id, "success");
            animate.ErrorInput("#answer"+this.question._id, "error");
            if(animation){
              animate.animateCSS("#answer"+this.question._id, "shake");
            }
          }
        } else {
          this.$parent.validatedform(true);
          animate.ErrorInput("#answer"+this.question._id, "success");
          animate.ErrorInput("#answer1"+this.question._id, "success");
        }
      },
      updateattemptanswer(){
        this.validatedform()
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
              this.errors.push(e)
          })
        }
      },
      updateattemptanswerother(){
        this.validatedform()
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
          }
        } else {
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
        }
      },
    },
    watch:{
      answer: function (newQuestion, oldQuestion) {
        if (this.answer.length != 0) {
          // this.debouncedupdateattemptanswer()
            this.extrafield  = false,
            this.otheranswer = ""          
        }
      },
      extrafield: function (newextrafield, oldextrafield) {
        this.validatedform()
        if(this.extrafield){
          this.answer = "";
          this.otheranswer = " "          
        } else {
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
            this.validatedform();
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
.dropdown-btn {
  padding: 10px;
}
</style>

     