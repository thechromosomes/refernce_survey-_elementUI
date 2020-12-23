<template>
  <div class="datatablequestion">
      <h2 class="practicename">{{answer.practicename}}</h2>
     <table class="dtable table" style="background-color:transparent;">
            <tr class="tableheader">
                <th class="text-center" v-for="(col,index) in dataCol.allcols" :key="`header${index}`">{{col.option}}</th>
            </tr>
            <template  v-if="finalAnswer.length > 0" >
              <template v-for="(AnswerData,index) in finalAnswer">
              <tr class="tabledata" :key="`datarow${index}`">
                <td class="text-center"  v-for="(col,index1) in dataCol.allcols" :key="index1">{{AnswerData[col._id]}}</td>
              </tr>
              </template>
            </template>
      </table>
    <div class="my-2">
      <input type="hidden" v-model="questionpotres" />
    </div>
  </div>
</template>

<script>
export default {
  props:['dataCol', 'practices', 'answer', 'tindex'],
  data() {
    return{
      allAnswers:[],
      selected:-1,
      finalAnswer:this.answer.finalAnswer,
      dialog:false ,
      questionpotres:'',
      errors:[]
    }
  },
  methods: {
  },
  created() {

  },
}
</script>