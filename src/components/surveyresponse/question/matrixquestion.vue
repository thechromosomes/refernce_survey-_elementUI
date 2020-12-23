<template>
    <div class="matrizquestion">
        <div class="messagebox error" v-if="errormessagebox != ''">{{errormessagebox}}</div>
        <div class="messagebox " v-if="messagebox != ''">{{messagebox}}</div>
        <table class="table" style="background-color:transparent;">
            <tr class="matrixheader">
                <td></td>
                <td class="text-center" v-for="(col,index) in matrixdata.allcols" :key="`header${index}`">{{col.option}}</td>
            </tr>
            <template v-for="(row, ri) in allrows">
                <tr :id="`subanswer${row._id}`"  :key="`qq${ri}`" class="matrixsinglerow subanswer">
                    <th class="matrow">{{row.option}}</th>
                    <td class="text-center matcols" v-for="(col,index) in matrixdata.allcols" :key="`question${ri}${index}`">
                        <v-radio-group v-model="row.radioans" @change="change_answer"  v-if="matrixdata.qtype == '0'" class="matrix_radio">
                            <v-radio :label="col.option"  :value="col._id"></v-radio>
                        </v-radio-group>

                        <v-checkbox v-else v-model="row.checkboxans" :label="col.option" @change="change_answer" :value="col._id" ></v-checkbox>
                    </td>
                </tr>
            </template>
        </table>
        <input type="hidden" v-model="questionpotres" />
    </div>
</template>
<script>
var animate = require('../../../models/cssAnimation.js');
export default {
    props:['matrixdata'],
    data() {
        return {
            allrows:this.matrixdata.allrows,
            allcols:this.matrixdata.allcols,
            ansno1:this.ansno,
            answer:0,
            errormessagebox:"",
            questionpotres:"",
            messagebox:"",
            radioans:[]
        }
    },
    methods:{
      animatenow(){
        this.validatedform(true);
      },
      validatedform(animation = false){
        if(this.matrixdata.required == "1"){
            this.$parent.validatedform(false);
            var validation = true;
            this.matrixdata.allrows.forEach(row => {
                if(this.matrixdata.qtype == '0'){
                    if(row.radioans.length == 0){
                        this.$parent.validatedform(false);
                        validation = false
                        animate.ErrorInput("#subanswer"+row._id, "error");
                        if(animation){
                            animate.animateCSS("#subanswer"+row._id, "shake");
                        }
                    } else {
                        animate.ErrorInput("#subanswer"+row._id, "success");
                    }
                } else {
                    if(row.checkboxans.length == 0){
                        this.$parent.validatedform(false);
                        validation = false
                        animate.ErrorInput("#subanswer"+row._id, "error");
                        if(animation){
                            animate.animateCSS("#subanswer"+row._id, "shake");
                        }
                    } else {
                        animate.ErrorInput("#subanswer"+row._id, "success");
                    }
                }
            });
            if(validation){
                this.$parent.validatedform(true);
            }
        } else {
          this.$parent.validatedform(true);
          animate.ErrorInput(".subanswer", "success");
        }
      },        change_answer(){
            this.debouncedupdateattemptanswer()
        },
        updateattemptanswer(){
            this.validatedform();
            const this_user = window.surveyuser
            const this_attempt = window.surveyattemptid
            var final_answer = [];
            if(this.matrixdata.qtype == '0'){
                this.matrixdata.allrows.forEach(element => {
                    if(element.radioans != ""){
                        final_answer.push({
                            rowid:element._id,
                            selected:element.radioans
                        })
                    }
                });
            } else {
                this.matrixdata.allrows.forEach(element => {
                    if(element.checkboxans.length != 0){
                        final_answer.push({
                            rowid:element._id,
                            selected:element.checkboxans
                        })
                    }
                });
            }
            if(this.matrixdata.required == "0" || this.matrixdata.allrows.length == final_answer.length){
                var surveyconfig = localStorage.getItem("sconfig_"+this_attempt._id);
                surveyconfig = JSON.parse(surveyconfig)
                if(surveyconfig.honeypot == '1'){
                    if(this.questionpotres.length > 0){
                        axios.post(`/postbotresponse`,{
                            'surveyId':this.matrixdata.surveyid,
                            'userId':this_user._id,
                            'questionId':this.matrixdata._id,
                            'attemptId':this_attempt._id,
                            }).then(response => {
                        }).catch(e => {})
                    } else {
                        axios.post(`/updateattemptanswer`,{
                            'surveyid':this.matrixdata.surveyid,
                            'userid':this_user._id,
                            'questionid':this.matrixdata._id,
                            'attemptid':this_attempt._id,
                            'answer':final_answer
                            }).then(response => {
                            })
                            .catch(e => {
                                this.errors.push(e)
                            })
                    }
                } else {
                    axios.post(`/updateattemptanswer`,{
                    'surveyid':this.matrixdata.surveyid,
                    'userid':this_user._id,
                    'questionid':this.matrixdata._id,
                    'attemptid':this_attempt._id,
                    'answer':final_answer
                    }).then(response => {
                    })
                    .catch(e => {
                        this.errors.push(e)
                    })

                }
            } else {
                // this.errormessagebox = "Must select all answer to submit answer";
            }
        },
        generateoption(){
            // console.log(this.allrows);
            const qtypedata = this.matrixdata.qtype
            // console.log("qtypedata"+qtypedata);
            var allrows = this.matrixdata.allrows;
            // console.log(allrows);
            
            allrows.forEach(function(element, index){
                if(qtypedata == "0"){
                    allrows[index].radioans=""
                } else {
                    allrows[index].checkans=[]
                }
                // console.log(index);
            })
            this.matrixdata.allrows = allrows
            // console.log(allrows);
        },
        clearmsg(){
            this.errormessagebox = ""
            this.messagebox = ""
        },

    },
    created: function () {
    this.$parent.validatedform(true);
    this.debouncedupdateattemptanswer = _.debounce(this.updateattemptanswer, 500)
    this.debouncedclearmsg = _.debounce(this.clearmsg, 2000)
    // this.generateoption();
        const this_user = window.surveyuser
        const this_attempt = window.surveyattemptid
        axios.post(`/getattemptanswer`,{
        'surveyid':this.matrixdata.surveyid,
        'userid':this_user._id,
        'questionid':this.matrixdata._id,
        'attemptid':this_attempt._id
        }).then(response => {
            if(response.data.status == 1){
                if(response.data.data != null){
                    this.answer = JSON.parse(response.data.data.answer)
                    // var defval = "";
                    // if(this.matrixdata.qtype == "0"){
                    //     defval = [];
                    // }
                    // var alldata = []
                    this.allrows.forEach((element, index) => {
                        // this.allrows.push(element)
                        this.answer.forEach(el => {
                            if(this.matrixdata.qtype == '0'){
                                if(element._id == el.rowid){
                                    this.allrows[index].radioans  = el.selected
                                }
                            } else {
                                if(element._id == el.rowid){
                                    this.allrows[index].checkboxans  = el.selected
                                }
                            }

                        });
                        // alldata.push(element)
                    });
                    this.validatedform();
                    // this.allrows = alldata
                }
            }
        })
        .catch(e => {
        // this.errors.push(e)
        })
    },
    watch: {
    // whenever question changes, this function will run
    errormessagebox :function(olddata, newdata){
      if(this.errormessagebox != ""){
        this.debouncedclearmsg()
      }
    },
    messagebox :function(olddata, newdata){
      if(this.messagebox != ""){
        this.debouncedclearmsg()
      }
    },
  }
}
</script>
