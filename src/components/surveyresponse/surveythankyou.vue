<template>
    <v-layout wrap class="conatiner_responceform paddingbottom50" v-if="surveydata">
        <v-flex xs12>
            <div class="surveybanner" v-if="surveyconfig != null">
              <img class="imginsheadonly" :src="getsurveyimage(surveyconfig.coverphoto)" />
              <div class="overview">
                <div class="surveydata">
                  <h1 class="surveyname">{{surveydata.surveyname}}</h1>
                </div>
              </div>
            </div>
        </v-flex>
        <v-flex xs12 v-if="thankyounotes.length > 0">
          <v-container>
            <div class="thankyounote" v-html="thankyounotes[currentnotes].description"></div>
            <v-flex class="text-center" xs12>
              <button @click="nextNotes(-1)" v-if="currentnotes != 0 && currentnotes != (thankyounotes.length - 1)" class="btn-custom1">Prev</button>
              <button @click="nextNotes(1)" v-if="(thankyounotes.length-1) > currentnotes" class="btn-custom1">Next</button>
            </v-flex>
          </v-container>

        </v-flex>
        <v-flex xs12 v-else>
          <v-container>
            <div class="thankyounote text-center">
                <h1>Thankyou for submitting "{{surveydata.surveyname}}"</h1>
            </div>
          </v-container>
        </v-flex>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
    </v-layout>
</template>
<script>
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
      surveyconfig:null,
      thankyoudata:null,
      thankyounotes:[],
      currentnotes:0,
      semesterid : "null"
    }
  },  
  methods: {
    nextNotes(seq){
      this.currentnotes += seq;
    },
    finishAttempt(){
               
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
        axios.post(`/getattemptsurvey`,{'attemptid':this.id}).then(response => {
            // console.log(response);
            if(response.data == null){
            this.$router.push('/')
            }
            if(response.data.state != 1){
                this.$router.push('/surveyresponse/'+this.id)
            }
            axios.post(`/getsurvey`,{'surveyid':response.data.surveyid}).then(response => {
            // JSON responses are automatically parsed.
                this.surveydata = response.data;
                axios.post(`/finalthankyoudata`,{'attemptid':this.id}).then(response => {
                  var tdata = response.data;
                  if(tdata.status == 1){
                    this.thankyounotes = tdata.data;
                  } else {
                    this.$toast.open({
                      type:"error",
                      position: 'top',
                      message:tdata.message,
                    });
                  }
                })

            })
            axios.post(`/getsurveyconfig`,{'surveyid':response.data.surveyid}).then(response => {
            // console.log("surveyconfig");
            // console.log(response);
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
            // axios.post(`/getwelcomethankyoudata`,{'surveyid':response.data.surveyid,datatype:'thankyoupage'}).then(response => {
            //     if(response.data == null){
            //     } else {
            //         this.thankyoudata = response.data;
            //     }
            // })
            // .catch(e => {
            //     this.errors.push(e)
            // })
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
