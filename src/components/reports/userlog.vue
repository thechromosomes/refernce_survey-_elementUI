<template>
    <v-layout wrap class="conatiner_responceform">
        <v-flex xs12>
            <v-container class="conatiner_dashboard" >
              <v-layout class="surveyressect" >
                <v-flex sm3>
                    <model-list-select :list="allprojects" class="sharedata"
                    v-model="selproject"
                    option-value="_id"
                    @input="getallsurvey"
                    option-text="projectname"
                    placeholder="Select Project"></model-list-select>
                </v-flex>
                <v-flex sm3>
                    <model-list-select :list="allsurvey" class="sharedata"
                    v-model="selsurvey"
                    option-value="_id"
                    option-text="surveyname"
                    placeholder="Select Survey"></model-list-select>
                </v-flex>
                <v-flex sm3>
                    <model-list-select :list="allusers" class="sharedata"
                    v-model="user"
                    option-value="_id"
                    option-text="email"
                    placeholder="User"></model-list-select>
                </v-flex>
                <v-flex sm3>
                    <model-list-select :list="actions" class="sharedata"
                    v-model="action"
                    option-value="code"
                    option-text="text"
                    placeholder="Action"></model-list-select>
                </v-flex>
              </v-layout>
              <v-layout class="surveyressect" >
                <v-flex sm12>
                    <button class="exportbutton" @click='getuserlogs'>Filter</button>
                    <button class="exportbutton" @click='clearfilter'>Reset</button>
                    <button class="exportbutton" v-if="alllogs.length > 0" @click='downloadCSV'>Download CSV</button>
                </v-flex>
              </v-layout>
            </v-container>
        </v-flex>
        <v-flex xs12>
            <v-container class="conatiner_dashboard" >
                <v-card> 
                    <v-card-title>Sent mail Report<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
                    <v-data-table :headers="headers" :items="alllogs" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                        <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{props.item.surveyname}} </td>
                        <td class="text-xs-left">{{props.item.username}} </td>
                        <td class="text-xs-left">{{props.item.email}} </td>
                        <td class="text-xs-left">{{props.item.action}} </td>
                        <td class="text-xs-left">{{props.item.module}} </td>
                        <td class="text-xs-left">{{props.item.api}} </td>
                        <td class="text-xs-left">{{props.item.date}} </td>
                        <td class="text-xs-left"></td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-container>
        </v-flex>
    </v-layout>
</template> 
<script>
import { ModelListSelect } from 'vue-search-select'

var username=localStorage.username;
var datetime = new Date();
const dateFormat = require('dateformat');
var mylibrary = require("../../models/mainlib.js");
export default {
  components:{ModelListSelect},
    data() {
        return {
            selproject:"",
            selsurvey:"",
            action:[],
            user:[],
            startdate:"",
            enddate:"",
            search:'',
            headers: [
                { text: 'Survey', value: 'surveyname' },
                { text: 'User name', value: 'username' },
                { text: 'User email', value: 'email' },
                { text: 'Action', value: 'action' },
                { text: 'Module', value: 'module' },
                { text: 'API', value: 'api' },
                { text: 'Date', value: 'createddate' },
                { text: '', value:'date', sortable: false },
            ],
            pagination: {
                rowsPerPage: 100,
                descending:true,
                sortBy:'createddate'
            },
            alllogs :[],
            allprojects :[],
            allusers :[],
            allsurvey :[],
            actions:[
                { code:"get", text:"Get" },
                { code:"add", text:"Add" },
                { code:"update", text:"Update" },
                { code:"delete", text:"Delete" },
                { code:"login", text:"Login" },
                { code:"logout", text:"Logout" }
            ],
        }
    },  
    methods: {
        downloadCSV(){
            var headers = {
                surveyname:"Survey name",
                username:"User name",
                email:"Email",
                action:"Action",
                module:"Module",
                api:"API",
                date:"Date"
            };
            var finalarray = [];  
            this.alllogs.forEach(element => {
                finalarray.push({
                    surveyname:element.surveyname,
                    username:element.username,
                    email:element.email,
                    action:element.action,
                    module:element.module,
                    api:element.api,
                    date:element.date,
                });
            });
            this.exportCSVFile(headers, finalarray, "Logreport_"+Date.now()+".csv");
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
        getuserlogs(){
            axios.post(`/getuserlogs`,{surveyid:this.selsurvey, action:this.action, users:this.user}).then(response => {
                this.alllogs = response.data
            })
            .catch(e => {
                this.$toast.open({
                    message:"Failed to fetch log",
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
        exportCSVFile(headers, items, fileTitle) {
            if (headers) {
                items.unshift(headers);
            }
            var objArray = JSON.stringify(items);
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var csv = '';
            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','
                    line += array[i][index];
                }
                csv += line + '\r\n';
            }
            var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
        
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, exportedFilenmae);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", exportedFilenmae);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        },
        clearfilter(){
            this.selproject = ""
            this.selsurvey = ""
            this.action = []
            this.user = []
            this.getuserlogs();
        }
    },
    created() {
        axios.get(`/getprojects`).then(response => {
            this.allprojects = response.data
        }).catch(e => {
            console.log(e);
        })
        axios.get(`/getusers`).then(response => {
            this.allusers = response.data
        }).catch(e => {
            console.log(e);
        })
    },
    watch: {
    },
    computed: {
    }
}
</script>

