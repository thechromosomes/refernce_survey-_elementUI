<template>
    <v-container class="responceform" id="responceform" >
        <div class="questionblock">
            <displayheading :sectiondata="question" v-if="question.questiontype === 'sectionheading'"></displayheading>
            <v-divider v-else-if="question.questiontype === 'pagebreak'"></v-divider>
            <div class="descriptionbox" v-else-if="question.questiontype == 'descriptionbox'">
            <v-layout>
                <v-flex xs1  class="finalquestionindex">
                </v-flex>
                <v-flex xs11 questionbox>
                <div v-html="question.description"></div>
                </v-flex>
            </v-layout>
            </div>
            <finalqestion @contactinfochnaged="contactinfochnaged" :ciChangecount="ciChangecount" :questiondata="question" :qno="qno" v-else-if="question.questiontext !== '' || question.questiontype == 'qtypeslider'" ></finalqestion>
        </div>
    </v-container>
</template>
<script>
import finalqestion from './question/finalquestion'
import displayheading from './question/sectionheading'
  export default {
    props:['question', 'qno', "ciChangecount"],
    components: {finalqestion,displayheading},
    data() {
        return {
            currentquestion:this.question,
            messagebox:"",
        }
    },  
    methods: {
        contactinfochnaged(){
            this.$emit("contactinfochnaged", null);
        },
        answersubmitted(){
            this.$parent.answersubmitted();
        },
        finishSurvey(){
        this.messagebox = "Submitted"
        this.debouncedclearmsg()
        },
        clearmsg(){
        this.messagebox = ""
        },
        validatedform(status){
            // console.log("from mobileview- ", status);
            this.$parent.validatedform(status);
        }
    },
    created() {
        this.debouncedclearmsg = _.debounce(this.clearmsg, 2000)
        if(this.question.questiontype == 'descriptionbox'){
            this.$parent.validatedform(true);
        }
    },
    watch: {
        // whenever question changes, this function will run
        currentquestion:function(olddata, newdata){
            // console.log("changed");

            return this.currentquestion
        },
        question:function(olddata, newdata){
            this.currentquestion = this.question
            return this.question
        }
    }
}
</script>
