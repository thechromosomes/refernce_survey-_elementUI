<template>
    <div class="padding20">
        <v-layout  row wrap  class="survey_lists"  v-if="activedashboard == 1">
            <template v-for="(dsurvey, dsurveyindex) in deletedsurveys" >
                <v-flex xs12 class="survey_list"  :key="dsurvey._id" v-if="(searchsurvey == '' || dsurvey.surveyname.toLowerCase().indexOf(searchsurvey.toLowerCase()) != -1)">
                    <div class="survey-image">
                        <img :src="getsurveyimage(dsurvey.surveyConfig.coverphoto)">
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
                            <div class="custom_badges active"  v-if="dsurvey.surveyConfig.active == '1'">
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
                        </div>
                        <div class="infocard">
                            <ul>
                            <a><li @click="deleteSurvey(dsurvey._id, dsurveyindex)"><img src="../assets/icons/trash-alt-light.svg" class="icon15"/><span class="fontinfo">Delete</span></li></a>
                            <a><li @click="undodeleteSurvey(dsurvey._id, dsurveyindex)"><span class="fontinfo">Undo Delete</span></li></a>
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
                    <span v-if="dsurvey.surveyConfig.active == '1'">Active</span>
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
        <div class="centerprogress">
            <v-progress-circular v-if="isloading == true" indeterminate size="50"></v-progress-circular>
        </div>
    </div>

</template>
<script>
var dateFormat = require('dateformat');

var username=localStorage.username;
var userrole=localStorage.userrole;
var dashboard_tab=localStorage.dashboard_tab;
var mylibrary = require("../models/mainlib.js");
export default {
    props:{
        searchsurvey:{
            default:"aaaaaaaaaaaaaaa"
        },
        activedashboard:{
            default:1
        },
        searchsemester:{
            default:"1"
        }
    },
    data(){
        return {
            isloading:true,
            havemoredata:true,
            deletedsurveys:[],
            haveaccess:null,
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
        undodeleteSurvey(surveyid,surveyindex){
            var stobedeleted = this.deletedsurveys[surveyindex];
            axios.post(`/changesurveystatus`,{'surveyid':surveyid,'delete':"0"}).then(response => {
                // location.reload();
                this.deletedsurveys.splice(surveyindex,1)
                stobedeleted.delete = "0"
            });
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
            axios.post(`/getdeletedsurveys`,{lastdate:this.lastupdated}).then(response => {
                    this.isloading=false
                if(response.data.data.length > 0){
                    this.havemoredata=true
                    this.lastupdated = response.data.data[(response.data.data.length)-1].modifiedddate;
                    this.deletedsurveys = this.deletedsurveys.concat(response.data.data);
                }
            })
            .catch(e => {
                this.isloading=true
                console.log("erroe- ", e)
            })
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
                this.getallsurveys();
            }
        }     
    },
    watch:{
    },
    created() {
        this.lastupdated=Date.now();
        this.getallsurveys();

    },
    beforeMount () {
        window.addEventListener('scroll', this.handleScroll);
    }
}
</script>