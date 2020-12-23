<template>
<v-container>
 <div class="mailformate">
      <v-layout row wrap>
      <v-flex xs12><h2>Survey name: {{surveydata.surveyname}}</h2></v-flex>
      </v-layout>
      <br/>
  </div>
 <v-layout row wrap>
 <v-flex xs12><h2> Notification Templates</h2></v-flex>
 </v-layout>
    <v-layout>
          <v-container>
            <v-card> 
              <v-card-title><v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details ></v-text-field></v-card-title>
              <v-data-table :headers="headers" :items="mailformate" :search="search" :rows-per-page-items="[50, 100, 150]" :pagination.sync="pagination" >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{props.index+1}}</td>
                  <td class="text-xs-left">{{mailfiorname(props.item.mailfor)}} </td>
                  <td class="text-xs-left">{{props.item.mailsubject}} </td>
                  <td class="text-xs-left"><div v-html="props.item.mailbody"></div></td>
                  <td class="text-xs-left"><button class="exportbutton" @click="customizeMail(props.item)">Customize</button></td>
                </template>
              </v-data-table>
            </v-card>
          </v-container>
    </v-layout>
    <br/>
    <div>
        <v-layout>
            <v-flex xs12> 
                  <v-select prepend-icon="person" :items="actions" v-model="mailfor" label="Template For" @change="changeflowdata" item-text="text" item-value="code"></v-select>
            </v-flex>
       </v-layout>
       <v-layout>
            <v-flex xs12> 
                  <v-text-field prepend-icon="person" v-model="mailsubject" label="Template Subject" type="text"></v-text-field>
            </v-flex>
       </v-layout>
       <v-layout>
            <v-flex xs12> 
              <div class="editorinput-conatiner">
                <div class="editorinput-title">Template Body: </div>
                <tinymce id="editor_formate" ref="tincyeditor"  v-model="mailbody" ></tinymce>
              </div>
            </v-flex>
       </v-layout>

        <v-layout>
          <button class="exportbutton" @click='addmailformate'>Save</button>
          <button class="exportbutton" @click='gotolist'>Cancel</button>
          </v-layout>
    </div>
    
   </v-container>
</template>
<script>
var datetime = new Date();

var username=localStorage.username;
  export default {
    props:['surveyid', 'surveydata'],
   data() {
    return {
      currentuser:null,
        mailformate:[],
        supermailformate:[],
        mailfor:"",
        mailsubject:"",
        mailbody:"",

      users:[],
      search:'',
      headers: [
        { text: 'Slno', align: 'left', value: 'slno',},
        { text: 'Mail For', value: 'mailfor' },
        { text: 'Mail Subject', value: 'mailsubject' },
        { text: 'Mail Body', value: 'mailbody' },
        { text: '', sortable: false, }
      ],
      errors: [],
      pagination: {
        rowsPerPage: 100
      },
        actions:[
          {
            code:"1",
            text:"Share Survey to Contact list "
          },
          {
            code:"2",
            text:"Response Added "
          },
          {
            code:"3",
            text:"Response Approved "
          },
          {
            code:"4",
            text:"Response Completed "
          },
          {
            code:"5",
            text:"Survey Notification"
          },
        ],
      defaultflow:{
            surveyid:this.survey,
            action:1,
            role:"",
            notifyrole:""
        }                                          

    }
  },
  methods: {
    customizeMail(propsitem){
      this.mailfor = propsitem.mailfor
      this.mailsubject = propsitem.mailsubject
      this.mailbody = propsitem.mailbody
      window.scrollTo(0,document.body.scrollHeight);
    },
    getallinternamtemplate(){
      axios.post(`/getsurveymailtemplate`,{"surveyid":this.surveyid})
        .then(response => {
          this.mailformate = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
      axios.post(`/getmailformate`,{"surveyid":this.surveyid})
        .then(response => {
          this.supermailformate = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })

    },
    addmailformate(){
      if(this.mailfor != ""){
        axios.post('/savesurveymailtemplate',{surveyid:this.surveyid,mailfor:this.mailfor,mailsubject:this.mailsubject,mailbody:this.mailbody})
        .then((response)=>{
          this.getallinternamtemplate();
            this.$toast.open({
              message:"Template Updated successfully",
              position:"top",
              type:"success"
            })
            this.mailfor = ""
            this.mailsubject = ""
            this.mailbody = ""

        })
        .catch((error)=>{
            this.$toast.open({
              message:"Failed to Update Template",
              position:"top",
              type:"error"
            })
        })
      }else{
        this.$toast.open({
          message:"Please specify Template for",
          position:"top",
          type:"error"
        })
      }
    }, 
    gotolist(){
      this.mailsubject = "";
      this.mailbody = "";
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
      // this.$router.push("/");
      }, 
      changeflowdata(){
        this.mailsubject = "";
        this.mailbody = "";
        setTimeout(() => {
          var chnaged =  0;
          this.mailformate.forEach(element => {
            if(this.mailfor == element.mailfor){
              this.mailsubject = element.mailsubject
              this.mailbody = element.mailbody
              console.log(element);
              chnaged = 1;
            }
          });
          if(chnaged != 1){
            this.supermailformate.forEach(element => {
              if(this.mailfor == element.mailfor){
                this.mailsubject = element.mailsubject
                this.mailbody = element.mailbody
                console.log(element);
                chnaged = 1;
              }
            });
          }
        }, 300);
    },
    mailfiorname(mailfor){
      var retdat = "";
      this.actions.forEach(element => {
        if(element.code == mailfor){
          retdat = element.text;
          return;
        }
      });
      return retdat;
    }
    },
 created() {
   this.getallinternamtemplate();
}
 
}
</script>