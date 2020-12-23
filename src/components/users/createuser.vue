<template>
<v-container>
  <div class="edituserform">
      <v-layout row wrap>
      <v-flex xs12><h2>Create User</h2></v-flex>
      </v-layout>
        <v-layout>
            <v-flex>
                  <v-text-field prepend-icon="person" v-model="fname" label="First Name" type="text"></v-text-field>
                  <v-text-field prepend-icon="person" v-model="lname" label="Last Name" type="text"></v-text-field>
                  <v-text-field prepend-icon="person" v-model="username" label="Username" type="text"></v-text-field>
                  <v-text-field prepend-icon="email" v-model="email" label="Email" type="email"></v-text-field>
            <v-select
            prepend-icon="person" 
    :items="roles"
    name="role"
    multiple
    v-model="role"
    label="Select Role"
    item-value="_id"
    item-text="roletitle"
    ></v-select>

            </v-flex>
      </v-layout>

        <v-layout>
          <v-btn @click='createUser'>Create</v-btn>
          <v-btn @click='cancleCreateUser'>Cancel</v-btn>
          </v-layout>
  </div>
  </v-container>
</template>
<script>
var datetime = new Date();
var username=localStorage.username;
var mylibrary = require("../../models/mainlib.js");
import axios from 'axios';
  export default {
   data() {
    return {
        fname:"",
        lname:"",
        username:"",
        fname:"",
        email:"",
        password:"dsfjk567&^%dkjfsd",
        role:[],
      errors: [],
      currentuser:null,
      roles:[]
    }
  },
    methods: {
      createUser(){
        // this.$toast.open('You did it!');
        if(this.validatesignupform()){
          axios.post('/Signup',{fname:this.fname,lname:this.lname,username:this.username,email:this.email,role:this.role,password:this.password})
          .then((response)=>{
            if(response.data.code == 200){
              this.$toast.open({ message:response.data.message, type : "success", position: 'top-right'});
              this.$router.push('/userlist/')
            } else {
              this.$toast.open({ message:response.data.message, type : "error", position: 'top-right'});
            }
          })
          .catch((error)=>{
                console.log(error);
          })
        }
      }, 
      cancleCreateUser(){
        this.$router.push('/userlist/')
      },
      validatesignupform(){
        var error = "";
        var type = "error";
        if(this.fname == ""){
          error = 'First name Required';
          this.$toast.open({
            message:error,
            type : type,
            position: 'bottom',
          });
        }
        if(this.lname == ""){
          error = 'Last name Required';
          this.$toast.open({
            message:error,
            type : type,
            position: 'bottom',
          });
        }
        if(this.username == ""){
          error = 'Username Required';
          this.$toast.open({
            message:error,
            type : type,
            position: 'bottom',
          });
        }
        if(this.email == ""){
          error = 'Email Required';
          this.$toast.open({
            message:error,
            type : type,
            position: 'bottom',
          });
        }
        if(this.role.length == 0){
          error = 'Role Required';
          this.$toast.open({
            message:error,
            type : type,
            position: 'bottom',
          });
        }
        if(error){
          return false;
        }
        return true;
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
    })
    .catch(e => {
      this.errors.push(e)
    })
    }

}
</script>