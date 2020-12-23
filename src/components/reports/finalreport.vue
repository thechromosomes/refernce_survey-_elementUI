 <template>
    <div class="finalquestion" style='page-break-before: always;'>
        <v-layout v-if="questiondata != null">
            <v-flex xs1  class="finalquestionindex">
                {{questionno+1}}.
            </v-flex>
            <v-flex xs11 questionbox>
                 <div class="question">
                    <div class="question_text" v-html="questiondata.data.questiontext"></div>
                </div>
                <template v-if="question.imagefirst">
                    <div class="finalquestionimage" v-if="question.image != '' && question.haveimage == '1' ">
                    <img :src="questionfinalimage" class="img-question"/>
                    </div>
                    <div class="finalquestiondescription" v-if="question.havedescription == '1'" v-html="question.description"></div>
                </template>
                <template v-else>
                    <div class="finalquestiondescription" v-if="question.havedescription == '1'" v-html="question.description"></div>
                    <div class="finalquestionimage" v-if="question.image != '' && question.haveimage == '1' ">
                    <img :src="questionfinalimage" class="img-question"/>
                    </div>
                </template>
                <div class="printonly">
                </div>
                <div class="report">
                    <chartmultichoice :contactuserid="userlist" :question="questiondata.data" v-if="questiondata.data.questiontype === 'multic' || questiondata.data.questiontype === 'singlec' || questiondata.data.questiontype === 'dropdown'"></chartmultichoice>
                    <chartratingstar :contactuserid="userlist" :question="questiondata.data" v-else-if="questiondata.data.questiontype === 'ratestars'"></chartratingstar>
                    <chartratingscale :contactuserid="userlist" :question="questiondata.data" v-else-if="questiondata.data.questiontype === 'ratescal'"></chartratingscale>
                    <chartnumbertype :contactuserid="userlist" :question="questiondata.data" v-else-if="questiondata.data.questiontype === 'numbertext'"></chartnumbertype>
                    <chartrankingtype :contactuserid="userlist" :question="questiondata.data" v-else-if="questiondata.data.questiontype === 'ranking'"></chartrankingtype>
                    <chartmatrixtype :contactuserid="userlist" :question="questiondata.data" v-else-if="questiondata.data.questiontype === 'matrixquestion'"></chartmatrixtype>
                    <chartnpstype :contactuserid="userlist" :question="questiondata.data" v-else-if="questiondata.data.questiontype === 'nps'"></chartnpstype>
                    <button class="btn-custom1"><a :href="`/allanswers/${questiondata.data._id}`" target="_blank">View report</a></button>
                </div>
            </v-flex>
        </v-layout> 
        <br/>
        <br/>
    </div>
</template>
<script>
import chartmultichoice from './chartfor/multichoice'
import chartratingstar from './chartfor/ratingstar'
import chartratingscale from './chartfor/ratingscale'
import chartnumbertype from './chartfor/numbertype'
import chartrankingtype from './chartfor/ranking'
import chartmatrixtype from './chartfor/matrix'
import chartnpstype from './chartfor/nps'


export default {
    props:['question', 'qno','userlist'],
    components: {chartmultichoice,chartratingstar, chartratingscale,chartnumbertype,chartrankingtype,chartmatrixtype, chartnpstype},
    data() {
    return {
        questiondata:null,
        questionno:this.qno,
    options: {
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: [
                'Very positive',
                'Somewhat negative',
                'Somewhat positive',
                'Very negative',
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Progress Rate (%)'
            }
        },
        tooltip: {
            headerFormat:'<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                         '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
            }
        },
        series: [{
            name: 'Rate',
            data: [9.9, 71.5, 6.4, 29.2]
        }]
        }
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
        getchoices:function(){
            return "dghdfjkhgjkdfhgjkhdfjkghdf"
        }
},
  computed: {
    // a computed getter
    questionfinalimage: function () {
      if(this.questiondata.data.image.indexOf('://') > 0){
        return this.questiondata.data.image;
      } else {
        return window.publicfileurl+this.questiondata.data.image;
      }
        // return "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
    //   return window.publicfileurl+this.questiondata.data.image;
    }
  },
  created(){
    // console.log(this.question.data);
    axios.post(`/getquestion`,{'questionid':this.question._id}).then(response => {
        this.questiondata = response.data
    })
    // axios.post(`/allanswers`,{'questionid':this.question.data._id}).then(response => {
    //     // console.log(response);
        
    //     if(response.data == null){
    //      console.log();
    //     } else {
    //    var all_answer = [];
    //     console.log("tesfdf");
    //    response.data.forEach(answer => {
    // //  console.log(answer);
     
    //    });
    // // this.allanswers = all_answer;

    //     }
    //   })



  }
}
</script>
<style>
.finalquestionindex{
    font-size: 24px !important;
    font-weight: 200!important;
}
.finalquestion .questionbox{
    padding-top: 10px;
    padding-bottom: 30px;
    margin-bottom: 20px;
    border-bottom: 1px solid #d0cdc7;
}
.input-group__details{
    display: none;
}
.singlechoice .radio-group{ 
    padding-top: 0px !important;
}
</style>
