<template>
  <div class="qtype_date">
    <v-text-field v-model="qtypedata.questiontext" @input="changeQuestion" label="Type Question here..." required ></v-text-field>
    <div class="questionimagepreview" v-if="qtypedata.image != '' && qtypedata.haveimage == '1' ">
      <img :src="questionfinalimage" class="img-question"/>
    </div>
    <div class="tobedeletedesc"  v-if="qtypedata.havedescription == '1'">
        <button class="btn-absolute right top" @click="removeDescription();"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></button>
      <div class="editorinput-conatiner">
        <div class="editorinput-title">Description: </div>
        <tinymce :id="`editor_${qtypedata._id}`" ref="tincyeditor"  v-model="qtypedata.description" @input="changeDescription" @editorInit="editorInit"></tinymce>
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
      <v-layout align-center>
        <v-date-picker v-model="date1" :show-current="false"></v-date-picker>
      </v-layout>
      <div class="que_bottom_btns">
        <v-chip class="addchip" @click="addDescription();"><v-avatar><v-icon>format_align_left</v-icon></v-avatar>Add Instruction</v-chip>
        <v-chip class="addchip" @click="addQuestionHaveImage()"><v-avatar><v-icon>image</v-icon></v-avatar>Add Image</v-chip>
        <v-checkbox 
        v-model="required"
        :label="`Required`"
        @change="changerequired"
      ></v-checkbox>
      </div>
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
      date1: new Date().toISOString().substr(0, 10),
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
    removeDescription(){
      axios.post(`/updatehavedescription`,{'questionid':this.id,'havedesc':'0'}).then(response => {
        this.qtypedata.havedescription="0"
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    changeQuestion(inputdata){
      this.questiontext = inputdata
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
    updateQuestion(){
        var questionid = this.id
        var questiontext = this.questiontext
        axios.post(`/updatequestion`,{'questionid':questionid,'questiontext':questiontext}).then(response => {
          console.log(response);
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
    },
    questiondesc: function (newQuestion, oldQuestion) {
      this.debouncedUpdateDescription()
    }
  },created: function () {
    this.debouncedUpdateQuestion = _.debounce(this.updateQuestion, 500)
    this.debouncedUpdateDescription = _.debounce(this.updateDescription, 500)
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
