import Vue from 'vue'
import Router from 'vue-router'
import Signup from '@/components/Signup'
import form from '@/components/form'
import Login from '@/components/Login'
import dashboard from '@/components/dashboard'
import Logout from '@/components/Logout'
import gpexlogin from '@/components/gpexlogin'
import sharedlinks from '@/components/sharedlinks'
import addproject from '@/components/addproject'
import createsurvey from '@/components/createsurvey'
import addgroup from '@/components/addgroup'
import builder from '@/components/formsbuilder/builder'
import responsereport from '@/components/reports/responsereport'
import filterreport from '@/components/reports/filterreport'
import userlog from '@/components/reports/userlog'
import surveyresponse from '@/components/surveyresponse/surveyresponse'
import surveyresponse1 from '@/components/surveyresponse/surveyresponse1'
import surveyattemptwlogin from '@/components/surveyresponse/surveyattemptwlogin'
import surveyattemptwtlogin from '@/components/surveyresponse/surveyattemptwtlogin'
import surveythankyou from '@/components/surveyresponse/surveythankyou'
import responselist from '@/components/responselist'
import approveresponse from '@/components/approveresponse'
import responsedetails from '@/components/responsedetails'
import editresponsedetails from '@/components/editresponsedetails'
import allanswers from '@/components/reports/allanswers'
import projectlist from '@/components/projectlist'
import editproject from '@/components/editproject'
import userlist from '@/components/users/userlist'
import edituser from '@/components/users/edituser'
import createuser from '@/components/users/createuser'
import editgroup from '@/components/editgroup'
import contacts from '@/components/contacts/contacts'
import contactdetails from '@/components/contacts/contactdetails'
import mailformat from '@/components/contacts/mailformat'
import imagelibrary from '@/components/imagelibrary/library'
import sentmailreport from '@/components/reports/sentmailreport'
import maildetails from '@/components/reports/maildetails'
import surveyshareddetails from '@/components/formsbuilder/surveyshareddetails'
import setting from '@/components/setting'
import surveyprint from '@/components/formsbuilder/surveyprint'
import addsemester from '@/components/addsemester'
import dateQuestionSubmit from '@/components/DateQuestionSubmit'


import store from '../store/index'

Vue.use(Router)
const router=new Router({
  mode: 'history',
 // export default new Router({
  routes: [
    {
      path: '/addsemester',
      name: 'addsemester',
      component: addsemester
    },
    {
      path: '/',
      name: 'Dashboard',
      component: dashboard
    },
    {
      path: '/gallery',
      name: 'imagelibrary',
      component: imagelibrary
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
      {
      path: '/form',
      name: 'form',
      component: form
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
     {
      path: '/gpexlogin',
      name: 'gpexlogin',
      component: gpexlogin
    } ,
     {
      path: '/sharedlinks',
      name: 'sharedlinks',
      component: sharedlinks
    } ,
     {
      path: '/addproject',
      name: 'addproject',
      component: addproject
    },
     {
      path: '/createsurvey',
      name: 'createsurvey',
      component: createsurvey
    },
     {
      path: '/addgroup',
      name: 'addgroup',
      component: addgroup
    },
    {
     path: '/builder/:id',
     name: 'Builder',
     component: builder
   },
   {
    path: '/surveyresponse/:id',
    name: 'SurveyResponse',
    component: surveyresponse
  },
   {
    path: '/surveyresponse1/:id',
    name: 'SurveyResponse1',
    component: surveyresponse1
  },
  {
    path: '/swl/:id',
    name: 'SurveyResponsewithlogin',
    component: surveyattemptwlogin
  },
  {
    path: '/swtl/:id',
    name: 'surveyattemptwtlogin',
    component: surveyattemptwtlogin
  },
 {
     path: '/responsereport/:id',
     name: 'Response Report',
     component: responsereport
   },
 {
     path: '/filterreport/:id',
     name: 'FilterReport',
     component: filterreport
   },
   {
    path: '/responselist/:id',
    name: 'responselist',
    component: responselist
  },
   {
    path: '/approveresponse/:id',
    name: 'approveresponse',
    component: approveresponse
  },
  {
    path: '/responsedetails/:id',
    name: 'responsedetails',
    component: responsedetails
  },
  {
    path: '/allanswers/:id',
    name: 'allanswers',
    component: allanswers
  },
  {
    path: '/surveythankyou/:id',
    name: 'surveythankyou',
    component: surveythankyou
  },
  {
    path: '/projectlist',
    name: 'projectlist',
    component: projectlist
  },
  {
    path: '/createuser',
    name: 'createuser',
    component: createuser
  },
  {
    path: '/editproject/:id',
    name: 'editproject',
    component: editproject
  },
  {
    path: '/edituser/:id',
    name: 'edituser',
    component: edituser
  },
  {
    path: '/editgroup/:id',
    name: 'editgroup',
    component: editgroup
  },
  {
    path: '/userlist',
    name: 'userlist',
    component: userlist
  },
  {
    path: '/contactlist',
    name: 'contactlist',
    component: contacts
  },
  {
    path: '/contactdetails/:id',
    name: 'contactdetails',
    component: contactdetails
  },
  {
    path: '/mailformat',
    name: 'mailformat',
    component: mailformat
  },
  {
    path: '/sentmailreport',
    name: 'sentmailreport',
    component: sentmailreport
  },
  {
    path: '/maildetails/:id',
    name: 'maildetails',
    component: maildetails
  },
  {
    path: '/surveyshareddetails/:id',
    name: 'surveyshareddetails',
    component: surveyshareddetails
  },
  {
    path: '/surveyprint/:id',
    name: 'surveyprint',
    component: surveyprint
  },
  {
    path: '/userlog',
    name: 'userlog',
    component: userlog
  },
  {
    path: '/setting',
    name: 'setting',
    component: setting
  },
  {
    path: '/editresponsedetails/:id',
    name: 'editresponsedetails',
    component: editresponsedetails
  },
  {
    path: '/dateQuestionSubmit',
    name: 'dateQuestionSubmit',
    component: dateQuestionSubmit
  }
  ]
});

const openRoutes=['Login','Signup','gpexlogin','sharedlinks','surveyattemptwtlogin','SurveyResponse','surveythankyou','SurveyResponse1'];

router.beforeEach((to, from, next) => {
  var additionurl= "/outsidelogin/"+window.btoa(to.fullPath)
  const redirecturl = window.gpexone+additionurl;
  if(openRoutes.includes(to.name)  ){
      next()
    } else if (store.getters.isAuthenticated){
      var lastsession = localStorage.getItem('sessiontimeout');
      if(lastsession){
        if(lastsession < (Date.now()-14400000)){
          localStorage.clear();
          location.href =  redirecturl
        }
        localStorage.setItem('sessiontimeout', Date.now());
      } else {
        localStorage.clear();
        location.href =  redirecturl
      }
      next()
    } else {
      location.href =  redirecturl
    }

})

export default router
