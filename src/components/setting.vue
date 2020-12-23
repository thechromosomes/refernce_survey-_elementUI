<template>
<v-container>
  <div class="edituserform">
    <v-layout row wrap>
        <v-flex xs12><h2>Setting</h2></v-flex>
    </v-layout>
    <br/>
    <br/>
    <br/>
    <template  v-for="s in allsetting">
        <div :key="s._id" class="placement" >
            <v-text-field class="borderdradius" v-model="s.value" :label="s.fullname" ></v-text-field>
        </div>
    </template>
    <v-layout>
        <button class="exportbutton" @click='savesettings'>Save</button>
        <button class="exportbutton" @click='cancleform'>Cancel</button>
    </v-layout>
  </div>
  </v-container>
</template>
<script>
var datetime = new Date();
var username=localStorage.username;
var mylibrary = require("../models/mainlib.js");
import axios from 'axios';
  export default {
   data() {
    return {
        allsetting:[],
        errors: [],
        currentuser:null,
        roles:[]
    }
  },
    methods: {
      savesettings(){
        axios.post('/updateserversettings',{allsetting:this.allsetting})
        .then((response)=>{
            console.log("dsfsdf",response);
            var type = "success";
            if(response.data.status != 1){
                type = "error";
            }
            response.data.message.forEach(element => {
                this.$toast.open({ message:element, type : type, position: 'top'});
            });
        })
        .catch((error, data)=>{
            this.$toast.open({ message:"Something went wrong", type : "error", position: 'top'});
        })
      }, 
      cancleform(){
        this.$router.push('/')
      },
    },
    created() {
      axios.post(`/getcurrentuser`,{'username':username}).then(response => {
        this.currentuser = response.data._id
        if(mylibrary.is_roleassigned(response.data.roles, "1")){
            axios.post(`/getserversettings`).then(response => {
                this.allsetting = response.data;
            })
            .catch(e => {
            })
        } else {
        console.log("don't have access");
        this.$router.push('/')
        }
    })
    }

}
</script>