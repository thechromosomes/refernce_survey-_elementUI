<template>
    <div class="allcontacts">
        <button class="exportbutton" @click="viewcontact(null)">create new</button>
        <v-card> 
            <v-card-title>All Organization<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
            <v-data-table :headers="headers" :items="allorgs" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
            <template slot="items" slot-scope="props">
                <td @click="viewcontact(props.item)" class="text-xs-left">{{props.item.name}} </td>
                <td class="text-xs-left">{{props.item.count}}</td>
                <td><a class="exportbutton" @click="getdetailscontact(props.item);">Manage</a></td> 

            </template>
            </v-data-table>
        </v-card>
        <vieworganization @removeModel="model_vieworganization = $event" v-if="model_vieworganization == true" :dialogstate="model_vieworganization" :org = "opencontact"></vieworganization>
    </div>
</template>
<script>
var datetime = new Date();
import vieworganization from './vieworganization'
import axios from 'axios';
  export default {
    components: {vieworganization},
   data() {
    return {
      allorgs:[],
      model_vieworganization:false,
      search:'',
      opencontact:null,
      isview:true,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Total Contact', value: 'count' },
        { text: '',sortable: false, }
      ],
      errors: [],
      pagination: {
        rowsPerPage: 100
      },
      selectedorg:null,

    }
  },
    methods: {
      viewcontact(item){
        this.isview = true;
        this.opencontact = item;
        this.model_vieworganization = true;
      },
      getallcontactlist(){
        axios.post(`/getorg`,{})
          .then(response => {
            this.allorgs = response.data
          })
          .catch(e => {
            this.errors.push(e)
          })
        // axios.post(`/mapallcontacts`,{}).then(response => {}).catch(e => {this.errors.push(e)})
      },
        getdetailscontact(data){
       this.$emit('myEvent', data);
      }

    },


 created() {
   this.getallcontactlist()
},
    watch:{
      model_vieworganization: function (newactivetab, oldactivetab) {
        this.getallcontactlist()
      }
    },
 
}
</script>
