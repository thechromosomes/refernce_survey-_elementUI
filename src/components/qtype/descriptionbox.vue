<template>
  <div class="Description qtype">
    <div class="editorinput-conatiner"> 
      <div class="editorinput-title">Description: </div>
      <!-- <v-editor-app v-model="qtypedata.description"  @input="changeDescription" ></v-editor-app> -->
      <tinymce :id="`editor_${qtypedata._id}`" ref="tincyeditor"  v-model="qtypedata.description" @input="changeDescription" @editorInit="editorInit" ></tinymce>
    </div>

  </div>
</template>
<script>  
export default {
  props:['qtypedata'],
  data() {
    return {
      id:this.qtypedata._id,
      questiondesc:this.qtypedata.description
    }
  }, 
  methods: {
    editorInit(){
      this.$refs.tincyeditor.editor.setContent(this.questiondesc)
    },
    changeDescription(inputdata){
      this.questiondesc = inputdata
    },
    updateDescription(){
      var questionid = this.id
      var questiondesc = this.questiondesc
      axios.post(`/updatedescription`,{'questionid':questionid,'desctext':questiondesc}).then(response => {
        console.log(response);
      }).catch(e => {
        this.errors.push(e)
      })        
    }
  },
  watch: {
    questiondesc: function (newQuestion, oldQuestion) {
      this.debouncedUpdateDescription()
      // this.updateQuestion()
    }
  },created: function () {
    this.debouncedUpdateDescription = _.debounce(this.updateDescription, 500)
  },

}
</script>
