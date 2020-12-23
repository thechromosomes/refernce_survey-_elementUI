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
        <button v-if="checkmygroup(cat.allowgroups)"  @click="chnagecurrenttab(cindex1+1)" :class="`btn_totabs ${(activesurveytab == (cindex1+1))?'active':''}`"
            :key="`${cindex1}`">
            <div class="icon30">
             <img src="../assets/icons/box-check-light-white.svg"/>
              </div>
             <span>{{ cat.projectname }}</span>
        </button>
        </template>

           <button :class="`btn_totabs ${(activesurveytab == 0)?'active':''} btn_archieved`" @click="chnagecurrenttab(0)" >
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
                  label="Search"
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
      <v-tabs-items v-model="activesurveytab">
        <template v-for="(cat, cindex) in cats">
      <v-tab-item :key="`${cindex + 1}`" >
      <v-layout row wrap  class="survey_lists" v-if="activedashboard == 1">
        
        <template v-for="(survey, surveyindex)  in surveys"  >
<v-flex :key="survey._id" xs12 class="survey_list" v-if="(survey.category == cat._id) && ((searchsurvey == '' || survey.surveyname.toLowerCase().indexOf(searchsurvey.toLowerCase()) != -1)) && ((searchsemester.length > 0 && searchsemester.indexOf(survey.semester) != -1 ) ||(searchsemester.length == 0))" >
<div class="survey-image" >
  <img :src="getsurveyimage(survey.config.coverphoto)">
  <div class="overflow">
    <div class="float_name">
      <div class="icon30">
        <img  src="../assets/icons/paper-plane-light-white.svg"/>
      </div>
      <span>{{survey.surveyname}}</span>
      </div>
  </div>
</div>

<div class="survey-details">
  <div class="surveycard">
    <div class="details">
      <p>Editor: <userdetailssnipt v-for="editor in survey.config.editor" :key="editor" utype="span_nameonly" :uid="editor"></userdetailssnipt></p>
      <p>Reviewer: <userdetailssnipt v-for="reviewer in survey.config.reviewer" :key="reviewer" utype="span_nameonly" :uid="reviewer"></userdetailssnipt></p>
      <p>Created: {{survey.createddate}}</p>
      <p>Modified: {{survey.modifiedddate}}</p>
    </div>
    <div class="buttons">
      <div class="custom_badges active"  v-if="survey.config.active == '1'">
        <div class="badge_shape">
          <i class="material-icons">done</i>
        </div>
        <div class="badge_text">Active</div>
      </div>
      <div class="custom_badges" v-else> 
        <div class="badge_shape" >
          <i class="material-icons">pause</i>
        </div>
        <div class="badge_text">Active</div>
      </div>
      <div class="custom_badges active"  @click="getallresponse(survey._id)" v-if="survey.response != '0'">
        <div class="badge_shape cursor_pointer">{{survey.response}}</div>
        <div class="badge_text">Response</div>
      </div>
      <div class="custom_badges" v-else>
        <div class="badge_shape">{{survey.response}}</div>
        <div class="badge_text">Response</div>
      </div>
    </div>
  </div><!--redcard-->

  <div class="infocard">
  <ul>
  <a :href="`/builder/${survey._id}`"> <li><img src="../assets/icons/edit-light-blue.svg" class="icon15"/><span class="fontinfo">Edit</span></li></a> 
  <a @click="shareSurvey(survey._id)"> <li><img src="../assets/icons/share-alt-light-blue.svg" class="icon15"/><span class="fontinfo">Share</span></li></a>
  <a @click="duplicateSurvey(survey._id)"> <li><img src="../assets/icons/layer-plus-light-blue.svg" class="icon15"/><span class="fontinfo">Duplicate</span></li></a>
  <a :href="`/responsereport/${survey._id}`"> <li><img src="../assets/icons/file-chart-line-light-blue.svg" class="icon15"/><span class="fontinfo">Report</span></li></a>
  <a @click="deletestatus(survey._id, surveyindex)" > <li><img src="../assets/icons/archive-light-blue.svg" class="icon15"/><span class="fontinfo">Archive</span></li></a>  
  </ul>
  </div><!--infocard-->

</div>
</v-flex>
        </template>




    </v-layout>
    <v-layout row wrap  class="survey_lists " v-if="activedashboard == 0">
      <v-flex>

        <div class="allresponselist">
          <table>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>Created</td>
              <td>Modified</td>
              <td>Response</td>
              <td>Active</td>
            </tr>
            <template v-for="(survey, surveyindex)  in surveys">
              <tr v-if="(survey.category == cat._id) && (searchsurvey == '' || survey.surveyname.toLowerCase().indexOf(searchsurvey.toLowerCase()) != -1)" :key="survey._id">
                <td>{{survey.surveyname}}</td>
                <td>
                  <a :href="`/builder/${survey._id}`"> <img src="../assets/icons/edit-light-blue.svg" class="icon15"/><span class="fontinfo">Edit</span></a> 
                </td>
                <td>
    <a @click="shareSurvey(survey._id)"> <img src="../assets/icons/share-alt-light-blue.svg" class="icon15"/><span class="fontinfo">Share</span></a>

                </td>
                <td>
    <a @click="duplicateSurvey(survey._id)"> <img src="../assets/icons/layer-plus-light-blue.svg" class="icon15"/><span class="fontinfo">Duplicate</span></a>

                </td>
                <td>
    <a :href="`/responsereport/${survey._id}`"> <img src="../assets/icons/file-chart-line-light-blue.svg" class="icon15"/><span class="fontinfo">Report</span></a>

                </td>
                <td>
    <a @click="deletestatus(survey._id, surveyindex)" > <img src="../assets/icons/archive-light-blue.svg" class="icon15"/><span class="fontinfo">Archive</span></a>  
                <td>{{survey.createddate}}</td>
                <td>{{survey.modifiedddate}}</td>
                <td>{{survey.response}}</td>
                <td>
                  <span v-if="survey.config.active == '1'">Active</span>
                  <span v-else>InActive</span>
                </td>
              </tr>
            </template>
          </table>
        </div>      
      </v-flex>
    </v-layout>

</v-tab-item>
        </template>
<v-tab-item :key="0">
      <v-layout  row wrap  class="survey_lists"  v-if="activedashboard == 1">

        <template v-for="(dsurvey, dsurveyindex) in deletedsurveys" >
<v-flex xs12 class="survey_list"  :key="dsurvey._id" v-if="(searchsurvey == '' || dsurvey.surveyname.toLowerCase().indexOf(searchsurvey.toLowerCase()) != -1)">
<div class="survey-image">
  <img :src="getsurveyimage(dsurvey.config.coverphoto)">
  <div class="overflow">
    <div class="float_name">
      <div class="icon30">
        <img  src="../assets/icons/paper-plane-light-white.svg"/>
      </div>
      <span>{{dsurvey.surveyname}}</span>
      </div>
  </div>
</div>
<div class="survey-details">
  <div class="surveycard">
    <div class="details">
      <p>Editor: Name of editor</p>
      <p>Reviewer: Name of reviewer</p>
      <p>Created: {{dsurvey.createddate}}</p>
      <p>Modified: 03/05/2019</p>
    </div>
    <div class="buttons">
      <div class="custom_badges active"  v-if="dsurvey.config.active == '1'">
        <div class="badge_shape">
          <i class="material-icons">done</i>
        </div>
        <div class="badge_text">Active</div>
      </div>
      <div class="custom_badges" v-else> 
        <div class="badge_shape" >
          <i class="material-icons">pause</i>
        </div>
        <div class="badge_text">Active</div>
      </div>
      <div class="custom_badges active"  @click="getallresponse(dsurvey._id)" v-if="dsurvey.response != '0'">
        <div class="badge_shape cursor_pointer">{{dsurvey.response}}</div>
        <div class="badge_text">Response</div>
      </div>
      <div class="custom_badges" v-else>
        <div class="badge_shape">{{dsurvey.response}}</div>
        <div class="badge_text">Response</div>
      </div>
    </div>
  </div><!--redcard-->

  <div class="infocard">
  <ul>
    
<a><li @click="deleteSurvey(dsurvey._id, dsurveyindex)"><img src="../assets/icons/trash-alt-light.svg" class="icon15"/><span class="fontinfo">Delete</span></li></a>
<a><li @click="undodeleteSurvey(dsurvey._id, dsurveyindex)"><span class="fontinfo">Undo Delete</span></li></a>
</ul>
  </div><!--infocard-->
</div>

</v-flex>
</template>


    </v-layout>
    <v-layout row wrap  class="survey_lists " v-if="activedashboard == 0">
      <v-flex>

        <div class="allresponselist">
          <table>
            <tr>
              <td></td>
              <td>Created</td>
              <td>Modified</td>
              <td>Response</td>
              <td>Active</td>
              <td></td>
            </tr>
            <template v-for="dsurvey in deletedsurveys">
              <tr v-if="(searchsurvey == '' || dsurvey.surveyname.toLowerCase().indexOf(searchsurvey.toLowerCase()) != -1)" :key="dsurvey._id">
                <td>{{dsurvey.surveyname}}</td>
                <td>{{dsurvey.createddate}}</td>
                <td>{{dsurvey.modifiedddate}}</td>
                <td>{{dsurvey.response}}</td>
                <td>
                  <span v-if="dsurvey.config.active == '1'">Active</span>
                  <span v-else>InActive</span>
                </td>
                <td>
                  <a @click="deleteSurvey(dsurvey._id)"> <img src="../assets/icons/trash-alt-light.svg" class="icon15"/><span class="fontinfo">Delete</span></a>
                </td>
              </tr>
            </template>
          </table>
        </div>      
      </v-flex>
    </v-layout>

</v-tab-item>
</v-tabs-items>
    </v-flex>
      <modelduplicatesurvey @removeModel="model_modelduplicatesurvey = $event"  v-if="model_modelduplicatesurvey == true" :dialogstate="model_modelduplicatesurvey" :loginuser="currentuser" :surveyid = "duplcate_surveyid"></modelduplicatesurvey>
      <modelsharesurvey @removeModel="model_modelsharesurvey = $event"  v-if="model_modelsharesurvey == true" :dialogstate="model_modelsharesurvey" :surveyid = "share_surveyid"></modelsharesurvey>
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
import modelduplicatesurvey from './models/duplicatesurvey'
import modelsharesurvey from './models/sharesurvey'
import userdetailssnipt from './users/userdetailssnipt'
import respondentDashboard from './models/respondentDashboard'
import { log } from 'util';
var mylibrary = require("../models/mainlib.js");
  export default {
    components: {modelduplicatesurvey,modelsharesurvey,userdetailssnipt,respondentDashboard},
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
      activedashboard:1
       }
    },
    methods:{
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
      checkmygroup(groups){
        if(groups == "" || groups == null){
          return true;
        } else {
          var retdata = false;
          var allgroup = groups.split(",");
          allgroup.forEach(element => {
            if(this.mygroup.indexOf(element) >= 0){
              retdata = true;
              return;
            }
          });
          return retdata;
        }
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
      getallresponse(surveyid){
        this.$router.push('/responselist/'+surveyid);
      },
      chnagecurrenttab(index){
        this.activesurveytab = index+"";
      },
      deletestatus(surveyid,surveyindex){
        var stobedeleted = this.surveys[surveyindex];
        axios.post(`/changesurveystatus`,{'surveyid':surveyid,'delete':"1"}).then(response => {
          this.surveys.splice(surveyindex,1)
          stobedeleted.delete = "1"
          this.deletedsurveys.push(stobedeleted);
          

        });
      },
      undodeleteSurvey(surveyid,surveyindex){
        var stobedeleted = this.deletedsurveys[surveyindex];
        axios.post(`/changesurveystatus`,{'surveyid':surveyid,'delete':"0"}).then(response => {
          // location.reload();
          this.deletedsurveys.splice(surveyindex,1)
          stobedeleted.delete = "0"
          this.surveys.push(stobedeleted);
          

        });
      },
      duplicateSurvey(surveyid){
        this.model_modelduplicatesurvey = true
        this.duplcate_surveyid = surveyid
      },
      shareSurvey(surveyid){
        this.model_modelsharesurvey = true
        this.share_surveyid = surveyid
      } ,
      deleteSurvey(surveyid,surveyindex){
        axios.post(`/deletesurvey`,{'surveyid':surveyid}).then(response => {
          this.$toast.open({
            message:"Survey Deleted Successfully",
            position:"top",
            type:"success"
          })
           this.deletedsurveys.splice(surveyindex,1)
          // location.href = "/";
        });
      }        
    },
    computed: {
      binding () {
        const binding = {}

        if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

        return binding
      }
    },
    watch:{
      model_modelduplicatesurvey: function (oldaBuilderArray, newaBuilderArray) {
        return this.model_modelduplicatesurvey;
      },
      model_modelsharesurvey: function (oldaBuilderArray, newaBuilderArray) {
        return this.model_modelsharesurvey;
      },
      activesurveytab: function (new_activesurveytab, old_activesurveytab) {
        localStorage.setItem("dashboard_tab", new_activesurveytab);
        
      }
    },
    created() {
      // if(window.reload != true){
      //   window.reload = true
      //   location.reload();
      // }
      var dashboard_tab = localStorage.getItem("dashboard_tab")
      if(!dashboard_tab){
        dashboard_tab = 1
      }
      this.activesurveytab = dashboard_tab;

      // this.encodeddata = "aaaaaaaaaaaaaaaaaa"
      //   var urlparam = {
      //       email:window.btoa("neeraj@ldsengineers.com"),
      //       sid:window.btoa("5d10c274a1413d29f8e18bf6")
      //   }

      //   this.encodeddata= window.btoa(encodeURIComponent(JSON.stringify(urlparam))); 

      axios.post(`/getcurrentuser`,{'username':username}).then(response => {
        // JSON responses are automatically parsed.
        // console.log(response.data);
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
    // axios.get(`/getprojects`)
    // .then(response => {
    //   // JSON responses are automatically parsed.
    //   var allproject = response.data;
    //   allproject = allproject.sort(function(a, b){
    //     return  a.projectname.localeCompare(b.projectname);
    //   })
    //   this.cats = allproject
    // })
    // .catch(e => {
    //   this.errors.push(e)
    // }),
    axios.post(`/getsemesters`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.semesters = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
    axios.get(`/getsurveys`)
    .then(response => {
      // JSON responses are automatically parsed.
      var all_survey = [];
      response.data.forEach(survey => {

            var promis_getresponse = new Promise(function(resolve, reject) {
            axios.post(`/responsecount`,{
              'surveyid':survey._id
              }).then(response1 => {
                resolve(response1)
              })
              .catch(e => {
                resolve({
                  data:0
                })
                });
              })
              
            var promis_getconfig = new Promise(function(resolve, reject) {
              axios.post(`/getsurveyconfig`,{'surveyid':survey._id}).then(response => {
                resolve(response.data.data)
              })
            });

            Promise.all([promis_getresponse, promis_getconfig]).then(function(promisdata) {
              var active ='1';
              var deleted= '0';
              if(survey.active != undefined)
              {
                active=survey.active
              }
              if(survey.delete != undefined)
              {
                deleted=survey.delete
              }
              if(survey.createddate.indexOf("/") < 0 && survey.createddate.indexOf("-") < 0){
                survey.createddate = dateFormat(parseInt(survey.createddate), "yyyy/mm/dd");
              }
              if(deleted != '1'){
                all_survey.push({
                  _id:survey._id,
                  semester:survey.semester,
                  category:survey.category,
                  createdby:survey.createdby,
                  createddate:survey.createddate.substring(0, 10),
                  modifiedddate:dateFormat(survey.modifiedddate, "yyyy/mm/dd"),
                  active:active,
                  delete:deleted,
                  surveyname:survey.surveyname,
                  response:promisdata[0].data,
                  config:promisdata[1]
                })
              }
            }).catch(function(err) {
              console.log('error', err)
            });
            });
      this.surveys = all_survey
    })
    .catch(e => {
      this.errors.push(e)
    })
    axios.get(`/getdeletedsurveys`)
    .then(response => {
      // JSON responses are automatically parsed.
      var all_deletedsurvey = [];
      response.data.forEach(survey => {
        var promis_getresponse = new Promise(function(resolve, reject) {
            axios.post(`/responsecount`,{
              'surveyid':survey._id
              }).then(response1 => {
                resolve(response1)
              })
              .catch(e => {
                resolve({
                  data:0
                })
                });
              })
              
            var promis_getconfig = new Promise(function(resolve, reject) {
              axios.post(`/getsurveyconfig`,{'surveyid':survey._id}).then(response => {
                resolve(response.data.data)
              })
            });

            Promise.all([promis_getresponse, promis_getconfig]).then(function(promisdata) {
              var active ='1';
              var deleted= '0';
              if(survey.active != undefined)
              {
                active=survey.active
              }
              if(survey.delete != undefined)
              {
                deleted=survey.delete
              }
              if(survey.createddate.indexOf("/") < 0 && survey.createddate.indexOf("-") < 0){
                survey.createddate = dateFormat(parseInt(survey.createddate), "yyyy/mm/dd");
              }
               all_deletedsurvey.push({
                _id:survey._id,
                category:survey.category,
                semester:survey.semester,
                createdby:survey.createdby,
                createddate:survey.createddate.substring(0, 10),
                modifiedddate:dateFormat(survey.modifiedddate, "yyyy/mm/dd"),
                active:active,
                delete:deleted,
                surveyname:survey.surveyname,
                response:promisdata[0].data,
                config:promisdata[1]
              })
            }).catch(function(err) {
              console.log('error', err)
            });
      })
      this.deletedsurveys = all_deletedsurvey
    })
    .catch(e => {
      this.errors.push(e)
    })
}
  }
</script>