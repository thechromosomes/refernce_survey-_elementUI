<template>
        <v-layout class="login-layout">
          <v-flex xs12 sm6 md6  class="login-leftscreen">
            <img src="../assets/riverland-cruises-houseboats.jpg" alt="" class="left_login_img img img-responsive">
          </v-flex>
          <v-flex xs12 sm6 md6 class="login-form">
            <div class="login_face">
              <v-card-text class="login_inner">
                  <div class="login_brand"><p class="text-xs-center"><img width="250" src="../assets/brand_gpex_logo.png" alt=""></p></div>
                  <v-form>
                  <p class="text-xs-center"> Welcome to GPEx ONE, <br>Now access all GPEx applications using one email and password </p>
                  <v-text-field prepend-icon="person" v-model="email" label="Username or email" type="text"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" v-model="password" label="Password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="btns-login">
                <v-spacer></v-spacer>
                <!-- <v-btn dark color="#8B784A" href="signup">Sign Up</v-btn> -->
                <v-btn dark color="#8B784A" @click='logIn'>Login</v-btn>
              </v-card-actions>
            </div>
          </v-flex>
        </v-layout>
</template>


<script>  

export default {
  data(){
    return {
      email:null,
      password:null
    }
  },
  methods: {
    logIn(){
      this.$store.dispatch('login', { email: this.email, password: this.password }).then(() => {
        // this.$router.push('/')
        location.href = "/";
      }).catch(console.error)
    }
  },
  created() {
        console.log("router", this.$router);
        
    },
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

