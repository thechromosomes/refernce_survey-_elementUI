
<template>
    <v-container class="scalerating">
        <v-subheader class="pl-0">Rated:-  {{rating}}</v-subheader>
    <v-layout row wrap >
        <v-flex>
          <v-slider
            @input="changeratingdata"
            v-model="rating"
            label="0"
            :max="ratingq.length"
            thumb-label

          ></v-slider>
        </v-flex>
        <v-flex shrink style="width: 60px">
          <v-card-text>{{ratingq.length}}</v-card-text>
        </v-flex>
      </v-layout>
      <input type="hidden" v-model="questionpotres" />
    </v-container>
</template>
<script>
export default {
  props:['ratingdata'],
  data() {
      return {
          ratingq:this.ratingdata,
          rating:0,
          questionpotres:""
      }
  },
  methods:{
    changeratingdata(){
      this.debouncedchangeScalelength()
    },
    updateratinganswer(){
      const this_user = window.surveyuser
      const this_attempt = window.surveyattemptid
      const this_rating = this.ratingq.response
      var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
      surveyconfig = JSON.parse(surveyconfig)
      if(surveyconfig.honeypot == '1'){
        if(this.questionpotres.length > 0){
            axios.post(`/postbotresponse`,{
                'surveyId':this.ratingq.surveyid,
                'userId':this_user._id,
                'questionId':this.ratingq._id,
                'attemptId':this_attempt._id,
                }).then(response => {
            }).catch(e => {})
        } else {
          axios.post(`/updateattemptanswer`,{
            'surveyid':this.ratingq.surveyid,
            'userid':this_user._id,
            'questionid':this.ratingq._id,
            'attemptid':this_attempt._id,
            'answer':this.rating
            }).then(response => {
                this.$parent.validatedform(true);
                  // var this_attempt = window.surveyattemptid
                  // var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
                  // surveyconfig = JSON.parse(surveyconfig)
                  // if(surveyconfig.skipnext == '1'){
                  //   this.$parent.answersubmitted();
                  // }           
          })
          .catch(e => {
            this.errors.push(e)
          })
        }
      } else {
          axios.post(`/updateattemptanswer`,{
            'surveyid':this.ratingq.surveyid,
            'userid':this_user._id,
            'questionid':this.ratingq._id,
            'attemptid':this_attempt._id,
            'answer':this.rating
            }).then(response => {
                this.$parent.validatedform(true);
                  // var this_attempt = window.surveyattemptid
                  // var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
                  // surveyconfig = JSON.parse(surveyconfig)
                  // if(surveyconfig.skipnext == '1'){
                  //   this.$parent.answersubmitted();
                  // }           
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    }
  },
  created: function () {
    this.$parent.validatedform(false);
    this.debouncedchangeScalelength = _.debounce(this.updateratinganswer, 200)
    var this_user = window.surveyuser
    var this_attempt = window.surveyattemptid
    var this_rating = this.ratingq.response
    axios.post(`/getattemptanswer`,{
      'surveyid':this.ratingq.surveyid,
      'userid':this_user._id,
      'questionid':this.ratingq._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.$parent.validatedform(true);
            this.rating = JSON.parse(response.data.data.answer)
          }
        }
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
}
</script>
<style>
.vue-star-rating {
    display: inline-block !important;
}
.scalerating{
  padding: 0px !important;
}
.scalerating .subheader{
  height: 25px !important;
}
.scalerating .slider__thumb, .scalerating .slider__thumb--label, .scalerating .slider__track-fill{
  background-color: #d0cdc7 !important;
    border-color: #d0cdc7 !important;
}
</style>
