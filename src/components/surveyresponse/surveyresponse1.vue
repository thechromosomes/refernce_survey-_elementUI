<template>
    <v-layout wrap class="conatiner_responceform">
      <div class="messagebox" v-if="messagebox != ''">{{messagebox}}</div>
        <v-flex xs12>
          <div class="surveybanner" v-if="surveyconfig != null">
            <img class="imginsheadonly" :src="getsurveyimage(surveyconfig.coverphoto)" />
            <div class="overview">
              <div class="surveydata" @click="getprogress" v-if="surveyconfig.display != '0'">
                <h1 class="surveyname">{{surveydata.surveyname}}</h1>
                    <div class="progress_timeline " v-html="progressdata">
                    </div> 
              </div>
              <div class="surveydata new_placement_cover" @click="getprogress" v-else>
                <h1 class="surveyname">{{surveydata.surveyname}}</h1>
                    <div class="progress_timeline " v-html="progressdata">
                    </div> 
              </div>
              
            </div>
          </div>
        </v-flex>
        <v-container class="responceform" id="responceform">
          <div class="questionblock">
            {{currentqdata}}
              <questionwithjump v-if="currentqdata != null" :question="currentqdata" :qno="0"></questionwithjump>
          </div>
        </v-container>
    </v-layout>
</template>
<script>
var username=localStorage.username;
var datetime = new Date();
import Vue from 'vue'
import axios from 'axios';
import finalqestion from './question/finalquestion'
import displayheading from './question/sectionheading'
import mobileresponse from './mobileresponse'
import questionwithjump from './questionwithjump'

  export default {
  components: {finalqestion,displayheading,mobileresponse,questionwithjump},
   data() {
    return {
      id:null,
      attemptid:this.$route.params.id,
      semesterid:"staticsemesterid",
      currentuser:"0",
      builderarray : [],
      prevquestion:-1,
      currentquestion:0,
      nextquestion:1,
      currentquestiondata:null,
      messagebox:"",
      surveyconfig : null,
      surveydata : null,
      progressdata : "",
      prevq:null,
      currentq:0,
      currentqdata:null,
      nextq:null,
      cuerrentjump:null,
      questionflow:[]
    }
  },  
  methods: {
    finishSurvey(){
      this.messagebox = "Submitted"
      this.debouncedclearmsg()
      axios.post(`/finishattempt`,{'attemptid':this.attemptid}).then(response => {
        this.$router.push('/surveythankyou/'+this.attemptid)
      }) 
    },
    clearmsg(){
      this.messagebox = ""
    },
    changequestion(changeto){
      this.currentquestion = changeto;
      this.prevquestion = changeto - 1;
      this.currentquestiondata = this.builderarray[changeto];
      this.nextquestion = changeto + 1;
    },
    getsurveyimage(imagepath){
        if(imagepath == "" || imagepath == null){
            return "https://source.unsplash.com/collection/4728778/1600x900/";
        } else if(imagepath.indexOf('unsplash.com') >= 0){
          return imagepath;
        }  else {
            return window.publicfileurl+imagepath;
        }
    },
    //   getquestionno(index){
    //   var qno = 0;
    //   for (let i = 0; i < this.builderarray.length; i++) {
    //     if(i >= index){
    //       break;
    //     }
    //     var queselement = this.builderarray[i];
    //     if(queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox'){

    //     } else if(queselement.questiontext != ""){
    //       qno+=1;
    //     } else {
    //     }
    //   }
    //   return qno;
    // },
    totalquestion(){
      var totalquestion = 0;
      for (let i = 0; i < this.builderarray.length; i++) {
        var queselement = this.builderarray[i];
        if(queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox'){

        } else if(queselement.questiontext != ""){
          totalquestion+=1;
        } else {
        }
      }
      return totalquestion;
    },
    getprogress(){
      var totalques = this.totalquestion();
        axios.post(`/totalattempt`,{'attemptid':this.attemptid}).then(response => {
          var answered  = response.data
          window.at_total = totalques
          window.at_attempted = totalques
          this.progressdata = '<div class="progress-bar_timeline" style="position: absolute; top: 0px; width: '+(answered / totalques)*100+'%;"></div><span class="sr-only_timeline spcll " style="font-weight: 500;"> '+answered +' out of '+totalques+' completed </span>';
        });
    },
    // getprogress_interval(){
    //   console.log("interval");
    // }
  },
  created() {
    this.debouncedclearmsg = _.debounce(this.clearmsg, 2000)
    this.debouncedgetprogress = _.debounce(this.getprogress, 500)
    if(this.attemptid == "" || this.attemptid == undefined){
      this.$router.push('/')
    } else {
      axios.post(`/getattemptsurvey`,{'attemptid':this.attemptid}).then(response => {
        console.log(response);
        if(response.data == null){
          this.$router.push('/')
        }
          if(response.data.state == 1){

            this.$router.push('/surveythankyou/'+this.attemptid)
          }
          window.surveyattemptid = response.data
          this.id = response.data.surveyid
          axios.post(`/getsurvey`,{'surveyid':response.data.surveyid}).then(response => {
          // JSON responses are automatically parsed.
          this.surveydata = response.data;
        })
        axios.post(`/getsurveyconfig`,{'surveyid':this.id}).then(response => {
          console.log("surveyconfig");
          console.log(response);
        if(response.data == null){
        } else {
            this.surveyconfig = response.data.data;
            if(this.surveyconfig.active != "1" ){
              this.$router.push('/swtl/'+this.id);
            }
        }
      })
      .catch(e => {
        this.errors.push(e)
      })
        this.currentuser = response.data.userid
        axios.post(`/getuserbyid`,{'userid':this.currentuser}).then(response => {
          console.log(response)
          // JSON responses are automatically parsed.
          if(response.data.status == 0){
            window.surveyuser = {
              '_id': this.currentuser,
            }
            // this.currentuser = "nologin"
          } else{
            window.surveyuser = response.data.user;
            this.currentuser = response.data.user._id
          }
          axios.post(`/getquestions`,{'surveyid':this.id}).then(response => {
            this.builderarray = response.data
            this.currentquestiondata = this.builderarray[this.currentquestion]
            this.currentqdata = this.builderarray[this.currentq]
              console.log("loop finish");
          })
          .catch(e => {
            this.errors.push(e)
          })
        })
      })
      .catch(e => {
        this.errors.push(e)
      })
      this.debouncedgetprogress();
    }
  },
  watch: {
    // whenever question changes, this function will run
    currentquestiondata :function(olddata, newdata){
      
      return this.currentquestiondata;
    },
    currentquestion :function(olddata, newdata){
      this.debouncedgetprogress();
      return this.currentquestion;
    }
  }
}
</script>
<style scoped>
.responceform .finalquestionimage{
    width: 100%;
}
.responceform .finalquestionimage img{
    max-width: 100%;
}
.responceform .emailinput .layout{
    padding: 0px 10px !important;
}
</style>
