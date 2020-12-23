<template>
    <div class="allcontacts">
 <v-layout row wrap v-if="organization != null">
 <v-flex xs12><h2>Members of: {{organization.name}}</h2></v-flex>
 </v-layout>
        <v-card> 
            <v-card-title>All Contacts<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
            <v-data-table :headers="headers" :items="contacts" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
            <template slot="items" slot-scope="props">
                <td @click="viewcontact(props.item)" class="text-xs-left">{{props.item.firstname}} </td>
                <td @click="viewcontact(props.item)" class="text-xs-left">{{props.item.lastname}} </td>
                <td @click="viewcontact(props.item)" class="text-xs-left">{{props.item.email}} </td>
                <td class="text-xs-left"></td>
            </template>
            </v-data-table>
        </v-card>
      <modelviewcontact @removeModel="model_modelviewcontact = $event" v-if="model_modelviewcontact == true" :dialogstate="model_modelviewcontact" :contact = "opencontact"></modelviewcontact>
    </div>
</template>
<script>
var datetime = new Date();
import modelviewcontact from './viewcontact'
import axios from 'axios';
  export default {
    components: {modelviewcontact},
    props:['organization'],
   data() {
    return {
      contacts:[],
      model_modelviewcontact:false,
      search:'',
      opencontact:null,
      isview:true,
      headers: [
        { text: 'First Name', value: 'firstname' },
        { text: 'Lastname', value: 'lastname' },
        { text: 'email', value: 'email' },
        { text: '',sortable: false, }
      ],
      errors: [],
      pagination: {
        rowsPerPage: 100
      }
    }
  },
    methods: {
      viewcontact(item){
        this.isview = true;
        this.opencontact = item;
        this.model_modelviewcontact = true;
      },
      getallcontactlist(){
        if(this.organization != null){
        axios.post(`/getalldata`,{id:this.organization._id})
          .then(response => {
            console.log(response)
            this.contacts = response.data.data
          })
          .catch(e => {
            this.errors.push(e)
          })
        } else {
        axios.post(`/getcontact`,{})
          .then(response => {
            this.contacts = response.data
          })
          .catch(e => {
            this.errors.push(e)
          })

        }
        // axios.post(`/mapallcontacts`,{}).then(response => {}).catch(e => {this.errors.push(e)})
      }
    },
 created() {
   this.getallcontactlist()
},
    watch:{
      model_modelviewcontact: function (newactivetab, oldactivetab) {
        this.getallcontactlist()
      }
    },
 
}
</script>
