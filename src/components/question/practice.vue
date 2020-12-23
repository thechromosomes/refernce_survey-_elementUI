<template>
    <div class="practiceform">
        <template v-if="practicedata != null">
            <v-layout class="practicename">
                <v-flex xs10 >
                    <h2>{{practicedata.name}}</h2>
                </v-flex>
                <v-flex xs2 >
                    <v-btn depressed class="icon30 delete " fab  @click="removepractice()" >
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
            <div class="practicefield" v-if="isnewemail" >
                <template v-if="practicedata.email.length > 0" >
                    <v-layout :key="index" v-for="(item, index) in practicedata.email">
                        <v-flex xs3 >
                            <strong v-if="index == 0">Email</strong>
                        </v-flex>
                        <v-flex xs5 >
                            <v-text-field v-model="newemail[index]" @input="updateemail(index)"></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 delete " v-if="(practicedata.email.length > 1)" fab  @click="removeemail(index)" >
                                <v-icon>delete</v-icon>
                            </v-btn>                            
                            <v-btn depressed class="icon30 edit " v-if="index == (practicedata.email.length-1)" fab @click="addnewemail" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template> 
                <template v-else>
                    <v-layout>
                        <v-flex xs3 >
                            <strong>Email</strong>
                        </v-flex>
                        <v-flex xs5 >
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 edit " fab @click="addnewemail" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template>
            </div>
            <div class="practicefield" v-if="isnewphone" >
                <template v-if="practicedata.phone.length > 0"  >
                    <v-layout v-for="(item, index) in practicedata.phone" :key="index">
                        <v-flex xs3 >
                            <strong v-if="index == 0">Phone</strong>
                        </v-flex>
                        <v-flex xs5 >
                            <v-text-field v-model="newphone[index]"  @input="updatephone(index)"></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 delete " v-if="(practicedata.phone.length > 1)" fab  @click="removephone(index)" >
                                <v-icon>delete</v-icon>
                            </v-btn>                            
                            <v-btn depressed class="icon30 edit " v-if="index == (practicedata.phone.length-1)" fab @click="addnewphone" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template> 
                <template v-else>
                    <v-layout>
                        <v-flex xs3 >
                            <strong>Phone</strong>
                        </v-flex>
                        <v-flex xs5 >
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 edit " fab @click="addnewphone" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template> 
            </div>
            <div class="practicefield" v-if="isnewfax" >
                <template v-if="practicedata.fax.length > 0" >
                    <v-layout :key="index" v-for="(item, index) in practicedata.fax">
                        <v-flex xs3 >
                            <strong v-if="index == 0">Fax</strong>
                        </v-flex>
                        <v-flex xs5 >
                            <v-text-field v-model="newfax[index]" @input="updatefax(index)"></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 delete " v-if="(practicedata.fax.length > 1)" fab  @click="removefax(index)" >
                                <v-icon>delete</v-icon>
                            </v-btn>                            
                            <v-btn depressed class="icon30 edit " v-if="index == (practicedata.fax.length-1)" fab @click="addnewfax" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template> 
                <template v-else>
                    <v-layout>
                        <v-flex xs3 >
                            <strong>Fax</strong>
                        </v-flex>
                        <v-flex xs5 >
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 edit " fab @click="addnewfax" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template>
            </div>
            <div class="practicefield" v-if="isnewwebsite" >
                <template v-if="practicedata.website.length > 0" >
                    <v-layout :key="index" v-for="(item, index) in practicedata.website">
                        <v-flex xs3 >
                            <strong v-if="index == 0">Website</strong>
                        </v-flex>
                        <v-flex xs5 >
                            <v-text-field v-model="newwebsite[index]" @input="updatewebsite(index)"></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 delete " v-if="(practicedata.website.length > 1)" fab  @click="removewebsite(index)" >
                                <v-icon>delete</v-icon>
                            </v-btn>                            
                            <v-btn depressed class="icon30 edit " v-if="index == (practicedata.website.length-1)" fab @click="addnewewebsite" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template> 
                <template v-else>
                    <v-layout>
                        <v-flex xs3 >
                            <strong>Website</strong>
                        </v-flex>
                        <v-flex xs5 >
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 edit " fab @click="addnewwebsite" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template>
            </div>
            <div class="practicefield">
                <template v-if="practicedata.address.length > 0"  >
                    <v-layout class="addressfiled" v-for="(item, index) in practicedata.address" :key="index">
                        <v-flex xs3 >
                            <strong >Address{{index+1}}</strong>
                        </v-flex>
                        <v-flex xs5 >
                            <v-text-field v-if="item.addressline1" @input="debouncedsendbackdata" v-model="item.addressline1" ></v-text-field>
                            <v-text-field v-if="item.addressline2" @input="debouncedsendbackdata" v-model="item.addressline2" ></v-text-field>
                            <v-text-field v-if="item.addressline3" @input="debouncedsendbackdata" v-model="item.addressline3" ></v-text-field>
                            <v-text-field v-if="item.suburb" @input="debouncedsendbackdata" v-model="item.suburb" ></v-text-field>
                            <v-text-field v-if="item.state" @input="debouncedsendbackdata" v-model="item.state" ></v-text-field>
                            <v-text-field v-if="item.country" @input="debouncedsendbackdata" v-model="item.country" ></v-text-field>
                            <v-text-field v-if="item.postcode" @input="debouncedsendbackdata" v-model="item.postcode" ></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 delete " v-if="(practicedata.address.length > 1)" fab  @click="removeaddress(index)" >
                                <v-icon>delete</v-icon>
                            </v-btn>                            
                            <v-btn depressed class="icon30 edit " v-if="index == (practicedata.address.length-1)" fab @click="addnewaddress" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template> 
                <template v-if="isnewaddress == true || practicedata.address.length==0">
                    <v-layout>
                        <v-flex xs3 >
                            <strong>Address</strong>
                        </v-flex>
                        <v-flex xs5 >
                            <gmap-autocomplete v-if="isnewaddress" :id="`el-input__inner${pindex}`" class="suburbsearch " placeholder="Search" :options="autocompleteOptions" :value="fromregion" @place_changed="changeregion" ></gmap-autocomplete>
                        </v-flex>
                        <v-flex xs3 >
                            <v-btn depressed class="icon30 edit " fab @click="addnewaddress" >
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </template> 
            </div> 
            <div class="practicefield">
                <v-layout>
                    <v-flex xs3 >
                        <strong>Accreditation</strong>
                    </v-flex>
                    <v-flex xs4 >Start Date: <template v-if="practicedata.accreditian">{{practicedata.accreditian.gpex_accreditationdatefrom}}</template>
                    </v-flex>
                    <v-flex xs4 >End Date: <template v-if="practicedata.accreditian">{{practicedata.accreditian.gpex_accreditationdateto}}</template>
                    </v-flex>
                </v-layout>
            </div>
        </template>




    </div>
</template>

<script>
import {gmapApi} from 'vue2-google-maps'
export default {
    props:['pindex', 'practice'],
    data(){
        return {
            isnewemail:true,
            isnewphone:true,
            isnewfax:true,
            isnewwebsite:true,
            newemail:[],
            newphone:[],
            newfax:[],
            newwebsite:[],
            practicedata:null,
            contactAnswer:"",
            finalContactData:[],
            contactData:[],
            isnewaddress:false,
            autocompleteOptions: {
                componentRestrictions: { country: 'au' }
            },
            fromregion:'',
            addressformat:{
                name:"",
                state:"",
                country:"",
                address:"",
                mmm:"",
                gpdivision:"",
                telephone1:"",
                addresstype:"",
                suburb:"",
                facilitytype:"",
                trainingprgm:"",
                emailaddress1:"",
                postcode:"",
                addressline1:"",
                addressline2:"",
                addressline3:"",
                rideidentifier:""
            }
        }
    },
    computed: {
      google: gmapApi
    },
    methods:{
        removepractice(){
            this.$emit("removepractice",{index: this.pindex});
        },
        addnewphone(){
            this.isnewphone = false
            this.practicedata.phone.push("");
            this.isnewphone = true
        },
        removephone(ind){
            this.isnewemail = false
            this.practicedata.phone.splice(ind, 1);
            this.isnewemail = true
        },
        updatephone(index){
            this.practicedata.phone[index]= this.newphone[index];
            this.debouncedsendbackdata();
        },
        addnewemail(){
            this.isnewemail = false
            this.practicedata.email.push("");
            this.isnewemail = true
            console.log(this.practicedata.email);
        },
        removeemail(ind){
            this.isnewemail = false
            this.practicedata.email.splice(ind, 1);
            this.isnewemail = true
        },
        updateemail(index){
            this.practicedata.email[index]= this.newemail[index];
            this.debouncedsendbackdata();
        },
        addnewfax(){
            this.isnewfax = false
            this.practicedata.fax.push("");
            this.isnewfax = true
        },
        removefax(ind){
            this.isnewfax = false
            this.practicedata.fax.splice(ind, 1);
            this.isnewefax = true
        },
        updatefax(index){
            this.practicedata.fax[index]= this.newfax[index];
            this.debouncedsendbackdata();
        },
        addnewwebsite(){
            this.isnewwebsite = false
            this.practicedata.website.push("");
            this.isnewwebsite = true
        },
        removewebsite(ind){
            this.isnewwebsite = false
            this.practicedata.website.splice(ind, 1);
            this.isnewewebsite = true
        },
        updatewebsite(index){
            this.practicedata.website[index]= this.newwebsite[index];
            this.debouncedsendbackdata();
        },
        addnewaddress(){
            this.isnewaddress = true;
        },
        removeaddress(ind){
            this.isnewaddress = false;
            this.practicedata.address.splice(ind, 1);
            this.isnewaddress = true;
        },
        sendbackdata(){
            console.log("datachanged");
            this.$emit("datachanged",{index: this.pindex, data: this.practicedata});
        },
        changeregion(place)
      {
          var components_by_type = {};
        //   place = {"address_components":[{"long_name":"189","short_name":"189","types":["street_number"]},{"long_name":"Maribyrnong Road","short_name":"Maribyrnong Rd","types":["route"]},{"long_name":"Ascot Vale","short_name":"Ascot Vale","types":["locality","political"]},{"long_name":"Moonee Valley City","short_name":"Moonee Valley","types":["administrative_area_level_2","political"]},{"long_name":"Victoria","short_name":"VIC","types":["administrative_area_level_1","political"]},{"long_name":"Australia","short_name":"AU","types":["country","political"]},{"long_name":"3032","short_name":"3032","types":["postal_code"]}],"adr_address":"<span class=\"street-address\">189 Maribyrnong Rd</span>, <span class=\"locality\">Ascot Vale</span> <span class=\"region\">VIC</span> <span class=\"postal-code\">3032</span>, <span class=\"country-name\">Australia</span>","formatted_address":"189 Maribyrnong Rd, Ascot Vale VIC 3032, Australia","formatted_phone_number":"(03) 9370 8022","geometry":{"location":{"lat":-37.77143959999999,"lng":144.9113982},"viewport":{"south":-37.77267363029149,"west":144.9100697197085,"north":-37.7699756697085,"east":144.9127676802915}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png","id":"52aed2ce00cc86b8468cddba2cc398ac9b87b81f","international_phone_number":"+61 3 9370 8022","name":"Testaz Chiropractic Clinic","opening_hours":{"open_now":false,"periods":[{"close":{"day":1,"time":"2000","hours":20,"minutes":0,"nextDate":1580115600000},"open":{"day":1,"time":"0900","hours":9,"minutes":0,"nextDate":1580076000000}},{"close":{"day":2,"time":"1900","hours":19,"minutes":0,"nextDate":1580198400000},"open":{"day":2,"time":"0900","hours":9,"minutes":0,"nextDate":1580162400000}},{"close":{"day":3,"time":"1900","hours":19,"minutes":0,"nextDate":1580284800000},"open":{"day":3,"time":"0830","hours":8,"minutes":30,"nextDate":1580247000000}},{"close":{"day":4,"time":"1900","hours":19,"minutes":0,"nextDate":1579766400000},"open":{"day":4,"time":"0900","hours":9,"minutes":0,"nextDate":1579730400000}},{"close":{"day":5,"time":"2000","hours":20,"minutes":0,"nextDate":1579856400000},"open":{"day":5,"time":"0830","hours":8,"minutes":30,"nextDate":1579815000000}},{"close":{"day":6,"time":"1300","hours":13,"minutes":0,"nextDate":1579917600000},"open":{"day":6,"time":"0830","hours":8,"minutes":30,"nextDate":1579901400000}}],"weekday_text":["Monday: 9:00 AM – 8:00 PM","Tuesday: 9:00 AM – 7:00 PM","Wednesday: 8:30 AM – 7:00 PM","Thursday: 9:00 AM – 7:00 PM","Friday: 8:30 AM – 8:00 PM","Saturday: 8:30 AM – 1:00 PM","Sunday: Closed"]},"photos":[{"height":4032,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/101783588364719160033\">Ali AQ</a>"],"width":3024}],"place_id":"ChIJH6-2VVFc1moRvTTfz1J6E_c","plus_code":{"compound_code":"6WH6+CH Ascot Vale, Victoria, Australia","global_code":"4RJ66WH6+CH"},"rating":5,"reference":"ChIJH6-2VVFc1moRvTTfz1J6E_c","reviews":[{"author_name":"matt f","author_url":"https://www.google.com/maps/contrib/117949623037100495183/reviews","language":"en","profile_photo_url":"https://lh4.ggpht.com/-a-yhj49NJuA/AAAAAAAAAAI/AAAAAAAAAAA/ykZ_J_VCTzw/s128-c0x00000000-cc-rp-mo/photo.jpg","rating":5,"relative_time_description":"7 months ago","text":"Amazing and professional chiro!","time":1559126390},{"author_name":"TJ Jk","author_url":"https://www.google.com/maps/contrib/108793717457982382533/reviews","language":"en","profile_photo_url":"https://lh6.ggpht.com/-5bkg0LwKj3s/AAAAAAAAAAI/AAAAAAAAAAA/ACsmBzZ3cHU/s128-c0x00000000-cc-rp-mo/photo.jpg","rating":5,"relative_time_description":"2 years ago","text":"Absolutely amazing. Mandy and Shane have worked with me for many many years and have not been able to find anyone better. Great job!","time":1510322279},{"author_name":"Fredrik Tronnberg","author_url":"https://www.google.com/maps/contrib/113640417865781120238/reviews","language":"en","profile_photo_url":"https://lh3.ggpht.com/-YsyzAOBcLBI/AAAAAAAAAAI/AAAAAAAAAAA/NVrQhBekZJs/s128-c0x00000000-cc-rp-mo/photo.jpg","rating":5,"relative_time_description":"a year ago","text":"When all else failed I found Rob & Co. Their magic works :-D","time":1518680610},{"author_name":"Gabrielle Piriz","author_url":"https://www.google.com/maps/contrib/116514414119065250450/reviews","profile_photo_url":"https://lh6.ggpht.com/-CyknCgVSwdU/AAAAAAAAAAI/AAAAAAAAAAA/lyDBxbi1P5U/s128-c0x00000000-cc-rp-mo/photo.jpg","rating":5,"relative_time_description":"2 years ago","text":"","time":1506293080}],"scope":"GOOGLE","types":["health","point_of_interest","establishment"],"url":"https://maps.google.com/?cid=17803708248019121341","user_ratings_total":4,"utc_offset":660,"vicinity":"189 Maribyrnong Road, Ascot Vale","website":"http://testazchiro.com.au/","html_attributions":[],"utc_offset_minutes":660};


            for (var i = 0; i < place.address_components.length; i++) {
                var c = place.address_components[i];
                components_by_type[c.types[0]] = c;
            }
            if ("country" in components_by_type){
                this.addressformat.country = components_by_type.country.long_name
            } 
            if ("administrative_area_level_1" in components_by_type){
                this.addressformat.state = components_by_type.administrative_area_level_1.long_name
            }
            if ("postal_code" in components_by_type){
                this.addressformat.postcode = components_by_type.postal_code.long_name
            } 
            if ("administrative_area_level_1" in components_by_type){
                this.suburb = components_by_type.long_name
            }
            if ("route" in components_by_type && "locality" in components_by_type && "street_number" in components_by_type){
                this.addressformat.addressline1 = `${components_by_type.street_number.long_name}, ${components_by_type.route.long_name}, ${components_by_type.locality.long_name}`
            }
        
            this.addressformat.address = place.formatted_address
            this.addressformat.addresstype = place.types[0]
            this.addressformat.name = this.practicedata.name
            this.practicedata.address.push(this.addressformat);
            this.resetaddress();
            this.isnewaddress = false
      },
      resetaddress(){
            this.addressformat={
                name:"",
                state:"",
                country:"",
                address:"",
                mmm:"",
                gpdivision:"",
                telephone1:"",
                addresstype:"",
                suburb:"",
                facilitytype:"",
                trainingprgm:"",
                emailaddress1:"",
                postcode:"",
                addressline1:"",
                addressline2:"",
                addressline3:"",
                rideidentifier:""
            };
        }
    },
    watch: {
        isnewemail: function (newjumptoquestion, oldjumptoquestion) {
            this.debouncedsendbackdata()
        },    
        isnewphone: function (newjumptoquestion, oldjumptoquestion) {
            this.debouncedsendbackdata()
        },    
        isnewaddress: function (newjumptoquestion, oldjumptoquestion) {
            this.debouncedsendbackdata()
        },    
    },    
    created() {
        this.debouncedsendbackdata = _.debounce(this.sendbackdata, 1000)
        
        this.practicedata= this.practice
        this.newemail = this.practicedata.email
        this.newphone = this.practicedata.phone
        this.newfax = this.practicedata.fax
        this.newwebsite = this.practicedata.website
    }
}
</script>