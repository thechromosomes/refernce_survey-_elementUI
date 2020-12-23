<template>
<v-container>
 <v-layout row wrap v-if="contact != null">
 <v-flex xs12><h2>Members of: {{contact.listname}}</h2></v-flex>
 </v-layout>
    <v-layout>
          <v-container>
            <v-card> 
              <v-card-title>Contact members<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
              <v-data-table :headers="headers" :items="contactdata" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{props.index+1}}</td>
                  <td class="text-xs-left">{{props.item.firstname}} </td>
                  <td class="text-xs-left">{{props.item.lastname}} </td>
                  <td class="text-xs-left">{{props.item.email}} </td>
                  <td><v-btn class="btn-extrasmall" @click="deletecontact(props.item._id);"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn></td>                
                </template>
              </v-data-table>
            </v-card>
          </v-container>
    </v-layout>
   </v-container>
</template>
<script>
var datetime = new Date();

import axios from 'axios';
  export default {
  props:['contact'],
   data() {
    return {
        id:this.$route.params.id,
        contacts:[],
        contactdata:[],
        contactdetails:null,
        email:"",
        firstname:"",
        lastname:"",

        users:[],
      search:'',
      headers: [
        {
          text: 'Slno',
          align: 'left',
          value: 'slno',
        },
        { text: 'Firstname', value: 'firstname' },
        { text: 'Lastname', value: 'lastname' },
        { text: 'Email', value: 'email' },
        { text: '',sortable: false, }
      ],
      errors: [],
      pagination: {
        rowsPerPage: 100
      }
    }
  },
  methods: {
    addemailform(){
      if(this.email != ""){
        axios.post('/addcontactemaildata',{email:this.email,firstname:this.firstname,lastname:this.lastname,listid:this.id})
        .then((response)=>{
          this.getallcontactitems()
          this.$toast.open({
            message:"Contact added successfully",
            position:"top",
            type:"success"
          })
          this.email=""
          this.firstname=""
          this.lastname=""
        })
        .catch((error)=>{
          this.$toast.open({
            message:"Failed to all Contact",
            position:"top",
            type:"error"
          })
        })
      } else{
          this.$toast.open({
            message:"Email is required",
            position:"top",
            type:"error"
          })
      }
      }, 
    gotolist(){
      this.$router.push("/contactlist");
    }, 
    deletecontact(contactuid){
      axios.post(`/deleteuserfromcontact`,{'contactuid':contactuid}).then(response => {
        if(response.data.n==1){
          this.$toast.open({
            message:"Contact deleted Successfully",
            position:"top",
            type:"success"
          })
          this.getallcontactitems()
        } else {
          this.$toast.open({
            message:"Failed to delete Contact",
            position:"top",
            type:"error"
          })
        }
      }).catch(e => {
          this.$toast.open({
            message:"Failed to delete Contact.",
            position:"top",
            type:"error"
          })
      })   
    },
    getallcontactitems(){
      axios.post(`/getcontactdetails`,{"listid":this.id})
        .then(response => {
          this.contactdetails = response.data.contactdetails
          this.contactdata = response.data.list
        })
        .catch(e => {
          this.errors.push(e)
        })        
    }

    
  },
 created() {
     if(this.contact != null){
        this.id = this.contact._id;
        this.getallcontactitems()
     }
 }
 
}
</script>
