<template>
    <v-container class="checkboxtop" :id="`answer${question._id}`">
        <div class="checkin" v-for="(choice, index) in question.choice" v-bind:key="index">
            <v-checkbox v-model="answer" :label="choice.choicetext" :value="choice._id" ></v-checkbox>
        </div>
        <div v-if="question.other" class="checkin">
          <v-checkbox v-if="question.othertext != ''" v-model="extrafield" :label="question.othertext" ></v-checkbox>
          <v-checkbox v-else v-model="extrafield" :label="`Other, please specify`" ></v-checkbox>
        </div>
        <div class="extraoption" v-if="extrafield">
          <v-text-field  label="Please Specify" v-model="otheranswer" ></v-text-field>
        </div>
        <input type="hidden" v-model="questionpotres" />
    </v-container>
</template>
<script>
var animate = require('../../../models/cssAnimation.js');
export default {
    props:['question'],
    data() {
        return {
            choicetexts:this.choicetext,
            answer:[],
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
        // console.log("questionpotres- ", this.questionpotres)
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
            })
            .catch(e => {
                this.errors.push(e)
            })

          }
      },
      updateattemptanswerother(){
        this.animatenow();
        const this_user = window.surveyuser
        const this_attempt = window.surveyattemptid
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
      },
    },
    watch:{
      answer: function (newQuestion, oldQuestion) {
        this.debouncedupdateattemptanswer()
        // if (this.answer.length != 0) {
        //     this.extrafield  = false,
        //     this.otheranswer = ""          
        // }
      },
      extrafield: function (newextrafield, oldextrafield) {
        if(this.extrafield){
          // this.answer = [];
          this.otheranswer = " " 
        } else {
          this.otheranswer = "" 
          this.debouncedupdateattemptanswerother()         
        }
      },
      otheranswer: function (newotheranswer, oldotheranswer) {
        if(this.extrafield){
          // this.answer = [];
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
<style>
.checkboxtop{
  padding-left: unset !important;
}
.checkboxtop .checkin {
    padding: 5px !important;
}
.checkboxtop .checkbox{
    top: unset !important;
}
.checkboxtop .checkin:hover{
    background-color: #ebebeb;
}
</style>
