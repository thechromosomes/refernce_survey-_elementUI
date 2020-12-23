<template>
 <v-container grid-list-xl  class="conatiner_dashboard" v-if="haveaccess === 1">
   <v-layout>
     <v-flex xs12 sm3 :class="`dashboard-sidebar ${displaysidebar}`">
           <button class="exportbutton floatdashboardbtn" @click="togglesidebar()"><i class="fa fa-bars"></i></button>
      <v-flex xs12 text-xs-left class="dashboard-sidebar-flex">
        <v-card text-right class="cardsddprotitle">
          <a href="addproject" class="btn_totabs">
            <div class="icon30 blueback">
              <img  src="../assets/icons/folder-plus-light-white.svg"/>
            </div>
             Add a Project
          </a>
          <a href="createsurvey"  class="btn_totabs">
            <div class="icon30 blueback">
              <img  src="../assets/icons/poll-h-light-white.svg"/>
            </div>
            Create a Survey
          </a>

        </v-card>
      </v-flex>
      <v-flex xs12 text-xs-left>

        <div class="cardsddprotitle side_projectlist">
          <div class="card-header">Projects</div>
          <template v-for="(cat, cindex1) in cats" >
        <button @click="getsurveylist(cat)" :class="`btn_totabs ${(cat._id == (selectedlistid))?'active':''}`"
            :key="`${cindex1}`">
            <div class="icon30">
             <img src="../assets/icons/box-check-light-white.svg"/>
              </div>
             <span>{{ cat.projectname }}</span>
        </button>
        </template>

           <button :class="`btn_totabs ${(activesurveytab == 0)?'active':''} btn_archieved`" @click="chnagecurrenttab()" >
            <div class="icon30">
             <img src="../assets/icons/box-check-light-white.svg"/>
              </div>
            Archived
        </button>
        </div>
      </v-flex>
     </v-flex>
      <v-flex xs12 sm9>
          <v-layout row wrap stickeytop survey_search>
            <v-flex md4>
              <v-select
                :items="semesters"
                label="Semester"
                item-value="_id"  item-text="semesterName"
                v-model="searchsemester"
                multiple
                solo>
              </v-select>
            </v-flex>

            <v-flex md5>
                <v-text-field
                v-model="searchsurvey"
                  label="Search..."
                  solo>
                </v-text-field>
            </v-flex>
            <v-flex md3>
              <div class="customtab_container">
                <span v-if="activedashboard == 0" @click="activeView(0)" class="custom_toogletab active">List View </span>
                <span v-else class="custom_toogletab" @click="activeView(0)">List View </span>
                <span v-if="activedashboard == 1"  @click="activeView(1)" class="custom_toogletab active">Cover View</span>
                <span v-else class="custom_toogletab" @click="activeView(1)">Cover View</span>
              </div>
            </v-flex>
          </v-layout>
          <searchsurveylist v-if="getdeleted == false && (searchsemester.length > 0 || searchsurvey.length > 0)"  :searchsemester = "searchsemester" :currentuser="currentuser" :activedashboard="activedashboard" :searchsurvey="searchsurvey"></searchsurveylist>
          <deletedsurvey v-else-if="getdeleted == true" :searchsemester = "searchsemester" :currentuser="currentuser" :activedashboard="activedashboard" :searchsurvey="searchsurvey"></deletedsurvey>
          <surveylist v-else-if="selectedlistid != null && getdeleted == false"  :searchsemester = "searchsemester" :currentuser="currentuser" :activedashboard="activedashboard" :searchsurvey="searchsurvey" :project="selectedlistid"></surveylist>
    </v-flex>
   </v-layout>
  </v-container>
  <v-container v-else-if="haveaccess === 0">
    <v-flex xs12 text-center>
      <h1>Respondent Dashboard</h1>
      <respondentDashboard :userdate="userData"></respondentDashboard>
    </v-flex>
  </v-container>
  <v-container v-else>
    <v-flex xs12 text-center>
      <h1>Loading...</h1>
    </v-flex>
  </v-container>
</template>


<script>
var dateFormat = require('dateformat');

var username=localStorage.username;
var userrole=localStorage.userrole;
var dashboard_tab=localStorage.dashboard_tab;
import respondentDashboard from './models/respondentDashboard'
import deletedsurvey from './deletedsurvey'
import surveylist from './surveylist'
import searchsurveylist from './searchsurveylist'
import { log } from 'util';
var mylibrary = require("../models/mainlib.js");
  export default {
    components: {respondentDashboard, surveylist, deletedsurvey, searchsurveylist},
     data(){
       return {
      semesters: [],
      cats: [],
      displaysidebar:"",
      surveys:[],
      encodeddata:"dfgfdgdf",
      mygroup:[],
      deletedsurveys:[],
      activesurveytab:"1",
      searchsemester:[],
      userData:null,
      searchsurvey:"",
      model_modelduplicatesurvey : false,
      model_modelsharesurvey : false,
      share_surveyid : "",
      duplcate_surveyid: "",
      currentuser:"",
      role:0,
      haveaccess:null,
      activedashboard:1,
      selectedlistid:null,
      getdeleted:false,
       }
    },
    methods:{
      getsurveylist(cat){
        this.selectedlistid = cat._id;
        this.getdeleted = false;
        localStorage.setItem("dashboard_project", cat._id);
      },
      chnagecurrenttab(){
        this.selectedlistid = null;
        this.getdeleted = true;
      },
      togglesidebar(){
        if(this.displaysidebar.length){
          this.displaysidebar = ""
        } else {
          this.displaysidebar = "active"
        }
      },
      activeView(active){
        this.activedashboard = active;
      },
    },
    computed: {
    },
    watch:{
    },
    created() {
       // get semester entry
        axios.post(`/getsemesters`).then(response => {
            this.semesters = response.data;
        })
        .catch(e => {
          this.errors.push(e)
        })
      var dashboard_project = localStorage.getItem("dashboard_project")
      axios.post(`/getcurrentuser`,{'username':username}).then(response => {
        this.currentuser = response.data._id
        this.userData =response.data;
        if(mylibrary.is_roleassigned(response.data.roles, "1") || mylibrary.is_roleassigned(response.data.roles, "2") || mylibrary.is_roleassigned(response.data.roles, "3")){
          this.haveaccess = 1;
        } else {
          this.haveaccess = 0
        }
        axios.post(`/getusergroup`,{'userid':response.data._id}).then(response => {
          // this.mygroup = response.data;
          response.data.forEach(element => {
            this.mygroup.push(element._id);
          });
          // alert(mylibrary.is_siteadmin());
        })
        .catch(e => {
          this.errors.push(e)
        })
        axios.post(`/findsurveycategory`,{'id':response.data._id}).then(response => {
          var allproject = response.data;
          allproject.sort(function(a, b){
            return  a.projectname.localeCompare(b.projectname);
          })
          this.cats = allproject
          if(!dashboard_project){
            dashboard_project = allproject[0]._id
          }
          this.selectedlistid = dashboard_project
          this.getdeleted = false;
        })
        .catch(e => {
          this.errors.push(e)
        })
        // alert(mylibrary.is_siteadmin());
      })
      .catch(e => {
        console.log(e);
        this.errors.push(e)
      })
      this.role = userrole
    }
  }
</script>