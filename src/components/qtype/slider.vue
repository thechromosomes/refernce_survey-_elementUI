<template>
  <div class="text_contact">
    <h4>Slider Description: </h4>
    <v-form class="text_contacttext" label="Slider summary text " ref="form" lazy-validation >
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
    <div v-for="(item,i) in qtypedata.links" v-bind:key="i" class="tobedelete">
      <v-btn class="btn-extrasmall" fab @click="deleteURL(i);"><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
      <v-layout align-center>
        <v-text-field :value="item.src" @input="changeURL(i)" :label="`link ${i+1}`" required ></v-text-field>
      </v-layout>
    </div>
      <div class="que_bottom_btns">
        <v-chip class="addchip" @click="addURL();"><v-avatar><v-icon>add</v-icon></v-avatar>URL</v-chip>
        <v-chip class="addchip" @click="addDescription();"><v-avatar><v-icon>format_align_left</v-icon></v-avatar>Add Instruction</v-chip>
        <v-chip class="addchip" @click="addQuestionHaveImage()"><v-avatar><v-icon>image</v-icon></v-avatar>Add Image</v-chip>
      </div>
    </v-form>
    <v-divider></v-divider>
<v-carousel>
    <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src" ></v-carousel-item>
  </v-carousel>
    </div>
</template>
<style scoped>
.text_contact{
  padding-bottom: 30px;
}
</style>

<script>
export default {
  props:['qtypedata'],
  data () {
    return {
      id:this.qtypedata._id,
      questiondesc: this.qtypedata.description,
      items: this.qtypedata.links
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
    deleteURL(ele_index, qtypedata_choice){
        var linkid = this.items[ele_index]._id
        axios.post(`/deletesliderlinks`,{'linkid':linkid}).then(response => {
          if(response.data.n==1){
            this.items.splice(ele_index,1);
            this.$emit("deleteURL",this.items);
          }
        }).catch(e => {
          this.errors.push(e)
        })        

    },
    changeURL(index){
      var this_choice = this.items[index];
      this_choice.src = event.target.value;
      this.debouncedUpdateallsilderurl()
    },
    updateallsilderurl(){
      var questionid = this.id
      var items = this.items
      console.log("from options")
      axios.post(`/updatesliderlinks`,{'links':items}).then(response => {
        console.log(response);
        
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    addURL(){
        axios.post(`/addsliderlink`,{'questionid':this.id, 'src':""}).then(response => {
          if(response.data.status==1){
            this.items.push(response.data.result);
            this.$emit("addURL",this.items);
          }
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
    questiondesc: function (newQuestion, oldQuestion) {
      this.debouncedUpdateDescription()
    }
  },created: function () {
    this.debouncedUpdateDescription = _.debounce(this.updateDescription, 500)
    this.debouncedUpdateallsilderurl = _.debounce(this.updateallsilderurl, 500)
  },
  computed: {
    // a computed getter
    questionfinalimage: function () {

      return window.publicfileurl+this.qtypedata.image;
    }
  }
}
</script>