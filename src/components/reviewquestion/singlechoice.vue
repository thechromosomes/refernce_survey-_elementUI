
<template>
  <div>
    <v-radio-group v-model="answer">
        <div v-for="(choice, index) in question.choice" v-bind:key="index">
            <v-container class="radiobutton">
                <v-radio 
                :key="qno"
                :label="choice.choicetext"
                :value="choice._id"
                disabled
            ></v-radio>
            </v-container>
        </div>
    </v-radio-group> 
    <div class="singlechoicecheck" v-if="question.other">
      <v-checkbox disabled readonly v-model="extrafield" :label="`Other`" ></v-checkbox>
    </div>
    <div class="extraoption" v-if="extrafield">
      <v-text-field disabled readonly  label="Please Specify" v-model="otheranswer" ></v-text-field>
    </div>
  </div>
</template>
<script>
export default {
    props:['question', 'ansno','qno'],
    data() {
        return {
            choicetext1:this.choicetext,
            ansno1:this.ansno,
            qno1:this.qno,
            answer:"",
            extrafield:false,
            otheranswer:""
        }
    },
    methods :{
    },
    watch:{
    },
    created: function () {
    var this_user = window.surveyuser
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.question._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            if(response.data.data.otheranswer != ""){
              this.extrafield = true;
              this.otheranswer = response.data.data.otheranswer
            } else{
              this.answer = JSON.parse(response.data.data.answer)
            }
          }
        }
    })
    .catch(e => {
      this.errors.push(e)
    })
  }
}
</script>
<style scoped>
.radiobutton{
    padding: 5px !important;
}
.radiobutton:hover{
    background-color: #ebebeb;
}

</style>
