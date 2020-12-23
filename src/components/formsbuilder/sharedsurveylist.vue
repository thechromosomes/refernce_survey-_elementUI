<template>
    <div class="sharedsurvey">
        <v-container>
          <v-card>  
            <v-card-title>Shared list<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
            <v-data-table :headers="headers" :items="sharedlist" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{props.index+1}} </td>
                <td class="text-xs-left">{{props.item.contactname}} </td>
                <td class="text-xs-left">{{getdatestring(props.item.createddate)}} </td>
                <td>
                  <template v-if="props.item.mailsent">Sent</template>
                  <template v-else><span class="cursor_pointer" @click="sendsharemeaaage(props.item._id)" >Send message</span></template>
                </td>
                <td>
                  <template v-if="props.item.senttoone == 1">Yes</template>
                  <template v-else><span class="cursor_pointer" @click="sendtoonedashboard(props.item._id)" >Send To Dashboard</span></template>
                </td>
                <td><v-btn class="btn-extrasmall" @click="deleteshareddata(props.item._id)" ><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn></td>
                <td><a target="_BLANK" :href="`/surveyshareddetails/${props.item._id}`" class="exportbutton" >Details</a></td>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
    </div>
</template>
<script>
var dateFormat = require('dateformat');
export default {
  props:['survey'],
  data() {
      return {
        id : 1,
        surveydata:this.survey,
        sharedlist:[],
        search:'',
        pagination: {
          rowsPerPage: 100
        },
        headers: [
          { text: 'Slno.', sortable: false },
          { text: 'Contact Name', align: 'left', value: 'contactname', },
          { text: 'Shared Date', align: 'left', value: 'createddate', },
          { text: 'Mail', sortable: false, },
          { text: 'Dashboard', sortable: false, },
          { text: '', sortable: false, },
          { text: '', sortable: false, },
        ],
      }
  },
  methods: {
    getdatestring(datestamp){
      return dateFormat(datestamp, "yyyy-mm-dd ")
    }, 
    sendtoonedashboard(sharedid){
      axios.post(`/sendsharedsurveymail`,{'sharedid':sharedid, sendtoone:true, sendmail:false }).then(response => {
        if(response.data){
          this.getshareddata();
          this.$toast.open({
              message:"Sent to GPEx ONE Dashboard",
              position:"top",
              type:"success"
          })          
        }
      }).catch(e => {
        this.$toast.open({
            message:"Failed to send to GPEx ONE Dashboard",
            position:"top",
            type:"success"
        })          
      })        
    },
    sendsharemeaaage(sharedid){
      axios.post(`/sendsharedsurveymail`,{'sharedid':sharedid, sendtoone:false, sendmail:true}).then(response => {
        if(response.data){
          this.getshareddata();
          this.$toast.open({
              message:"Mail Sent",
              position:"top",
              type:"success"
          })          
        }
      }).catch(e => {
          this.$toast.open({
              message:"Failed to Send mail",
              position:"top",
              type:"error"
          })          
      })        
    },
    deleteshareddata(listid){
      axios.post(`/deletesharedsurveytolist`,{'listid':listid}).then(response => {
        if(response.data.n==1){
          this.getshareddata();
        }
      }).catch(e => {
          this.$toast.open({
              message:"Failed to delete surveylist",
              position:"top",
              type:"error"
          })          
      })        
    },
    getshareddata(){
      axios.post(`/getsharedsurveytolist`,{'surveyid':this.survey._id}).then(shareresponse => {
        this.sharedlist = shareresponse.data;
      })
    },
  },
  created(){
    this.getshareddata()
  }
}
</script>