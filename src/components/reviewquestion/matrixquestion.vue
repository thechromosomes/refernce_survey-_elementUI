<template>
    <div class="matrizquestion">
        <table class="table" style="background-color:transparent;">
            <tr>
                <td></td>
                <td class="text-center" v-for="(col,index) in matrixdata.allcols" :key="`header${index}`">{{col.option}}</td>
            </tr>
            <tr v-for="(row, ri) in allrows" :key="`qq${ri}`">
                <th>{{row.option}}</th>
                <td class="text-center" v-for="(col,index) in matrixdata.allcols" :key="`question${ri}${index}`">
                    <v-radio-group v-model="row.radioans"  v-if="matrixdata.qtype == '0'" class="matrix_radio">
                        <v-radio disabled   :value="col._id"></v-radio>
                    </v-radio-group>

                    <v-checkbox disabled v-else v-model="row.checkans"  :value="col._id" ></v-checkbox>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    props:['matrixdata'],
    data() {
        return {
            allrows:this.matrixdata.allrows,
            allcols:this.matrixdata.allcols,
            ansno1:this.ansno,
            answer:0,
            radioans:[]
        }
    },
    methods:{
        generateoption(){
            console.log(this.allrows);
            const qtypedata = this.matrixdata.qtype
            console.log("qtypedata"+qtypedata);
            var allrows = this.matrixdata.allrows;
            console.log(allrows);
            
            allrows.forEach(function(element, index){
                if(qtypedata == "0"){
                    allrows[index].radioans=""
                } else {
                    allrows[index].checkans=[]
                }
                console.log(index);
            })
            this.matrixdata.allrows = allrows
            console.log(allrows);
        }

    },
    created: function () {
    // this.generateoption();
    var this_attempt = window.surveyattemptid
    axios.post(`/getattemptanswer`,{
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
                    // this.allrows = alldata
                }
            }
        })
        .catch(e => {
        // this.errors.push(e)
        })
  }
}
</script>
