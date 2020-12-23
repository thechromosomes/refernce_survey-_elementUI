import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    contacts: [],
    token: localStorage.getItem('token') || '',
    status:'',
    user: {}
  },

  mutations:{
    authSuccess(state,token){
      state.token=token;
      state.status='success';
    },
    
    authError(state){
      state.token='';
      state.status='error';
    },
    authLogout(state){
      state.token=''
    },
    setContacts(state,contacts){
        state.contacts=contacts;
    },
    setUsername(state, name) {
      state.user.name = name
    }
  },

  actions: {
      fetchContacts(context){
        axios.get('/contact')
          .then(response=>{
            context.commit('setContacts',response.data.data)
            // this.contacts=response.data.data;
          })

      },
      login(context, payload) {

        return new Promise((resolve,reject)=>{

          axios.post('/login', payload)
            .then((response) => {
              const accessToken = response.data.token;
              console.log(accessToken);
              const name = response.data.name
              const userrole = response.data.userrole
              axios.post('/getrolebyid', {"roleid":response.data.userrole})
              .then((roleresponse) => {
                var myrole = 4;
                if(roleresponse.data != null){
                  if(roleresponse.data.roleid){
                    myrole = roleresponse.data.roleid
                  }
                }
                context.commit('authSuccess', accessToken)
                context.commit('setUsername', name)
                localStorage.setItem('token', accessToken);
                window.userid = response.data.id;
                localStorage.setItem('loginuser', response.data.id);
                localStorage.setItem('username', name);
                localStorage.setItem('userrole', myrole);
                localStorage.setItem('userroledata', roleresponse.data);
                localStorage.setItem('sessiontimeout', Date.now());
                axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
                axios.defaults.headers.common['loginuser'] = response.data._id;
                console.log("succress from store");
                
                resolve(response);
                // reject("lkdfjglkfdjgldf");
  
              })
              // var myrole = 0
              // if(userrole == "5c94d5cdde72f25c40c46307"){
              //   //admin
              //   myrole = 1
              // } else if(userrole == "5c94d5f4de72f25c40c46308"){
              //   //reviewer
              //   myrole = 2
              // } else if(userrole == "5c94d661de72f25c40c46309"){
              //   myrole = 3
              //   //editor
              // } else {
              //   // Respondent
              //   myrole = 4

              // }
            })
            .catch((error) => {
              localStorage.removeItem('token');
              context.commit('authError')
              console.log(error);
              reject(error);
            })

        })
         
      },
      gpexlogin(context, payload) {

        return new Promise((resolve,reject)=>{
          console.log("payload-", payload);
          
          axios.post('/gpexlogin', payload)
            .then((response) => {
              const accessToken = response.data.token;
              console.log(accessToken);
              const name = response.data.name
              const userrole = response.data.userrole
              axios.post('/getrolebyid', {"roleid":response.data.userrole})
              .then((roleresponse) => {
                var myrole = 4;
                if(roleresponse.data != null){
                  if(roleresponse.data.roleid){
                    myrole = roleresponse.data.roleid
                  }
                }
                context.commit('authSuccess', accessToken)
                context.commit('setUsername', name)
                window.userid = response.data.id;
                localStorage.setItem('token', accessToken);
                localStorage.setItem('loginuser', response.data.id);
                localStorage.setItem('username', name);
                localStorage.setItem('userrole', myrole);
                localStorage.setItem('userroledata', roleresponse.data);
                localStorage.setItem('sessiontimeout', Date.now());
                axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
                axios.defaults.headers.common['loginuser'] = response.data._id;
                resolve(response);
                // reject("lkdfjglkfdjgldf");
  
              })
              // context.commit('authSuccess', accessToken)
              // context.commit('setUsername', name)
              // localStorage.setItem('token', accessToken);
              // localStorage.setItem('username', name);
              // localStorage.setItem('userrole', myrole);
              // axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
              // resolve(response);
            })
            .catch((error) => {
              localStorage.removeItem('token');
              context.commit('authError')
              console.log(error);
              reject(error);
            })

        })
         
      },
      validateshare(context, payload) {

        return new Promise((resolve,reject)=>{
          console.log("payload-", payload);
          console.log("context-", context);
          axios.post('/validateshareuser', payload)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })

        })
         
      },

      logout(context){
        return new Promise((resolve,reject)=>{
            context.commit('authLogout')
            localStorage.clear();
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userrole');
            localStorage.removeItem('userrole');
            localStorage.removeItem('userroledata');
            delete axios.defaults.headers.common['Authorization'] ;

            resolve();


        })
      }

  },


  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    menus:(state,getters)=>{
      if(getters.isAuthenticated){
        return [{
          name: "Logout", route: "Logout"
        }]
      }
      return [
        { name: "Signup", route: "Signup" },
        { name: "Login", route: "Login" },
        { name: "Form1", route: "form1" },
        { name: "form", route: "form" },
        { name: "gpexlogin", route: "gpexlogin" },
        { name: "surveyattemptwtlogin", route: "surveyattemptwtlogin" },
      ];
    }
  }




})