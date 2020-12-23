<template>
  <div class="datatable">
    <template v-if="infoconnected == 1" >
      <template v-for="(AnswerData,index) in allAnswers">
         <dtable :key="`dtable${index}`" @datachanged="tableupdated" :tindex="index" :dataCol="question" :practices="allpractice" :answer="AnswerData" ></dtable> 
      </template>
      <h3>Question preview is not available for Datatable connected with contact info</h3>
    </template>
    <template v-else-if="allAnswers.length > 0">
      <dtable :dataCol="question" @datachanged="tableupdated" :tindex="0" :practices="allpractice" :answer="allAnswers[0]" ></dtable>
    </template>
  </div>
</template>

<script>
import dtable from './dtable'

export default {
  components:{dtable},
  props:['question'],
  data(){
    return{
      allAnswers:[],
      allpractice:[],
      finalAnswer:[],
      dialog:false ,
      questionpotres:'',
      infoconnected:(this.question.qtype.length > 10)?1:0,
      errors:[],
      currentanswer:[]

    }
  },
  methods: {
    getallPractice(){
      // console.log("fetching practice");
      const this_attempt = window.surveyattemptid
      axios.post(`/getattemptanswer`,{
        'questionid':this.question.qtype,
        'attemptid':this_attempt._id
        }).then(response => {
            if(response.data.data){
               if(response.data.data.answer){
                 this.allpractice = JSON.parse(response.data.data.answer);
                 this.getcurrentquestionanswer()
               }
            } else{
              this.allpractice=[]
              this.getcurrentquestionanswer()
            }

        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    getcurrentquestionanswer(){
      const this_attempt = window.surveyattemptid
      axios.post(`/getattemptanswer`,{
        'questionid':this.question._id,
        'attemptid':this_attempt._id
      }).then(resp => {
        if(resp.data.data){
          // console.log("1")
          if(resp.data.data.answer){
            this.currentanswer = JSON.parse(resp.data.data.answer);
          } else {
            this.currentanswer=[]
          }
        } else {
          this.currentanswer=[]
        }
        this.mergeallanswer()
      }).catch(e => {
        this.errors.push(e)
      })
    },
    mergeallanswer(){
      console.log("mergeallanswer- ", this.infoconnected);
      var this_allAnswers = [];
      if(this.infoconnected == 1){
        this.allpractice.forEach(element => {
          var ansdata = this.currentanswer.find(p => p.practice == element.id)
          if(ansdata){
            this_allAnswers.push(ansdata) 
          } else {
            this_allAnswers.push({
              practice:element.id,
              practicename:element.name,
              finalAnswer:[]
            }) 
          }
        });
      } else {
        console.log("currentanswer- ", this.currentanswer);
        if(this.currentanswer.length > 0){
          this_allAnswers[0] = this.currentanswer[0];
        } else {
          this_allAnswers[0]= {
            practice:"",
            practicename:"",
            finalAnswer:[]
          }
        }
      console.log("allAnswers- ", this.allAnswers);
      }
      this.allAnswers = this_allAnswers
    },
    tableupdated(data){
      var updans = this.allAnswers[data.index];
      updans.finalAnswer = data.data;
      this.allAnswers[data.index] = updans;
      this.updateserveranswer()
    },
    updateserveranswer(){
        

    },
  },
  watch: {
    allAnswers: function (newjumptoquestion, oldjumptoquestion) {
      console.log("watch allAnswers", this.allAnswers);
      
      // this.debouncedsendbackdata()
    },    
  },
  created() {
    this.mergeallanswer();
  },
}
</script>