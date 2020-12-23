
<template>
  <div class="text-xs-center duplicateSurvey_">
    <v-dialog v-model="dialog" width="600" >
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >Change group</v-card-title>
        <v-card-text>
            <v-layout>
                <v-flex xs12 >
                    <v-alert v-if="errormsg != ''" :value="true" type="warning" > {{errormsg}}  </v-alert>
                    <h3>Question {{qtext}}</h3>
                    <br>
                    <br>
                    <v-select :items="groups" label="Select Group" v-model="groupid" item-text="groupname" 
            item-value="_id" ></v-select>
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="changeQuestiongroup" flat>Change group</v-btn>
          <v-btn color="primary" flat @click="removeModel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
    props:['dialogstate', 'questionid','questiontext'],
    data () {
      return {
        dialog: this.dialogstate,
        qid: this.questionid,
        questiondata: null,
        groupid: null,
        oldgroupid: null,
        qtext: this.questiontext,
        groups:[],
        errormsg:""
      }
    },
    methods:{
        removeModel(){
            this.dialog = false
            this.$emit("removeModel",this.dialog);
        },
        changeQuestiongroup(){
            if(this.oldgroupid == this.groupid){
                this.errormsg= "Must Change Group"
            } else {
               axios.post(`/updatequestiongroup`,{'questionid':this.qid, 'groupid':this.groupid, }).then(response => {
                    const APIresoponse =  response.data;
                    if(APIresoponse.status == 1){
                        location.reload();
                        this.dialog = false
                        this.$emit("removeModel",this.dialog);
                        this.$parent.changedGroup();
                    } else {
                        this.errormsg = APIresoponse.message;
                    }
                }) 
            }
        },
    },
    created(){
        var surveyid = this.$parent.data.surveyid
        axios.post(`/getquestiongroups`,{'surveyid':surveyid}).then(response => {
            this.groups = response.data
        })
        axios.post(`/getquestion`,{'questionid':this.questionid}).then(response => {
            this.questiondata = response.data.data
            this.groupid = response.data.data.groupid
            this.oldgroupid = response.data.data.groupid
        })

        
        console.log("created mode to change group");
        
    },
    watch: {
      dialog: function (olddialog, newdialog) {
          this.$emit("removeModel",this.dialog);
          return this.dialog;
        },
      errormsg: function (olddialog, newdialog) {
          setTimeout(() => {
             this.errormsg = ""; 
          }, 2000);
        }
    }
}
</script>
