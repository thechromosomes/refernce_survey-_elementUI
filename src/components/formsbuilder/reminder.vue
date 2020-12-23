 <template>
  <div class="reminder_section">
    <div class="container_reminnder" v-if="reminder.length > 0">
        <div  class="singlereminder" v-for="(rem, findex) in reminder" :key="`flow${findex}`">
            <v-flex xs12>
                <span>Send a reminder email after </span><input class="input-inlineblock text" @change="changereminderdata" type="number" v-model="rem.days" /> days from <input class="input-inlineblock date" @change="changereminderdata" type="date" v-model="rem.initialshare" /> </v-flex>
            <v-flex xs12>
                <span>in case of <v-checkbox @change="changereminderdata" v-model="rem.partialresponse" ></v-checkbox> Partial response <v-checkbox @change="changereminderdata" v-model="rem.noresponse" ></v-checkbox> No response  If the survey is still active</span>
            </v-flex>
            <v-flex xs12 flexright>
                <button v-if="reminder.length != findex" @click="deletereminder(findex)" class="btn-jumpaction delete"><img src="../../assets/icons/minus-circle-white.svg" /></button>
                <button v-if="reminder.length == (findex+1)" @click="addReminder" class="btn-jumpaction add"><img src="../../assets/icons/plus-circle-light-white.svg" /></button>
            </v-flex>
        </div>
    </div>
    <div class="container_reminnder" v-else>
        <div class="singlereminder">
            <v-flex xs12 flexright>
                <button @click="addReminder" class="btn-jumpaction add"><img src="../../assets/icons/plus-circle-light-white.svg" /></button>
            </v-flex>
        </div>
    </div>
  </div>
</template>
<script>
var dateFormat = require('dateformat');
export default {
  props:['survey'],
  data() {
      return {
        id : this.survey,
        surveydata:this.survey,
        reminder:[],
        defaultreminder:{
            surveyid:this.survey,
            days:7,
            initialshare:dateFormat(Date.now(), "yyyy-mm-dd"),
            partialresponse:false,
            noresponse:false,
        }
      }
  },
  methods:{
    addReminder(){
        axios.post(`/addreminder`,{'reminderdata':this.defaultreminder}).then(response => {
            this.reminder.push(response.data);
        })
    },
    deletereminder(index){
        console.log("reminder- ", this.reminder);
        console.log("index- ", index);
      var reminderid = this.reminder[index]._id
        console.log("reminderid- ", reminderid);
      axios.post(`/deletereminder`,{'reminderid':reminderid}).then(response => {
        if(response.data.n==1){
          this.reminder.splice(index,1);
        }
      }).catch(e => {
        this.errors.push(e)
      })        
    },
    changereminderdata(){
      this.debouncedchangereminderdata()
    //   console.log("have to call API to update logics");
    },
    updatereminderdata(){
      var allreminderdata = this.reminder
      axios.post(`/updatereminder`,{'allreminderdata':allreminderdata}).then(response => {
      }).catch(e => {
        this.errors.push(e)
      })
    }
  },
  created(){
    this.debouncedchangereminderdata = _.debounce(this.updatereminderdata, 2000)
    axios.post(`/getallreminder`,{'surveyid':this.survey}).then(response => {
        var allreminder = response.data;
          this.reminder = allreminder;
    })
  }
}
</script>
