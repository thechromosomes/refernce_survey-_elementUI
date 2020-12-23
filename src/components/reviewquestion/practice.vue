<template>
    <div class="practiceform">
        <template v-if="practicedata != null">
            <v-layout class="practicename">
                <v-flex xs12 >
                    <h2>{{practicedata.name}}</h2>
                </v-flex>
            </v-layout>
            <div class="practicefield" v-if="isnewemail" >
                <template v-if="practicedata.email.length > 0" >
                    <v-layout :key="index" v-for="(item, index) in practicedata.email">
                        <v-flex xs3 >
                            <strong v-if="index == 0">Email</strong>
                        </v-flex>
                        <v-flex xs5 >
                            <v-text-field readonly v-model="newemail[index]" ></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
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
                            <v-text-field v-model="newphone[index]" readonly ></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
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
                            <v-text-field v-model="newfax[index]" readonly></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
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
                            <v-text-field v-model="newwebsite[index]" readonly></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
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
                            <v-text-field v-if="item.addressline1" readonly v-model="item.addressline1" ></v-text-field>
                            <v-text-field v-if="item.addressline2" readonly v-model="item.addressline2" ></v-text-field>
                            <v-text-field v-if="item.addressline3" readonly v-model="item.addressline3" ></v-text-field>
                            <v-text-field v-if="item.suburb" readonly v-model="item.suburb" ></v-text-field>
                            <v-text-field v-if="item.state" readonly v-model="item.state" ></v-text-field>
                            <v-text-field v-if="item.country" readonly v-model="item.country" ></v-text-field>
                            <v-text-field v-if="item.postcode" readonly v-model="item.postcode" ></v-text-field>
                        </v-flex>
                        <v-flex xs3 >
                        </v-flex>
                    </v-layout>
                </template> 
                <template v-if="isnewaddress == true || practicedata.address.length==0">
                    <v-layout>
                        <v-flex xs3 >
                            <strong>Address</strong>
                        </v-flex>
                        <v-flex xs5 >
                        </v-flex>
                        <v-flex xs3 >
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
    },
    created() {
        this.practicedata= this.practice
        this.newemail = this.practicedata.email
        this.newphone = this.practicedata.phone
        this.newfax = this.practicedata.fax
        this.newwebsite = this.practicedata.website
    }
}
</script>