<template>
    <div class="matrizquestion">
        <table class="table" style="background-color:transparent;">
            <tr>
                <td></td>
                <td class="text-center" v-for="(col,index) in matrixdata.allcols" :key="`header${index}`">{{col.option}}</td>
            </tr>
            <tr v-for="(row, ri) in matrixdata.allrows" :key="`qq${ri}`">
                <th>{{row.option}}</th>
                <td  class="text-center" v-for="(col,index) in matrixdata.allcols" :key="`question${ri}${index}`">
                    <v-radio-group v-model="row.radioans" v-if="matrixdata.qtype == '0'" class="matrix_radio">
                        <v-radio   :value="col.option"></v-radio>
                    </v-radio-group>
                    <v-checkbox v-else v-model="row.checkans" :value="col.option" ></v-checkbox>
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
            answer:0
        }
    }
}
</script>
