<template>
    <div class="multitextinput">
            <div v-for="(textinput, index) in question.choice" v-bind:key="index" class="textinput">
                <v-layout align-center >
                    <v-text-field class="subanswer" @blur="animatenow" :id="`subanswer${textinput._id}`"  v-if="textinput.choicetext != ''" :value="setoldanswer(textinput._id)" @input="getanswer" :label="textinput.choicetext"  :key="textinput._id" :data-id="textinput._id" ></v-text-field>
                    <v-text-field class="subanswer" @blur="animatenow" :id="`subanswer${textinput._id}`" v-if="textinput.choicetext == ''" :value="setoldanswer(textinput._id)" @input="getanswer" label="Answer"  :key="textinput._id" :data-id="textinput._id"  ></v-text-field>
                </v-layout>
            </div>
            <input type="hidden" v-model="questionpotres" />
    </div>
</template>
<script>
var animate = require('../../../models/cssAnimation.js');
import question from './question'
export default {
    components: {question},
    props:['alltextinput','question'],
    data() {
        return {
            allinput:this.alltextinput,
            questionno:this.qno,
            answer:[],
            questionpotres:""
        }
    },
    methods: {
      animatenow(){
        this.validatedform(true);
      },
      validatedform(animation = false){
        if(this.question.required == "1"){
            this.$parent.validatedform(false);
            var validation = true;
            this.question.choice.forEach(element => {
                var found = this.answer.find( a => a.id === element._id );
                if(found){
                    if(found.answer == ""){
                        this.$parent.validatedform(false);
                        validation = false
                        animate.ErrorInput("#subanswer"+element._id, "error");
                        if(animation){
                            animate.animateCSS("#subanswer"+element._id, "shake");
                        }
                    } else {
                        animate.ErrorInput("#subanswer"+element._id, "success");
                    }
                } else {
                    validation = false
                    animate.ErrorInput("#subanswer"+element._id, "error");
                    if(animation){
                        animate.animateCSS("#subanswer"+element._id, "shake");
                    }
                }
            });
            if(validation){
                this.$parent.validatedform(true);
            }
        } else {
          this.$parent.validatedform(true);
          animate.ErrorInput(".subanswer", "success");
        }
      },
        getanswer(newtext){
            var isfound = 0;
            var allans = this.answer;
            allans.forEach((element, index) => {
                if(element.id == event.target.dataset.id){
                    isfound = 1;
                    this.answer[index].answer = newtext
                }                
            });
            if(isfound == 0){
                this.answer.push({
                    id:event.target.dataset.id,
                    answer:newtext
                })
            }
            this.debouncedupdateattemptanswer()
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
        },
        setoldanswer(questionid){
            var retdata = "";
            this.answer.forEach(function(ans) {
                if(ans.id == questionid){
                    retdata = ans.answer;
                }
            });
            return retdata;
        }
    },
    watch:{
    //   answer: function (newQuestion, oldQuestion) {
      
    //   // this.updateQuestion()
    //   }
    },
    created: function () {
    this.debouncedupdateattemptanswer = _.debounce(this.updateattemptanswer, 500)
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
.multitextinput .textinput{
    padding: 0px 10px 10px 10px;
    margin-bottom: 15px;
}
.multitextinput .textinput:hover{
    background-color: #ebebeb;

}
</style>

