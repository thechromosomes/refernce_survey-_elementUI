<template>
    <div class="Ranking-options">
        <template v-for="(choice, index) in choices" >
            <v-layout :id="`subanswer${choice._id}`"  v-bind:key="index" class="rating-row">
                <v-flex xs1 >
                    <v-select @change="mapdata(index)" v-model="choice.answer" class="rankselector" :items="allrank" label="" ></v-select>
                </v-flex>
                <v-flex xs11>
                    {{choice.choicetext}}
                </v-flex>
            </v-layout>
        </template>
        <input type="hidden" v-model="questionpotres" />
    </div>
</template>
<script>
var animate = require('../../../models/cssAnimation.js');
export default {
    props:['allchoice','question'],
    data() {
        return {
            choices:[],
            answer:null,
            allrank:[],
            selectedanswer:[],
            questionpotres:""
        }
    },
    methods:{
      validatedform(animation = false){
        if(this.question.required == "1"){
            this.$parent.validatedform(false);
            var validation = true;
            this.choices.forEach(element => {
                var found = this.selectedanswer.find( a => a.option === element._id );
                if(found){
                    if(found.rank == ""){
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
        mapdata(index){
            const selectedans =  event.srcElement.innerText
            const changeddata = this.choices[index]
            var ans = [];
            this.choices.forEach((choice, i) => {
                if(choice.answer == selectedans && choice._id != changeddata._id){
                    this.choices[i].answer = "";
                    choice.answer ="";
                }
                if(choice._id == changeddata._id){
                    choice.answer =selectedans;
                }
                ans.push({
                    option:choice._id,
                    rank:choice.answer
                })
            });
            this.selectedanswer = ans;
            this.validatedform(true);
            this.debouncedupdateattemptanswer();
        },
        updateattemptanswer(){
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
                        'answer':this.selectedanswer
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
                    'answer':this.selectedanswer
                    }).then(response => {
                })
                .catch(e => {
                    this.errors.push(e)
                })
            }
        },

    },
    created(){
        this.debouncedupdateattemptanswer = _.debounce(this.updateattemptanswer, 200)
        var counter = 1;
        this.allrank.push("");
        var this_user = window.surveyuser
        var this_attempt = window.surveyattemptid
        axios.post(`/getattemptanswer`,{
        'surveyid':this.question.surveyid,
        'userid':this_user._id,
        'questionid':this.question._id,
        'attemptid':this_attempt._id
        }).then(response => {
            if(response.data.status == 1){
                if(response.data.data){
                    this.selectedanswer = JSON.parse(response.data.data.answer)
                }
                this.allchoice.forEach(choice => {
                    this.allrank.push(counter);
                    counter++;
                    var found = this.selectedanswer.find( answeritem => answeritem.option == choice._id );
                    var sanswer = ""
                    if(found){
                        sanswer = parseInt(found.rank)
                    }
                    this.choices.push({
                        _id:choice._id,
                        questionid:choice.questionid,
                        choicestate:choice.choicestate,
                        choicetext:choice.choicetext,
                        answer:sanswer  
                    });
                });
                this.validatedform()
            }
        })
        .catch(e => {
            console.log("e- ", e);
            
        })

    }
}
</script>