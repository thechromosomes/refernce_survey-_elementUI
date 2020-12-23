<template>
  <div class="text_contact qtype">
        <v-flex xs12>
            <v-text-field label="First Name"  ></v-text-field>
        </v-flex>
        <v-flex xs12>
            <v-text-field label="Last Name"  ></v-text-field>
        </v-flex>
        <v-flex xs12>
            <v-text-field label="Email"  ></v-text-field>
        </v-flex>
        <v-flex xs12>
            <v-text-field label="Phone"  ></v-text-field>
        </v-flex>
        <v-flex xs12>
            <v-text-field label="Address..."  ></v-text-field>
        </v-flex>
  </div> 
</template>
<script>
export default {
  props:['contactform'],
  data() {
    return {
      questiontext:this.contactform.questiontext
    }
  }
}
</script>