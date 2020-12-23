<template>
    <div class="textinput">
            <v-layout align-center >
            <v-text-field  label="Answer" class="text_input" ></v-text-field>
            </v-layout>
    </div>
</template>
<script>
export default {
    props:['answertext']
}
</script>
<style scoped>
.textinput {
    padding: 0px 10px 10px 10px;
}
.textinput .input-group__input{
    background-color: white !important;
    border: 1px solid #8b784a;
}
.textinput:hover{
    background-color: #ebebeb;
}
</style>

