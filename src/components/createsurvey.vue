<template>
<v-container>
 <v-layout row wrap>
   <v-flex xs12><h2>Add Survey</h2></v-flex>
 </v-layout>
  <v-layout>
    <v-text-field v-model="surveyname" label="Survey Name" required ></v-text-field>
  </v-layout>
  <v-layout>
    <v-select :items="projects" name="project" label="Select a Project" v-model="project"  item-value="_id" item-text="projectname" ></v-select>
  </v-layout>
  <v-layout>
    <v-select :items="allsemesters" label="Select Semester" v-model="semester" item-value="_id"  item-text="semesterName" ></v-select>
  </v-layout>
  <v-layout>
    <v-btn @click='createSurvey'>Add</v-btn>
    <v-btn @click='clear'>Cancel</v-btn>
  </v-layout>
</v-container>
</template>
<script>
var datetime = new Date();
var username=localStorage.username;
import axios from 'axios';
  export default {
   data() {
    return {
      currentuser:null,
      projects:[],
      project:null,
      surveyname:null,
      allsemesters: [],
      semester:null,
      errors: []
    }
  },
    methods: {
      createSurvey(){
        var errormessage = "";
        if(!this.surveyname){
          errormessage = "Survey name required";
        }
        if(!this.project){
          errormessage += " Project required";
        }
        if(errormessage.length > 0){
          this.$toast.open({
            message:errormessage,
            position:"top",
            type:"error"
          })
          return;
        }
        axios.post('/createsurvey',{surveyname:this.surveyname,category:this.project,semester:this.semester,createdby:this.currentuser,createddate:datetime})
    .then(response => {
      // JSON responses are automatically parsed.
      if(response.data.code == 200){
        this.$router.push('/builder/'+response.data.data._id);
      } else {
        this.$toast.open({
            message:response.message,
            position:"top",
            type:"error"
        })
      }
    })
    .catch(e => {
        this.$toast.open({
            message:"Failed",
            position:"top",
            type:"error"
        })
    })
        
      },
       clear () {
        this.surveyname = ''
        this.project = null,
        this.$router.push('/');
      }
    },
 created() {
  //  // get semester entry
  //         axios.post(`/getsemesterentry`).then(response => {
  //         response.data.semester.forEach(element => {
  //           this.semesters.push(element.semester);
  //         });
  //         // alert();
  //       })
  //       .catch(e => {
  //         this.errors.push(e)
  //       })
    axios.post(`/getcurrentuser`,{'username':username})
    .then(response => {
      // JSON responses are automatically parsed.
      this.currentuser = response.data._id
    })
    .catch(e => {
      this.errors.push(e)
    }),
    axios.get(`/getprojects`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.projects = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
    axios.post(`/getsemesters`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.allsemesters = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
}

}
</script>