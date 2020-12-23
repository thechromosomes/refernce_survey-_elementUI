<template>
<v-container>
  <div class="edituserform" v-if="edituser != null">
      <v-layout row wrap>
      <v-flex xs12><h2>Edit User</h2></v-flex>
      </v-layout>
        <v-layout>
          <v-text-field v-model="edituser.firstname" label="First Name" required></v-text-field>
          </v-layout> 
      <v-layout>
          <v-text-field v-model="edituser.lastname" label="Last Name" required></v-text-field>
      </v-layout>
      <v-layout>
          <v-text-field v-model="edituser.email" label="Email" required></v-text-field>
      </v-layout>
      <v-layout>
          <v-select
  :items="roles"
  name="role"
  v-model="edituser.role"
  label="Select Role"
  item-value="_id"
  item-text="roletitle"
  multiple
  ></v-select>
      </v-layout>
        <br/>
        <br/>
        <v-layout>
          <v-btn @click='updateUsers'>Update</v-btn>
          <v-btn @click='cancleUpdateUser'>Cancel</v-btn>
          </v-layout>
  </div>
  <div class="edituserform" v-else>
    <h1>Loading...</h1>
  </div>

  </v-container>
</template>
<script>
var datetime = new Date();
var username=localStorage.username;
var mylibrary = require("../../models/mainlib.js");
import axios from 'axios';
import { log } from 'util';

export default {
   data() {
    return {
      id:this.$route.params.id,     
      currentuser:null,
      edituser:null,
      errors: [],
      roles:[]
    }
  },
    methods: {
      updateUsers(){
       axios.post(`/updateUser`,{'user':this.edituser}).then(response => {
        if(response.data == null){
        } else {
          this.$router.push('/userlist/')
        }
      })
         
      }, 
      cancleUpdateUser(){
        this.$router.push('/userlist/')
      }
    },

 created() {
  axios.post(`/getcurrentuser`,{'username':username}).then(response => {
    // JSON responses are automatically parsed.
    console.log(response.data);
    this.currentuser = response.data._id
    if(mylibrary.is_roleassigned(response.data.roles, "1")){
      console.log("have access");
    } else {
      console.log("don't have access");
      this.$router.push('/')
    }
  })
    axios.get(`/getroles`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.roles = response.data
      axios.post(`/getuserbyid`,{'userid':this.id}).then(response => {
          if(response.data == null){
            this.$router.push('/userlist/')
            } else {
              if(response.data.user.role == undefined){
                response.data.user.role = "";
              }
              response.data.user.role=response.data.user.role.split(",");
              this.edituser=response.data.user
              var newroles = []
              response.data.user.role.forEach(role => {
                var found = this.roles.find( role1 => role1._id === role );
                if(found){
                  newroles.push(role);
                }
                
              });
              this.edituser.role = newroles;
            }
    })
    })
    .catch(e => {
      this.errors.push(e)
    })


}

}
</script>