<template>
    <div class="textinput">
      <p><strong>Answer:</strong> {{answer}}</p>
    </div>
</template>
<script>
export default {
    props:['textinput'],
    data() {
        return {
            answer: ""
        }
    },
    methods :{
    },
    watch:{
    },
    created: function () {
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
      'questionid':this.textinput._id,
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
.textinput {
    padding: 0px 10px 10px 10px;
}
.textinput .input-group__input{
  background-color: white !important;
    border: 1px solid #8b784a;
}
.textinput:hover{
    background-color: #ebebeb;
} 
</style>

