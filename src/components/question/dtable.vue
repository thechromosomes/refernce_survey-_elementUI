<template>
  <div class="datatablequestion">
      <h2 class="practicename">{{answer.practicename}}</h2>
     <table class="dtable table" style="background-color:transparent;">
            <tr class="tableheader">
                <th class="text-center" v-for="(col,index) in dataCol.allcols" :key="`header${index}`">{{col.option}}</th>
                <th class="text-center" ></th>
            </tr>
            <template  v-if="finalAnswer.length > 0" >
              <template v-for="(AnswerData,index) in finalAnswer">
              <tr class="tabledata" :key="`datarow${index}`">
                <td class="text-center"  v-for="(col,index1) in dataCol.allcols" :key="index1">{{AnswerData[col._id]}}</td>
                <td style="width:80px;" > 
                  <v-btn depressed class="icon30 edit " fab  @click="openEditor(index)" >
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn depressed class="icon30 delete " fab  @click="removeElement(index)" >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              </template>
            </template>
      </table>
    <div class="my-2">
      <input type="hidden" v-model="questionpotres" />
      <v-btn depressed class="icon30  add" fab  @click="dialog = true" >
        <v-icon>add</v-icon>
      </v-btn>
    </div>
    <div justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Editable Profile</v-card-title>
          <v-card-text>
            <v-container>
              <div>
                <div v-for="(col) in dataCol.allcols" :key="col._id">
                  <div cols="12" sm="6">
                    <v-text-field :label="col.option" required v-model="allAnswers[col._id]"></v-text-field>
                  </div>
                </div> 
              </div>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat  @click="saveData">Save</v-btn>
            <v-btn color="primary" flat  @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props:['dataCol', 'practices', 'answer', 'tindex'],
  data() {
    return{
      allAnswers:[],
      selected:-1,
      finalAnswer:this.answer.finalAnswer,
      dialog:false ,
      questionpotres:'',
      errors:[]
    }
  },
  methods: {
    saveData(){
      var this_allAnswers = Object.assign({}, this.allAnswers);
      console.log(this_allAnswers)
      if(this.selected <0){
        this.finalAnswer.push(this_allAnswers);
      } else {
        this.finalAnswer[this.selected] = this_allAnswers;
      }
      this.allAnswers = [];
      this.dialog = false;
      this.selected = -1;
        this.debouncedsendbackdata();

    },
    removeElement(indexVal){
      this.finalAnswer.splice(indexVal, 1);
    },
    openEditor(indexVal){
      this.allAnswers = Object.assign({}, this.finalAnswer[indexVal]);
      this.dialog = true;
      this.selected = indexVal;
    },
    sendbackdata(){
        this.$emit("datachanged",{index: this.tindex, data: this.finalAnswer});
    },

  },
  created() {
      this.debouncedsendbackdata = _.debounce(this.sendbackdata, 1000)

  },
}
</script>