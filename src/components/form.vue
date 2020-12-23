<!-- <template>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="#8B784A">
                <v-toolbar-title>Signup</v-toolbar-title>
                <v-spacer></v-spacer>
               
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" v-model="name" label="Name" type="text"></v-text-field>
                  <v-text-field prepend-icon="person" v-model="email" label="Email" type="email"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" v-model="password" label="Password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark color="#8B784A" type='submit' @click='registerUser'>Signup</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
</template> -->

<template>


<div class="marginzerme col-md-5">
<h3 class="surveyheading">Survey Form</h3>
<div class="surveyformouter">

<form action="" method="post" class="surveyform">


<!-- ------------------text---------------------------- -->

<div class="outersurvey outersurvey1">
<div lass="innersurvey">
<label class="qusdark">1. What do you want learn?</label><br>
  <v-text-field
            v-model="qusdark"
            label="Enter your answer"
          ></v-text-field>

</div>
</div>
<br>
<br>

<!-- ------------------Radio Buttons-------------------------------- -->
<div class="outersurvey outersurvey2" id="outersurvey2">
<div lass="innersurvey">
      <label class="qusdark">2. What is your gender?</label>
      <p>
       <v-radio-group v-model="radios" :mandatory="false">
      <v-radio label="Male" value="radio-1"></v-radio>
      <v-radio label="Female" value="radio-2"></v-radio>
      <v-radio label="Other" value="radio-3"></v-radio>
    </v-radio-group>
      </p>
    
    </div>
   </div><br>

  <!-- ------------------Checkboxes-------------------------------- -->
<div class="outersurvey outersurvey3">
<div lass="innersurvey">
    <label class="qusdark">3. Check All That Apply</label>
    <v-checkbox v-model="selected" label="Onedev" value="Onedev"></v-checkbox>
    <v-checkbox v-model="selected" label="GPEx" value="GPEx"></v-checkbox>
    <v-checkbox v-model="selected" label="Examples" value="Examples"></v-checkbox>
    <v-checkbox v-model="selected" label="Forms" value="Forms"></v-checkbox>
  </div>
   </div><br>
  <!-- -----------------Dropdown menus--------------------------------- -->
  

<div class="outersurvey outersurvey4">
<div lass="innersurvey">
  <label class="qusdark">4. Select your location</label><br>
     <v-select
          :items="items"
          label="City"
        ></v-select>
</div>
 </div> <br>

  <!-- --------------------Text Areas------------------------------ -->
  

<div class="outersurvey outersurvey5">
<div lass="innersurvey">
<label for="msg"></label>
<p class="qusdark">5. In 50 words or more explain why you select this location</p>
  <v-textarea
          name="input-7-4"
          label="textarea"
          value=""
        ></v-textarea>
</div></div><br>

  <!-- --------------------Slider------------------------------ -->
  
  
<div class="outersurvey outersurvey6">
<div lass="innersurvey">
<label for="msg" class="qusdark">6. Select Your Range</label><br>
  <v-subheader class="pl-0"></v-subheader>
        <v-slider
          v-model="slider"
          color="#8B784A"
          label="Range"
          thumb-label
        ></v-slider>
</div></div><br>



<!----------------------------rating--------------------->
<div class="outersurvey outersurvey6">
<div lass="innersurvey">
<label for="msg" class="qusdark">7. Select Your Rating</label><br>
 <v-rating v-model="rating" color="#8B784A"></v-rating>
</div></div><br>

<!----------------------------Date picker--------------------->
   <div>
      <v-layout row wrap >
      </v-layout>
  <label for="msg" class="qusdark">8. Select Your DOB</label><br><br>
      <v-date-picker v-model="picker" :landscape="landscape" :reactive="reactive" dark color="#8B784A"></v-date-picker>
    </div>

 
 <!----------------------------Time Picker--------------------->

 <div>
     <br> <label for="msg" class="qusdark">9. Please select time</label><br><br>
    
      <v-time-picker v-model="time" :landscape="landscape" dark color="#8B784A"></v-time-picker>
    </div>

  <!-- --------------------Image upload------------------------------ -->

<br>
<div class="outersurvey outersurvey7">
<div lass="innersurvey">
<label for="fileupload" class="qusdark"> 10. Select a file to upload</label> <br>
<input type="file" name="fileupload" value="fileupload" id="fileupload">
</div></div><br>


  <!-- --------------------submit----------------------------- -->
  <v-spacer></v-spacer>
                <v-btn dark color="#8B784A" type='submit' @click='submitForm'>Submit</v-btn>
              </v-card-actions>

<!-- <div class="">
<button type="button" class="submitbuttonform col-md-4" >Submit</button> 
</div> -->

</form>


</div><!--4-->
</div><!--surveyform-->






</template>




<script>  

export default {
    data(){
      return {
        picker: null,
        qusdark: null,
        radios: null,
        selected: false,
        checkbox1: null,
        checkbox2: null,
        items: null,
        slider: null,
        rating: null,
        time: new Date(),
        landscape: false,
        reactive: false,
        items: ['Delhi', 'Mumbai', 'Kolkata', 'Goa']
      }
    },

    methods: {

      submitForm(){
        axios.post('/Signup',{name:this.name,email:this.email,password:this.password})
        .then((response)=>{
            Bus.$emit('loggedIn',response);
        })
        .catch((error)=>{
            console.log(error);
        })
        
      }
    }

}
</script>