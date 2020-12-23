<template>
  <div class="text-xs-center ">
    <v-dialog v-model="dialog"  >
    <v-card>
        <div class="grayback">
          <div class="gallerypupupbuttons">
                <button color="primary" class="exportbutton" @click="removeModel"  flat>Close</button>
          </div>
            <library></library>
        </div>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import library from '../imagelibrary/library'
export default {
    components: {library},
    props:['dialogstate'],
    data () {
      return {
        dialog:true,
      }
    },
    methods:{
        removeModel(){
            this.dialog = false
            this.$emit("removeModel",this.dialog);
        },
    },
    created(){
    },
    watch: {
        dialog: function (olddialog, newdialog) {
            this.$emit("removeModel",this.dialog);
            return this.dialog;
        },
    }
}
</script>
<style scoped>
.gallerypupupbuttons{
position: absolute;
  top: 0px;
  right: 0px;
  padding: 15px;
  padding-right: 30px;
}
</style>