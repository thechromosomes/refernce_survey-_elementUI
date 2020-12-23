<template>
 <v-container grid-list-xl  class="conatiner_dashboard">
   <v-layout>
     <v-flex xs3 class="dashboard-sidebar">
      <v-flex xs12 text-xs-left class="dashboard-sidebar-flex">
        <v-card text-right class="cardsddprotitle">
          <a class="btn_totabs"  @click="model_modelnewcontact = true" ><div class="icon30 blueback"><img  src="../../assets/icons/folder-plus-light-white.svg"/></div>New Contact</a>
          <a class="btn_totabs"  @click="model_modelimportcontact = true"><div class="icon30 blueback"><img  src="../../assets/icons/poll-h-light-white.svg"/></div>Import Contact</a>
        </v-card>
      </v-flex>
      <v-flex xs12 text-xs-left>
        <div class="cardsddprotitle side_projectlist">
          <div class="card-header">Details</div>
            <button :class="`btn_totabs ${(activetab == 0)?'active':''} `" @click="activetab = '0'" ><div class="icon30"><img src="../../assets/icons/box-check-light-white.svg"/></div>Contacts</button>
            <button :class="`btn_totabs ${(activetab == 1)?'active':''} `" @click="activetab = '1'" ><div class="icon30"><img src="../../assets/icons/box-check-light-white.svg"/></div>Contacts List</button>
            <button :class="`btn_totabs ${(activetab == 3)?'active':''} `" @click="activetab = '3'" ><div class="icon30"><img src="../../assets/icons/box-check-light-white.svg"/></div>Organization</button>
        </div>
      </v-flex> 
     </v-flex>
      <v-flex xs9>
      <v-tabs-items v-model="activetab">
          <v-tab-item :key="0">
            <allcontact v-if="activetab == '0'" :organization="selectedorg"></allcontact>
          </v-tab-item>
          <v-tab-item :key="1">
            <v-layout>
              <v-container v-if="activetab == '1'">
                <v-card> 
                  <v-card-title>Contact list<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
                  <v-data-table :headers="headers" :items="contacts" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{props.index+1}}</td>
                      <td class="text-xs-left">{{props.item.listname}} </td>
                      <td class="text-xs-left" v-if="props.item.listid.indexOf('local')>= 0 ">local</td>
                      <td class="text-xs-left" v-else>GPEx</td>
                      <td class="text-xs-left">{{props.item.count}} </td>
                      
                      <td><a class="exportbutton" @click="getdetailscontact(props.item);">Manage contacts</a></td>                
                      <td><v-btn class="btn-extrasmall" @click="deletecontactlist(props.item._id);"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn></td>                
                    </template>
                  </v-data-table>
                </v-card>
              </v-container>
            </v-layout>

          </v-tab-item>
          <v-tab-item :key="2">
            <contactdetail v-if="selectedcontact != null" :contact= "selectedcontact"></contactdetail>
          </v-tab-item>
          <v-tab-item :key="3">
            <allorg v-if="activetab == '3'" @myEvent="selectOrganisation" ></allorg>
          </v-tab-item>
          <v-tab-item :key="4">
            <allcontact v-if="activetab == '4'" :organization="selectedorg"></allcontact>
          </v-tab-item>
      </v-tabs-items>
      <modelimportcontact @removeModel="model_modelimportcontact = $event" :allcontact="contacts"  v-if="model_modelimportcontact == true" :dialogstate="model_modelimportcontact" :contact = "selectedcontact"></modelimportcontact>
      <modelnewcontact @removeModel="model_modelnewcontact = $event" :allcontact="contacts" v-if="model_modelnewcontact == true" :dialogstate="model_modelnewcontact" :contact = "selectedcontact"></modelnewcontact>
    </v-flex>
   </v-layout>
  </v-container>
</template>
<script>
import modelimportcontact from './importcontact' 
import modelnewcontact from './newcontact'
import contactdetail from './contactdetail'
import allcontact from './allcontacts'
import allorg from './allorg'
import orgcontacts from './orgcontacts'
var datetime = new Date();
var username=localStorage.username;
import axios from 'axios';
  export default {
    props:['contact'],
    components: {allcontact, modelnewcontact, modelimportcontact, contactdetail,allorg, orgcontacts},
   data() {
    return {
      activetab:"0",
      contacts:[],
      model_modelimportcontact:false,
      model_modelnewcontact:false,
      contactname:"",
      users:[],
      search:'',
      selectedcontact:null,
      selectedorg:null,
      headers: [
        {
          text: 'Slno',
          align: 'left',
          value: 'slno',
          sortable: false
        },
        { text: 'Name', value: 'listname' },
        { text: 'Source', value: 'reson' },
        { text: 'Total', value: 'count' },
        { text: '',sortable: false, },
        { text: '',sortable: false, }
      ],
      errors: [],
      pagination: {
        rowsPerPage: 100
      }
    }
  },
    methods: {
      addcontactlist(){
        if(this.contactname != ""){
          axios.post(`/addcontactlist`,{
            userlist:[],
            listname:this.contactname,
            listid:"local_"+this.contacts.length
          })
            .then(response => {
              if(response.data.contactdata != null){
                this.$toast.open({
                  message:"Contact List addedd successfully",
                  position:"top",
                  type:"success"
                })
                this.$router.push('/contactdetails/'+response.data.contactdata._id)
              } else {
                this.$toast.open({
                  message:"Failed to add contact list",
                  position:"top",
                  type:"error"
                })
              }
            })
            .catch(e => {
                this.$toast.open({
                  message:"Failed to add contact list",
                  position:"top",
                  type:"error"
                })
            })
        } else {
          this.$toast.open({
            message:"Contact Name required",
            position:"top",
            type:"error"
          })
        }

      },
      deletecontactlist(contactlistid){
        axios.post(`/deletecontactlist`,{'contactlistid':contactlistid}).then(response => {
          if(response.data.n==1){
            this.$toast.open({
              message:"Contact list deleted successfully",
              position:"top",
              type:"success"
            })
            this.getallcontactlist()
          } else {
            this.$toast.open({
              message:"Failed to delete Contact list",
              position:"top",
              type:"error"
            })
          }
        }).catch(e => {
          this.$toast.open({
            message:"Failed to delete Contact list",
            position:"top",
            type:"error"
          })
        })   
      },
      getallcontactlist(){
        axios.post(`/getcontacts`,{})
          .then(response => {
            console.log(response);
            this.contacts = response.data
          })
          .catch(e => {
            this.errors.push(e)
          })
      },
      getdetailscontact(data){
       this.selectedcontact = data;
       this.activetab = '2';
       console.log('selectedcontact>>>>>>',data)

      },
      selectOrganisation(data) {
        this.selectedorg = data;
           this.activetab = '4'
      }
    },
 created() {
   this.getallcontactlist()
},
    watch:{
      activetab: function (newactivetab, oldactivetab) {
        if(newactivetab != 2){
          this.selectedcontact = null;
        }
        if(newactivetab != 4){
          this.selectedorg = null;
        }
        // return this.activetab;
      },
      model_modelimportcontact: function (newactivetab, oldactivetab) {
        this.getallcontactlist()
      },
      model_modelnewcontact: function (newactivetab, oldactivetab) {
        this.getallcontactlist()
      }
    },
}
</script>
