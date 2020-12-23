
<template>
  <div class="text-xs-center duplicateSurvey_">
    <v-dialog
      v-model="dialog"
      width="600"
    >
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >Duplicate Survey</v-card-title>
        <v-card-text>
            <v-card-text danger v-if="errormsg != ''">{{errormsg}}</v-card-text>
            <v-flex xs12 >
            <v-text-field
                label="Survey Title"
                @input="validatetext"
                required
                v-model="title"
            ></v-text-field>
            </v-flex>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="duplicateSurvey"
          >
            Duplicate
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="removeModel"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
    props:['dialogstate', 'surveyid','loginuser'],
    data () {
      return {
        dialog: this.dialogstate,
        survey: this.surveyid,
        user_id: this.loginuser,
        title:"",
        errormsg:""
      }
    },
    methods:{
        removeModel(){
            this.dialog = false
            this.$emit("removeModel",this.dialog);
        },
        validatetext(changetext){
          this.title = changetext
            if(changetext.length <=0){
                this.errormsg = "Title is required"
            } else {
                this.errormsg = ""
            }
        },
        duplicateSurvey(){
            if(this.title == ""){
                this.errormsg = "Title is required"
            } else {
              axios.post(`/duplicatsurvey`,{'surveyid':this.survey, "title":this.title, 'user_id':this.user_id}).then(response => {
                console.log(response);
                    if(response.data.status == 1){
                      this.$router.push('/builder/'+response.data.data._id);
                    } else {
                      this.errormsg = "Failed to duplicate survey"
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
