<template>
  <div class="qtype_matrixquestion">
    <v-text-field v-model="qtypedata.questiontext" @input="changeQuestion"  label="Form heading" required ></v-text-field>
    <div class="questionimagepreview" v-if="qtypedata.image != '' && qtypedata.haveimage == '1' ">
      <img :src="questionfinalimage" class="img-question"/>
    </div>
    <div class="tobedeletedesc"  v-if="qtypedata.havedescription == '1'">
        <button class="btn-absolute right top" @click="removeDescription();"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></button>
      <div class="editorinput-conatiner">
        <div class="editorinput-title">Description: </div>
        <!-- <v-editor-app v-model="qtypedata.description" @input="changeDescription"></v-editor-app> -->
        <tinymce :id="`editor_${qtypedata._id}`" ref="tincyeditor"  v-model="qtypedata.description" @input="changeDescription" @editorInit="editorInit"></tinymce>
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
      <v-chip class="addchip" @click="addRows();"><v-avatar><v-icon>add</v-icon></v-avatar>Add Rows</v-chip>
    </div>
    <h2>Columns</h2>
    <div class="allcols">
      <div v-for="(cols, index) in qtypedata.allcols" v-bind:key="index" class="tobedelete">
        <v-btn class="btn-extrasmall" fab  @click="deleteCols(index);" ><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
        <v-layout align-center >
          <v-text-field  label="Enter Text Here"  :key="index" v-model="cols.option" @input="changecoltext(index)" ></v-text-field>
        </v-layout>
      </div>
      <v-chip class="addchip" @click="addCols();"><v-avatar><v-icon>add</v-icon></v-avatar>Add Cols</v-chip>
    </div>
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
      allrows:this.qtypedata.allrows,
      allcols:this.qtypedata.allcols,
      qtype:this.qtypedata.qtype,
      required:false,
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
    deleteRows(ele_index){
      var rowid = this.qtypedata.allrows[ele_index]._id
      axios.post(`/deletematrixrows`,{'rowid':rowid}).then(response => {
        if(response.data.n==1){
          this.qtypedata.allrows.splice(ele_index,1);
          this.$emit("deleteRows",this.qtypedata.allrows);
        }
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
    deleteCols(ele_index){
      var colid = this.qtypedata.allcols[ele_index]._id
      axios.post(`/deletematrixcols`,{'colid':colid}).then(response => {
        if(response.data.n==1){
          this.qtypedata.allcols.splice(ele_index,1);
          this.$emit("deleteCols",this.qtypedata.allcols);
        }
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    addRows(){
        axios.post(`/addmatrixrow`,{'questionid':this.id, 'option':"0", 'radioans':""}).then(response => {
          console.log(response);
          
          if(response.data.status==1){
            this.qtypedata.allrows.push(response.data.result);
            this.$emit("addRows",this.qtypedata.allrows);
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
            this.$emit("addCols",this.qtypedata.allcols);
          }
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    changeQuestion(inputdata){
      this.questiontext = inputdata
    },
    changeQType(newval){
        var questionid = this.id
        var questiontext = this.questiontext
        axios.post(`/updateqtype`,{'questionid':questionid,'qtypedata':newval}).then(response => {
          console.log(response);
        }).catch(e => {
          this.errors.push(e)
        })        
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
    changecoltext(c_index){
      this.debouncedUpdateallcoltext()
    },
    updateallcoltext(){
      var questionid = this.id
      var allcols = this.qtypedata.allcols
      console.log(allcols);
      axios.post(`/updatematrixcols`,{'allcols':allcols}).then(response => {
        console.log(response);
        
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    changerowtext(c_index){
      this.debouncedUpdateallrowtext()
    },
    updateallrowtext(){
      var questionid = this.id
      var allrows = this.qtypedata.allrows
      console.log(allrows);
      axios.post(`/updatematrixrows`,{'allrows':allrows}).then(response => {
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
    this.debouncedUpdateallcoltext = _.debounce(this.updateallcoltext, 500)
    this.debouncedUpdateallrowtext = _.debounce(this.updateallrowtext, 500)
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
