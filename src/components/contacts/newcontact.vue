<template>
  <div class="text-xs-center shareSurvey_">
    <v-dialog
      v-model="dialog"
      width="600"
      @click="removeModel"
    >
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >New Contact</v-card-title>
        <v-card-text>
          <h3>Contact list</h3>
          <v-radio-group v-model="formmodel.createfor" row>
            <v-radio :key="`conatctfor0`" label="None" value="0" @click="contactresonchanges" ></v-radio>
            <v-radio :key="`conatctfor1`" label="New" value="1" @click="contactresonchanges" ></v-radio>
            <v-radio :key="`conatctfor2`" label="Existing" value="2" @click="contactresonchanges" ></v-radio>
          </v-radio-group>
            <v-text-field prepend-icon="person" v-if="formmodel.createfor == '1'" v-model="formmodel.listname" label="Contact List Name" type="text"></v-text-field>
            <!-- <v-select prepend-icon="person" v-if="formmodel.createfor == '2'" v-model="formmodel.listid" :items="allcontact" item-text="listname" item-value="_id" label="Contact List" ></v-select> -->
            <model-list-select :list="allcontact"
              v-if="formmodel.createfor == '2'" 
              v-model="formmodel.listid"
              option-value="_id"
              option-text="listname"
              placeholder="Select Contact list"></model-list-select>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
            <v-text-field prepend-icon="person" v-model="formmodel.firstname" label="Firstname" type="text"></v-text-field>
            <v-text-field prepend-icon="person" v-model="formmodel.lastname" label="Lastname" type="text"></v-text-field>
            <v-text-field prepend-icon="person" v-model="formmodel.email" label="Email" type="text"></v-text-field>
            <div class="bubble_poplist prependicon">
              <template v-for="org in allorganization" >
                <span v-bind:key="org._id" v-if="formmodel.organization.indexOf(org._id) != -1" class="bubbleuser" >{{org.name}}<v-icon @click="removeorg(formmodel.organization.indexOf(org._id))">maximize</v-icon></span>
              </template>
            </div>
            <v-text-field prepend-icon="person" v-model="searchorg" label="Organization" type="text"></v-text-field>
            <div class="hiddendatalist prependicon">
              <div v-for="org in allorganization" v-bind:key="org._id">
                <span v-if="org.name.toLowerCase().includes(searchorg.toLowerCase()) && searchorg != '' && formmodel.organization.indexOf(org._id) == -1" class="databble" @click="addorganization(org._id)">
                  {{org.name}}
                </span>
              </div>
              <div v-if="!allorganization.find(org => org.name.toLowerCase().localeCompare(searchorg.toLowerCase()) == 0) && searchorg != ''">
                <span class="databble" @click="addneworganization()">
                  {{searchorg}}(Add new)
                </span>
              </div>
            </div>            
            <v-text-field prepend-icon="person" v-model="formmodel.position" label="Position" type="text"></v-text-field>
            <v-text-field prepend-icon="person" v-model="formmodel.address" label="Address" type="text"></v-text-field>
            <v-text-field prepend-icon="person" v-model="formmodel.phone" label="Phone" type="text"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="saveContact" >Add</v-btn>
          <v-btn color="primary" flat @click="removeModel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import copytoclip from 'copy-to-clipboard';
import { ModelListSelect } from 'vue-search-select'
export default {
  components: {ModelListSelect},
  props:['contact', 'loginuser', 'dialogstate', 'allcontact'],
  data () {
    return { 
      dialog: this.dialogstate,
      searchorg:"",
      userid:"",
      allorganization:[],
      formmodel:{
          createfor:"0",
          listname:"",
          listid:"",
          firstname:"",
          lastname:"",
          email:"",
          organization:[],
          position:"",
          phone:"",
          address:"",
      }
    }
  },
  methods:{
    addneworganization(){
      axios.post(`/createorg`,{name:this.searchorg, created:this.userid})
      .then(response => {
        if(response.data.status == 1){
          this.allorganization.push(response.data.data);
          this.formmodel.organization.push(response.data.data._id);
          this.searchorg = "";
          // this.$toast.open({ message:response.data.message, type : "success", position: 'top', });
        } else {
          this.$toast.open({ message:response.data.message, type : "error", position: 'top', });
        }
      })
      .catch(e => {
        this.errors.push(e)
      })
    },
    removeorg(revindex){
      this.formmodel.organization.splice(revindex,1);
    },
    addorganization(orgid){
      this.formmodel.organization.push(orgid);
      this.searchorg = "";
    },
    contactresonchanges(){
      this.formmodel.listid = "";
      this.formmodel.listname = "";
    },
    removeModel(){
        this.dialog = false
        this.$emit("removeModel",this.dialog);
    },
    saveContact(){
      var this_form = this.formmodel
        var error = [];
        if(this_form.createfor == "2" && this_form.listid == ""){
            error.push("Please select Contact list");
        } 
        if(this_form.createfor == "1" && this_form.listname == ""){
            error.push("Contact list name is required")
        } 
        if(this_form.firstname == ""){
            error.push("Firstname is required")
        } 
        if(this_form.lastname == ""){
            error.push("Lastname is required")
        } 
        if(this_form.email == ""){
            error.push("Email is required")
        } 
        if(error.length > 0){
            error.forEach(element => {
                this.$toast.open({ message:element, type : "error", position: 'top', });
            });
        } else {
            axios.post('/addnewcontact',this.formmodel)
            .then((response)=>{
                if(response.data.status == 1){
                    this.formmodel = {
                        createfor:"0",
                        listname:"",
                        listid:"",
                        firstname:"",
                        lastname:"",
                        email:"",
                        organization:"",
                        position:"",
                        phone:"",
                        address:"",
                    }
                    this.$toast.open({message:"Contact added successfully", position:"top", type:"success" })
                } else {
                      this.$toast.open({message:response.data.message, position:"top", type:"error" })
                }
            }).catch((error)=>{
                  this.$toast.open({message:"Failed", position:"top", type:"error" })
            })
            // this.$toast.open({message:"Contact added successfully", position:"top", type:"success" })
        }
    }
},created() {
  axios.post(`/getorg`,{})
  .then(response => {
    this.allorganization = response.data
  })
  .catch(e => {
    this.errors.push(e)
  })
},
  watch: {
    dialog: function (olddialog, newdialog) {
        this.$emit("removeModel",this.dialog);
        return this.dialog;
    }
  }
}
</script>
