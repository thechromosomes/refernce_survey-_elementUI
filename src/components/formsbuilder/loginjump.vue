<template>
  <div class="logicjump_section">
      <div class="container_logicjump" v-if="jumpdata.length > 0">
        <div v-for="(jump, jindex) in jumpdata" :key="`jump${jindex}`">
          <div class="jumpelement" v-if="jumptype1.indexOf(question.questiontype) >= 0">
            <v-layout>
              <v-flex xs1 class="conditiontext flexcenter">If</v-flex>
              <v-flex xs3 class="conditionon">
                <v-select :items="question.choice" v-model="jump.choiceid" label="Select Option" @change="changelogicdata" item-text="choicetext" item-value="_id"></v-select>
              </v-flex>
                <v-flex xs3 class="nextquestion">
                <v-select :items="gotodata" v-model="jump.goto" label="Select logic" @change="changelogicdata" item-text="text" item-value="code"></v-select>
              </v-flex>
              <v-flex xs3 class="nextquestion">
                <v-select :items="allgroup" v-if="jump.goto == 1" v-model="jump.nextquestion" label="Select Group" @change="changelogicdata" item-text="groupname" item-value="_id"></v-select>
                <v-select :items="allquestions" v-else v-model="jump.nextquestion" label="Select Question" @change="changelogicdata" item-text="questiontext" item-value="_id"></v-select>
              </v-flex>
              <v-flex xs2 flexcenter>
                <button v-if="jumpdata.length != jindex" @click="deleteLogic(jindex)" class="btn-jumpaction delete"><img src="../../assets/icons/minus-circle-white.svg" /></button>
                <button v-if="jumpdata.length == (jindex+1)" @click="addLogic" class="btn-jumpaction add"><img src="../../assets/icons/plus-circle-light-white.svg" /></button>
              </v-flex>
            </v-layout>
          </div>
          <div class="jumpelement" v-else-if="jumptype2.indexOf(question.questiontype) >= 0">
            <v-layout>
              <v-flex xs1 class="conditiontext flexcenter">If</v-flex>
              <v-flex xs3 class="nextquestion">
                Answer
                <v-select :items="conditions" v-model="jump.condition" label="Select Condition" @change="changelogicdata" item-text="text" item-value="code"></v-select>
              </v-flex>
              <v-flex xs3 class="conditionon">
                <v-text-field v-model="jump.answer" label="Value" @input="changelogicdata"  ></v-text-field>
              </v-flex>
              <v-flex xs3 class="nextquestion">
                <v-select :items="gotodata" v-model="jump.goto" label="Select logic" @change="changelogicdata" item-text="text" item-value="code"></v-select>
              </v-flex>
              <v-flex xs3 class="nextquestion">
                <v-select :items="allgroup" v-if="jump.goto == 1" v-model="jump.nextquestion" label="Select Group" @change="changelogicdata" item-text="groupname" item-value="_id"></v-select>
                <v-select :items="allquestions" v-else v-model="jump.nextquestion" label="Select Question" @change="changelogicdata" item-text="questiontext" item-value="_id"></v-select>
              </v-flex>
              <v-flex xs2 flexcenter>
                <button v-if="jumpdata.length != jindex" @click="deleteLogic(jindex)" class="btn-jumpaction delete"><img src="../../assets/icons/minus-circle-white.svg" /></button>
                <button v-if="jumpdata.length == (jindex+1)" @click="addLogic" class="btn-jumpaction add"><img src="../../assets/icons/plus-circle-light-white.svg" /></button>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </div>
      <div class="container_logicjump" v-else>
        <div>
          <div class="jumpelement">
            <v-layout>
              <v-flex xs1 class="conditiontext flexcenter"></v-flex>
              <v-flex xs4 class="conditionon">
              </v-flex>
              <v-flex xs4 class="nextquestion">
              </v-flex>
              <v-flex xs3 flexcenter>
                <button @click="addLogic" class="btn-jumpaction add"><img src="../../assets/icons/plus-circle-light-white.svg" /></button>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </div>

  </div>
</template>
<script>
export default {
  props:['question'],
  data() {
      return {
        quid : this.question._id,
        groupid : this.question.groupid,
        surveyid : this.question.surveyid,
        data : this.question,
        allquestions:[],
        jumptype1:["multic","singlec","dropdown",],
        jumptype2:["numbertext","ratestars","ratescal"],
        allgroup:[],
        jumpdata:[],
        gotodata:[
          {
            code:0,
            text:"question"
          },
          {
            code:1,
            text:"group"
          }
        ],
        conditions:[
          {
            "code":"<",
            "text":"is less then"
          },
          {
            "code":">",
            "text":"id greater then"
          },
          {
            "code":"=",
            "text":"is equal to"
          },
          {
            "code":"!=",
            "text":"is not equal to"
          }
        ],
        defaultjump:{
            questionid:this.question._id,
            surveyid:this.question.surveyid,
            choiceid:"",
            condition:"",
            goto:0,
            answer:"",
            nextquestion:""
        }
      }
  },
  methods:{
    addLogic(){
      axios.post(`/addlogicjump`,{'logicdata':this.defaultjump}).then(response => {
        this.jumpdata.push(response.data);
      });
    },
    deleteLogic(index){
      var logicid = this.jumpdata[index]._id
      axios.post(`/deletelogicjump`,{'logicid':logicid}).then(response => {
        if(response.data.n==1){
          this.jumpdata.splice(index,1);
        }
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    changelogicdata(){
      this.debouncedchangelogicdata()
      console.log("have to call API to update logics");
    },
    updatelogicdata(){
      var alljumpdata = this.jumpdata
      axios.post(`/updatelogicdata`,{'alljumpdata':alljumpdata}).then(response => {
      }).catch(e => {
        this.errors.push(e)
      })
    }
  },
  created(){
    this.debouncedchangelogicdata = _.debounce(this.updatelogicdata, 2000)

    axios.post(`/getquestiongroups`,{'surveyid':this.surveyid}).then(response => {
        this.allgroup = response.data;
    })
    axios.post(`/getquestions`,{'surveyid':this.surveyid}).then(qsresponse => {
            axios.post(`/getquestionorder`,{'surveyid':this.surveyid}).then(response => {
              var qno = 0
              var decorder = 0
              response.data.forEach(element => {
                // console.log(element);
                  qsresponse.data.forEach(q => {
                      q.order = element.order
                      if(q._id == element.questionid){
                        if(q.questiontype == 'welcomepage' || q.questiontype == 'thankyoupage'  || q.questiontype == 'sectionheading'  || q.questiontype == 'pagebreak' || q.questiontype == 'descriptionbox' || q.questiontype == 'qtypeslider' ){
                          if((q.questiontype == 'descriptionbox' && q.required == "1")){
                            q.questiontext = "Description "+(++decorder);
                            this.allquestions.push(q)
                          } else if(q.questiontext == ""){
                              q.questiontext = "element type:- "+q.questiontype 
                            }
                          } else {
                            qno++
                            q.questiontext = qno + ".  "+q.questiontext;
                            this.allquestions.push(q)
                          }
                      }
                  });
              });
            axios.post(`/getallwelcomethankyoudataforlogic`,{'surveyid':this.surveyid,datatype:'thankyoupage'}).then(response => {
                if(response.data == null){

                } else {
                    response.data.forEach((q, index) => {
                      // console.log(q);
                      var thankno = index +1; 
                      q.questiontext = "Thankyou page "+thankno;
                              // if(q._id == element.questionid){
                      this.allquestions.push(q)
                              // }
                          });
                }
              })              
            })
            .catch(e => {
              console.log(e);
            })
    })
    axios.post(`/getalllogicjump`,{'questionid':this.question._id}).then(response => {
        var alljumps = response.data;
        if(alljumps.length == 0){
          axios.post(`/addlogicjump`,{'logicdata':this.defaultjump}).then(response => {
              this.jumpdata.push(response.data);
          })
        } else {
          this.jumpdata = alljumps;
        }
    })
  }
}
</script>
