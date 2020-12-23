
<template>
    <v-container class="radiobutton">
        <v-radio 
        :key="qno"
        :label="choicetext.choicetext"
        :value="ansno"
      ></v-radio>
    </v-container>
</template>
<script>
export default {
    props:['choicetext', 'ansno','qno'],
    data() {
        return {
            choicetext1:this.choicetext,
            ansno1:this.ansno,
            qno1:this.qno
        }
    }
}
</script>
<style scoped>
.radiobutton{
    padding: 5px !important;
}
.radiobutton:hover{
    background-color: #ebebeb;
}

</style>
