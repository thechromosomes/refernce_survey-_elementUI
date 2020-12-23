<template>
    <v-container class="npsquestion">
        <v-btn-toggle v-model="selected">
            <v-btn class="npsbtn" @click="changenspdata(0)">0</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(1)">1</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(2)">2</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(3)">3</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(4)">4</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(5)">5</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(6)">6</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(7)">7</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(8)">8</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(9)">9</v-btn>
            <v-btn class="npsbtn" @click="changenspdata(10)">10</v-btn>
        </v-btn-toggle>
        <div class="npsscales">
          <span class="npsscale text-left">{{question.npsleft}}</span>
          <span class="npsscale text-middle">{{question.npsmiddle}}</span>
          <span class="npsscale text-right">{{question.npsright}}</span>
        </div>
        <input type="hidden" v-model="questionpotres" />
    </v-container>
</template>
<script>
export default {
  props:['npsdata'],
  data() {
      return {
          question:this.npsdata,
          selected:null,
          questionpotres:""
      }
  },
  methods:{
    changenspdata(selected){
      this.selected = selected;
      this.debouncedupdatenpsanswer()
    },
    updatenpsanswer(){
      const this_user = window.surveyuser
      const this_attempt = window.surveyattemptid
      const this_rating = this.npsdata.response
      var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
      surveyconfig = JSON.parse(surveyconfig)
      if(surveyconfig.honeypot == '1'){
        if(this.questionpotres.length > 0){
            axios.post(`/postbotresponse`,{
                'surveyId':this.npsdata.surveyid,
                'userId':this_user._id,
                'questionId':this.npsdata._id,
                'attemptId':this_attempt._id,
                }).then(response => {
            }).catch(e => {})
        } else {
          axios.post(`/updateattemptanswer`,{
            'surveyid':this.npsdata.surveyid,
            'userid':this_user._id,
            'questionid':this.npsdata._id,
            'attemptid':this_attempt._id,
            'answer':parseInt(this.selected)
            }).then(response => {
               this.$parent.validatedform(true);
            // JSON responses are automatically parsed.
            // window.surveyuser = response.data;
          })
          .catch(e => {
            this.errors.push(e)
          })
        }
      } else {
          axios.post(`/updateattemptanswer`,{
            'surveyid':this.npsdata.surveyid,
            'userid':this_user._id,
            'questionid':this.npsdata._id,
            'attemptid':this_attempt._id,
            'answer':parseInt(this.selected)
            }).then(response => {
               this.$parent.validatedform(true);
            // JSON responses are automatically parsed.
            // window.surveyuser = response.data;
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    }
  },
  created: function () {
    this.$parent.validatedform(false);
    this.debouncedupdatenpsanswer = _.debounce(this.updatenpsanswer, 200)
    var this_user = window.surveyuser
    var this_attempt = window.surveyattemptid
    var this_rating = this.npsdata.response
    axios.post(`/getattemptanswer`,{
      'surveyid':this.npsdata.surveyid,
      'userid':this_user._id,
      'questionid':this.npsdata._id,
      'attemptid':this_attempt._id
      }).then(response => {
        // console.log("nspresponse- ", response);
        
        if(response.data.status == 1){
          if(response.data.data != null){
            this.$parent.validatedform(true);
            this.selected = JSON.parse(response.data.data.answer)
          }
        }
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
}
</script>
<style scoped>
.npsbtn.btn--active{
    background-color: #595959 !important;
}
</style>
