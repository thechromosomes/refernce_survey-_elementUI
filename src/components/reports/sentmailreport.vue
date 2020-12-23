<template>
    <v-layout wrap class="conatiner_responceform">
        <v-flex xs12>
            <v-container class="conatiner_dashboard" >
              <v-layout class="surveyressect" >
                <v-flex sm4>
                    <model-list-select :list="allprojects" class="sharedata"
                    v-model="selproject"
                    option-value="_id"
                    @input="getallsurvey"
                    option-text="projectname"
                    placeholder="Select Project"></model-list-select>
                </v-flex>
                <v-flex sm4>
                    <model-list-select :list="allsurvey" class="sharedata"
                    v-model="selsurvey"
                    option-value="_id"
                    @input="getallsurvey"
                    option-text="surveyname"
                    placeholder="Select Survey"></model-list-select>
                </v-flex>
                <v-flex sm4>
                    <model-list-select :list="actions" class="sharedata"
                    v-model="seltype"
                    option-value="code"
                    @input="getallsurvey"
                    option-text="text"
                    placeholder="Mail for"></model-list-select>
                </v-flex>
              </v-layout>
              <v-layout class="surveyressect" >
                <v-flex sm12>
                    <button class="exportbutton" @click='getsentmails'>Filter</button>
                    <button class="exportbutton" @click='clearfilter'>Reset</button>
                </v-flex>
              </v-layout>
            </v-container>
        </v-flex>
        <v-flex xs12>
            <v-container class="conatiner_dashboard" >
                <v-card> 
                    <v-card-title>Sent mail Report<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
                    <v-data-table :headers="headers" :items="allmails" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                        <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{props.index+1}}</td>
                        <td class="text-xs-left">{{props.item.surveyname}} </td>
                        <td class="text-xs-left">{{props.item.username}} </td>
                        <td class="text-xs-left">{{props.item.toemail}} </td>
                        <td class="text-xs-left">{{notifyfor(props.item.notificationfor)}} </td>
                        <td class="text-xs-left">{{datetostring(props.item.createddate)}} </td>
                        <td class="text-xs-left"><button @click="popupmaildetails(props.item)" class="exportbutton">Details</button></td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-container>
        </v-flex>
        <singleMailData @removeModel="model_modelviewdetails = false" v-if="model_modelviewdetails == true" :data = "selmail"></singleMailData>
    </v-layout>
</template> 
<script>
var username=localStorage.username;
var datetime = new Date();
const dateFormat = require('dateformat');
import { ModelListSelect } from 'vue-search-select'
import singleMailData from './singleMailData'
export default {
    components:{ModelListSelect, singleMailData},
    data() {
        return {
            model_modelviewdetails:false,
            selproject:"",
            selsurvey:"",
            seltype:"",
            selmail:null,
            search:'',
            pagination: {
                rowsPerPage: 100,
                descending:true,
                SortBy:'createddate'
            },
            headers: [
                { text: 'Slno', sortable: false },
                { text: 'Survey', value: 'surveyname' },
                { text: 'User name', value: 'username' },
                { text: 'User email', value: 'toemail' },
                { text: 'Mail for', value: 'notificationfor' },
                { text: 'Date', value: 'createddate' },
                { text: '', sortable: false },
            ],
            allmails :[],
            allprojects :[],
            allsurvey :[],
            actions:[
                { code:"1", text:"Share Survey to Contact list " },
                { code:"2", text:"Response Added " },
                { code:"3", text:"Response Approved " },
                { code:"4", text:"Response Completed " },
                { code:"5", text:"Survey Notification" },
            ],

            showModal: false    
        }
    },  
    methods: {
        popupmaildetails(mail){
            this.model_modelviewdetails = true
            this.selmail = mail

        },
        getmaildetails(mailid){
            this.showModal = true
            this.$router.push('/maildetails/'+mailid);

        },
        datetostring(datetime){
            return dateFormat(datetime,"yyyy/mm/dd hh:MM:ss TT")
        },
        notifyfor(type){
            var found = this.actions.find( a => a.code == type );
            if(found){
                return found.text
            }
            return "";
        },
        getsentmails(){
            axios.post(`/getsentreminder`,{surveyid:this.selsurvey, remtype:this.seltype}).then(response => {
                this.allmails = response.data
            })
            .catch(e => {
                this.$toast.open({
                    message:"Failed to fetch Sent mails",
                    position:"top",
                    type:"error"
                })

            })
        },
        getallsurvey(){
            this.allsurvey = [];
            if(this.selproject){
                axios.post(`/getallsurveys`,{projectid:this.selproject}).then(response => {
                    this.allsurvey = response.data
                })
                .catch(e => {
                    this.$toast.open({
                        message:"Failed to fetch Sent mails",
                        position:"top",
                        type:"error"
                    })
    
                })
            }
        },
        clearfilter(){
            this.selproject = ""
            this.selsurvey = ""
            this.seltype = ""
            this.getsentmails();
        }
    },
    created() {
        axios.get(`/getprojects`).then(response => {
            this.allprojects = response.data
        }).catch(e => {
            console.log(e);
        })
        this.getsentmails()
    },
    watch: {
    },
    computed: {
    }
}
</script>
