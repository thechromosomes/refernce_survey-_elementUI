<template>
  <div class="config_section">
    <v-layout row wrap paddingbottom15>
      <v-flex xs3 fieldtitle>Survey title</v-flex>
      <v-flex xs9>
        <v-text-field class="input_text"
            label=""
            @input="changeconfig"
            v-model="surveytitle"
          ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap paddingbottom15>
      <v-flex xs3 fieldtitle>Survey active</v-flex>
      <v-flex xs9>
        <v-radio-group v-model="config.active" row>
          <v-radio label="Active" value="1"></v-radio>
          <v-radio label="Not active" value="0"></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
    <v-layout row wrap paddingbottom15>
      <v-flex xs3 fieldtitle>Survey display</v-flex>
      <v-flex xs9>
        <v-radio-group v-model="config.display" row>
          <v-radio label="One question at a time" value="1"></v-radio>
          <v-radio label="All question at once" value="0"></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
    <v-layout row wrap paddingbottom15>
      <v-flex xs3 fieldtitle>Kiosk mode</v-flex>
      <v-flex xs9>
        <v-radio-group v-model="config.mode" row>
          <v-radio label="Yes" value="1"></v-radio>
          <v-radio label="No" value="0"></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
    <v-layout row wrap paddingbottom15>
      <v-flex xs3 fieldtitle>Cover photo</v-flex>
      <v-flex xs9>{{coverphoto}}
      </v-flex>
    </v-layout>
    <v-layout row wrap paddingbottom15>
      <v-flex xs3 fieldtitle>Multiple submission from same device</v-flex>
      <v-flex xs9 fieldtitle>
        <v-radio-group v-model="config.multisubmission" row>
          <v-radio label="Yes" value="1"></v-radio>
          <v-radio label="No" value="0"></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
    <v-layout row wrap paddingbottom15>
      <v-flex xs3 fieldtitle>Add editor</v-flex>
      <v-flex xs9>
          <input type="text" class="base_inputtext" placeholder="Editor" />
      </v-flex>
    </v-layout>
    <v-layout row wrap paddingbottom15>
      <v-flex xs3 fieldtitle>Add reviewer</v-flex>
      <v-flex xs9>
          <input type="text" class="base_inputtext" placeholder="Reviewer" />
      </v-flex>
    </v-layout>
    <v-layout row wrap paddingbottom15>
      <v-flex xs3 fieldtitle>Workflow</v-flex>
      <v-flex xs9>
        <div><v-checkbox v-model="config.resnotiftoedotor" label="Send response notification to editor"></v-checkbox></div>
        <div><v-checkbox v-model="config.processapprovalbyedotor"  label="Workflow process approval by editor"></v-checkbox></div>
        <div class="paddingleft30"><v-checkbox v-model="config.processapprovaltoedotor"  label="Send process approval to editor"></v-checkbox></div>
        <div class="paddingleft30"><v-checkbox v-model="config.sendnotiftoreviewer" label="Send notification to reviewer for approval"></v-checkbox></div>
        <div class="paddingleft30"><v-checkbox v-model="config.sendnotiftoeditor"  label="Send notification to editor after review"></v-checkbox></div>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  props:['surveyconfig','surveytitle'],
  data() {
      return {
        id : 1,
        title:this.surveytitle,
        config: this.surveyconfig,
      }
  },

}
</script>
<style>
.input_text .input-group__input{
  width: 100%;
    background: #fff !important;
    border: 1px solid #aaa  !important;
    box-shadow: 0px 0px 0px 1px #eaeaea !important;
    border-radius: 3px !important;
}

</style>
