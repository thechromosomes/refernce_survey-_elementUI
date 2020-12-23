<template>
  <div class="qtype_customform">
    <v-text-field v-model="qtypedata.questiontext" @input="changeQuestion" label="Form heading" required ></v-text-field>
    <div class="questionimagepreview" v-if="qtypedata.image != '' && qtypedata.haveimage == '1' ">
      <img :src="questionfinalimage" class="img-question"/>
    </div>
    <div class="tobedeletedesc"  v-if="qtypedata.havedescription == '1'">
        <button class="btn-absolute right top" @click="removeDescription();"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></button>
      <div class="editorinput-conatiner">
        <div class="editorinput-title">Description: </div>
        <tinymce :id="`editor_${qtypedata._id}`" ref="tincyeditor"  v-model="qtypedata.description" @input="changeDescription" @editorInit="editorInit" ></tinymce>
        <!-- <v-editor-app v-model="qtypedata.description" @input="changeDescription"></v-editor-app> -->
      </div>
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
    <v-container grid-list-md >
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
      <div class="que_bottom_btns">
        <v-chip class="addchip" @click="addField();"><v-avatar><v-icon>add</v-icon></v-avatar>Add Field</v-chip>
        <v-chip class="addchip" @click="addDescription();"><v-avatar><v-icon>format_align_left</v-icon></v-avatar>Add Instruction</v-chip>
        <v-chip class="addchip" @click="addQuestionHaveImage()"><v-avatar><v-icon>image</v-icon></v-avatar>Add Image</v-chip>
        <v-checkbox 
        v-model="required"
        :label="`Required`"
        @change="changerequired"
      ></v-checkbox>
      </div>
 </v-container>
  </div>
</template>
<script>
export default {
  props:['qtypedata'],
  data() {
    return {
      id:this.qtypedata._id,
      questiontext:this.qtypedata.questiontext,
      questiondesc:this.qtypedata.description,
      customformdata:this.qtypedata.customformdata,
      allwidth:["8.3%","16.6%","25%","33.3%","41.6%","50%","58.3%","66.6%","75%","83.3%","91.6%","100%"],
      alltype:["Number", "Text", "Textarea", "Email", "Date", "Phone", "Time" ],
      required:false
    }
  }, 
  methods: {
    editorInit(){
      this.$refs.tincyeditor.editor.setContent(this.questiondesc)
    },
    addDescription(){
      axios.post(`/updatehavedescription`,{'questionid':this.id,'havedesc':'1'}).then(response => {
          this.qtypedata.havedescription="1"
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
     axios.post(`/updatequestionrequired`,{'questionid':this.id,'required':required}).then(response => {
         console.log(response);
         this.qtypedata.required=required
         
      }).catch(e => {
        this.errors.push(e)
      })  
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
    deleteField(ele_index){
        var fieldid = this.qtypedata.customformdata[ele_index]._id
        axios.post(`/deletecustimfield`,{'fieldid':fieldid}).then(response => {
          console.log(response);
          
          if(response.data.n==1){
            this.qtypedata.customformdata.splice(ele_index,1);
            this.$emit("deleteField",this.qtypedata.customformdata);
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
            this.$emit("addField",this.qtypedata.customformdata);
          }
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    changeQuestion(inputdata){
      this.questiontext = inputdata
    },
    updateQuestion(){
        var questionid = this.id
        var questiontext = this.questiontext
        axios.post(`/updatequestion`,{'questionid':questionid,'questiontext':questiontext}).then(response => {
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    changeDescription(currenttext){
      this.questiondesc = currenttext;
    },
    updateDescription(){
      var questionid = this.id
      var questiondesc = this.questiondesc
      axios.post(`/updatedescription`,{'questionid':questionid,'desctext':questiondesc}).then(response => {
        console.log(response);
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    changefielddata(){
      this.debouncedUpdateallfielddata()

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
    addQuestionHaveImage(){
      axios.post(`/updatehaveimage`,{'questionid':this.id,'haveimage':'1'}).then(response => {
          this.qtypedata.haveimage="1"
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    removeQuestionHaveImage(){
      axios.post(`/updatehaveimage`,{'questionid':this.id,'haveimage':'0'}).then(response => {
        this.qtypedata.haveimage="0"
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    async sendImageFile(){
      const file = this.$refs.file.files[0];
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      try{
        const res = await axios.post("/upload", formData);
        axios.post(`/updatequestionimage`,{'questionid':this.id,'image':res.data.file}).then(response => {
          this.qtypedata.image=res.data.file
        }).catch(e => {
          this.errors.push(e)
        })        
        
      } catch(err){
        this.message = err.response.data.error;
        this.error = true;
      }
    },

  },
  watch: {
    // whenever question changes, this function will run
    questiontext: function (newQuestion, oldQuestion) {
      this.debouncedUpdateQuestion()
      // this.updateQuestion()
    },
    questiondesc: function (newQuestion, oldQuestion) {
      this.debouncedUpdateDescription()
    }

  },created: function () {
    this.debouncedUpdateQuestion = _.debounce(this.updateQuestion, 500)
    this.debouncedUpdateDescription = _.debounce(this.updateDescription, 500)
    this.debouncedUpdateallfielddata = _.debounce(this.updateallfielddata, 500)
    this.checkrequired()
  },
  computed: {
    // a computed getter
    questionfinalimage: function () {

      return window.publicfileurl+this.qtypedata.image;
    }
  }
}
</script>
