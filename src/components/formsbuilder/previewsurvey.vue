<template>
  <div v-if="inprocess == true" ref="surveypreview">
      <button id="printButton" class="exportbutton" @click="printsurvey">Print</button>
        <template xs12 v-if="welcomenotes.length > 0">
            <template class="qustiongroup" v-for="(welcomenote, windex) in welcomenotes" >
                <div  class="printonly" :key="`welcomenotesid${windex}`" v-html="welcomenote.description" ></div>
            </template>
        </template>

        <div class="questionblock" v-if="finalbuilderarray.length > 0">
            <div v-for="(question, index) in finalbuilderarray" :key="`previewqid${index}`">
                <displayheading :sectiondata="question" v-if="question.questiontype === 'sectionheading'"></displayheading>
                <v-divider v-else-if="question.questiontype === 'pagebreak'"></v-divider>
                <div class="descriptionbox" v-else-if="question.questiontype == 'descriptionbox'">
                <v-layout>
                    <v-flex xs1  class="finalquestionindex">
                    </v-flex>
                    <v-flex xs11 questionbox>
                    <div v-html="question.description"></div>
                    <div class="questionimagepreview" v-if="question.image != '' && question.haveimage == '1' ">
                      <img :src="questionfinalimage(question.image)" class="img-question"/>
                    </div>
                    </v-flex>
                </v-layout>
                </div>
                <finalquestion :questiondata="question" :qno="getquestionno(index)" v-else ></finalquestion>
            </div>
        </div>
        <div v-else class="questionblock">
        <h3>Question not available</h3>
        </div>
        <template xs12 v-if="thankyounotes.length > 0">
            <template class="qustiongroup" v-for="(thankyounote, windex) in thankyounotes" >
                <div class="printonly" :key="`welcomenotesid${windex}`" v-html="thankyounote.description" ></div>
            </template>
        </template>

  </div>
  <div v-else>
    <div class="questionblock">
      <h3>Loading...</h3>
    </div>
  </div>
</template>
<script>
import displayheading from '../question/sectionheading'
import finalquestion from '../question/finalquestion'
export default {
  props:["surveyid", 'printnow'],
  components: {finalquestion,displayheading},
  data() {
      return {
        id : this.surveyid,
        questions :[],
        builderarray :[],
        finalbuilderarray :[],
        questionorder:[],
        inprocess :false,
        thankyounotes:[],
        welcomenotes:[],
      }
  },
  methods:{
    questionfinalimage(path){
      return window.publicfileurl+path;
    },
        printsurvey(){
        var content = this.$refs.surveypreview.innerHTML;
        var head = document.getElementsByTagName("head")[0].innerHTML;
        var printButton = document.getElementById("printButton")
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        
        if (isSafari){
         var popupWin = window.open('', 'PrintWindow','width=650,height=650,location=no,left=200px');
         popupWin.document.write("<html><head><style>button#printButton{display:none}</style>"+head+"<style>body{padding:15px;}@media print {.exportbutton {display:none;} .jumbotron__content,img{display:block;page-break-before: auto; page-break-after: auto;page-break-inside: avoid; } .input-group--text-field label{font-size: 12px;margin-top: -25px;font-weight: 700;}.input-group--dirty{{font-size: auto;margin-top: unset;font-weight: auto; }}}}</style></head><body><br><br>"+content+"</body></html>");
          setTimeout(function(){
            popupWin.print();
            popupWin.close();
          },1000);
      }
      else{
        var myWindow = window.open("", "", "");      
        myWindow.document.write("<html><head><style>button#printButton{display:none}</style>"+head+"<style>body{padding:15px;}@media print {.exportbutton {display:none;} .jumbotron__content,img{display:block;page-break-before: auto; page-break-after: auto;page-break-inside: avoid; } .input-group--text-field label{font-size: 12px;margin-top: -25px;font-weight: 700;}.input-group--dirty{{font-size: auto;margin-top: unset;font-weight: auto; }}}}</style></head><body><br><br>"+content+"</body></html>");
          setTimeout(function(){
            if(document.readyState ==="complete"){
            myWindow.print();
            myWindow.close();
          }
        },1000);
      }
    },
    getquestionno(index){
      var qno = 0;
      for (let i = 0; i < this.finalbuilderarray.length; i++) {
        if(i >= index){
          break;
        }
        var queselement = this.finalbuilderarray[i];
        if(queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox' || queselement.questiontype == 'qtypeslider' ){
        // } else if(queselement.questiontext != ""){
        //   qno+=1;
        } else {
          qno+=1;
        }
      }
      return qno;
    },

    },
  watch: {
      // whenever question changes, this function will run

  },
  created(){
    var skipcontactinfo = [];
    axios.post(`/getquestions`,{'surveyid':this.id}).then(response => {
        this.builderarray = response.data
        axios.post(`/getquestionorder`,{'surveyid':this.id}).then(response => {
            var contactinfo = null;
            this.questionorder = response.data
            this.questionorder.forEach(element => {
                this.builderarray.forEach(q => {
                    q.order = element.order
                    if( q.qtype && q.qtype.length > 10 && q.questiontype == "dataTable") {
                      if(!skipcontactinfo.includes(q.qtype)){
                        skipcontactinfo.push(q.qtype);
                        var existingindex = this.finalbuilderarray.findIndex( ques => ques._id == q.qtype );
                        contactinfo = this.builderarray.find( ques => ques._id == q.qtype );
                        if(contactinfo){
                          this.finalbuilderarray.push(contactinfo)
                          contactinfo = null
                        }
                        if(existingindex >= 0){
                          this.builderarray.splice(existingindex,1);
                        }
                      }
                    }

                    if(q._id == element.questionid && !skipcontactinfo.includes(q._id)){
                        this.finalbuilderarray.push(q)
                        skipcontactinfo.push(q._id);
                    }
                });
            });
            this.inprocess = true
            // this.currentquestiondata = this.finalbuilderarray[this.currentquestion]
        })
    })
    .catch(e => {
        this.errors.push(e)
    })
     axios.post(`/getallwelcomethankyoudata`,{'surveyid':this.id,datatype:'welcomepage'}).then(response => {
        if(response.data == null){
        } else {
            this.welcomenotes = response.data;
        }
      })
      axios.post(`/getallwelcomethankyoudata`,{'surveyid':this.id,datatype:'thankyoupage'}).then(response => {
        if(response.data == null){

        } else {
            this.thankyounotes = response.data;
        }
      })
    //   console.log("Created");
  },
  computed: {
    
    }
}
</script>
