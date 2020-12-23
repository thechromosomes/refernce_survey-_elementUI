<template>
    <v-layout wrap class="conatiner_responceform">
        <reportheader :surveyid="id" active="4"></reportheader>
        <v-flex xs12>
          <v-container class="conatiner_dashboard" v-if="surveydata != null">
            <div class="surveydetails">
              <v-layout class="surveysect">
                <v-flex xs12>
                  <div class="">Approval report</div>
                  <h2>{{surveydata.surveyname}}</h2>
                  </v-flex>
              </v-layout>
              <v-layout class="surveyressect">
                <v-flex xs12 sm6>
                  <div>Total Response : {{responselist.length}}</div>
                  <div>Average Time : {{averageresponsetime}}</div>
                  <div>First response : {{firstresponse}}</div>
                  <div>Last response : {{lastresponse}}</div>
                  <div>Active : <span v-if="surveyconfig.active == '1'">Yes</span><span v-else>No</span></div>
                  <div><v-flex xs6 d-flex>
                   <model-list-select :list="contacts"
                     v-model="listid"
                     option-value="contactid"
                     @input="contactlistid"
                     option-text="contactname"
                     placeholder="Select Contact list"></model-list-select>
                  </v-flex><v-flex xs6 d-flex>

                  <!-- <v-select :items="contacts" box v-model="listid" item-value="contactid" @change="contactlistid" item-text="contactname" label="Select Contact list"></v-select> -->
                  </v-flex></div>
                </v-flex>
                <v-flex xs12 sm6>
                  <div>Editor : <userdetailssnipt v-for="editor in surveyconfig.editor" :key="editor" utype="span_nameonly" :uid="editor"></userdetailssnipt></div>
                  <div>Reviewer : <userdetailssnipt v-for="reviewer in surveyconfig.reviewer" :key="reviewer" utype="span_nameonly" :uid="reviewer"></userdetailssnipt></div>
                <div>Created : {{createddate}}</div>
                  <div>Modified : {{modifiedddate}}</div>
                </v-flex>
              </v-layout>
              <v-layout class="surveyressect" >
                <v-flex xs12 sm6>
                  <div>
                    <span class="exportbutton" @click="getexportalllink('csv', id)">CSV Export</span>
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-container>
            <v-container class="conatiner_dashboard">
              <div class="allresponselist">
                <table class="table  table-left">
                    <tr>
                        <td>Response no.</td>
                        <td>User</td>
                        <td>Date submitted</td>
                        <template v-if="have_editorapproval">
                          <td>Approved by editor</td>
                          <td>Date Approved</td>
                        </template>
                        <template v-if="have_reviewerapproval">
                          <td>Approved by reviewer</td>
                          <td>Date Approved</td>
                        </template>
                        <template v-if="have_complete">
                          <td>Completed</td>
                          <td>Date Completed</td>
                        </template>
                        <td>Details</td>
                        <td></td>
                    </tr>
                    <tr v-for="(attempet, index) in responselist" :key="`questionid_${index}`">
                        <td>{{index+1}}</td>
                        <td v-if="attempet.anonymous">Anonymous</td>
                        <td v-else>
                          {{attempet.userdetails.firstname}} {{attempet.userdetails.lastname}} 
                        </td>
                        <td>{{getdatestring(attempet.datestarted)}}</td>
                        <template v-if="have_editorapproval">
                          <td>
                            <v-checkbox v-if="surveyconfig.editor.indexOf(currentuser) != -1 || userrole.indexOf('1') >= 0" @change="changeatemptstate(0,index)" v-model="attempet.approvededi" value="1"></v-checkbox>
                            <v-checkbox v-else v-model="attempet.approvededi" value="1" disabled></v-checkbox>
                          </td>
                          <td>
                            {{getdatestring(attempet.approvedbyedidate)}}
                          </td>
                        </template>
                        <template v-if="have_reviewerapproval">
                          <td>
                            <v-checkbox v-if="(surveyconfig.reviewer.indexOf(currentuser) != -1 && attempet.approvededi == 1) || userrole.indexOf('1') >= 0 || have_editorapproval == false" @change="changeatemptstate(1,index)" v-model="attempet.approvedrev" value="1" ></v-checkbox>
                            <v-checkbox v-else v-model="attempet.approvedrev" value="1" disabled></v-checkbox>
                          </td>
                          <td> 
                            {{getdatestring(attempet.approvedbyrevdate)}}
                          </td>
                        </template>
                        <template v-if="have_complete">
                          <td>
                            <v-checkbox  v-if="((surveyconfig.reviewer.indexOf(currentuser) != -1 || surveyconfig.editor.indexOf(currentuser) != -1) && (attempet.approvedrev == 1 && attempet.approvededi == 1))  || userrole.indexOf('1') >= 0 || (have_editorapproval == false || have_editorapproval == false)" @change="changeatemptstate(2,index)" v-model="attempet.completed" value="1" ></v-checkbox>
                            <v-checkbox v-else v-model="attempet.completed" value="1" disabled></v-checkbox>
                          </td>
                          <td> {{getdatestring(attempet.completeddate)}}</td>
                        </template>
                        <td><a :href="`/responsedetails/${attempet._id}`">details<img class ="deletequestion" src="../assets/icons/arrow-circle-left-regular.svg" /></a></td>
                        <td><v-btn class="btn-extrasmall" @click="deleteresponse(index, attempet._id)"><img class ="deletequestion" src="../assets/icons/trash-alt-light.svg" /></v-btn></td>
                    </tr>
                </table>
            </div>
            </v-container>
        </v-flex> 
    </v-layout>
</template> 
<script>
var dateFormat = require('dateformat');
import userdetailssnipt from './users/userdetailssnipt'
import reportheader from './reports/reportheader'
import { ModelListSelect } from 'vue-search-select'
var mylibrary = require("../models/mainlib.js");
var username=localStorage.username;
var userrole=localStorage.userrole;
var datetime = new Date();
import Vue from 'vue'
import axios from 'axios';
  export default {
  components: {userdetailssnipt, reportheader, ModelListSelect},
   data() {
    return {
      id:this.$route.params.id,
      currentuser:null,
      surveydata:null,
      createddate:null,
      modifiedddate:null,
      surveyconfig:null,
      responselist:[],
      userrole:[],
      contacts:[],
      allwordflow:[],
      listid:null,
      contactdata:[],
      semesterid : "null",
      averagetime : 0,
      have_editorapproval:false,
      have_reviewerapproval:false,
      have_complete:false,
    }
  },  
  methods: {
    getexportalllink(linkfor, resid){
      let loader = this.$loading.show({
          loader: 'dots'
      });
      axios.post(`/downlaodresponseuserxls`,{'surveyid':resid},{responseType: 'arraybuffer'}).then(response => {
        if(response.headers['content-type'].indexOf("application/json") >= 0){
          this.$toast.open({
              message:response.data.message,
              position:"top",
              type:"error"
            })
        } else {
          mylibrary.downloadfiles(response, "xlsx");
        }
        loader.hide();
      }).catch(e => {
        loader.hide();
        console.log("e- ", e)
      })
    },
    getdatestring(datestamp){
      if(datestamp && datestamp != 0){
        return dateFormat(datestamp, "yyyy-mm-dd ");
      } else {
        return "";
      }
    },
    deleteresponse(index, respid){
      // deletesurveyresponse
      axios.post(`/deletesurveyresponse`,{'responseid':respid}).then(response => {
        // JSON responses are automatically parsed.
        if(response.data.n==1){
            this.responselist.splice(index,1);
            this.$toast.open({
              message:"Response deleted successfully.",
              position:"top",
              type:"error"
            })
          } else {
            this.$toast.open({
              message:"Failed to delete Response.",
              position:"top",
              type:"error"
            })
          }
      })
      .catch(e => {
        this.errors.push(e)
      })
      console.log("tobe deleted");
    },
    getsurveyimage(imagepath){
        if(imagepath == "" || imagepath == null){
            return "https://source.unsplash.com/collection/4728778/1600x900/";
        } else if(imagepath.indexOf('unsplash.com') >= 0){
        return imagepath;
      } else {
            return window.publicfileurl+imagepath;
        }
    },
    contactlistid: function(){
      setTimeout(() => {
        axios.post(`/getcontactsdata`,{'listid':this.listid}).then(response => {
          this.contactdata = ["selected"];
          response.data.forEach(contactuserid => {
              if(contactuserid.userid != ""){
                this.contactdata.push(contactuserid.userid)
              }
              });
             })
           .catch(e => {
          //  this.errors.push(e)
         })
        
      }, 100);
    },
    changeatemptstate(check,index){
        var obj = this.responselist[index];
        var userid=this.currentuser;
        var attemptid = obj._id;
        console.log("check", check);
        console.log("index", index);
        console.log("obj", obj);
        var now = Date.now();
      if(check===0){
        if(obj.approvededi == "1"){
          now = "";
        }
      axios.post(`/approvebyeditor`,{'attemptid':obj._id,'status':obj.approvededi,'userid':userid}).then(response => {
        this.responselist[index].approvedbyedidate = now
        });
      }else if(check===1){
        if(obj.approvedrev == "1"){
          now = "";
        }
        axios.post(`/approvebyviewer`,{'attemptid':obj._id,'status':obj.approvedrev,'userid':userid}).then(response => {
        this.responselist[index].approvedbyrevdate = now

        }); 
      }else if(check===2){
        if(obj.completed == "1"){
          now = "";
        }
        axios.post(`/attemptcompleted`,{'attemptid':obj._id,'status':obj.completed,'userid':userid}).then(response => {
        this.responselist[index].completeddate = now

        });
      }
    }
  },
  computed:{
    firstresponse: function () {
      if(this.responselist.length > 0){
        return this.responselist[0].datestarted
      } else{
        return "No response"
      }
    },
    lastresponse: function () {
      if(this.responselist.length > 0){
        return this.responselist[this.responselist.length - 1].datestarted
      } else{
        return "No response"
      }
    },
    averageresponsetime: function () {
      return "Calculating..."
    },
    surveycreated: function () {
        if(this.surveydata.createddate != undefined){
          return "fdjglkdjgl"
          // return dateFormat(this.surveydata.createddate, "yyyy/mm/dd");
        } else {
          return "bbbbbbb";
          // return this.surveydata.createddate
        }
    },
    surveymodified: function () {
        if(this.surveydata.modifiedddate != undefined){
            return "cccccccccc";
        } else {
          return "ddddddddddd"
            // return dateFormat(datetime, "yyyy/mm/dd");
        }
    },
  },
  created() {
    // this.userrole = userrole;
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
        if(mylibrary.is_roleassigned(response.data.roles, "1")){
          this.userrole.push("1");
        }
        if(mylibrary.is_roleassigned(response.data.roles, "2")){
          this.userrole.push("2");
        }
        if(mylibrary.is_roleassigned(response.data.roles, "3")){
          this.userrole.push("3");
        }
      })
      .catch(e => {
        this.errors.push(e)
      })
      axios.post(`/getsurvey`,{'surveyid':this.id}).then(response => {
        if(response.data == null){
          this.$router.push('/')
        } else {
            this.surveydata = response.data;
            this.modifiedddate = dateFormat(this.surveydata.modifiedddate, "yyyy-mm-dd ")
            this.createddate = dateFormat(parseInt(this.surveydata.createddate), "yyyy-mm-dd ")
            axios.post(`/getallworkflow`,{'surveyid':this.id}).then(reminders => {
              const allwordflow = reminders.data;
              this.allwordflow = allwordflow;
              const have_rev = allwordflow.filter( function(item) {
                  return (item.action == "1" && item.role == "2" && item.notifyrole != "");
              });
              if(have_rev.length > 0){ this.have_reviewerapproval = true }
              const have_editor = allwordflow.filter( function(item) {
                  return (item.action == "1" && item.role == "1" && item.notifyrole != "");
              });
              if(have_editor.length > 0){ this.have_editorapproval = true }
              const have_complete = allwordflow.filter( function(item) {
                  return (item.action == "2" && item.role != "" && item.notifyrole != "");
              });
              if(have_complete.length > 0){ this.have_complete = true }

            })


        }
      })
      .catch(e => {
        this.errors.push(e)
      })
    axios.post(`/getsharedsurveytolist`,{'surveyid':this.id}).then(shareresponse => {
      this.contacts = shareresponse.data
    })
    axios.post(`/allresponselist`,{'surveyid':this.id}).then(response => {
    if(response.data == null){
        console.log();
    } else {
       var all_response = [];
       var attempttime = 0
       var attemptcount = 0
       response.data.forEach(attempdata => {
         if(attempdata.approvedrev)
         attempdata.approvedrev = attempdata.approvedrev.toString();
         if(attempdata.approvededi)
         attempdata.approvededi = attempdata.approvededi.toString();
         if(attempdata.completed)
         attempdata.completed = attempdata.completed.toString();
        this.responselist.push(attempdata)
       });    
          // = all_response;
       }
    })
      axios.post(`/getsurveyconfig`,{'surveyid':this.id}).then(response => {
        if(response.data == null){

        } else {
            this.surveyconfig = response.data.data;
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
