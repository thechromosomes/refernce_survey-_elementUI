
<template>
  <div class="text-xs-center shareSurvey_">
    <v-dialog
      v-model="dialog"
      width="600"
      @click="removeModel"
    >
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >Share Survey</v-card-title>
        <v-card-text>
          <div class="sharesurveybox">
            <div class="shareelement">Direct Link</div>
            <div class="sharedata">{{getsurveylinkwlogin}}</div>
            <div class="sharebutton">
              <button class="copysurveylink" @click="copylinktoclipboard(0);">Copy link</button>
            </div>
          </div>
          <div class="sharesurveybox">
            <div class="shareelement">Direct Link- without login</div>
            <div class="sharedata">{{getsurveylinkwtlogin}}</div>
            <div class="sharebutton">
              <button class="copysurveylink" @click="copylinktoclipboard(1);">Copy link</button>
            </div>
          </div>
          <div class="sharesurveybox">
            <div class="shareelement">Embed code</div>
            <div class="sharedata">{{getsurveyembadecode}}</div>
            <div class="sharebutton">
              <button class="copysurveylink" @click="copylinktoclipboard(2);">Copy</button>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import copytoclip from 'copy-to-clipboard';
export default {
  props:['dialogstate', 'surveyid'],
  data () {
    return {
      dialog: this.dialogstate,
      survey: this.surveyid,
      title:"",
      errormsg:""
    }
  },
  methods:{
    removeModel(){
        this.dialog = false
        this.$emit("removeModel",this.dialog);
    },
    copylinktoclipboard(copyfrom){
      if(copyfrom == 0){
        copytoclip(this.getsurveylinkwlogin);
      } else if(copyfrom == 1){
        copytoclip(this.getsurveylinkwtlogin);
      } else if(copyfrom == 2){
        copytoclip(this.getsurveyembadecode);
      } else {
      }
    }

  },
  computed:{
    getsurveylinkwlogin: function(){
      return window.siteurl+"swl/"+this.survey;
    },
    getsurveylinkwtlogin: function(){
      return window.siteurl+"swtl/"+this.survey;
    },
    getsurveyembadecode: function(){
      return '<iframe id="gpex-survey"src="'+window.siteurl+'swtl/'+this.survey+'" width="100%" height="1000px" allowtransparency="true" style="frameborder:0; border: 0; margin: 0 auto; background: transparent; background-color: transparent;" ></iframe>';
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
