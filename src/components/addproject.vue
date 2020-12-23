<template>
<v-container>
 <v-layout row wrap>
 <v-flex xs12><h2>Add Project</h2></v-flex>
 </v-layout>
  <form>
   <v-layout>
    <v-text-field
      v-model="projectname"
      label="Project Name"
      required
    ></v-text-field>
    </v-layout>
    <v-layout>
       <v-select
  :items="groups"
  name="group"
  label="Select a Group"
  v-model="group"
  item-text="groupname"
  item-value="_id"
  multiple
  ></v-select>
          </v-layout>
            <v-layout>
       <v-select
  :items="roles"
  name="role"
  label="Select a Role"
  v-model="role"
  item-text="roletitle"
  item-value="_id"
  multiple
  ></v-select>
          </v-layout>
   <v-layout>
    <button type="button" class="exportbutton" @click='createProject'>Add</button>
    <button type="button" class="exportbutton" @click='clear'>Cancel</button>
     </v-layout>
  </form>
   </v-container>
</template>
<script>
var datetime = new Date();
var username=localStorage.username;
import axios from 'axios';
  export default {
   data() {
    return {
      projectname:null,
      currentuser:null,
      groups:[],
      group:null,
      roles:[],
      role:null,
      errors: []
    }
  },
    methods: {

      createProject(){
        axios.post('/createproject',{projectname:this.projectname,groups:this.group,roles:this.role,createdby:this.currentuser,createddate:datetime})
    .then(response => {
      this.$router.push('/projectlist');
      // JSON responses are automatically parsed.
    })
    .catch(e => {
      this.errors.push(e)
    })
        
      },
       clear () {
        this.projectname = ''
        this.groups = null,
        this.$router.push('/');
      }
    },
 created() {
    axios.post(`/getcurrentuser`,{'username':username})
    .then(response => {
      // JSON responses are automatically parsed.
      this.currentuser = response.data._id
    })
    .catch(e => {
      this.errors.push(e)
    }),
          axios.get(`/getgroups`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.groups = response.data
    })
    .catch(e => {
      this.errors.push(e)
    }),
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