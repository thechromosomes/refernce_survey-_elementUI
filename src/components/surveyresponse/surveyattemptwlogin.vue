<template>
    <v-layout wrap class="conatiner_responceform paddingbottom50" v-if="surveydata != null && surveyconfig != null">
        <v-flex xs12 v-if="surveyconfig != null">
            <div class="surveybanner" v-if="surveyconfig != null">
              <img class="imginsheadonly" :src="getsurveyimage(surveyconfig.coverphoto)" />
              <div class="overview">
                <div class="surveydata">
                  <h1 class="surveyname">{{surveydata.surveyname}}</h1>
                </div>
              </div>
            </div>
        </v-flex>
        <v-flex  v-if="surveyconfig.active == '1'">
          <v-flex xs12 v-if="welcomenotes.length > 0">
            <v-container>
              <div class="welcomenotes" v-html="welcomenotes[currentnotes].description"></div>
            </v-container>
          </v-flex>
          <v-flex class="text-center" xs12>
            <button @click="nextNotes(-1)" v-if="currentnotes != 0" class="btn-custom1">Prev</button>
            <button @click="nextNotes(1)" v-if="(welcomenotes.length-1) > currentnotes" class="btn-custom1">Next</button>
            <button @click="startNewattempt" v-else class="btn-custom1">Start Now</button>
          </v-flex>
        </v-flex>
        <v-flex class="text-center" v-else>
          <h2>Survey is not Active</h2>            
        </v-flex>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

    </v-layout>
</template>
<script>
var username=localStorage.username;
var datetime = new Date();
import Vue from 'vue'
import axios from 'axios';
  export default {
  components: {},
   data() {
    return {
      id:this.$route.params.id,
      currentuser:null,
      surveydata:null,
      currentnotes:0,
      surveyconfig:null,
      welcomenotes:[],
      semesterid : "null"
    }
  },  
  methods: {
    startNewattempt(){
        var stepuser = localStorage.getItem("attemptuserid");
        if(stepuser){
          this.currentuser = stepuser;
        }
        axios.post(`/attemptsurvey`,{'surveyid':this.id,'userid':this.currentuser,'semesterid':this.semesterid}).then(response => {
            // console.log(response.data);
            window.surveyattemptid = response.data.data
            localStorage.setItem("attemptuserid", "");
            this.$router.push('/surveyresponse/'+response.data.data._id)
        })        
    },
    nextNotes(seq){
      this.currentnotes += seq;
    },
    getsurveyimage(imagepath){
        if(imagepath == "" || imagepath == null){
            return "https://source.unsplash.com/collection/4728778/1600x900/";
        } else if(imagepath.indexOf('unsplash.com') >= 0){
          return imagepath;
        } else {
            return window.publicfileurl+imagepath;
        }
    }
  },
  created() {
    if(this.id == "" || this.id == undefined){
      this.$router.push('/')
    } else {
      axios.post(`/getcurrentuser`,{'username':username}).then(response => {
        // JSON responses are automatically parsed.
        if(response.data == null){
          this.$router.push('/')
        }
        window.surveyuser = response.data;
        this.currentuser = response.data._id;
      })
      .catch(e => {
        this.errors.push(e)
      })
      axios.post(`/getsurvey`,{'surveyid':this.id}).then(response => {
        if(response.data == null){
          this.$router.push('/')
        } else {
            this.surveydata = response.data;
        }
      }) 
      .catch(e => {
        this.errors.push(e)
      })
      axios.post(`/getsurveyconfig`,{'surveyid':this.id}).then(response => {
        if(response.data == null){
          } else {
            this.surveyconfig = response.data.data;
            axios.post(`/getallwelcomethankyoudata`,{'surveyid':this.id,datatype:'welcomepage'}).then(response => {
              // console.log(response.data);
              if(response.data == null){
                // console.log("null");
                  if(this.surveyconfig.active == 1){
                    this.startNewattempt();
                  }
              } else {
                if(response.data.length <=0 ){
                // console.log("0");
                  if(this.surveyconfig.active == 1){
                    this.startNewattempt();
                  }
                } else {
                  // console.log("have data");
                  this.welcomenotes = response.data;
                }
              }
            })
        }
      })
      .catch(e => {
        this.errors.push(e)
      }) 
    }
    
  },
  watch: {
      surveyconfig :function(newdata, olddata){
          return newdata;
      }
    // whenever question changes, this function will run
  }
}
</script>
<style scoped>

</style>
