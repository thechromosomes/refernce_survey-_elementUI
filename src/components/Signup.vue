<template>

        <v-layout class="login-layout">
          <v-flex xs12 sm6 md6  class="login-leftscreen">
            <img src="assets/images/riverland-cruises-houseboats.jpg" alt="" class="left_login_img img img-responsive">
          </v-flex>
          <v-flex xs12 sm6 md6 class="login-form">
            <div class="login_face">
              <v-card-text class="login_inner">
                  <div class="login_brand"><p class="text-xs-center"><img width="250" src="../assets/brand_gpex_logo.png" alt=""></p></div>
                <v-form>
                  <p class="text-xs-center"> Welcome to GPEx ONE, <br>Now access all GPEx applications using one email and password </p>
                  <v-text-field prepend-icon="person" v-model="fname" label="First Name" type="text"></v-text-field>
                  <v-text-field prepend-icon="person" v-model="lname" label="Last Name" type="text"></v-text-field>
                  <v-text-field prepend-icon="person" v-model="username" label="Username" type="text"></v-text-field>
                  <v-text-field prepend-icon="person" v-model="email" label="Email" type="email"></v-text-field>
                  <v-select
  :items="roles"
  name="role"
  v-model="role"
  prepend-icon="person"
  label="Select Role"
  item-value="_id"
  item-text="roletitle"
  ></v-select>
                  <v-text-field id="password" prepend-icon="lock" v-model="password" label="Password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="btns-login">
                <v-spacer></v-spacer>
                <v-btn dark color="#8B784A" href="login">Sign In</v-btn>
                <!-- <v-btn dark color="#8B784A" type='submit' @click='registerUser'>Sign Up</v-btn> -->
              </v-card-actions>
            </div>
          </v-flex>
        </v-layout>



</template>

<script>  
export default {
    data(){
      return {
        fname:null,
        lname:null,
        email:null,
        username:null,
        password:null,
        role:null,
        roles: [],
      errors: []
      }
    },

    methods: {

      registerUser(){
        axios.post('/Signup',{fname:this.fname,lname:this.lname,username:this.username,email:this.email,role:this.role,password:this.password})
        .then((response)=>{
            Bus.$emit('loggedIn',response);
            this.$router.push('/')
        })
        .catch((error)=>{
            console.log(error);
        })
        
      }
    },
    created() {
    axios.get(`/getroles`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.roles = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
}

}
</script>
<style scoped>
@media only screen and (max-width: 768px) {
  .login-leftscreen{
    display: none;
  }
}
.login-layout{
  height: 100vh;
}
.login-form{
  align-items: center;
  justify-content: center;
  display: flex;
}
.left_login_img {
    width: 100%;
    height: 100%;
}
</style>

