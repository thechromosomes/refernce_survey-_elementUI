<template>
<v-container>
 <v-layout row wrap>
 <v-flex xs12><h2>Create Group</h2></v-flex>
 </v-layout>
    <v-layout> <v-text-field label="Group Name" v-model="groupname" required ></v-text-field> </v-layout>
    <v-layout>
      <v-select :items="registrars" name="registrar" label="Select a username" v-model="registrar" item-text="firstname" item-value="_id" multiple ></v-select>
    </v-layout>
    <v-layout>
      <button class="exportbutton" @click='createGroup'>Add</button>
      <button class="exportbutton" @click="clear">Cancel</button>
    </v-layout>
   <v-layout>
          <v-container>
            <v-card> 
              <v-card-title>Group list<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
              <v-data-table :headers="headers" :items="groups" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{props.index+1}}</td>
                  <td class="text-xs-left">{{props.item.groupname}} </td>
                  <td>
                  <template v-if="props.item.groupmemmbers != null && props.item.groupmemmbers != ''">
                  <userdetailssnipt v-for="member in props.item.groupmemmbers.split(',')" :key="member" utype="span_nameonly" :uid="member"></userdetailssnipt>
                  </template>
                  </td>
                  <td><a :href="`/editgroup/${props.item._id}`">edit</a></td>
                  <td><v-btn class="btn-extrasmall" @click="deletegroup(props.item._id);"><img class ="deletequestion" src="../assets/icons/trash-alt-light.svg" /></v-btn></td>
                </template>
              </v-data-table>
            </v-card>
          </v-container>
    </v-layout>


   </v-container>
</template>
<script>

import userdetailssnipt from './users/userdetailssnipt'
var username=localStorage.username;
var datetime = new Date();
var mylibrary = require("../models/mainlib.js");
import axios from 'axios';
  export default {
    components: {userdetailssnipt},
   data() {
    return {
      registrars: [],
      users:[],
      search:'',
      headers: [
        {
          text: 'Slno',
          align: 'left',
          value: 'slno',
        },
        { text: 'Group Name', value: 'groupname' },
        { text: 'Members', value: 'groupmemmbers' },
        { text: '',sortable: false, },
        { text: '',sortable: false, }
      ],
      errors: [],
      currentuser:null,
      groupname:null,
      registrar:null,

        groups: [],
        pagination: {
        rowsPerPage: 100
      }
 
    }
  },
  methods: {
    deletegroup(groupid){
        axios.post(`/deletegroup`,{'groupid':groupid}).then(response => {
          if(response.data.n==1){
            this.getgroups()  
            this.$toast.open({
              message:"Group deleted successfully",
              position:"top",
              type:"success"
            })
            // this.groups.splice(ele_index,1);
          } else {
            this.$toast.open({
              message:"Failed to delete group",
              position:"top",
              type:"error"
            })
          }
        }).catch(e => {
            this.$toast.open({
              message:"Failed to delete group",
              position:"top",
              type:"error"
            })
        })   
    },
    createGroup(){
        var errormessage = "";
        if(!this.groupname){
          errormessage = "Group name required";
        }
        if(this.registrar.length <=0){
          errormessage += "Atleast one user is required";
        }
        if(errormessage.length > 0){
          this.$toast.open({
            message:errormessage,
            position:"top",
            type:"error"
          })
          return;
        }
        axios.post('/creategroup',{groupname:this.groupname,members:this.registrar,createdby:this.currentuser,createddate:datetime})
    .then(response => {
          this.getgroups()  
          this.$toast.open({
            message:"Group created successfully",
            position:"top",
            type:"success"
          })
    })
    .catch(e => {
            this.$toast.open({
              message:"Failed to create group",
              position:"top",
              type:"error"
            })
    })
        
      },
       clear () {
        this.projectname = ''
        this.groups = null,
        this.$router.push('/');
      },
      getgroups(){
        axios.get(`/getgroups`)
        .then(response => {
          // JSON responses are automatically parsed.
          this.groups = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })        
      }
    },
 created() {
    axios.post(`/getcurrentuser`,{'username':username})
    .then(response => {
      // JSON responses are automatically parsed.
      this.currentuser = response.data._id
      if(mylibrary.is_roleassigned(response.data.roles, "1")){
        console.log("have access");
      } else {
        console.log("don't have access");
        this.$router.push('/')
      }
    })
    .catch(e => {
      this.errors.push(e)
    })
    axios.get(`/getusers`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.registrars = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
      this.getgroups()  
  }

}
</script>