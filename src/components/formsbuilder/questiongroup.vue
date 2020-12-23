<template>
  <div class="questiongroup_section" ref="allquestoin" v-if="show = true">
    <v-layout >
        <v-flex xs1>
        </v-flex>
        <v-flex xs11 >
          <v-text-field v-model="data.groupname" label="Question group name"></v-text-field>
          <div class="qustioneditor" v-for="(question111, index) in allquestions" :key="`questionid${index}`">
            <questioneditor :question="question111" :index="getquestionno(index)" :origindex="index" :total="allquestions.length"></questioneditor>
          </div>
        </v-flex>
    </v-layout>
    <addquestiontorgroup @removeModel="model_changegroup = $event" v-if="questionid != '' && model_changegroup == true" :dialogstate="model_changegroup" :questionid="questionid" :questiontext="questiontext" ></addquestiontorgroup>
  </div>
</template>
<script>
import Vue from 'vue'
import questioneditor from './questioneditor'
import addquestiontorgroup from '../models/addquestiontorgroup'

export default {
  props:['gdata'],
  components: {questioneditor,addquestiontorgroup},
  data() {
      return {
        data : this.gdata,
        questiongroupname : this.gdata.groupname,
        surveyid : this.gdata.surveyid,
        allquestions:[],
        show:true,
        model_changegroup : false,
        questiontext : "",
        questionid : "",
        errors:[]
      }
  },
  methods : {
    moveelement(ele_index, pos){
      console.log("from question group");
      // console.log(this);
      var tmp_allquestions = this.allquestions;
      var celement = tmp_allquestions[ele_index];
      var otherelement = tmp_allquestions[ele_index + pos];
      Vue.set(tmp_allquestions, ele_index, otherelement);
      Vue.set(tmp_allquestions, ele_index + pos, celement);
      // console.log(this.allquestions);
      var array_index = [];
      tmp_allquestions.forEach((question, index) => {
        array_index.push({
          order:index,
          id:question._id
        })
      });
      axios.post(`/updatequestionorder`,{'neworder':array_index}).then(response => {
        console.log(response);
        axios.post(`/updatequestiontable`,{'surveyid':this.surveyid}).then(response => {
          location.reload();
          // console.log(response);
        }).catch(e => {
          this.errors.push(e)
        }) 
        // var self = this;
        // self.show = false;
        // Vue.nextTick(function (){
        //   console.log("re-render");
        //   self.show = true;
        // })
      }).catch(e => {
        this.errors.push(e)
      }) 
     
     console.log('test')
    },
    changedGroup(){ 
      var self = this;
      self.show = false;
      setTimeout(() => {
        self.show = true;
      }, 2000);
    },
    addToGroup(questionid,questiontext){
      this.questionid = questionid
      this.questiontext = questiontext
      this.model_changegroup = true
        console.log("have to implement model for "+questiontext+" - "+questionid);
    },
    deleteelement(ele_index){
      var questionid = this.allquestions[ele_index]._id
      axios.post(`/deletequestion`,{'questionid':questionid}).then(response => {
        if(response.data.n==1){
          this.allquestions.splice(ele_index,1);
        }
        axios.post(`/updatequestiontable`,{'surveyid':this.surveyid}).then(response => {
          // console.log(response);
        }).catch(e => {
          this.errors.push(e)
        }) 

      }).catch(e => {
        this.errors.push(e)
      })        
    },
    updateGroupname(){
      axios.post(`/changequestiongroupname`,{'groupid':this.data._id, 'groupname':this.data.groupname}).then(response => {
        if(response.data.n==1){
          this.allquestions.splice(ele_index,1);
        }
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    getquestionno(index){
      var qno = 0;
      for (let i = 0; i < this.allquestions.length; i++) {
        if(i >= index){
          break;
        }
        var queselement = this.allquestions[i];
        if(queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox' || queselement.questiontype == 'qtypeslider'){
        // } else if(queselement.data.questiontext != ""){
        //   qno+=1;
        } else {
          qno+=1;
        }
      }
      return qno;
    },
  },
  created(){
        this.debouncedUpdateGroupname = _.debounce(this.updateGroupname, 500)

    axios.post(`/getquestionfromgroup`,{'groupid':this.gdata._id}).then(response => {
      // console.log(JSON.stringify(response.data));
      
        this.allquestions = response.data;
    })

  },
  watch : {
    'data.groupname': function (oldArray, newArray) {
      console.log("group name changed");
      this.debouncedUpdateGroupname();
      
    },
  }
}
</script>
