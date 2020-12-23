<template>
    <div class="emailinput">
      <v-text-field  label="Email: " :mask="maskedinput" ></v-text-field>
    </div>
</template>
<script>
export default {
  data () {
      return {
        rules: {
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        }
      }
    }
}
</script>
<style scoped>
  .emailinput{
    padding: 0px 10px 10px 10px;
    margin-top: 10px;
  }
  .emailinput:hover{
    background-color: #ebebeb;
  }
</style>
