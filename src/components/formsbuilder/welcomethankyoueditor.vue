<template>
  <div class="questioneditor_section">
    <div v-if="qtypedata != null">
        <v-layout  class="create_question">
            <v-flex xs1 class="builderindex">
            </v-flex>
            <v-flex xs11>
              <div class="questiontype">{{getquestiontype}}</div>
              <tinymce api-key="10zoi6d1mnc0zzw2zcda5zq1c0do30jxot05hwds72y6y31r" :id="`editor_${qtypedata._id}`" ref="tincyeditor" @input="savenotes" v-model="question.description" @editorInit="editorInit"></tinymce>
              <questionbuttons :question="qtypedata" :index="index" :total="total"></questionbuttons>
            </v-flex>
        </v-layout>
    </div>
  </div>
</template>
<script>
import questionbuttons from './questionbuttons'
export default {
  props:['question','index',"total"],
  components: {questionbuttons
  },
  data() {
      return {
        id : this.question._id,
        description:this.question.description,
        questiontype:this.question.questiontype,
        qtypedata : this.question,
        currentdate: new Date().toISOString().substr(0, 10),
      }
  },
  methods:{
    savenotes(){
        this.debouncedUpdateDescription();
    },
    moveelement(ele_index, pos){
        var type = 5;
        if(this.questiontype == 'welcomepage'){
            type = 1;
        } else if(this.questiontype == 'thankyoupage'){
            type = 2;
        }
      this.$parent.$parent.$parent.moveelement(ele_index, pos, type);
    },
    deleteelement(ele_index){
        var type = 5;
        if(this.questiontype == 'welcomepage'){
            type = 1;
        } else if(this.questiontype == 'thankyoupage'){
            type = 2;
        }
      this.$parent.$parent.$parent.deleteelement(ele_index, type);
    },
    editorInit(){
      this.$refs.tincyeditor.editor.setContent(this.question.description)
    },
    updateDescription(){
      var questionid = this.id
      var questiondesc = this.question.description
        axios.post(`/updatedescription`,{'questionid':questionid,'desctext':questiondesc}).then(response => {
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
  },
  watch: {
    // whenever question changes, this function will run
    // description: function (newQuestion, oldQuestion) {
    //     console.log(this.description);
    //   this.debouncedUpdateDescription()
    // },

  },
  created(){
    this.debouncedUpdateDescription = _.debounce(this.updateDescription, 500)
  },
  computed: {
    // a computed getter
    getquestiontype:function(){
      if(this.question.questiontype == 'welcomepage'){
        return "Welcome notes";
      } else if(this.question.questiontype == 'thankyoupage'){
        return "Thankyou notes";
      } else {
        return "othertype";
      }
    }
  }
}
</script>
