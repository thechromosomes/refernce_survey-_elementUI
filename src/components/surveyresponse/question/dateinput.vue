<template>
    <div class="dateinput">
      <template v-if="questiondata.qtype == '1' && dateLength >= 0">
        <template v-if="questiondata.npsleft && questiondata.npsright">
          <VueHotelDatepicker
            ref="dateselector"
            v-model="selecteddate"
            :placeholder="`${(selecteddate)?selecteddate:'select dates'}`"
            :minDate="questiondata.npsleft"
            :maxDate="questiondata.npsright"
            :maxNight="dateLength"
            endDate="13-02-2020"
            format="DD-MM-YYYY"
            @confirm="getValueAndPost"
            @update="updatedate"
            >
          </VueHotelDatepicker >
        </template>
        <template v-else>
          <VueHotelDatepicker
            ref="dateselector"
            endDate="13-02-2020"
              v-model="selecteddate"
              format="DD-MM-YYYY"
              :placeholder="`${(selecteddate)?selecteddate:'select date'}`"
              :maxNight="dateLength"
              @confirm="getValueAndPost"
              @update="updatedate"
              >
            </VueHotelDatepicker >
        </template>
    </template>
    <template v-else>
      <v-date-picker v-model="selecteddate" ></v-date-picker>
    </template>
    </div>
</template>
<script>
import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker'
var animate = require('../../../models/cssAnimation.js');

export default {
    props:['questiondata'],
    components:{ VueHotelDatepicker},
    data() {
        return {
          questionpotres:"",
            selecteddate: null,
            end:'',
            menu: false,
            dateLength:parseInt(this.questiondata.length),
            question:this.questiondata
        }
    },
    methods :{
      animatenow(){
        this.validatedform(true);
      },
      validatedform(animation = false){
        if(this.questiondata.required == "1" && this.selecteddate == ""){
          this.$parent.validatedform(false);
          animate.ErrorInput("#answer"+this.questiondata._id, "error");
          if(animation){
            animate.animateCSS("#answer"+this.questiondata._id, "shake");
          }
        } else {
          this.$parent.validatedform(true);
          animate.ErrorInput("#answer"+this.questiondata._id, "success");
        }
      },
      updatedate(selecteddate){
        console.log("selecteddate- ", selecteddate);
        // this.end = selecteddate.start;
        // this.$refs.dateselector.endDate = selecteddate.start;
        // this.$refs.dateselector.$listeners.confirm;
        // console.log(this.$refs.dateselector);
      },
      getValueAndPost(dateResult){
        // console.log("this is date range console", dateResult)
        this.selecteddate = `${dateResult.start} to ${dateResult.end}` 
      },
      answerdateSelected(newdate){
        // console.log(newdate);
        
      },
      updateattemptanswer(){
        
        this.validatedform(false);
        const this_user = window.surveyuser
        const this_attempt = window.surveyattemptid
        var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
        surveyconfig = JSON.parse(surveyconfig)
        if(surveyconfig.honeypot == '1'){
          if(this.questionpotres.length > 0){
              axios.post(`/postbotresponse`,{
                  'surveyId':this.questiondata.surveyid,
                  'userId':this_user._id,
                  'questionId':this.questiondata._id,
                  'attemptId':this_attempt._id,
                  }).then(response => {
              }).catch(e => {})
          } else {
            axios.post(`/updateattemptanswer`,{
                'surveyid':this.questiondata.surveyid,
                'userid':this_user._id,
                'questionid':this.questiondata._id,
                'attemptid':this_attempt._id,
                'answer':this.selecteddate
                }).then(response => {
            })
            .catch(e => {
                this.errors.push(e)
            })
          }
        } else {
          axios.post(`/updateattemptanswer`,{
              'surveyid':this.questiondata.surveyid,
              'userid':this_user._id,
              'questionid':this.questiondata._id,
              'attemptid':this_attempt._id,
              'answer':this.selecteddate
              }).then(response => {
          })
          .catch(e => {
              this.errors.push(e)
          })
        }

      }
    },
    watch:{
      selecteddate: function (newQuestion, oldQuestion) {
      this.debouncedupdateattemptanswer()
      // this.updateQuestion()
      }
    },
    created: function () {
      // this.$parent.validatedform(true);
    this.debouncedupdateattemptanswer = _.debounce(this.updateattemptanswer, 0)
    var this_user = window.surveyuser
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'surveyid':this.questiondata.surveyid,
      'userid':this_user._id,
      'questionid':this.questiondata._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.selecteddate = JSON.parse(response.data.data.answer)
            this.validatedform()
          }
        }
    })
    .catch(e => {
      this.errors.push(e)
    })
  }

}
</script>
