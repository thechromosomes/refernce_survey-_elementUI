<template>
  <div class="questioneditor_section">
    <div v-if="qtypedata != null">
        <v-layout :id="`editor${question._id}`" class="create_question">
            <v-flex xs1 class="builderindex">
                <span v-if="qtypedata.questiontype == 'pagebreak' || qtypedata.questiontype == 'sectionheading' || qtypedata.questiontype == 'descriptionbox' || qtypedata.questiontype == 'welcomepage' || qtypedata.questiontype == 'thankyoupage'  || qtypedata.questiontype == 'qtypeslider'  " ></span>
                <span v-else>{{getquestionno(qtypedata._id)}}</span>
            </v-flex>
            <v-flex xs11 v-if="qtypedata.questiontype != 'pagebreak' && qtypedata.questiontype != 'sectionheading' && qtypedata.questiontype != 'descriptionbox' && qtypedata.questiontype != 'welcomepage' && qtypedata.questiontype != 'thankyoupage' ">
                <div class="questiontype">{{getquestiontype}}</div>
                <v-text-field class="questiontextinput" v-model="questiontext" v-if="qtypedata.questiontype != 'qtypeslider'" label="Question" required ></v-text-field>
                <div class="questionimagepreview" v-if="qtypedata.image != '' && qtypedata.haveimage == '1' ">
                <img :src="questionfinalimage" class="img-question"/>
                </div>
                <div class="tobedeletedesc"  v-if="qtypedata.havedescription == '1'">
                  <button class="btn-absolute right top" @click="removeDescription();"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></button>
                  <div class="editorinput-conatiner">
                      <div class="editorinput-title">Description </div>
                      <tinymce :id="`editor_${qtypedata._id}`" ref="tincyeditor" :init="tinyinitValue" v-model="description" @editorInit="editorInit" ></tinymce>
                  </div>
                </div>
                <div class="questionimage" v-if="qtypedata.haveimage == '1'">
                  <div class="customquestionimage">
                    <form class="form_dropzone" enctype="multipart/form-data">
                        <div class="dropzone">
                        <div>
                            <input type="file" ref="file" @change="sendImageFile" accept="image/*" class="file-upload-input" />
                            <p class="call-to-action">Drag or add a file</p>
                            <p v-if="qtypedata.image != ''" class="">{{qtypedata.image}}</p>
                        </div>
                        </div>
                    </form>
                    <span>OR</span>
                    <button class="exportbutton" id="show-modal" @click="showModal = true">Insert image url</button>
                    <button class=" " @click="removeQuestionHaveImage();"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></button>
                  </div>
                  <ImageURLInput v-if="showModal" @urlAddress="updateUrl" @closeModel="showModal = false"></ImageURLInput>
                </div>
                <div class="questionextra" v-if="qtypedata.questiontype =='nps'">
                  <v-text-field v-model="npsleft" label="Left Text" ></v-text-field>
                  <v-text-field v-model="npsmiddle" label="Middle Text" ></v-text-field>
                  <v-text-field v-model="npsright" label="Right Text" ></v-text-field>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='singlec' || qtypedata.questiontype == 'multic' || qtypedata.questiontype == 'dropdown' || qtypedata.questiontype == 'ranking'">
                  <div v-for="(choice, index) in qtypedata.choice" v-bind:key="index" class="tobedelete">
                    <v-btn class="btn-extrasmall" fab  @click="deleteChoice(index);"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
                    <v-layout align-center >
                      <v-checkbox :model="choice.choicestate" hide-details class="shrink mr-2"></v-checkbox>
                      <v-text-field :label="`Option ${index +1}`" :key="index" v-model="choice.choicetext" @input="changeChoicetext(index)" ></v-text-field>
                    </v-layout>
                  </div>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='customform'">
                  <div v-for="(customformelem, index) in qtypedata.customformdata" :key="`customformelem${index}`" class="tobedelete">
                    <v-btn class="btn-extrasmall" fab  @click="deleteField(index);"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
                        <v-layout row wrap >
                        <v-flex xs4>
                            <v-text-field v-model="customformelem.title" @input="changefielddata" label="Title" required ></v-text-field>
                        </v-flex>
                        <v-flex xs2>
                            <v-select
                                @change="changefielddata"
                                :items="allwidth"
                                label="Select Width"
                                v-model="customformelem.width"
                            ></v-select>
                        </v-flex>
                        <v-flex xs3>
                          <v-switch @change="changefielddata" v-model="customformelem.required" :label="`Required`"></v-switch>
                        </v-flex>
                        <v-flex xs2>
                            <v-select
                                @change="changefielddata"
                                :items="alltype"
                                label="Select Type"
                                v-model="customformelem.type"
                            ></v-select>
                        </v-flex>
                        </v-layout>
                    </div>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='ratescal'">
                  <v-layout row wrap >
                    <v-flex>
                      <v-slider v-model="qtypedata.length" label="Select Max Rating: " thumb-color="green" thumb-label = true always-dirty min="5" max="100" @input="changeScalelength" ></v-slider>
                    </v-flex>
                    <v-flex shrink style="width: 60px">
                      <v-card-text>{{qtypedata.length}}</v-card-text>
                    </v-flex>
                  </v-layout>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='ratestars'">
                       <v-text-field v-model="qtypedata.maxrate" @input="changeMaxrate" mask="##" label="Max Number of star"></v-text-field>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='numbertext'">
                       <v-text-field v-model="qtypedata.maskformat" mask="##" label="Digits allowed" @change="changeMaskformat"></v-text-field>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='emailtext'">
                       <v-text-field :rules="[rules.email]" label="Email" ></v-text-field>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='commenttext'">
                  <v-layout align-center>
                    <textarea disabled class="xs12textarea" rows="8"></textarea>
                  </v-layout>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='qtypedatetime'">
                  <v-radio-group v-model="qtypedata.qtype" @change="changeQType" row>
                    <v-radio label="Single Choice" value="0"></v-radio>
                    <v-radio label="Multi Choice" value="1" ></v-radio>
                  </v-radio-group>
                  <v-text-field
                      v-model="qtypedata.length"
                      label="Pick days number"
                      prepend-icon="event"
                      @change="changeScalelength"
                    ></v-text-field>
                  <div> 
                    <v-text-field
                      v-model="npsleft"
                      label="Pick min date"
                      prepend-icon="event"
                      @click="modal1 = true"
                    ></v-text-field>
                    <v-dialog
                      ref="dialog"
                      v-model="modal1"
                      :return-value.sync="npsleft"
                      persistent
                      width="290px"
                    >
                      <v-date-picker v-model="npsleft" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click="modal1 = false; $refs.dialog.save(npsleft)">OK</v-btn>
                        <v-btn color="primary" flat @click="modal1 = false">Cancel</v-btn>
                        </v-date-picker>
                    </v-dialog>
                    </div>
                    <div>
                      <v-text-field
                      v-model="npsright"
                      label="Pick max date"
                      prepend-icon="event"
                      @click="modal2 = true"
                    ></v-text-field>
                    <v-dialog
                      ref="dialog1"
                      v-model="modal2"
                      :return-value.sync="npsright"
                      persistent
                      width="290px"
                    >
                      <v-date-picker v-model="npsright" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click="modal2 = false; $refs.dialog1.save(npsright);">OK</v-btn>
                        <v-btn color="primary" flat @click="modal2 = false">Cancel</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </div>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='singletext'">
                  <v-text-field label="Answer" ></v-text-field>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='fileupload'">
                  <form class="form_dropzone" enctype="multipart/form-data">
                      <div class="dropzone">
                        <div>
                          <input type="file" ref="file" class="file-upload-input" />
                          <p class="call-to-action">Drag your file here</p>
                        </div>
                      </div>
                  </form>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='multipletext'">
                  <div v-for="(answer, index) in qtypedata.choice" v-bind:key="index" class="tobedelete">
                    <v-btn class="btn-extrasmall" fab  @click="deleteChoice(index);"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
                    <v-layout align-center >
                      <v-text-field  label="Enter Text Here" @input="changeAnswer(index)"  :key="index" v-model="answer.choicetext" ></v-text-field>
                    </v-layout>
                  </div>
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='matrixquestion'">
                  <v-radio-group v-model="qtypedata.qtype" @change="changeQType" row>
                    <v-radio label="Single Choice" value="0"></v-radio>
                    <v-radio label="Multi Choice" value="1" ></v-radio>
                  </v-radio-group>    
                  <h2>Rows</h2>
                  <div class="allrows">
                    <div v-for="(rows, index) in qtypedata.allrows" v-bind:key="index" class="tobedelete">
                      <v-btn class="btn-extrasmall" fab  @click="deleteRows(index);" ><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
                      <v-layout align-center >
                        <v-text-field  label="Enter Text Here"  :key="index" v-model="rows.option"  @input="changerowtext(index)" ></v-text-field>
                      </v-layout>
                    </div>
                  </div>
                  <h2>Columns</h2>
                  <div class="allcols">
                    <div v-for="(cols, index) in qtypedata.allcols" v-bind:key="index" class="tobedelete">
                      <v-btn class="btn-extrasmall" fab  @click="deleteCols(index);" ><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
                      <v-layout align-center >
                        <v-text-field  label="Enter Text Here"  :key="index" v-model="cols.option" @input="changecoltext(index)" ></v-text-field>
                      </v-layout>
                    </div>
                  </div>                  
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='dataTable'">
                  <h2>Columns</h2>
                  <div class="allcols">
                    <div v-for="(cols, index) in qtypedata.allcols" v-bind:key="index" class="tobedelete">
                      <v-btn class="btn-extrasmall" fab  @click="deleteCols(index);" ><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
                      <v-layout align-center >
                        <v-text-field  label="Enter Text Here"  :key="index" v-model="cols.option" @input="changecoltext(index)" ></v-text-field>
                      </v-layout>
                    </div>
                  </div>                  
                </div>
                <div class="questionextra" v-else-if="qtypedata.questiontype =='qtypeslider'">
                  <div v-for="(item,i) in qtypedata.links" v-bind:key="i" class="tobedelete">
                    <v-btn class="btn-extrasmall" fab @click="deleteURL(i);"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
                    <v-layout align-center>
                      <v-text-field :value="item.src" @input="changeURL(i)" :label="`link ${i+1}`" required ></v-text-field>
                    </v-layout>
                  </div>                  
                </div>
                <div v-if="qtypedata.other">
                  <v-layout align-center >
                    <v-checkbox hide-details class="shrink mr-2"></v-checkbox>
                    <v-text-field label="Other text"  v-model="othertext" ></v-text-field>
                  </v-layout>
                </div>
                <div v-if="qtypedata.havecomment == true">
                  <v-text-field class="questiontextinput" label="Comment text" v-model="commenttext" ></v-text-field>
                </div>
                <questionbuttons :allquestion="finalbuilderarray" :question="qtypedata" :index="origindex" :total="total"></questionbuttons>
                <loginjump v-if="loginjump != null || logicjumps.length > 0" :question="qtypedata" ></loginjump>
            </v-flex>
            <v-flex xs11 v-else-if="qtypedata.questiontype != 'pagebreak'">
              <div class="questiontype">{{getquestiontype}}</div>
              <v-text-field v-if="qtypedata.questiontype == 'sectionheading'" v-model="questiontext" label="Heading Here" required ></v-text-field>
              <tinymce v-else-if="qtypedata.questiontype == 'descriptionbox' || qtypedata.questiontype == 'welcomepage' || qtypedata.questiontype == 'thankyoupage'"  :id="`qeditor_${qtypedata._id}`" ref="tincyeditor" v-model="description" @editorInit="editorInit"></tinymce>
              <template v-if="qtypedata.questiontype == 'descriptionbox'">
                <div class="questionimagepreview" v-if="qtypedata.image != '' && qtypedata.haveimage == '1' ">
                <img :src="questionfinalimage" class="img-question"/>
                </div>
                <div class="questionimage" v-if="qtypedata.haveimage == '1'">
                  <button class="btn-absolute extreme-right top " @click="removeQuestionHaveImage();"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></button>
                  <form class="form_dropzone" enctype="multipart/form-data">
                      <div class="dropzone">
                      <div>
                          <input type="file" ref="file" @change="sendImageFile" class="file-upload-input" />
                          <p class="call-to-action">Drag your file here</p>
                          <p v-if="qtypedata.image != ''" class="">{{qtypedata.image}}</p>
                      </div>
                      </div>
                  </form>
                </div>
              </template>
              <questionbuttons :allquestion="finalbuilderarray" :question="qtypedata" :index="origindex" :total="total"></questionbuttons>
            </v-flex>
        </v-layout>
    </div>
  </div>

</template>
<script>
import multic from '../qtype/multichoice'
import singlec from '../qtype/singlechoice'
import ratescal from '../qtype/ratingscale'
import qtypedatetime from '../qtype/qtypedatetime'
import qtypeslider from '../qtype/slider'
import singletext from '../qtype/singletext'
import multipletext from '../qtype/multipletext'
import commenttext from '../qtype/commenttext'
import numbertext from '../qtype/numbertext'
import contacttext from '../qtype/contacttext'
import emailtext from '../qtype/emailtext'
import dropdown from '../qtype/dropdown'
import gpexpicture from '../qtype/gpexpicture'
import fileupload from '../qtype/fileupload'
import pagebreak from '../qtype/pagebreak'
import sectionheading from '../qtype/sectionheading'
import welcomepage from '../qtype/welcomepage'
import thankyoupage from '../qtype/thankyoupage'
import ratestars from '../qtype/ratingstars'
import customform from '../qtype/customform'
import descriptionbox from '../qtype/descriptionbox'
import matrixquestion from '../qtype/matrixquestion'
import questionbuttons from './questionbuttons'
import loginjump from './loginjump'
import ImageURLInput from '../models/ImageURLInput'
// import DateRangePicker from 'vue2-daterange-picker'

export default {
  props:['question','index','total', 'origindex'],
  components: {ImageURLInput,
    multic,singlec,ratescal,qtypedatetime,singletext,multipletext,commenttext,numbertext,contacttext,emailtext,
  qtypeslider, dropdown, gpexpicture, fileupload, pagebreak, sectionheading, welcomepage, thankyoupage, ratestars,customform,
  matrixquestion,descriptionbox,questionbuttons,loginjump },
  data() {
      return {
        showModal:false,
      keepInBounds: true,
        id : this.question._id,
        questiontext:this.question.questiontext,
        description:this.question.description,
        questiontype :this.question.questiontype,
        commenttext :this.question.commenttext,
        othertext :this.question.othertext,
        qtypedata : null,
        npsleft:this.question.npsright,
        npsright:this.question.npsright,
        npsmiddle:this.question.npsmiddle,
        loginjump : null,
        questionorder:[],
        builderarray:[],
        finalbuilderarray :[],
        modal1: false,
        modal2: false,
        readyforupdate : true,
        allwidth:["8.3%","16.6%","25%","33.3%","41.6%","50%","58.3%","66.6%","75%","83.3%","91.6%","100%"],
        alltype:["Number", "Text", "Textarea", "Email", "Date", "Phone", "Time" ],
        logicjumps:[],
        rules: {
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        },
        tinyinitValue:{
          plugins: ['image', 'imagetools'],
          menubar: "insert",
          toolbar: "image imagetools",
          image_uploadtab: true
        }
      }
  },
  methods:{
    changeCommentsection(state){
      console.log("from question editor ", state);

      this.qtypedata.havecomment = state
    },
    changeMaskformat(){
      axios.post(`/updatequestionmaskformat`,{questionid:this.qtypedata._id, maskformat:this.qtypedata.maskformat}).then(response => {
        console.log(response);
      }).catch(e => {
        console.log(e);
      })
    },
    changeOthersection(state){
      console.log("from question editor ", state);
      this.qtypedata.other = state
    },
    deleteURL(ele_index, qtypedata_choice){
        var linkid = this.qtypedata.links[ele_index]._id
        axios.post(`/deletesliderlinks`,{'linkid':linkid}).then(response => {
          if(response.data.n==1){
            this.qtypedata.links.splice(ele_index,1);
          }
        }).catch(e => {
          this.errors.push(e)
        })        

    },
    changeURL(index){
      console.log(this.qtypedata);
      
      var this_choice = this.qtypedata.links[index];
      this_choice.src = event.target.value;
      this.debouncedUpdateallsilderurl()
    },
    addURL(){
        axios.post(`/addsliderlink`,{'questionid':this.id, 'src':""}).then(response => {
          if(response.data.status==1){
            this.qtypedata.links.push(response.data.result);
          }
        }).catch(e => {
          this.errors.push(e)
        })
    },
    updateallsilderurl(){
      var questionid = this.id
      var items = this.qtypedata.links
      console.log("from options")
      axios.post(`/updatesliderlinks`,{'links':items}).then(response => {
        console.log(response);
        
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    changeQType(){
      console.log("fkdjgkdfg");
        var questionid = this.id

        
        axios.post(`/updateqtype`,{'questionid':questionid,'qtypedata':this.qtypedata.qtype}).then(response => {
          console.log(response);
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    addRows(){
        axios.post(`/addmatrixrow`,{'questionid':this.id, 'option':"0", 'radioans':""}).then(response => {
          console.log(response);
          
          if(response.data.status==1){
            this.qtypedata.allrows.push(response.data.result);
            // this.$emit("addRows",this.qtypedata.allrows);
          }
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    addCols(){
        axios.post(`/addmatrixcol`,{'questionid':this.id, 'option':""}).then(response => {
          console.log(response);
          if(response.data.status==1){
            this.qtypedata.allcols.push(response.data.result);
            // this.$emit("addCols",this.qtypedata.allcols);
          }
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    deleteCols(ele_index){
      var colid = this.qtypedata.allcols[ele_index]._id
      axios.post(`/deletematrixcols`,{'colid':colid}).then(response => {
        if(response.data.n==1){
          this.qtypedata.allcols.splice(ele_index,1);
          // this.$emit("deleteCols",this.qtypedata.allcols);
        }
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    deleteRows(ele_index){
      var rowid = this.qtypedata.allrows[ele_index]._id
      axios.post(`/deletematrixrows`,{'rowid':rowid}).then(response => {
        if(response.data.n==1){
          this.qtypedata.allrows.splice(ele_index,1);
          // this.$emit("deleteRows",this.qtypedata.allrows);
        }
      }).catch(e => {
        this.errors.push(e)
      })        

    },
    changerowtext(c_index){
      this.debouncedUpdateallrowtext()
    },
    changecoltext(c_index){
      this.debouncedUpdateallcoltext()
    },
    changeAnswer(c_index){
      this.debouncedUpdateOptions()
    },
    changeMaxrate(inputdata){
      this.debouncedUpdateMaxrate()
    },
    updateMaxrate(){
      var questionid = this.id
      var maxrate = this.qtypedata.maxrate
      axios.post(`/updatemaxrate`,{'questionid':questionid,'maxrate':maxrate}).then(response => {
        console.log(response);
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    changeScalelength(){
      this.debouncedUpdateLength()
    },
    updateLength(){
      var questionid = this.id
      var length = this.qtypedata.length
      axios.post(`/updatelength`,{'questionid':questionid,'length':length}).then(response => {
        console.log(response);
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    changefielddata(){
      this.debouncedUpdateallfielddata()
    },
    moveelement(ele_index, pos){
      console.log();
      this.$parent.moveelement(ele_index, pos)
      console.log("Called from buttons element");
    },
    deleteelement(ele_index){
      this.$parent.deleteelement(ele_index)
      console.log("Called delete from buttons element");
    },
    addLogicjump(){
        this.loginjump = "";
        console.log("Called parent function");
    },
    editorInit(){
      this.$refs.tincyeditor.editor.setContent(this.question.description)
    },
    checkrequired(){
      if(this.qtypedata.required=="1"){
        this.required = true
      }
    },
    removeDescription(){
      axios.post(`/updatehavedescription`,{'questionid':this.id,'havedesc':'0'}).then(response => {
        this.qtypedata.havedescription="0"
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    updateQuestion(){
        var questionid = this.id
        var questiontext = this.questiontext
        this.qtypedata.questiontext = questiontext
        if(this.readyforupdate){
          axios.post(`/updatequestion`,{'questionid':questionid,'questiontext':questiontext}).then(response => {
          }).catch(e => {
            this.errors.push(e)
          })        
        }
    },
    updateOtherandComment(){
        var questionid = this.id
        if(this.readyforupdate){
          axios.post(`/updatequestionothercomment`,{'questionid':questionid,'othertext':this.othertext,'commenttext':this.commenttext}).then(response => {
            console.log("updatequestionothercomment-  ", response);
            
          }).catch(e => {
            this.errors.push(e)
          })        
        }
    },
    updateDescription(){
      var questionid = this.id
      var questiondesc = this.description
      if(this.readyforupdate){
        axios.post(`/updatedescription`,{'questionid':questionid,'desctext':questiondesc}).then(response => {
          console.log(response);
        }).catch(e => {
          this.errors.push(e)
        })        
      }
    },
    updatequestionnsp(){
      var questionid = this.id
      var npsleft = this.npsleft
      var npsright = this.npsright
      var npsmiddle = this.npsmiddle
      var questiondesc = this.description
      if(this.readyforupdate){
        axios.post(`/updatequestionnsp`,{'questionid':questionid,'npsleft':npsleft ,'npsright':npsright ,'npsmiddle':npsmiddle
         }).then(response => {
          console.log(response);
        }).catch(e => {
          this.errors.push(e)
        })        
      }
    },
    updatesurveynsp(){
      var questionid = this.id
      var questiondesc = this.description
      if(this.readyforupdate){
        axios.post(`/updatesurveynsp`,{'questionid':questionid,'desctext':questiondesc}).then(response => {
          console.log(response);
        }).catch(e => {
          this.errors.push(e)
        })        
      }
    },
    removeQuestionHaveImage(){
      axios.post(`/updatehaveimage`,{'questionid':this.id,'haveimage':'0'}).then(response => {
        this.qtypedata.haveimage="0"
        this.qtypedata.image=""
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    addToGroup(questionid,questiontext){
      this.$parent.addToGroup(questionid,questiontext)
        console.log("have to implement model for "+questiontext+" - "+questionid);
    },
    async sendImageFile(){
      const file = this.$refs.file.files[0];
      if(!file.type.includes("image/")){
          var error = 'Only Image Allowed';
          this.$toast.open({
            message:error,
            type : "error",
            position: 'bottom',
          });
        return ;
      }
      if(file.size > (5 * 1024*1025)){
          var error = 'Image too large, max image size is 5MB';
          this.$toast.open({
            message:error,
            type : "error",
            position: 'bottom',
          });
        return ;
      }
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      let reader = new FileReader();
      var uplaod = false;
        const res = await axios.post("/upload", formData);
      reader.readAsDataURL(file);
      reader.onload = evt => {
        console.log("success evt- ", evt);
        let img = new Image();
        img.src = evt.target.result;
        img.onload = () => {
          console.log(img.width);
          console.log(img.height);
          if(img.width < 200 || img.height < 200){
            this.$toast.open({
              message:"minimum size of image is 200X200",
              type : "error",
              position: 'bottom',
            });
            return ;
          } else {
            try{
              axios.post(`/updatequestionimage`,{'questionid':this.id,'image':res.data.file}).then(response => {
                  this.qtypedata.image=res.data.file
              }).catch(e => {
                this.errors.push(e)
              })        
              
            } catch(err){
              this.message = err.response.data.error;
              this.error = true;
            }
          }
        }
      }
      reader.onerror = evt => {
        console.log("error evt- ", evt);
      }

    },
    deleteChoice(ele_index){
        var optionid = this.qtypedata.choice[ele_index]._id
        axios.post(`/deleteoptions`,{'optionid':optionid}).then(response => {
          if(response.data.n==1){
            this.qtypedata.choice.splice(ele_index,1);
          }
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    deleteField(ele_index){
        var fieldid = this.qtypedata.customformdata[ele_index]._id
        axios.post(`/deletecustimfield`,{'fieldid':fieldid}).then(response => {
          console.log(response);
          if(response.data.n==1){
            this.qtypedata.customformdata.splice(ele_index,1);
          }
        }).catch(e => {
          this.errors.push(e)
        })        

    },
    addChoice(){
        axios.post(`/addoptions`,{'questionid':this.id, 'choicestate':"0", 'choicetext':""}).then(response => {
          if(response.data.status==1){
            this.qtypedata.choice.push(response.data.result);
          }
        }).catch(e => {
          this.errors.push(e)
        })        

    },
    addField(){
        axios.post(`/addnewcustomfield`,{'questionid':this.id, 'formdata':{
          title:"",
          type:"Text",
          width:"100%",
          required:false,
        }}).then(response => {
          if(response.data.status==1){
            this.qtypedata.customformdata.push(response.data.result);
          }
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    changeQuestiondata(){
      this.readyforupdate = false
      axios.post(`/getquestion`,{'questionid':this.question._id}).then(response => {
        
        this.qtypedata = response.data.data;
        this.id = this.qtypedata._id
        this.questiontext = this.qtypedata.questiontext
        this.description = this.qtypedata.description
        this.readyforupdate = true
      })
    },
    changeChoicetext(c_index){
      this.qtypedata.choice[c_index].choicetext = event.target.value;
      this.debouncedUpdateOptions()

    },
    updateallChoicetext(){
      var questionid = this.id
      var options = this.qtypedata.choice
      if(this.readyforupdate){
        axios.post(`/updatequestionoption`,{'alloption':options}).then(response => {
        }).catch(e => {
          this.errors.push(e)
        })
      }
    },
    updateallfielddata(){
      var questionid = this.id
      var allfields = this.qtypedata.customformdata
      axios.post(`/updatecustomfields`,{'allfields':allfields}).then(response => {
      console.log("changefielddata")
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    updateallcoltext(){
      var questionid = this.id
      var allcols = this.qtypedata.allcols
      axios.post(`/updatematrixcols`,{'allcols':allcols}).then(response => {
        console.log(response);
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    updateallrowtext(){
      var questionid = this.id
      var allrows = this.qtypedata.allrows
      axios.post(`/updatematrixrows`,{'allrows':allrows}).then(response => {
        console.log(response);
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    getquestionno(qno){
      var num = 0
      var retno = ""
      this.finalbuilderarray.forEach((queselement, key) => {
         if(queselement.questiontype == 'welcomepage' || queselement.questiontype == 'thankyoupage'  || queselement.questiontype == 'sectionheading'  || queselement.questiontype == 'pagebreak' || queselement.questiontype == 'descriptionbox' || queselement.questiontype == 'qtypeslider' ){
        // } else if(queselement.questiontext != ""){
        //   qno+=1;
        } else {
          num+=1;
        }
        if(queselement._id == qno){
          retno = (num)+"."
          return retno
        }
      });
      return retno;        
    },
    getquestionno111(index){
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
    updateUrl(data){
      axios.post(`/updatequestionimage`,{'questionid':this.id,'image':data})
      .then(response => {
      //  let imageURL = JSON.parse(response.config.data).image ;
      this.qtypedata.image=data;
      console.log('q type data',this.qtypedata);
      })
      .catch(e => {
       this.errors.push(e)
      console.log('errror>>>>', e)
       }) 
       this.showModal = false;

    },
    updatequestiondisplay(){
          var simplequestion = ["multic", "dropdown", "singlec", "qtypeslider", "matrixquestion", "multipletext", "customform","ranking", "dataTable"]
      if(simplequestion.indexOf(this.question.questiontype) >= 0){
              axios.post(`/getquestion`,{'questionid':this.question._id}).then(response => {
        // console.log("question", this.question);
        // console.log("getquestion response", response);
                this.qtypedata = response.data.data;
              })
              axios.post(`/getalllogicjump`,{'questionid':this.question._id}).then(response => {
                  this.logicjumps = response.data;
              })
            } else {
              this.qtypedata = this.question;
              axios.post(`/getalllogicjump`,{'questionid':this.question._id}).then(response => {
                  this.logicjumps = response.data;
              })
            }


    }
  },
  watch: {
    // whenever question changes, this function will run
    questiontext: function (newQuestion, oldQuestion) {
      this.debouncedUpdateQuestion()
      // this.updateQuestion()
    },
    id: function (newQuestion, oldQuestion) {
      this.updatequestiondisplay()
    },
    othertext: function (newQuestion, oldQuestion) {
      this.debouncedUpdateOtherandComment()
      // this.updateQuestion()
    },
    commenttext: function (newQuestion, oldQuestion) {
      this.debouncedUpdateOtherandComment()
      // this.updateQuestion()
    },
    editor: function (newQuestion, oldQuestion) {
      console.log("update quetext", this.editor.questiontext);
    },
    description: function (newQuestion, oldQuestion) {
      console.log("update quedesc");
      this.debouncedUpdateDescription()
    },
    npsright: function (newQuestion, oldQuestion) {
      console.log("update quedesc");
      this.debouncedupdatequestionnsp()
    },
    npsleft: function (newQuestion, oldQuestion) {
      console.log("update quedesc");
      this.debouncedupdatequestionnsp()
    },
    'question._id': function (newQuestionid, oldQuestionid) {
      this.debouncedChangeQuestion()
    },
    'qtypedata.havedescription': function (newhavedescription, oldhavedescription) {
      return this.qtypedata.havedescription;
    },
    'qtypedata.haveimage': function (newhaveimage, oldhaveimage) {
      return this.qtypedata.haveimage;
    }

  },
  created(){
    // console.log("editor- ", this.editor);
    
    this.debouncedUpdateQuestion = _.debounce(this.updateQuestion, 500)
    this.debouncedUpdateDescription = _.debounce(this.updateDescription, 500)
    this.debouncedupdatequestionnsp = _.debounce(this.updatequestionnsp, 500)
    this.debouncedChangeQuestion = _.debounce(this.changeQuestiondata, 50)
    this.debouncedUpdateOptions = _.debounce(this.updateallChoicetext, 500)
    this.debouncedUpdateallfielddata = _.debounce(this.updateallfielddata, 500)
    this.debouncedUpdateLength = _.debounce(this.updateLength, 500)
    this.debouncedUpdateMaxrate = _.debounce(this.updateMaxrate, 500)
    this.debouncedUpdateallcoltext = _.debounce(this.updateallcoltext, 500)
    this.debouncedUpdateallrowtext = _.debounce(this.updateallrowtext, 500)
    this.debouncedUpdateallsilderurl = _.debounce(this.updateallsilderurl, 500)
    this.debouncedUpdateOtherandComment = _.debounce(this.updateOtherandComment, 500)
    axios.post(`/getquestions`,{'surveyid':this.question.surveyid}).then(response => {
        this.builderarray = response.data
        axios.post(`/getquestionorder`,{'surveyid':this.question.surveyid}).then(response => {
            this.questionorder = response.data
            var qorder = 0;
            var decorder = 0;
            this.questionorder.forEach(element => {
                this.builderarray.forEach(q => {
                    q.order = element.order
                    if((q._id == element.questionid) && !(q.questiontype == 'welcomepage' || q.questiontype == 'thankyoupage'  || q.questiontype == 'sectionheading'  || q.questiontype == 'pagebreak' || (q.questiontype == 'descriptionbox' && q.required == "0") || q.questiontype == 'qtypeslider' )){
                      if(q.questiontype == 'descriptionbox'){
                        q.questiontext = "Description "+(++decorder);
                        } else {
                          qorder++;
                          q.questiontext = qorder+". "+q.questiontext
                        }
                        this.finalbuilderarray.push(q)
                    }
                });
            });
            // this.currentquestiondata = this.finalbuilderarray[this.currentquestion]
            // if(simplequestion.indexOf(this.question.questiontype) >= 0){
            //   axios.post(`/getquestion`,{'questionid':this.question._id}).then(response => {
            //     this.qtypedata = response.data.data;
            //   })
            //   axios.post(`/getalllogicjump`,{'questionid':this.question._id}).then(response => {
            //       this.logicjumps = response.data;
            //   })
            // } else {
            //   this.qtypedata = this.question;
            //   axios.post(`/getalllogicjump`,{'questionid':this.question._id}).then(response => {
            //       this.logicjumps = response.data;
            //   })
            // }
            this.updatequestiondisplay()
        })
    })
    .catch(e => {
        this.errors.push(e)
    })    



  },
  computed: {
    // a computed getter
    questionfinalimage: function () {
      if(this.qtypedata.image.indexOf('://') > 0){
        return this.qtypedata.image;
      } else {
        return window.publicfileurl+this.qtypedata.image;
      }
    },
    getquestiontype:function(){
      if(this.qtypedata.questiontype == 'multic'){
        return "Multi choice Question";
      } else if(this.qtypedata.questiontype == 'singlec'){
        return "Single choice Question";
      } else if(this.qtypedata.questiontype == 'dropdown'){
        return "Dropdown Question";
      } else if(this.qtypedata.questiontype == 'qtypeslider'){
        return "Slider";
      } else if(this.qtypedata.questiontype == 'matrixquestion'){
        return "Matrix Question";
      } else if(this.qtypedata.questiontype == 'multipletext'){
        return "Multi text Question";
      } else if(this.qtypedata.questiontype == 'singletext'){
        return "Single text Question";
      } else if(this.qtypedata.questiontype == 'customform'){
        return "Custom Question";
      } else if(this.qtypedata.questiontype == 'ratescal'){
        return "Rating slider Question";
      } else if(this.qtypedata.questiontype == 'ratestars'){
        return "Rating star Question";
      } else if(this.qtypedata.questiontype == 'qtypedatetime'){
        return "Date type Question";
      } else if(this.qtypedata.questiontype == 'commenttext'){
        return "Comment Question";
      } else if(this.qtypedata.questiontype == 'numbertext'){
        return "Number type Question";
      } else if(this.qtypedata.questiontype == 'emailtext'){
        return "Email Question";
      } else if(this.qtypedata.questiontype == 'fileupload'){
        return "File upload Question";
      } else if(this.qtypedata.questiontype == 'sectionheading'){
        return "Section heading";
      } else if(this.qtypedata.questiontype == 'welcomepage'){
        return "Welcome notes";
      } else if(this.qtypedata.questiontype == 'thankyoupage'){
        return "Thankyou notes";
      } else if(this.qtypedata.questiontype == 'descriptionbox'){
        return "Description box";
      } else if(this.qtypedata.questiontype == 'ranking'){
        return "Ranking";
      } else if(this.qtypedata.questiontype == 'nps'){
        return "NPS";
      } else if(this.qtypedata.questiontype == 'contactInfo'){
        return "contactInfo";
      } else if (this.qtypedata.questiontype == 'dataTable'){
        return "dataTable"
      } else {
        return "New Question";
      }
    }

  }
}
</script>
<style scoped>
.questionimage {
    padding-right: 10px;
}
</style>