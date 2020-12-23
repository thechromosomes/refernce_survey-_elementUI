<template>
    <div class="sharedsurvey">
        <v-container>
        <v-flex xs12 v-if="contactdata != null"><h2> Contacts Name: {{contactdata.listname}}</h2></v-flex>
        <v-flex xs12 v-if="surveydata != null"><h2> Survey Name: {{surveydata.surveyname}}</h2></v-flex>
        <br/>
        <v-flex xs12 v-if="sharedlist.length > 0">
          <span class=" exportbutton cursor_pointer" @click="sendtoonedashboard(id)" >Send To Dashboard</span>
        </v-flex>
        <br/>
        <br/>
          <v-card>  
            <v-card-title>Shared list<v-spacer></v-spacer><v-text-field v-model="search" class="datatable_search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
            <v-data-table :headers="headers" :items="sharedlist" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{props.index+1}} </td>
                <td class="text-xs-left">{{props.item.username}} </td>
                <td class="text-xs-left">{{props.item.email}} </td>
                <td class="text-xs-left">{{props.item.createdat}} </td>
                <td>
                  <template v-if="props.item.mailsent">Sent</template>
                  <template v-else>
                    <span class="cursor_pointer" @click="sendsharemeaaage(props.item.contactid)" >Send message</span>
                    </template>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
    </div>
</template>
<script>
var dateFormat = require('dateformat');
export default {
  data() {
      return {
        id : this.$route.params.id,
        surveydata:null,
        contactdata:null,
        sharedata:null,
        sharedlist:[],
        search:'',
        pagination: {
          rowsPerPage: 100
        },
        headers: [
          { text: 'Slno.', sortable: false },
          { text: 'User Name', align: 'left', value: 'username', },
          { text: 'Email', align: 'left', value: 'email', },
          { text: 'Shared Date', align: 'left', value: 'createddate', },
          { text: 'Mail', sortable: false, },
        ],
      }
  },
  methods: {
    
    sendtoonedashboard(sharedid){
      axios.post(`/testapi`,{'sharedid':sharedid, sendtoone:true, sendmail:false }).then(response => {
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
    sendsharemeaaage(conatctitemid){
      axios.post(`/sharesurveytocontact`,{'slistid':this.id, conatctitemid:conatctitemid}).then(response => {
        if(response.data){
          // this.getshareddata();
          this.$toast.open({
              message:"Email Sent",
              position:"top",
              type:"success"
          })
        } else {
            this.$toast.open({
                message:"Something went wrong, Please try again...",
                position:"top",
                type:"info"
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
    getshareddata(){
      axios.post(`/getsurveyshareddetails`,{'sid':this.id}).then(shareresponse => {
        if(shareresponse.data){
          this.sharedlist = shareresponse.data.finallist;
          this.contactdata = shareresponse.data.contact;
          this.surveydata = shareresponse.data.survey;
          this.sharedata = shareresponse.data.share;
        }
      })
    },
  },
  created(){
    this.getshareddata()
  }
}
</script>