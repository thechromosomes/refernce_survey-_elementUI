<template>
  <div class="datatable">
    <template v-if="infoconnected == 1" >
      <template v-for="(AnswerData,index) in allAnswers">
         <dtable v-if="isloaded" :key="`dtable${index}`" @datachanged="tableupdated" :tindex="index" :dataCol="question" :practices="allpractice" :answer="AnswerData" ></dtable> 
      </template>
    </template>
    <template v-else-if="allAnswers.length > 0">
      <dtable v-if="isloaded" :dataCol="question" @datachanged="tableupdated" :tindex="0" :practices="allpractice" :answer="allAnswers[0]" ></dtable>
    </template>
  </div>
</template>

<script>
import dtable from './dtable'

export default {
  components:{dtable},
  props:['question',"ciChangecount"],
  data(){
    return{
      allAnswers:[],
      allpractice:[],
      finalAnswer:[],
      dialog:false ,
      isloaded:false ,
      this_ciChangecount:this.ciChangecount,
      questionpotres:'',
      infoconnected:(this.question.qtype.length > 10)?1:0,
      errors:[],
      currentanswer:[]

    }
  },
  methods: {
    getallPractice(){
      // console.log("getallPractice called");
      localStorage.setItem('Updatedatatable', "");
      // console.log("fetching practice");
      const this_attempt = window.surveyattemptid
      this.isloaded = false;
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
      // console.log("mergeallanswer- ", this.infoconnected);
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
        // console.log("currentanswer- ", this.currentanswer);
        if(this.currentanswer.length > 0){
          this_allAnswers[0] = this.currentanswer[0];
        } else {
          this_allAnswers[0]= {
            practice:"",
            practicename:"",
            finalAnswer:[]
          }
        }
      // console.log("allAnswers- ", this.allAnswers);
      }
      this.allAnswers = this_allAnswers
      this.isloaded = true;

      this.updateserveranswer();
    },
    tableupdated(data){
      var updans = this.allAnswers[data.index];
      updans.finalAnswer = data.data;
      this.allAnswers[data.index] = updans;
      this.updateserveranswer()
    },
    updateserveranswer(){
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
              'answer':this.allAnswers
            }).then(response => {
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
            'answer':this.allAnswers
          }).then(response => {
          })
          .catch(e => {
              this.errors.push(e)
          })
        }

    },
  },
  watch: {
    allAnswers: function (newjumptoquestion, oldjumptoquestion) {
      // console.log("watch allAnswers", this.allAnswers);
      // this.debouncedupdateserveranswer()
    },    
    ciChangecount: function (newjumptoquestion, oldjumptoquestion) {
      // console.log("getting new practice data");
      this.debouncedgetallPractice();
    },    
  },
  created() {
    this.debouncedupdateserveranswer = _.debounce(this.updateserveranswer, 3000)
    this.debouncedgetallPractice = _.debounce(this.getallPractice, 2000)
    this.getallPractice();
  },
}
</script>