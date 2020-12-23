<template>
<v-container>
 <v-layout row wrap>
 <v-flex xs6><h2> Users List</h2></v-flex>
 <v-flex xs6>
 </v-flex>
 </v-layout>
   <v-layout>
          <v-container>
            <v-card> 
              <v-card-title>User list<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
              <v-data-table :headers="headers" :items="users" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{props.item.username}} </td>
                  <td class="text-xs-left">{{props.item.firstname}} {{props.item.lastname}} </td>
                  <td class="text-xs-left" >{{props.item.email}} </td>
                  <td>
                    <template v-for="(role, rindex) in props.item.roles">
                      <span v-bind:key="`role${rindex}`">{{role.roletitle}}<i v-if="props.item.roles.length > (rindex+1)">, </i></span>
                    </template>
                  </td>
                  <td><a :href="`/edituser/${props.item._id}`">edit</a></td>                
                </template>
              </v-data-table>
            </v-card>
          </v-container>
    </v-layout>
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
      currentuser:null,
      srchusername:"",
      users:[],
      pagination: {
      rowsPerPage: 100
      },
      search:'',
      headers: [
        {
          text: 'Username',
          align: 'left',
          value: 'username',
        },
        { text: 'Fullname', value: 'firstname' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'roles' },
        { text: '',sortable: false, }
      ],
      errors: []
    }
  },
    methods: {
    
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

   axios.get(`/getuserswithrole`)
    .then(response => {
      this.users = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  
}
 
}
</script>