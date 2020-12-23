<template>
<v-container>
 <v-layout row wrap>
 <v-flex xs12><h2> Project List</h2></v-flex>
 </v-layout>



   <!-- <v-layout>
          <v-container>
              <div class="allresponselist">
                <table class="table">
                    <tr>
                        <td>Slno</td>
                        <td>Projectname</td>
                        <td>Details</td>
                        <td></td>
                    </tr>
                    <tr v-for="(project, index) in projects" :key="`questionid_${index}`">
                        <td>{{index+1}}</td>
                        <td>{{project.projectname}}</td>
                        <td><a :href="`/editproject/${project._id}`">edit</a></td>
                        <td><a @click="deleteproject(project._id, index)">Delete</a></td>
                
                    </tr>
                </table>
            </div>
          </v-container>
    </v-layout> -->





   <v-layout>
          <v-container>
            <v-card> 
              <v-card-title>Project list<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
              <v-data-table :headers="headers" :items="projects" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                <template slot="items" slot-scope="props">
                  <td>{{props.index+1}}</td>
                  <td class="text-xs-left">{{props.item.projectname}} </td>
                  <td><a :href="`/editproject/${props.item._id}`">edit</a></td> 
                  <td><a @click="deleteproject(props.item._id)">Delete</a></td>     
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
import axios from 'axios';
  export default {
   data() {
    return {  
      projects:[],
      users:[],
      search:'',
      pagination: {
        rowsPerPage: 100
      },
      headers: [
        { text: 'Slno.',sortable: false, },
        {
          text: 'Projectname',
          align: 'left',
          value: 'projectname',
        },
        { text: '',sortable: false, },
        { text: '',sortable: false, }
      ],

      errors: []
    }
  },
    methods: {
      deleteproject(projectid){
        axios.post(`/deleteproject`,{projectid:projectid}).then(response => {
          var apires = response.data;
          var msg = ""
          var typ = ""
          msg = apires.message
          if(apires.status == 0){
            typ = "warning"

          } else if(apires.status == 1){
            typ = "error"

          } else if(apires.status == 2){
            typ = "success"
            this.getprojects();
          } else {
            typ = "info"
            msg = "Invalid response"
          }
          this.$toast.open({
            message:msg,
            position:"top",
            type:typ
          })
        }).catch(e => {
          console.log(e);
          this.$toast.open({
            message:"error deleting project",
            position:"top",
            type:"error"
          })
        })
      },
      getprojects(){
        axios.get(`/getprojects`)
         .then(response => {
           console.log(response);
           this.projects = response.data
         })
         .catch(e => {
           this.errors.push(e)
         })
      }
    },

  created() {
    this.getprojects()
  }
 
}
</script>