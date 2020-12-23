 <template>
    <td v-if="answerfor != null">{{answerfor.title}} </td>
    <td v-else></td>
</template>
<script>
import chartmultichoice from './chartfor/multichoice'
import chartratingstar from './chartfor/ratingstar'
import chartratingscale from './chartfor/ratingscale'
import chartnumbertype from './chartfor/numbertype'


export default {
    props:['answer', 'sq'],
    data() {
        return {
            answerq:this.answer,
            answerfor:null,
            givenanswer:null,
        }
    },
  created(){
    axios.post(`/getcustiomquestionsubs`,{'id':this.answer.id}).then(response => {
        this.answerfor = response.data
    })
  }
}
</script>


