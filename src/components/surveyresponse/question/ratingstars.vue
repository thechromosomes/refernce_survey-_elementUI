<template>
    <div class="starrating">
       <star-rating @rating-selected="changeratingdata" :rating="rating" :max-rating="cmaxrate" :star-size="starsize" ></star-rating>
       <input type="hidden" v-model="questionpotres" />
    </div>
</template>
<script>
import StarRating from 'vue-star-rating'
export default {
    props:['ratingdata'],
    components: {StarRating},
    data() {
        return {
            question:this.ratingdata,
            maxrating:this.ratingdata.maxrate,
            rating:0,
            starsize:30,
            questionpotres:""
        }
    },
    methods:{
        changeratingdata(newrate){
            this.rating = newrate
            this.debouncedchangeScalelength()
        },
        updateratinganswer(){
        const this_user = window.surveyuser
        const this_attempt = window.surveyattemptid
        var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
        surveyconfig = JSON.parse(surveyconfig)
        if(surveyconfig.honeypot == '1'){
          if(this.questionpotres.length > 0){
              axios.post(`/postbotresponse`,{
                  'surveyId':this.question.surveyid,
                  'userId':this_user._id,
                  'questionId':this.question._id,
                  'attemptId':this_attempt._id,
                  }).then(response => {
              }).catch(e => {})
          } else {
            axios.post(`/updateattemptanswer`,{
                'surveyid':this.question.surveyid,
                'userid':this_user._id,
                'questionid':this.question._id,
                'attemptid':this_attempt._id,
                'answer':this.rating
                }).then(response => {
                  this.$parent.validatedform(true);
                  var this_attempt = window.surveyattemptid
                  var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
                  surveyconfig = JSON.parse(surveyconfig)
                  if(surveyconfig.skipnext == '1'){
                    this.$parent.answersubmitted();
                  }                         
            })
            .catch(e => {
                this.errors.push(e)
            })
          }
        } else {
            axios.post(`/updateattemptanswer`,{
                'surveyid':this.question.surveyid,
                'userid':this_user._id,
                'questionid':this.question._id,
                'attemptid':this_attempt._id,
                'answer':this.rating
                }).then(response => {
                  this.$parent.validatedform(true);
                  var this_attempt = window.surveyattemptid
                  var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
                  surveyconfig = JSON.parse(surveyconfig)
                  if(surveyconfig.skipnext == '1'){
                    this.$parent.answersubmitted();
                  }                         
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
    axios.post(`/getattemptanswer`,{
      'surveyid':this.ratingdata.surveyid,
      'userid':this_user._id,
      'questionid':this.ratingdata._id,
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
    computed: {
    // a computed getter
    cmaxrate: function () {
      // `this` points to the vm instance

      return parseInt(this.ratingdata.maxrate);
    }
    }
}
</script>
<style>
.vue-star-rating {
    display: inline-block !important;
}
</style>
