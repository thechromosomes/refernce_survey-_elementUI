<template>
  <div class="bottom_btns">
    <div class="que_bottom_btns">
        <v-chip class="addchip" v-if="data.questiontype == 'qtypeslider'" @click="addURL" ><v-avatar><v-icon>add</v-icon></v-avatar>Add URL</v-chip>
        <v-chip class="addchip" v-if="data.questiontype == 'singlec' || data.questiontype == 'multic' || data.questiontype == 'dropdown' || data.questiontype == 'multipletext' || data.questiontype == 'ranking' " @click="addChoice" ><v-avatar><v-icon>add</v-icon></v-avatar>Add Field</v-chip>
        <v-chip class="addchip" v-if="data.questiontype == 'customform'" @click="addField"><v-avatar><v-icon>add</v-icon></v-avatar>Add Field</v-chip>
        <v-chip class="addchip" v-if="data.questiontype == 'matrixquestion'" @click="addRows();"><v-avatar><v-icon>add</v-icon></v-avatar>Add Rows</v-chip>
        <v-chip class="addchip" v-if="data.questiontype == 'matrixquestion' || data.questiontype == 'dataTable'" @click="addCols();"><v-avatar><v-icon>add</v-icon></v-avatar>Add Cols</v-chip>        <v-chip class="addchip" v-if="data.questiontype != 'descriptionbox' && data.questiontype != 'welcomepage' && data.questiontype != 'thankyoupage' && data.questiontype != 'sectionheading'" @click="addDescription" ><v-avatar><v-icon>format_align_left</v-icon></v-avatar>Add description</v-chip>
        <v-chip class="addchip" v-if="data.questiontype != 'welcomepage' && data.questiontype != 'thankyoupage' && data.questiontype != 'sectionheading'" @click="addQuestionHaveImage" ><v-avatar><v-icon>image</v-icon></v-avatar>Add Image</v-chip>
        <v-checkbox v-if="data.questiontype == 'descriptionbox' " v-model="required" :label="`information page`" @change="changerequired" ></v-checkbox>
        <v-chip class="addchip" v-if="data.questiontype == 'multic' || data.questiontype == 'singlec' || data.questiontype == 'dropdown' || data.questiontype == 'numbertext' || data.questiontype == 'ratestars' || data.questiontype == 'ratescal'" @click="addLogicjump" ><v-avatar><v-icon>image</v-icon></v-avatar>Add logic jump</v-chip>
        <v-chip class="addchip" v-if="data.questiontype != 'welcomepage' " @click="addToGroup(question._id, question.questiontext)" ><v-avatar><v-icon>image</v-icon></v-avatar>Add to group</v-chip>
        <v-chip class="addchip" @click="duplicateQuestion(question._id)" ><v-avatar><img src="../../assets/icons/layer-plus-light-white.svg" class="iconinsidebtnsmall"/></v-avatar>Duplicate</v-chip>
        <v-checkbox v-if="data.questiontype != 'descriptionbox' && data.questiontype != 'welcomepage' && data.questiontype != 'thankyoupage' && data.questiontype != 'sectionheading'" v-model="required" :label="`Required`" @change="changerequired" ></v-checkbox>
        <v-checkbox v-if="data.questiontype == 'singlec' || data.questiontype == 'multic' || data.questiontype == 'dropdown'" v-model="extraoption" :label="`Other`" @change="chnageotheroption" ></v-checkbox>
        <v-checkbox v-if="allwoedcomment.indexOf(data.questiontype) >= 0" v-model="havecomment" :label="`Comment`" ></v-checkbox>
        <v-select v-if="data.questiontype != 'welcomepage' && data.questiontype != 'thankyoupage'" :items="allquestion" v-model="jumptoquestion" label="Move question after" item-text="questiontext" item-value="_id"></v-select>
        <!-- <v-select v-if="data.questiontype == 'dataTable'" :items="connectquestion" v-model="connecttoquestion" label="contactinfo" item-text="questiontext" item-value="_id"></v-select> -->
        <button class="badge-btn" v-if="connecttoquestion && data.questiontype == 'dataTable'" >{{getconnection}}<v-icon class="closebtn"  @click="clearConnection">close</v-icon></button>
        <v-chip class="addchip" v-if="data.questiontype == 'dataTable'" @click="contactinfo = true" ><v-avatar><v-icon>add</v-icon></v-avatar>Add connection</v-chip>
    </div>
    <v-btn-toggle  class="group_movequestion">
        <v-btn flat class="movequestion" v-if="index !== 0" v-on:click="moveelement(index, -1);">
            <v-icon>arrow_upward</v-icon>
        </v-btn>
        <v-btn flat class="movequestion" v-on:click="deleteelement(index);">
            <img class ="deletequestion" src="../../assets/icons/trash-alt-light-white.svg" />
        </v-btn>
        <v-btn flat class="movequestion" v-if="index < (total - 1)" v-on:click="moveelement(index, 1);">
            <v-icon>arrow_downward</v-icon>
        </v-btn>
    </v-btn-toggle>
      <v-dialog v-model="contactinfo" persistent max-width="600px">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Add Connection</v-card-title>
          <v-card-text>
            <v-container>
              <div>
                <v-select :items="connectquestion" v-model="tmpconnecttoquestion" label="contactinfo" item-text="questiontext" item-value="_id"></v-select>
              </div>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="saveConnection">Save</v-btn>
            <v-btn color="primary" flat @click="clearConnection">Reset</v-btn>
            <v-btn color="primary" flat @click="contactinfo = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

  </div>
</template>
<script>
import { setTimeout } from 'timers';
export default {
  props:['question','allquestion','index', 'total'],
  data() {
      return {
        contactinfo:false,
        data : this.question,
        required:false,
        extraoption:this.question.other,
        questions:this.allquestion,
        jumptoquestion:"",
        connecttoquestion:this.question.qtype,
        tmpconnecttoquestion:this.connecttoquestion,
        connectquestion:[],
        havecomment:false,
        allwoedcomment:['multic', 'singlec', 'dropdown', 'ratescal', 'ratestars', 'matrixquestion', 'qtypedatetime', 'ranking']
      }
  },
  methods:{
    saveConnection(){
      this.contactinfo = false;
      this.connecttoquestion = this.tmpconnecttoquestion;
    },
    clearConnection(){
      this.contactinfo = false;
      this.connecttoquestion = "";
    },
    callJumpquestion(){
      // console.log("jumptoquestion- " ,this.jumptoquestion);
      if(this.jumptoquestion != this.question._id){
        axios.post(`/movequestion`,{movequestionid:this.question._id, questionid: this.jumptoquestion}).then(response => {
          // console.log("move quextion response",response);
          if(response.data == "1"){
            setTimeout(() => {
              location.reload();
            }, 100);
          }
        })  
      } else {
        alert("same question");
      }
      
    },
    callconnecttoquestion(){
      // console.log("connecttoquestion- " ,this.connecttoquestion);
        axios.post(`/updateqtype`,{'questionid':this.data._id,'qtypedata':this.connecttoquestion}).then(response => {
          // console.log(response);
        }).catch(e => {
          // this.errors.push(e)
        })        
    },
    duplicateQuestion(questionid){
     axios.post(`/duplicatquestion`,{'questionid':questionid}).then(response => {
        if(response.data == "1"){
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      })  

    },
    chnageotheroption(){
     axios.post(`/updatequestionopteroption`,{'questionid':this.question._id, 'extraoption':this.extraoption }).then(response => {
        this.$parent.changeOthersection(this.extraoption);
      })  
    },
    updatehavecomment(){
        axios.post(`/updatequestionhavecomment`,{'questionid':this.data._id,'havecomment':this.havecomment}).then(response => {
          this.$parent.changeCommentsection(this.havecomment);
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    changerequired(){
     var required="1"
     if(this.required == false)
     {
       required="0"
     }
     axios.post(`/updatequestionrequired`,{'questionid':this.data._id,'required':required}).then(response => {
         this.question.required=required
      }).catch(e => {
        this.errors.push(e)
      })  
    },
    moveelement(ele_index, pos){
      console.log(this.$parent);
        this.$parent.moveelement(ele_index, pos)
    },
    deleteelement(ele_index){
        this.$parent.deleteelement(ele_index)
        // console.log("delete element "+ele_index);
    },
    addQuestionHaveImage(){
      axios.post(`/updatehaveimage`,{'questionid':this.data._id,'haveimage':'1'}).then(response => {
          this.question.haveimage="1"
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    addLogicjump(){
        this.$parent.addLogicjump()
        this.question.havelogicjump="1"
    //   axios.post(`/updatehaveimage`,{'questionid':this.data.id,'haveimage':'1'}).then(response => {
    //       this.question.haveimage="1"
    //   }).catch(e => {
    //     this.errors.push(e)
    //   })        
    },
    addChoice(){
        this.$parent.addChoice()
    },
    addURL(){
        this.$parent.addURL()
    },
    addRows(){
        this.$parent.addRows()
    },
    addCols(){
        this.$parent.addCols()
    },
    addField(){
        this.$parent.addField()
    },
    addToGroup(questionid,questiontext){
      this.$parent.addToGroup(questionid,questiontext)
        console.log("have to implement model for "+questiontext+" - "+questionid);
    },
    addDescription(){
      axios.post(`/updatehavedescription`,{'questionid':this.data._id,'havedesc':'1'}).then(response => {
          this.question.havedescription="1"
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    updateconnectquestions(){
      var connectquestion = [];
      if(this.questions){
        this.questions.forEach(element => {
          if(element.questiontype == "contactInfo"){
            connectquestion.push(element)
          }
        });
      }
      this.connectquestion = connectquestion;
    },

  },
  created(){ 
    this.debouncedjumptoquestion = _.debounce(this.callJumpquestion, 500)
    this.debouncedconnecttoquestion = _.debounce(this.callconnecttoquestion, 500)
    this.debouncedhavecomment = _.debounce(this.updatehavecomment, 500)
    this.updateconnectquestions();
      if(this.question.required == "1"){
          this.required = true
      }
      if(this.question.havecomment){
          this.havecomment = this.question.havecomment
      }
  },
  watch: {
    jumptoquestion: function (newjumptoquestion, oldjumptoquestion) {
      this.debouncedjumptoquestion()
    },    
    connecttoquestion: function (newconnecttoquestion, oldconnecttoquestion) {
      this.debouncedconnecttoquestion()
    },    
    havecomment: function (newhavecomment, oldhavecomment) {
      this.debouncedhavecomment()
    },    
    questions: function (newhavecomment, oldhavecomment) {
      this.updateconnectquestions()
    },    
  },
  computed: {
    getconnection: function () {
      var returndata = "";
      var found = this.connectquestion.find( role => role._id == this.connecttoquestion);
      if(found){
        returndata = found.questiontext;
      }
      return returndata;
    }
  },
  updated: function () {
    console.log("skjdfkshdkfs");
  this.$nextTick(function () {
    console.log("updated next tic from queston button")
  })
}
}
</script>
