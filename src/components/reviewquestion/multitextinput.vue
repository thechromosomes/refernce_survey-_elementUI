<template>
    <div class="multitextinput">
            <div v-for="(textinput, index) in question.choice" v-bind:key="index" class="textinput">
              <p v-if="textinput.choicetext != ''"><strong >{{textinput.choicetext}}</strong> <br/> {{setoldanswer(textinput._id)}}</p>
              <p v-if="textinput.choicetext == ''"><strong>Answer:</strong> {{setoldanswer(textinput._id)}}</p>
            </div>
    </div>
</template>
<script>
import question from './question'
export default {
    components: {question},
    props:['alltextinput','question'],
    data() {
        return {
            allinput:this.alltextinput,
            questionno:this.qno,
            answer:[]
        }
    },
    methods: {
        setoldanswer(questionid){
            var retdata = "";
            this.answer.forEach(function(ans) {
                if(ans.id == questionid){
                    retdata = ans.answer;
                }
            });
            return retdata;
        }
    },
    watch:{
    },
    created: function () {
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.question._id,
      'attemptid':this_attempt._id
      }).then(response => {
        if(response.data.status == 1){
          if(response.data.data != null){
            this.answer = JSON.parse(response.data.data.answer)
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
.multitextinput .textinput{
    padding: 0px 10px 10px 10px;
    margin-bottom: 15px;
}
.multitextinput .textinput:hover{
    background-color: #ebebeb;

}
</style>

