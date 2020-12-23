<template>
<v-container>
 <v-layout row wrap>
 <v-flex xs12><h2>Edit Project</h2></v-flex>
 </v-layout>
  <form>
   <v-layout>
    <v-text-field v-model="editprojects.projectname" label="Project Name" required></v-text-field>
    </v-layout> 
    <v-layout>
       <v-select
  :items="groups"
  name="group"
  label="Select a Group"
  v-model="allowgroups"
  item-text="groupname"
  item-value="_id"
  multiple
  ></v-select>
          </v-layout>
  <br/>
  <br/>
   <v-layout>
    <v-btn @click='updateProject'>Update</v-btn>
    <v-btn @click='cancleUpdateProject'>Cancel</v-btn>
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
      id:this.$route.params.id,
      editprojects:null,
      groups:[],
      allowgroups:[],
      errors: []
    }
  },
    methods: {

      updateProject(){
        
       axios.post(`/editproject`,{'projectid':this.id,projectname:this.editprojects.projectname,allowgroups:this.allowgroups}).then(response => {
        // console.log(response);
        
        if(response.data == null){
         console.log();
        } else {
          this.editprojects = response.data
          this.$router.push('/projectlist/')
     //  var editprojects = [];
        console.log("tesfdf");

        }
      })
         
      }, 
      cancleUpdateProject(){
        this.$router.push('/projectlist/')
      }
    },

 created() {

    axios.post(`/getoneproject`,{'projectid':this.id}).then(response => {
            console.log(response);
            
            if(response.data == null){
            } else {
                this.editprojects=response.data
                if(response.data.allowgroups != null){
                  this.allowgroups = response.data.allowgroups.split(",");
                }
            }
    })
    axios.get(`/getgroups`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.groups = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
}

}
</script>