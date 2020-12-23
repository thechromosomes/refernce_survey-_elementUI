<template>
<v-container>
 <div class="mailformate">
      <v-layout row wrap>
      <v-flex xs12><h2>Mail Template</h2></v-flex>
      </v-layout>
        <v-layout>
            <v-flex xs12> 
                  <v-select prepend-icon="person" :items="actions" v-model="mailfor" label="Template For" @change="changeflowdata" item-text="text" item-value="code"></v-select>
            </v-flex>
       </v-layout>
       <v-layout>
            <v-flex xs12> 
                  <v-text-field prepend-icon="person" v-model="mailsubject" label="Template Subject" type="text"></v-text-field>
            </v-flex>
       </v-layout>
       <v-layout>
            <v-flex xs12> 
              <div class="editorinput-conatiner">
                <div class="editorinput-title">Template Body: </div>
                <tinymce id="editor_formate" ref="tincyeditor"  v-model="mailbody" ></tinymce>
              </div>
            </v-flex>
       </v-layout>

        <v-layout>
          <v-btn @click='addmailformate'>Save</v-btn>
          <v-btn @click='gotolist'>Cancel</v-btn>
          </v-layout>
  </div>
 <v-layout row wrap>
 <v-flex xs12><h2> Notification Templates</h2></v-flex>
 </v-layout>
    <v-layout>
          <v-container>
            <v-card> 
              <v-card-title><v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
              <v-data-table :headers="headers" :items="mailformate" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{props.index+1}}</td>
                  <td class="text-xs-left">{{mailfiorname(props.item.mailfor)}} </td>
                  <td class="text-xs-left">{{props.item.mailsubject}} </td>
                  <td class="text-xs-left"><div v-html="props.item.mailbody"></div></td>
                </template>
              </v-data-table>
            </v-card>
          </v-container>
    </v-layout>
    
   </v-container>
</template>
<script>
var datetime = new Date();

import rolesnipt from '../snipt/rolesnipt'
var username=localStorage.username;
import axios from 'axios';
import { setTimeout } from 'timers';
var mylibrary = require("../../models/mainlib.js");
  export default {
    components: {rolesnipt},
   data() {
    return {
      currentuser:null,
        mailformate:[],
        mailfor:"",
        mailsubject:"",
        mailbody:"",

      users:[],
      search:'',
      headers: [
        {
          text: 'Slno',
          align: 'left',
          value: 'slno',
        },
        { text: 'Mail For', value: 'mailfor' },
        { text: 'Mail Subject', value: 'mailsubject' },
        { text: 'Mail Body', value: 'mailbody' }
      ],
      errors: [],
      pagination: {
        rowsPerPage: 100
      },

        actions:[
          {
            code:"1",
            text:"Share Survey to Contact list "
          },
          {
            code:"2",
            text:"Response Added "
          },
          {
            code:"3",
            text:"Response Approved "
          },
          {
            code:"4",
            text:"Response Completed "
          },
          {
            code:"5",
            text:"Survey Notification"
          },
        ],
      defaultflow:{
            surveyid:this.survey,
            action:1,
            role:"",
            notifyrole:""
        }                                          

    }
  },
    methods: {
    addmailformate(){
      if(this.mailfor != ""){
        axios.post('/addmailformate',{mailfor:this.mailfor,mailsubject:this.mailsubject,mailbody:this.mailbody})
        .then((response)=>{
          this.mailformate=response.data
            this.$toast.open({
              message:"Template Updated successfully",
              position:"top",
              type:"success"
            })
        })
        .catch((error)=>{
            this.$toast.open({
              message:"Failed to Update Template",
              position:"top",
              type:"error"
            })
        })
      }else{
        this.$toast.open({
          message:"Please specify Template for",
          position:"top",
          type:"error"
        })
      }
        this.mailfor = ""
        this.mailsubject = ""
        this.mailbody = ""
      }, 
    gotolist(){
      this.$router.push("/");
      }, 
      changeflowdata(){
        this.mailsubject = "";
        this.mailbody = "";
        setTimeout(() => {
          this.mailformate.forEach(element => {
            if(this.mailfor == element.mailfor){
              this.mailsubject = element.mailsubject
              this.mailbody = element.mailbody
              console.log(element);
            }
          });
        }, 300);
    },
    mailfiorname(mailfor){
      var retdat = "";
      this.actions.forEach(element => {
        if(element.code == mailfor){
          retdat = element.text;
          return;
        }
      });
      return retdat;
    }
    },
 created() {
  //  this.debouncedchangeflowdata = _.debounce(this.updateFlowdata, 2000)
  axios.post(`/getcurrentuser`,{'username':username}).then(response => {
    // JSON responses are automatically parsed.
    console.log(response.data);
    this.currentuser = response.data._id
    if(mylibrary.is_roleassigned(response.data.roles, "1") || mylibrary.is_roleassigned(response.data.roles, "2") || mylibrary.is_roleassigned(response.data.roles, "3")){
      console.log("have access");
    } else {
      console.log("don't have access");
      this.$router.push('/')
    }
  })

   axios.post(`/getmailformate`,{"listid":this.id})
    .then(response => {
      this.mailformate = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  
}
 
}
</script>