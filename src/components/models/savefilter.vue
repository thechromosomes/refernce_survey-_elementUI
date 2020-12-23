
<template>
  <div class="text-xs-center shareSurvey_">
    <v-dialog
      v-model="dialog"
      width="600"
      @click="removeModel"
    >
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >Save Filter</v-card-title>
        <v-card-text>
            <v-text-field
                label="Filter name"
                v-model="filtername"
            ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="saveFilter" >Save</v-btn>
          <v-btn color="primary" flat @click="removeModel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import copytoclip from 'copy-to-clipboard';
export default {
  props:['allcondition', 'surveyid', 'loginuser', 'dialogstate'],
  data () {
    return {
      dialog: this.dialogstate,
      survey: this.surveyid,
      conditions: this.allcondition,
      filtername:""
    }
  },
  methods:{
    removeModel(){
        this.dialog = false
        this.$emit("removeModel",this.dialog);
    },
    saveFilter(){
        if(this.filtername == ""){
            this.$toast.open({ message:"Filter name is required", type : "error", position: 'top', });
        } else {
            axios.post(`/savesurveyfilter`,{surveyid:this.survey, filtername:this.filtername, createdby:this.createdby, filterdata:this.conditions}).then(response => {
                if(response.data){
                  this.removeModel();
                  this.$toast.open({ message:"filter Saved", type : "success", position: 'top', });
                  this.$parent.getfilters();
                } else {
                    this.$toast.open({ message:"Failed to Save survey", type : "error", position: 'top', });
                    // this.errormsg = "Failed to duplicate survey"
                }
            }).catch(e => {
                console.log(e);
            }) 
        }
    }
},
  watch: {
    dialog: function (olddialog, newdialog) {
        this.$emit("removeModel",this.dialog);
        return this.dialog;
      }
  }
}
</script>
