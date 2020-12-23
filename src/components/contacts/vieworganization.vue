<template>
  <div class="text-xs-center shareSurvey_">
    <v-dialog
      v-model="dialog"
      width="600"
      @click="removeModel"
    >
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >
            <v-toolbar-title>Organization details</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-switch v-if="org != null" v-model="readonly_switch" label="Edit"></v-switch>
        </v-card-title>
        <v-card-text>
            <v-text-field prepend-icon="person"  v-model="formmodel.name" label="Name" type="text"></v-text-field>
        </v-card-text>
        <v-card-text>
            <v-text-field prepend-icon="person"  v-model="formmodel.address" label="address" type="text"></v-text-field>
        </v-card-text>
        <v-card-text>
            <v-text-field prepend-icon="person"  v-model="formmodel.phone" label="phone" type="number"></v-text-field>
        </v-card-text>
        <v-card-text>
            <v-text-field prepend-icon="email"  v-model="formmodel.email" label="email" type="text"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" v-if="readonly_switch == true" flat @click="saveorganization" >Save</v-btn>
          <v-btn color="primary" flat @click="removeModel">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props:['org', 'dialogstate'],
  data () {
    return { 
      readonly_switch:false,
      dialog: this.dialogstate,
      searchorg:"",
      userid:"",
      allorganization:[],
      formmodel:{
          id:"",
          name:"",
          address:"",
          phone:"",
          email:"",
      }
    }
  },
  methods:{
    removeModel(){
        this.dialog = false
        this.$emit("removeModel",this.dialog);
    },
    saveorganization(){
      var this_form = this.formmodel;
      var error = [];

      // email validation
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (this_form.email !== "" && !pattern.test(this_form.email)){
      error.push(`email is not valid`)
  
 }
        if(this_form.name == ""){
            error.push("name is required")
        } 
        if(error.length > 0){
            error.forEach(element => {
                this.$toast.open({ message:element, type : "error", position: 'top', });
            });
        } else {
          if(this.formmodel.id){
            axios.post('/updateorganization',this.formmodel)
            .then((response)=>{
                if(response.data.status == 1){
                    this.removeModel();
                    this.$toast.open({message:"Organization Updated successfully", position:"top", type:"success" })
                } else {
                    this.$toast.open({message:response.data.message, position:"top", type:"error" })
                }
            }).catch((error)=>{
                  this.$toast.open({message:"Failed", position:"top", type:"error" })
            })

          } else {
            axios.post(`/createorg`,
            {name:this.formmodel.name,
             address:this.formmodel.address,
             email:this.formmodel.email,
             phone: this.formmodel.phone,
             created:this.formmodel.id})
            .then(response => {
              if(response.data.status == 1){
                    this.removeModel();
                    this.$toast.open({message:"Organization created successfully", position:"top", type:"success" })
            } else {
              this.$toast.open({ message:response.data.message, type : "error", position: 'top', });
            }
      })
      .catch(e => {
        this.errors.push(e)
      })

          }
        }
    }
},
mounted: function () {
  if(this.org != null){
    this.formmodel.name=this.org.name;
    this.formmodel.email=this.org.email;
    this.formmodel.address=this.org.address;
    this.formmodel.phone=this.org.phone;
    this.formmodel.id=this.org._id;
  }
    this.readonly_switch=true;
},created() {
},
  watch: {
    dialog: function (olddialog, newdialog) {
        this.$emit("removeModel",this.dialog);
        return this.dialog;
      }
  }
}
</script>
