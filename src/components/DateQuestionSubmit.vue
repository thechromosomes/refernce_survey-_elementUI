<template>
<div>
<div v-if="loading == false">
<v-container>
    <h3>Please select the project, survey, semester and question</h3>
        <div class="margin_top">
            <v-select
            :items="Project"
            label="select Project"
            item-value="_id"
            item-text="projectname"
            v-model="searchProject"
            solo>
            </v-select>
        </div>
        <div class="margin_top" v-if="semesters.length > 0">
            <v-select
                :items="semesters"
                label="Semester"
                item-value="_id"
                item-text="semesterName"
                v-model="searchsemester"
                solo>
              </v-select>
        </div>
        <div class="margin_top" v-if="finalSurvey.length > 0">
            <v-select
            :items="finalSurvey"
            label="select survey"
            item-value="_id"
            item-text="surveyname"
            v-model="searchsurvey"
            solo>
            </v-select>
        </div>
        <div class="margin_top" v-if="finalSurvey.length == 0 && survey.length > 0">
            <v-select
            :items="survey"
            label="select survey"
            item-value="_id"
            item-text="surveyname"
            v-model="searchsurvey"
            solo>
            </v-select>
        </div>
        <div class="margin_top" v-if="question.length > 0">
            <v-select
            :items="question"
            label="select question"
            item-value="_id"
            item-text="questiontext"
            v-model="searchquestion"
            solo>
            </v-select>
        </div>
         <div v-if="selectedAnswer !== null" class="margin_top">
             <h5>Question type : <span> {{selectedAnswer}} </span></h5>
        </div>
        <div class="margin_top" style="float: right;">
            <v-btn @click='addquestion'>Add Question</v-btn>
        </div>
</v-container>
</div>
<div else>
    <v-container>
         <v-dialog
        v-model="loading"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            hold on Please...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
</div>
<div class="messagebox" v-if="successmessage != ''">{{successmessage}}</div>

</div>
</template>

<script>
var username=localStorage.username;

export default {
    data(){
        return{
            survey:[],
            question:[],
            Project:[],
            semesters: [],
            errors:[],
            searchProject:null,
            lastupdated:0,
            searchsurvey:null,
            searchquestion:null,
            selectedAnswer:null,
            questionId: null,
            semester:null,
            searchsemester:null,
            finalSurvey:[],
            loading: false,
            successmessage: ""
        }
    },
    methods: {
          getallsurveys(){
            if(this.searchProject != ""){
                this.loading = true
                axios.post(`/findSurveys`,{id:this.searchProject,lastdate:this.lastupdated}).then(response => {
                    this.survey = response.data.data
                    this.loading = false
                })
                .catch(e => {
                    this.errors.push(e)
                    this.loading = false
                })
            }
        },
        getAllQuestion(){
                this.loading = true
                axios.post(`/getquestions`,{'surveyid':this.searchsurvey}).then(response => {
                this.question = response.data
                this.loading = false
            })
            .catch(e => {
                this.errors.push(e)
                this.loading = false
            })
        },
        selectedAnswerText(){
            this.question.map(element => {
                if(element._id === this.searchquestion){
                    this.questionId = element._id
                    this.selectedAnswer = element.questiontype
                }
            })
        },
        selectedSemester(){
            this.survey.map(element => {
                if(element._id === this.searchsurvey){
                    this.semester = element.semester
                }
            })
        },
        addquestion(){
            this.loading = true
            axios.post(`/datequestiontype`,{semester:this.semester,survey:this.searchsurvey, question_Id: this.questionId}).then(response => {
                    console.log("response", response)
                    this.loading = false
                    this.successmessage = response.data.message
                })
                .catch(e => {
                    this.errors.push(e)
                    this.loading = false
                    this.successmessage = response.data.message

                })
        },
        filterSemester(){
            let semesters = this.searchsemester
            let survey = this.survey
            var result = survey.filter(function(e) {
                return semesters == e.semester, e.semester == null, e.semester == "";
            });
            this.finalSurvey = result

        }
    },
    watch:{
        searchProject: function () {
            this.lastupdated=Date.now();
            this.getallsurveys();
        },
        searchsurvey: function () {
            this.getAllQuestion();
            this.selectedSemester()

        },
        searchquestion: function () {
            this.selectedAnswerText();
        },
        searchsemester: function() {
            this.filterSemester()
        },
        successmessage : function(){
            setTimeout(function(){this.successmessage = "";}, 3000);
        }
    },
created() {
    axios.post(`/getcurrentuser`,{'username':username}).then(response => {
        axios.post(`/findsurveycategory`,{'id':response.data._id}).then(response => {
            this.Project = response.data;
        })
        .catch(e => {
            this.errors.push(e)
        })
        .catch(e => {
            this.errors.push(e)
        })
     })
     // get semester entry
    axios.post(`/getsemesters`).then(response => {
        this.semesters = response.data;
    })
    .catch(e => {
        this.errors.push(e)
    })
    }
}
</script>
<style scoped>
.margin_top{
    margin-top: 10px;
}
</style>