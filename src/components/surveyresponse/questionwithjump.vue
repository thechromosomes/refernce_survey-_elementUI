<template>
    <v-container class="responceform" id="responceform" >
        <div class="questionblock">
            <displayheading :sectiondata="question.data" v-if="question.data.questiontype === 'sectionheading'"></displayheading>
            <v-divider v-else-if="question.data.questiontype === 'pagebreak'"></v-divider>
            <div class="descriptionbox" v-else-if="question.data.questiontype == 'descriptionbox'">
            <v-layout>
                <v-flex xs1  class="finalquestionindex">
                </v-flex>
                <v-flex xs11 questionbox>
                <div v-html="question.data.description"></div>
                </v-flex>
            </v-layout>
            </div>
            <finalqestion :questiondata="question" :qno="qno"></finalqestion>
        </div>
    </v-container>
</template>
<script>
import finalqestion from './question/finalquestion'
import displayheading from './question/sectionheading'
  export default {
    props:['question', 'qno'],
    components: {finalqestion,displayheading},
    data() {
        return {
            currentquestion:this.question,
            messagebox:"",
        }
    },  
    methods: {
        finishSurvey(){
        this.messagebox = "Submitted"
        this.debouncedclearmsg()
        },
        clearmsg(){
        this.messagebox = ""
        },
    },
    created() {
        this.debouncedclearmsg = _.debounce(this.clearmsg, 2000)
    },
    watch: {
        // whenever question changes, this function will run
        currentquestion:function(olddata, newdata){
            console.log("changed");

            return this.currentquestion
        },
        question:function(olddata, newdata){
            this.currentquestion = this.question
            return this.question
        },
    }
}
</script>
