<template>
    <div class="padding20">
        <v-layout row wrap  class="survey_lists" v-if="activedashboard == 1">
            <template v-for="(survey, surveyindex)  in surveys"  >
                <v-flex :key="`surveyid${surveyindex+''+survey._id}`" xs12 class="survey_list" >
                    <div class="survey-image" >
                        <img :src="getsurveyimage(survey.surveyConfig.coverphoto)">
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
                            <p>Editor: 
                                <template v-for="(ed, i) in survey.surveyConfig.editorToJson">
                                    <span :key="`ed${ed._id}`">{{ed.firstname}} {{ed.lastname}}</span><template v-if="i< (survey.surveyConfig.editorToJson.length - 1)">, </template>
                                </template></p>
                            <p>Reviewer: <template v-for="(ed, i) in survey.surveyConfig.reviewerToJson">
                                    <span :key="`ed${ed._id}`">{{ed.firstname}} {{ed.lastname}}</span><template v-if="i< (survey.surveyConfig.editorToJson.length - 1)">, </template>
                                </template></p>
                            <p>Created: {{formateddate(survey.createddate)}}</p>
                            <p>Modified: {{formateddate(survey.modifiedddate)}}</p>
                            </div>
                            <div class="buttons">
                            <div class="custom_badges active"  v-if="survey.surveyConfig.active == '1'">
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
                        </div>

                        <div class="infocard">
                        <ul>
                        <a :href="`/builder/${survey._id}`"> <li><img src="../assets/icons/edit-light-blue.svg" class="icon15"/><span class="fontinfo">Edit</span></li></a> 
                        <a @click="shareSurvey(survey._id)"> <li><img src="../assets/icons/share-alt-light-blue.svg" class="icon15"/><span class="fontinfo">Share</span></li></a>
                        <a @click="duplicateSurvey(survey._id)"> <li><img src="../assets/icons/layer-plus-light-blue.svg" class="icon15"/><span class="fontinfo">Duplicate</span></li></a>
                        <a :href="`/responsereport/${survey._id}`"> <li><img src="../assets/icons/file-chart-line-light-blue.svg" class="icon15"/><span class="fontinfo">Report</span></li></a>
                        <a @click="deletestatus(survey._id, surveyindex)" > <li><img src="../assets/icons/archive-light-blue.svg" class="icon15"/><span class="fontinfo">Archive</span></li></a>  
                        </ul>
                        </div>
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
                <tr :key="survey._id">
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
                    <td>{{formateddate(survey.createddate)}}</td>
                    <td>{{formateddate(survey.modifiedddate)}}</td>
                    <td>{{survey.response}}</td>
                    <td>
                    <span v-if="survey.surveyConfig.active == '1'">Active</span>
                    <span v-else>InActive</span>
                    </td>
                </tr>
                </template>
            </table>
            </div>      
        </v-flex>
        </v-layout>
        <div class="centerprogress">
            <v-progress-circular v-if="isloading == true" indeterminate size="50"></v-progress-circular>
        </div>
        <modelduplicatesurvey @removeModel="model_modelduplicatesurvey = $event"  v-if="model_modelduplicatesurvey == true" :dialogstate="model_modelduplicatesurvey" :loginuser="currentuser" :surveyid = "duplcate_surveyid"></modelduplicatesurvey>
        <modelsharesurvey @removeModel="model_modelsharesurvey = $event"  v-if="model_modelsharesurvey == true" :dialogstate="model_modelsharesurvey" :surveyid = "share_surveyid"></modelsharesurvey>

    </div>
    
</template>
<script>
var dateFormat = require('dateformat');

var username=localStorage.username;
var userrole=localStorage.userrole;
var dashboard_tab=localStorage.dashboard_tab;
import modelduplicatesurvey from './models/duplicatesurvey'
import modelsharesurvey from './models/sharesurvey'
var mylibrary = require("../models/mainlib.js");
export default {
    props:{
        searchsurvey:{
            default:""
        },
        project:{
            default:""
        },
        activedashboard:{
            default:1
        },
        searchsemester:{
            default:[]
        },
        currentuser:{
            default:""
        },
    },
    components: {modelduplicatesurvey,modelsharesurvey},
    data(){
        return {
            isloading:true,
            havemoredata:true,
            surveys:[],
            haveaccess:null,
            model_modelduplicatesurvey : false,
            model_modelsharesurvey : false,
            share_surveyid : "",
            duplcate_surveyid: "",
            lastupdated:0
        }
    },
    methods:{
        getsurveyimage(imagepath){
            if(imagepath == "" || imagepath == null){
                return "https://source.unsplash.com/collection/4728778/1600x900/";
            } else if(imagepath.indexOf('unsplash.com') >= 0){
            return imagepath;
            }  else {
                return window.publicfileurl+imagepath;
            }
        },
        bottomVisible() {
            const scrollY = window.scrollY
            const visible = document.documentElement.clientHeight
            const pageHeight = document.documentElement.scrollHeight
            const bottomOfPage = visible + scrollY >= pageHeight
            return bottomOfPage || pageHeight < visible
        },
        handleScroll(){
            if(this.bottomVisible() && this.havemoredata){
                this.debouncedgetallsurveys();
            }
        },
        getallresponse(surveyid){
            this.$router.push('/responselist/'+surveyid);
        },
        formateddate(data){
            if(typeof(data) == "string"){
                if(data.indexOf("/") >= 0 || data.indexOf("-") >= 0){
                    return data.substring(0, 10);
                } else {
                    data = parseInt(data);
                    return dateFormat(data, "yyyy/mm/dd")
                }
            } else {
                return dateFormat(data, "yyyy/mm/dd")
            }
        },
        deletestatus(surveyid,surveyindex){
            var stobedeleted = this.surveys[surveyindex];
            axios.post(`/changesurveystatus`,{'surveyid':surveyid,'delete':"1"}).then(response => {
            this.surveys.splice(surveyindex,1)
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
        },
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
        },
        getallsurveys(){
            this.isloading=true
            this.havemoredata=false
            axios.post(`/searchallSurveys`,{lastdate:this.lastupdated, surveyname:this.searchsurvey, semester:this.searchsemester}).then(response => {
                this.isloading=false
                if(response.data.data.length > 0){
                    this.havemoredata=true
                    this.lastupdated = response.data.data[(response.data.data.length)-1].modifiedddate;
                    // this.debouncedgetnewsurvey();
                    this.surveys = this.surveys.concat(response.data.data);
                }
            })
            .catch(e => {
                this.isloading=false
                console.log("err",e);
            })
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
        },
        searchsemester: function (new_activesurveytab, old_activesurveytab) {
            this.lastupdated=Date.now();
            this.surveys=[];
            this.debouncedgetallsurveys();
        },
        searchsurvey: function (new_activesurveytab, old_activesurveytab) {
            this.lastupdated=Date.now();
            this.surveys=[];
            this.debouncedgetallsurveys();
        }
    },
    created(){
        this.lastupdated=Date.now();
        this.debouncedgetallsurveys = _.debounce(this.getallsurveys, 2000)
        this.getallsurveys();

    },
    beforeMount () {
        window.addEventListener('scroll', this.handleScroll);
    },
}
</script>