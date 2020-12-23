<template>
<v-container>
 <v-layout row wrap>
 <v-flex xs12><h2>Create Group</h2></v-flex>
 </v-layout>
    <v-layout> <v-text-field label="Group Name" v-model="editgroup.groupname" required ></v-text-field> </v-layout>
    <v-layout>
      <v-select :items="registrars" name="registrar" label="Select a username" v-model="registrar" item-text="firstname" item-value="_id" multiple ></v-select>
    </v-layout>
    <v-layout>
      <v-btn @click='saveGroup'>Add</v-btn>
      <v-btn @click="clear">Cancel</v-btn>
    </v-layout>
              <div class="allresponselist">
                <table class="table">
                    <tr>
                        <td>S No.</td>
                        <td>Group Name</td>
                        <td>Members</td>
                        <td></td>
                    </tr>
                    <tr v-for="(group, index) in groups" :key="`groupid_${index}`">
                        <td>{{index+1}}</td>
                        <td>{{group.groupname}}</td>
                        <td>
                          <template v-if="group.groupmemmbers != null" >
                            <userdetailssnipt v-for="member in group.groupmemmbers.split(',')" :key="member" utype="span_nameonly" :uid="member"></userdetailssnipt>
                          </template>
                          </td>
                        
                        <td><a :href="`/editgroup/${group._id}`">edit</a></td>
                
                    </tr>
                </table>
            </div>
   </v-container>
</template>
<script>

import userdetailssnipt from './users/userdetailssnipt'
var username=localStorage.username;
var datetime = new Date();
import axios from 'axios';
  export default {
    components: {userdetailssnipt},
   data() {
    return {
      id:this.$route.params.id,
      registrars: [],
      errors: [],
      currentuser:null,
      groupname:null,
      registrar:null,
       editgroup:null,
        headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'left',
            sortable: false,
            value: 'groupname'
          },
          { text: 'Fat (g)', value: 'groupmemmbers' },
          { text: 'Carbs (g)', value: 'createdby' },
          { text: 'Protein (g)', value: 'createddate' }
        ],
        groups: []
 
    }
  },
  methods: {
      saveGroup(){
        axios.post('/updategroup',{groupid:this.editgroup._id,groupname:this.editgroup.groupname,members:this.registrar,createdby:this.currentuser,createddate:datetime})
    .then(response => {
      console.log(response);
      if(response.data._id == undefined){
        alert("Duplicate group name")
      } else {
        alert("Saved Successfully")
        this.$router.push('/addgroup');
      }
    })
    .catch(e => {
      this.errors.push(e)
    })
        
      },
       clear () {
        this.projectname = ''
        this.groups = [],
        this.$router.push('/');
      },
    },
 created() {
    axios.get(`/getusers`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.registrars = response.data
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
        axios.post(`/getcurrentuser`,{'username':username})
    .then(response => {
      // JSON responses are automatically parsed.
      this.currentuser = response.data._id
    })
    .catch(e => {
      this.errors.push(e)
    }),
    axios.post(`/getgroupbyid`,{'groupid':this.id}).then(response => {
        if(response.data == null){
            } else {
                this.editgroup=response.data.group
                if(response.data.group.groupmemmbers != null){
                  this.registrar  = response.data.group.groupmemmbers.split(",")
                }
                // this.registrar  = "5c9721be8663e171fee00847,5c971ebd14497e5c080013c5"
            }
    })
}

}
</script>