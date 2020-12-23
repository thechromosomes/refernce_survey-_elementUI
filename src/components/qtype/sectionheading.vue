<template>
  <div class="text_h2head sqtype">
    <v-text-field v-model="qtypedata.questiontext" @input="changeQuestion" label="Heading Here" required ></v-text-field>
  </div>
</template>
<script>
export default {
  props:['qtypedata'],
  data () {
    return {
      id:this.qtypedata._id,
      questiontext:this.qtypedata.questiontext,
    }
  },
  methods: {
    changeQuestion(inputdata){
      this.questiontext = inputdata
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
  },
  watch: {
    // whenever question changes, this function will run
    questiontext: function (newQuestion, oldQuestion) {
      this.debouncedUpdateQuestion()
    },
  },created: function () {
    this.debouncedUpdateQuestion = _.debounce(this.updateQuestion, 500)
  },
  computed: {
    // a computed getter
    questionfinalimage: function () {

      return window.publicfileurl+this.qtypedata.image;
    }
  }
}
</script>