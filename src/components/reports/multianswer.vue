 <template>
    <td v-if="answerfor != null">{{answerfor.choicetext}}</td>
    <td v-else></td>
</template>
<script>
export default {
    props:['answer','sq'],
    data() {
        return {
            answerq:this.answer,
            answerfor:null,
            givenanswer:null,
        }
    },
    watch: {
      // whenever question changes, this function will run
      questionno: function (newQuestion, oldQuestion) {
      },
      questiondata: function (oldaBuilderArray, newaBuilderArray) {
        return this.questiondata;
      }
    },
    methods :{
    },
  created(){
    axios.post(`/getmultitextsubs`,{'id':this.answer.id}).then(response => {
        this.answerfor = response.data
    })
  }
}
</script>


