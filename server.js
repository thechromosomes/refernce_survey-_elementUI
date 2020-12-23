var express = require('express');
var multer  = require('multer');
var sharp = require('sharp');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var path = require('path')
var app = express();
var mongoose   = require('mongoose');
var cors = require('cors')
var asyncLoop = require('node-async-loop');
const excel = require('node-excel-export');
var dateFormat = require('dateformat');
mongoose.connect('mongodb://127.0.0.1:27017/gpexsurvey',{'useNewUrlParser': true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
var users = require('./app/models/users');
var roles = require('./app/models/roles');
var groups = require('./app/models/groups');
var projects = require('./app/models/projects');
var surveys = require('./app/models/surveys');
var questions = require('./app/models/questions');
var questionoptions = require('./app/models/questionoptions');
var questionsliderlinks = require('./app/models/questionsliderlinks');
var questionmatrixrows = require('./app/models/questionmatrixrows');
var questionmatrixcols = require('./app/models/questionmatrixcols');
var questioncustomdata = require('./app/models/questioncustomdata');
var surveyconfig = require('./app/models/surveyconfig');
var surveyattempt = require('./app/models/surveyattempt');
var attemptanswer = require('./app/models/attemptanswer');
var questiongroup = require('./app/models/questiongroup');
var questionlogicjump = require('./app/models/questionlogicjump');
var questionorder = require('./app/models/questionorder');
var workflows = require('./app/models/workflow');
var contactlist = require('./app/models/contactlist');
var contactlistdata = require('./app/models/contactlistdata');
var sharedsurveytolist = require('./app/models/sharedsurveytolist');
var mailformat = require('./app/models/mailformat');
var surveyreminders = require('./app/models/surveyreminder');
var notifictionsmailsdata = require('./app/models/notifictionsmailsdata');
var filterreportshistory = require('./app/models/filterreportshistory');
var medialibrary = require('./app/models/medialibrary');
var questioncomments = require('./app/models/questioncomments');
var sharedsurveyusermails = require('./app/models/sharedsurveyusermails');
var logstores = require('./app/models/userlogs');

var noquestion =["thankyoupage","welcomepage","descriptionbox","sectionheading","qtypeslider"];
var optionanswer =["multic","singlec","dropdown"];
var multitextanswer =["multipletext"];
var customformanswer =["customform"];
var matrixquestion =["matrixquestion"];

const excelstyles = {
    headerDark: {
        fill: {
          fgColor: {
            rgb: 'bfbfbf'
          }
        },
        font: {
          color: {
            rgb: '000000'
          },
          sz: 14,
          bold: true,
          underline: true
        }
    },
    headerLight: {
        fill: {
          fgColor: {
            rgb: 'bfbfbf'
          }
        },
        font: {
          color: {
            rgb: '000000'
          },
          sz: 14,
          bold: false,
          underline: false
        }
    },
    greenLight: {
        fill: {
          fgColor: {
            rgb: 'c6efce'
          }
        },
        font: {
          color: {
            rgb: '4e6100'
          },
          sz: 14,
          bold: false,
          underline: false
        }
    },
    lightCyan: {
        fill: {
          fgColor: {
            rgb: 'deebf6'
          }
        },
        font: {
          color: {
            rgb: '000000'
          },
          sz: 12,
          bold: false,
          underline: false
        }
    },
    red: {
        fill: {
          fgColor: {
            rgb: 'ff0000'
          }
        },
        font: {
          color: {
            rgb: '0000ff'
          },
          sz: 12,
          bold: false,
          underline: false
        }
    },
    datanormal: {
        font: {
          color: {
            rgb: '000000'
          },
          sz: 11,
          bold: false,
          underline: false
        }
    },
};



var workflowevents = require('./workflowevents');
var generatepdf = require('./generatepdf');
var summaryexport = require('./reports/summaryreport');
var surveyController = require('./controller/surveyController');
var allcrons = require('./crons/allcrons');
var logstore = require('./logstore');
var serversettings = require('./controller/serversettings');
var serversettings = require('./controller/serversettings');
var contactcontroller = require('./controller/contactcontroller');
var hexToImage = require('./controller/hexToImage')
var updateDetail = require('./controller/updateDetail');
var botResponse = require('./controller/botResponse');


require('./customcrons.js');
var config = require('./config');
var bodyParser = require('body-parser');
var empty  = require('is-empty');
var upload = multer({ 
    dest: './uploads/',
    limit:{
        fileSize:10000000
    }
 })

app.use(cors())
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

app.set('superSecret',config.secret);


var router = express.Router();
var filerouter = express.Router();

app.use(express.static("public")); 

app.use(express.static(path.join(__dirname, 'dist')))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

console.log("server started");

router.post('/upload', upload.single('file'), async (req, res) => {
    var  currentUnixTime= Date.now();
    console.log(req.file);
    // res.json({file: req.file});
    try {
        var f = currentUnixTime+'_' + req.file.originalname;
        var dest = path.resolve('./publicfiles/', f);
        console.log(dest);
        fs.rename(req.file.path, dest, (err)=>{
          if(err) throw err;
          else {
              console.log('Successfully moved');
              res.json({file: `/publicfiles/${f}`});
          }
        });

        // await sharp(req.file.path).toFile(`./publicfiles/${currentUnixTime}_${req.file.originalname}`);
        // fs.unlink(req.file.path,() => {
        //     res.json({file: `/publicfiles/${currentUnixTime}_${req.file.originalname}`});
        // })
    } catch(err){
        res.status(422).json({err});
    }
  })

router.route('/Signup')
    .post(function(req, res) {
    try {
        logstore.createlog({action:"signup", module:"user"}, req)
        var emailCheck = new Promise(function(resolve, reject) {
            users.find({
                email: req.body.email
            }, function(err, results) {
                if (err) {
                    reject({
                        httpCode: err,
                        code: err,
                        message: err
                    })
                } else {
                    results.length ? reject({
                        httpCode: 200,
                        code: 402,
                        message: 'Email already exist.'
                    }) : resolve(results[0]);

                }
            })
        });
        var usernameCheck = new Promise(function(resolve, reject) {
            users.find({
                username: req.body.username
            }, function(err, results) {
                if (err) {
                    reject({
                        httpCode: err,
                        code: err,
                        message: err
                    })
                } else {
                    results.length ? reject({
                        httpCode: 200,
                        code: 402,
                        message: 'username already exist.'
                    }) : resolve(results[0]);

                }
            })
        });
        Promise.all([emailCheck, usernameCheck]).then(function(results) {
            users.create({
                'firstname': req.body.fname,
                'lastname': req.body.lname,
                'username': req.body.username,
                'email': req.body.email,
                'role': req.body.role,
                'password': req.body.password
            }, 
            function(createErr, result) {
                if (createErr) {
                    res.status(200).send({
                        httpCode: err,
                        code: 402,
                        message: err
                    });
                } else {
                    res.status(200).send({
                       'message': "Registration successfull",
                        'code': 200,
                        'data': result
                    });
                }

                //create cart for this user:result._id,ironing:[],
                console.log('Success');
            })
        }).catch(function(err) {
            console.log('error', err)
            res.status(err.httpCode).json(err);
        });
    } catch (e) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        });
        console.log('catch login', e);
    }
});
    
router.route('/createproject')
    .post(function(req, res) {
    try {
        var projectCheck = new Promise(function(resolve, reject) {
            projects.find({
                projectname: req.body.projectname
            }, function(err, results) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    results.length ? reject({
                        httpCode: 200,
                        code: 402,
                        message: 'Group already exist.'
                    }) : resolve(results[0]);

                }
            })
        });
        Promise.all([projectCheck]).then(function(results) {
            projects.create({
                'projectname': req.body.projectname,
                'allowgroups': req.body.groups,
                'allowroles': req.body.roles,
                'createdby': req.body.createdby,
                'createddate': req.body.createddate
            }, 
            function(createErr, result) {
                if (createErr) {
                    res.status(CodesAndMessages.dbErrHttpCode).send({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    });
                } else {
                    logstore.createlog({action:"create", module:"project", moduleid:result._id}, req)
                    res.status(200).send({
                       // 'message': CodesAndMessages.sucess1,
                        'code': 200,
                        'data': result
                    });
                }

                //create cart for this user:result._id,ironing:[],
                console.log('Success');
            })
        }).catch(function(err) {
            console.log('error', err)
            res.status(err.httpCode).json(err);
        });
    } catch (e) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        });
        console.log('catch login', e);
    }
});
    
router.route('/createsurvey')
    .post(function(req, res) {
    try {
        var surveytCheck = new Promise(function(resolve, reject) {
            surveys.find({
                surveyname: req.body.surveyname
            }, function(err, results) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    results.length ? reject({
                        httpCode: 200,
                        code: 402,
                        message: 'Survey already exist.'
                    }) : resolve(results[0]);

                }
            })
        });
        Promise.all([surveytCheck]).then(function(results) {
            surveys.create({
                'surveyname': req.body.surveyname,
                'category': req.body.category,
                'semester': req.body.semester,
                'createdby': req.body.createdby,
                'createddate': Date.now()
            }, 
            function(createErr, result) {
                if (createErr) {
                    res.status(CodesAndMessages.dbErrHttpCode).send({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    });
                } else {
                    logstore.createlog({action:"create", module:"survey", moduleid:result._id}, req)
                    var data_surveyconfig = {
                        surveyid:result._id,
                        active: "0",
                        display: "0",
                        mode: "0",
                        anonymous: "0",
                        coverphoto: "",
                        multisubmission: "0",
                        multisubmissionuser: "0",
                        editor: JSON.stringify([req.body.createdby]),
                        reviewer: JSON.stringify([]),
                        resnotiftoedotor: false,
                        processapprovalbyedotor: false,
                        processapprovaltoedotor: false,
                        sendnotiftoreviewer: false,
                        sendnotiftoeditor: false,
                        createdby:  req.body.createdby
                    };
                    surveyconfig.create(data_surveyconfig, function(err, configres){});
                    res.status(200).send({
                       // 'message': CodesAndMessages.sucess1,
                        'code': 200,
                        'data': result
                    });
                }

                //create cart for this user:result._id,ironing:[],
                console.log('Success');
            })
        }).catch(function(err) {
            console.log('error', err)
            res.status(500).json(err);
        });
    } catch (e) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        });
        console.log('catch login', e);
    }
});
router.route('/creategroup')
    .post(function(req, res) {
    try {
        var groupCheck = new Promise(function(resolve, reject) {
            groups.find({
                groupname: req.body.groupname
            }, function(err, results) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    results.length ? reject({
                        httpCode: 200,
                        code: 402,
                        message: 'Group already exist.'
                    }) : resolve(results[0]);

                }
            })
        });
        Promise.all([groupCheck]).then(function(results) {
            groups.create({
                'groupname': req.body.groupname,
                'groupmemmbers': req.body.members,
                'createdby': req.body.createdby,
                'createddate': req.body.createddate
            }, 
            function(createErr, result) {
                if (createErr) {
                    res.status(CodesAndMessages.dbErrHttpCode).send({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    });
                } else {
                    logstore.createlog({action:"create", module:"group", moduleid:result._id}, req)
                    res.status(200).send({
                       // 'message': CodesAndMessages.sucess1,
                        'code': 200,
                        'data': result
                    });
                }

                //create cart for this user:result._id,ironing:[],
                console.log('Success');
            })
        }).catch(function(err) {
            console.log('error', err)
            res.status(err.httpCode).json(err);
        });
    } catch (e) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        });
        console.log('catch login', e);
    }
});
router.route('/attemptsurvey')
    .post(function(req, res) {
        if(!req.body.attemptemail){
            req.body.attemptemail = "";
        }
        if(req.body.userid== null){
            req.body.userid = Date.now()+"_nologin";
        } else {
            req.body.attemptemail = "";
        }
        var clientip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var anonymous = false;
    try {
        var surveyCheck = new Promise(function(resolve, reject) {
            surveys.findOne({
                _id: req.body.surveyid
            }, function(err, results) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    if(results == null){
                        reject({
                            status:0,
                            message:"Invalid Survey"
                        })                        
                    } else {
                        resolve(results)
                    }
                }
            })
        });
        var surveyConfigCheck = new Promise(function(resolve, reject) {
            surveyconfig.findOne({
                surveyid: req.body.surveyid
            }, function(err, results) {
                resolve(results)
            })
        });
        var userCheck = new Promise(function(resolve, reject) {
            users.findOne({
                _id: req.body.userid
            }, function(err, results) {
                if (err) {
                    resolve({
                        _id:"nologin",
                        message:"Invalid User"
                    }) 
                } else {
                    if(results == null){
                        resolve({
                            _id:"nologin",
                            message:"Invalid User"
                        })                        
                    } else {
                        resolve(results)
                    }
                }
            })
        });
        var surveyattemptCheck = new Promise(function(resolve, reject) {
            Promise.all([surveyConfigCheck]).then(function(sconfig) {
                if(req.body.userid.indexOf("login") < 0 || req.body.attemptemail == ""){
                   var attemptFilter =  {
                        userid: req.body.userid,
                        surveyid: req.body.surveyid,
                        semesterid: req.body.semesterid
                    }
                } else {
                    var attemptFilter =  {
                        useremail: req.body.attemptemail,
                        surveyid: req.body.surveyid,
                        semesterid: req.body.semesterid
                    }
                }
                var surveyConfig = sconfig[0];
                surveyattempt.find(attemptFilter, function(err, results) {
                    if (err) {
                        reject(err)
                    } else {
                        if(surveyConfig){
                            anonymous = surveyConfig.anonymous
                            if(surveyConfig.multisubmission == "0"){
                                /* IP restriction */
                                var found = results.find( attemp => attemp.createdip == clientip);
                                if(!found){
                                   if(surveyConfig.multisubmissionuser == "0" && results.length > 0){
                                        /* user access restriction */
                                        resolve(results[0]);
                                    } else {
                                        resolve(found);
                                    }
                                } else {
                                    resolve(found);
                                }
                            } else if(surveyConfig.multisubmissionuser == "0" && results.length > 0){
                                /* user access restriction */
                                resolve(results[0]);
                            } else {
                                var found = results.find( attemp => attemp.state == 0);
                                resolve(found)
                            }
                        } else {
                            var found = results.find( attemp => attemp.state == 0);
                            resolve(found)
                        }
                    }
                })
            }).catch(function(err) {
                reject(err)
            });
        });
        var surveyattemptdata = new Promise(function(resolve, reject) {
            Promise.all([surveyattemptCheck]).then(function(attemptcheck) {
                if(attemptcheck[0] == null){
                    surveyattempt.create({
                        userid: req.body.userid,
                        surveyid: req.body.surveyid,
                        semesterid: req.body.semesterid,
                        useremail: req.body.attemptemail,
                        state:0,
                        anonymous:anonymous,
                        createdip:clientip,
                        datestarted:Date.now(),
                        datefinished:0
                    }, function(err, results) {
                        if (err) {
                            reject({
                                httpCode: CodesAndMessages.dbErrHttpCode,
                                code: CodesAndMessages.dbErrCode,
                                message: CodesAndMessages.dbErrMessage
                            })
                        } else {
                            resolve(results)
                        }
                    })
                } else {
                    resolve(attemptcheck[0])
                }
            }).catch(function(err) {
                console.log('error', err)
                res.status(err.httpCode).json(err);
            });
        });
        Promise.all([surveyCheck, userCheck, surveyattemptdata]).then(function(allcheck) {
            logstore.createlog({action:"start", module:"attempt", moduleid:allcheck[2]._id}, req)
            res.status(200).json({
                message : " attempt.",
                data:allcheck[2]
            });
        }).catch(function(err) {
            console.log('error', err)
            res.status(err.httpCode).json(err);
        });
    } catch (e) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        });
        console.log('catch login', e);
    }
});

router.route('/getattemptsurvey')
    .post(function(req, res) {
        // console.log(req.body);
        // req.body.userid = "tempdata";
        // console.log(req.body);
        surveyattempt.findOne({
            _id: req.body.attemptid
        }, function(err, results) {
            if (err) {
                return res.status(401).json({
                    status : 401,
                    message : "Invalid Attempt.",
                });
            } else {
                // logstore.createlog({action:"get", module:"attempt", moduleid:results._id}, req)
                res.json(results)
            }
        })
});
router.route('/login')
    .post(function(req, res){
        logstore.createlog({action:"login", module:"user", email:req.body.email}, req)
        users.findOne({"email": req.body.email, "password": req.body.password}, function(err, user_data){
            if(err || !user_data){
                return res.status(401).json({
                    status : 401,
                    message : "Invalid email and password.",
                });
            } else {
                const payload = {
                    name: user_data.username
                };
                const name = user_data.username
                const userrole = user_data.role
                var token = jwt.sign(payload, app.get('superSecret'), {
                            expiresIn : 60*60*24 // expires in 24 hours
                });
                res.status(200).json({
                    message : "You have succesfully loggedin.",
                    token   : token,
                    userrole    : userrole,
                    id    : user_data._id,
                    name
                });
            }
        });
    });

    router.route('/gpexlogin')
    .post(function(req, res){
        logstore.createlog({action:"gpexlogin", module:"user", email:req.body.email}, req)
        users.findOne({"email": req.body.email}, function(err, user_data){
            if(err || !user_data){
                return res.status(401).json({
                    status : 401,
                    message : "Invalid email",
                });
            } else {
                const payload = {
                    name: user_data.username
                };
                const name = user_data.username
                const userrole = user_data.role
                var token = jwt.sign(payload, app.get('superSecret'), {
                            expiresIn : 60*60*24 // expires in 24 hours
                });
                res.status(200).json({
                    message : "You have succesfully loggedin.",
                    token   : token,
                    userrole   : userrole,
                    id    : user_data._id,
                    name
                });
            }
        });
    });
router.route('/result')
    .get(function(req, res) {
        users.find({},{
            password:0
        },function(err, logins) {
            if (err)
                res.send(err);

            res.json(logins);
        });
     });
router.route('/getusers')
    .get(function(req, res) {
        logstore.createlog({action:"get", module:"user"}, req)
        users.find({},{
            password:0
        },function(err, regs) {
            if (err)
                res.send(err);

            res.json(regs);
        });
    });
router.route('/getuserswithrole')
    .get(function(req, res) {
        // logstore.createlog({action:"get", module:"user"}, req)
        users.find({},{
            password:0
        },function(err, regs) {
            if (err)
                res.send(err);



        var counter = 0;
        var alllist = [];
        if(regs != undefined && regs.length > 0){
            asyncLoop(regs, function (slist, next)
            {
                var role = slist.role.split(",");
                roles.find({ _id : { $in : role } }, function(error, allroles) {
                    if(error){
                        allroles = [];
                    }
                    alllist.push({
                        _id:slist._id,
                        oneuserid:slist.oneuserid,
                        firstname:slist.firstname,
                        lastname:slist.lastname,
                        username:slist.username,
                        email:slist.email,
                        roles:allroles
                    });
                    next();
                });
            }, function (err)
            {
                if (err)
                {
                    console.error('Inner Error: ' + err.message);
                    // return;
                }
                res.json(alllist);
            });
        } else {
             res.json(alllist);
        }
    });
});
     router.route('/getroles')
     .get(function(req, res) {
        // logstore.createlog({action:"get", module:"role"}, req)
         roles.find(function(err, allroles) {
             if (err)
                 res.send(err);
 
             res.json(allroles);
         });
      });
      router.route('/getrolebyid')
      .post(function(req, res) {
        //   logstore.createlog({action:"get", module:"role", moduleid:req.body.roleid}, req)
          roles.findOne({"_id":req.body.roleid},function(err, allroles) {
              if (err)
                  res.send(err);
  
              res.json(allroles);
          });
       });
 router.route('/getgroups')
     .get(function(req, res) {
          logstore.createlog({action:"get", module:"group"}, req)
         groups.find(function(err, allgroups) {
             if (err)
                 res.send(err);
 
             res.json(allgroups);
         });
      });
router.route('/getprojects')
     .get(function(req, res) {
          logstore.createlog({action:"get", module:"project"}, req)
        projects.find(function(err, allprojects) {
             if (err)
                 res.send(err);
 
             res.json(allprojects);
         });
      });
      router.route('/getsurveys')
      .get(function(req, res) {
          var surveylist = []
          surveys.find(function(err, allsurveys) {
              if(allsurveys){
                asyncLoop(allsurveys, function (survey, nextsurvey){
                    logstores.findOne({
                        surveyid:survey._id,
                        $or:[
                            {action:"add"},
                            {action:"update"},
                            {action:"delete"}
                        ]
                    }).sort('-createddate').exec(function (err, log) {
                        console.log(log);
                        if(log){
                            survey.modifiedddate = log.createddate;
                        }
                        surveylist.push(survey);
                        nextsurvey()
                    });
                }, function (err)
                {
                    var newarray = surveylist.sort(function(a, b){
                            return b.modifiedddate-a.modifiedddate;
                    })
                    res.json(newarray);
                });
              } else {
                  res.json([]);
              }
          });
      });
    router.route('/getdeletedsurveys')
    .get(function(req, res) {
        logstore.createlog({action:"get", module:"survey"}, req)
        surveys.find({"delete": "1"},function(err, allsurveys) {
            if (err)
                res.send(err);

            res.json(allsurveys);
        });
    });
      router.route('/getsurvey')
    .post(function(req, res) {
        var surveyid = req.body.surveyid;
        logstore.createlog({action:"get", module:"survey", moduleid:surveyid, surveyid:surveyid}, req)
        surveys.findOne({"_id":surveyid},function(err, surveydata) {
            if (err)
                res.send(err);

            res.json(surveydata);
        });
    });
    router.route('/updatesurveytitle')
    .post(function(req, res) {
        var surveyid = req.body.surveyid;
        logstore.createlog({action:"update", module:"survey", moduleid:surveyid, surveyid:surveyid}, req)
        var title = req.body.title;
        surveys.findOneAndUpdate({"_id":surveyid},{
            surveyname:title,
            modifiedddate:Date.now()
        },function(err, surveydata) {
            if (err)
                res.send(err);

            res.json(surveydata);
        });
    });
    router.route('/updatesurveyproject')
    .post(function(req, res) {
        var surveyid = req.body.surveyid;
        var project = req.body.project;
        logstore.createlog({action:"update", module:"survey", moduleid:surveyid, surveyid:surveyid}, req)
        surveys.findOneAndUpdate({"_id":surveyid},{
            category:project,
            modifiedddate:Date.now()
        },function(err, surveydata) {
            if (err)
                res.send(err);

            res.json(surveydata);
        });
    });
    router.route('/getsurveyconfig')
    .post(function(req, res) {
        var surveyid = req.body.surveyid;
        var data_surveyconfig = {
            surveyid:surveyid,
            active: "0",
            display: "0",
            mode: "0",
            anonymous: "0",
            coverphoto: "",
            multisubmission: "0",
            multisubmissionuser: "0",
            editor: [],
            reviewer: [],
            resnotiftoedotor: false,
            processapprovalbyedotor: false,
            processapprovaltoedotor: false,
            sendnotiftoreviewer: false,
            sendnotiftoeditor: false,
            createdby:  "",
            createddate:  "",
            recaptcha:"0",
            skipnext:"0",
            honeypot:"0"
        };
        var promis_getsurveyconfig = new Promise(function(resolve, reject) {
            surveyconfig.findOne({"surveyid": surveyid},function(err, resconfig) {
                if (err)
                    resolve(surveyconfig)
                // console.log(resconfig);
                if(resconfig == null){
                    resolve(data_surveyconfig)
                } else {
                    data_surveyconfig.active = resconfig.active
                    data_surveyconfig.display = resconfig.display
                    data_surveyconfig.mode = resconfig.mode
                    data_surveyconfig.anonymous = resconfig.anonymous
                    data_surveyconfig.coverphoto = resconfig.coverphoto
                    data_surveyconfig.multisubmission = resconfig.multisubmission
                    data_surveyconfig.multisubmissionuser = resconfig.multisubmissionuser
                    data_surveyconfig.editor = JSON.parse(resconfig.editor)
                    data_surveyconfig.reviewer = JSON.parse(resconfig.reviewer)
                    data_surveyconfig.resnotiftoedotor = resconfig.resnotiftoedotor
                    data_surveyconfig.processapprovalbyedotor = resconfig.processapprovalbyedotor
                    data_surveyconfig.processapprovaltoedotor = resconfig.processapprovaltoedotor
                    data_surveyconfig.sendnotiftoreviewer = resconfig.sendnotiftoreviewer
                    data_surveyconfig.sendnotiftoeditor = resconfig.sendnotiftoeditor
                    data_surveyconfig.createdby = resconfig.createdby
                    data_surveyconfig.createddate = resconfig.createddate
                    data_surveyconfig.recaptcha = resconfig.recaptcha
                    data_surveyconfig.skipnext = resconfig.skipnext
                    data_surveyconfig.honeypot = resconfig.honeypot
                    resolve(data_surveyconfig)
                }
            });                
        });
        Promise.all([promis_getsurveyconfig]).then(function(promisdata) {
            console.log("promisdata");
            // logstore.createlog({action:"get", module:"surveyconfig", moduleid:data_surveyconfig._id, surveyid:surveyid}, req)
            res.status(200).json({
                status:1,
                message:"found",
                data:data_surveyconfig
            })
        }).catch(function(err) {
            console.log('error', err)
        });
       
    });
    router.route('/getcurrentuser')
    .post(function(req, res) {
        // logstore.createlog({action:"get", module:"user"}, req)
       users.findOne({"username": req.body.username},{
           password:0
       },function(err, curentuser) {
            if (err)
                res.send(err);
            if(curentuser){
                var allroles = [];
                var curentuser1={
                    _id:curentuser._id,
                    oneuserid:curentuser.oneuserid,
                    firstname:curentuser.firstname,
                    lastname:curentuser.lastname,
                    username:curentuser.username,
                    email:curentuser.email,
                    role:curentuser.role,
                    roles:allroles
                };
                role = curentuser.role.split(",");
                roles.find({ _id : { $in : role } }, function(error, allroles) {
                    if(error){
                        allroles = [];
                    }
                    curentuser1.roles = allroles;
                    res.json(curentuser1);
                });
            } else {
                res.json(curentuser);
            }
        });
     });
     router.route('/getuserbyid')
     .post(function(req, res) {
        users.findOne({"_id": req.body.userid},{
            password:0
        },function(err, curentuser) {
            if (err){
                res.send({
                    status:0,
                    err:err
                });
             } else {
                 res.status(200).json({
                    status:0,
                    user:curentuser
                });

             }
         });
      });

    router.route('/addquestion')
       .post(function(req, res) {
        try {
            var surveyid = req.body.surveyid;
            surveys.findOne({"_id": surveyid},function(err, survey_data){
                if(err || !survey_data){
                    return res.status(401).json({
                        status : 401,
                        message : "Invalid Survey ID",
                    });
                } else {
                        questions.create({
                            'surveyid':surveyid,
                            'questiontype':req.body.questions.type,
                            'status':"0",
                            'questiontext':req.body.questions.questiontext,
                            'havedescription':req.body.questions.havedescription,
                            'description':req.body.questions.description,
                            'haveimage':req.body.questions.haveimage,
                            'required':req.body.questions.required,
                            'image':req.body.questions.image,
                            'maskformat':req.body.questions.maskformat,
                            'groupid':req.body.questions.groupid,
                            'maxrate':req.body.questions.maxrate,
                            'length':req.body.questions.length,
                            'rating':req.body.questions.rating,
                            'order':req.body.questions.order,
                            'qtype':req.body.questions.qtype
                        }, 
                        function(createErr, result) {
                            if (createErr) {
                                console.log(createErr);
                                res.status(200).send({
                                    message: "Failed to add question",
                                    error: createErr
                                });
                            } else {
                                surveys.findOneAndUpdate({_id:surveyid},{modifiedddate:Date.now()},function(status,result){})

                                var questionid = result._id;
                                logstore.createlog({action:"add", module:"question", moduleid:questionid,surveyid:surveyid }, req)
                                if(req.body.questions.type == 'multic' || req.body.questions.type == 'singlec' || req.body.questions.type == 'multipletext' || req.body.questions.type == 'dropdown' || req.body.questions.type == 'ranking'){
                                    var arr_choice = [];
                                    var arr_err = [];
                                    req.body.questions.choice.forEach(choice => {
                                        questionoptions.create({
                                            questionid:questionid,
                                            choicestate:choice.choicestate,
                                            choicetext:choice.choicetext
                                        }, 
                                        function(createChoiceErr, result1) {
                                            // console.log(result1)
                                            
                                        });
                                    });
                                    res.status(200).json({
                                        message : "Updated multic succesfully.",
                                        questionid    : questionid,
                                        result    : result,
                                        arr_choice:arr_choice,
                                        arr_err:arr_err
                                    });
                                } else if(req.body.questions.type == 'matrixquestion'){
                                    req.body.questions.allrows.forEach(rows => {
                                        questionmatrixrows.create({
                                            questionid:questionid,
                                            option:rows.option,
                                            option:rows.radioans
                                        }, 
                                        function(createChoiceErr, result1) {
                                            // console.log(result1)
                                        });
                                    });
                                    req.body.questions.allcols.forEach(cols => {
                                        questionmatrixcols.create({
                                            questionid:questionid,
                                            option:cols.option
                                        }, 
                                        function(createChoiceErr, result1) {
                                            // console.log(result1)
                                        });
                                    });
                                    res.status(200).json({
                                        message : "Updated multic succesfully.",
                                        questionid    : questionid,
                                        result    : result
                                    });
                                } else if(req.body.questions.type == 'customform'){
                                    req.body.questions.customformdata.forEach(formdata => {
                                        questioncustomdata.create({
                                            questionid:questionid,
                                            title:formdata.title,
                                            type:formdata.type,
                                            width:formdata.width,
                                            required:formdata.required
                                        }, 
                                        function(createChoiceErr, result1) {
                                            // console.log(result1)
                                        });
                                    });
                                    res.status(200).json({
                                        message : "Updated custom form succesfully.",
                                        questionid    : questionid,
                                        result    : result
                                    });
                                } else if(req.body.questions.type == 'qtypeslider'){
                                    req.body.questions.links.forEach(link => {
                                        questionsliderlinks.create({
                                            questionid:questionid,
                                            src:link.src
                                        }, 
                                        function(createChoiceErr, result1) {
                                            // console.log(result1)
                                        });
                                    });
                                    res.status(200).json({
                                        message : "Updated custom form succesfully.",
                                        questionid    : questionid,
                                        result    : result
                                    });
                                } else {
                                    res.status(200).json({
                                        message : "Updated succesfully.",
                                        questionid    : questionid,
                                        result    : result
                                    });
                                }
                            }
                            console.log('Success');
                        });
                }
            })
        } catch (e) {
                res.status(500).json({
                    httpCode: CodesAndMessages.dbErrHttpCode,
                    code: CodesAndMessages.dbErrCode,
                    message: CodesAndMessages.dbErrMessage
                });
        }

    });
    router.route('/getquestions')
    .post(function(req, res) {
         var surveyid = req.body.surveyid;
        logstore.createlog({action:"get", module:"question", surveyid:surveyid }, req)
         questions.find({surveyid:surveyid},function(err, allquestions) {
            if (err)
                res.send(err);
            console.log("success");
            // console.log(allquestions);
            var newarray = []
            // console.log(newarray);
            if(allquestions.length > 0){
                newarray = allquestions.sort(function(a, b){
                        return a.order-b.order
                    })
            } else {
                newarray = allquestions
            }
            res.json(newarray);
        });
     });
    router.route('/getquestion')
     .post(function(req, res) {
        var questionid = req.body.questionid;
        
        questions.findOne({'_id':questionid},function(err, question) {
            if(err){
                res.status(200).json({
                    status:0,
                    message:"question not found",
                })
            } else {
                if(question === null){
                    res.status(200).json({
                        status:0,
                        message:"question not found",
                    })
                } else {
                    // logstore.createlog({action:"get", module:"question", moduleid:questionid, surveyid: question.surveyid}, req)
                    if(question.questiontype == 'multic' || question.questiontype == 'singlec' || question.questiontype == 'multipletext' || question.questiontype == 'dropdown' || question.questiontype == 'ranking' ){
                        questionoptions.find({'questionid':question._id}, function(err, options){
                            if(err){
                                console.log("error in option");
                            } else {
                                var retquestion = {
                                    '_id':question._id,
                                    'surveyid':question.surveyid,
                                    'groupid':question.groupid,
                                    'questiontype':question.questiontype,
                                    'status':question.status,
                                    'questiontext':question.questiontext,
                                    'havedescription':question.havedescription,
                                    'description':question.description,
                                    'haveimage':question.haveimage,
                                    'imagefirst':question.imagefirst,
                                    'image':question.image,
                                    'required':question.required,
                                    'other':question.other,
                                    'havecomment':question.havecomment,
                                    'othertext':question.othertext,
                                    'commenttext':question.commenttext,
                                    'maskformat':question.maskformat,
                                    'maxrate':question.maxrate,
                                    'length':question.length,
                                    'rating':question.rating,
                                    'order':question.order,
                                    'qtype':question.qtype,
                                    'choice':options,
                                    'npsleft':question.npsleft,
                                    'npsright':question.npsright,
                                    'npsmiddle':question.npsmiddle,
                                }
                                res.status(200).json({
                                    status:1,
                                    message:"found",
                                    data:retquestion
                                })
                            }
                        })
                    } else if(question.questiontype == 'matrixquestion'){
                        
                        var allrows = [];
                        var allcols = [];
                        var promis_getallrows = new Promise(function(resolve, reject) {
                            questionmatrixrows.find({'questionid':question._id}, function(err, allrow){
                                if(err){
                                    resolve([])
                                } else {
                                    allrows = allrow
                                    resolve(allrow)
                                }
                            })                
                        });
                        var promis_getallcols = new Promise(function(resolve, reject) {
                            questionmatrixcols.find({'questionid':question._id}, function(err, allcol){
                                if(err){
                                    resolve([])
                                } else {
                                    allcols = allcol
                                    resolve(allcols)
                                }
                            })
                        });
                        Promise.all([promis_getallrows, promis_getallcols]).then(function(promisdata) {
                            var retquestion = {
                                '_id':question._id,
                                'surveyid':question.surveyid,
                                'groupid':question.groupid,
                                'questiontype':question.questiontype,
                                'status':question.status,
                                'questiontext':question.questiontext,
                                'havedescription':question.havedescription,
                                'description':question.description,
                                'haveimage':question.haveimage,
                                'image':question.image,
                                'required':question.required,
                                'other':question.other,
                                'havecomment':question.havecomment,
                                'othertext':question.othertext,
                                'commenttext':question.commenttext,
                                'maskformat':question.maskformat,
                                'maxrate':question.maxrate,
                                'length':question.length,
                                'rating':question.rating,
                                'order':question.order,
                                'qtype':question.qtype,
                                'allrows':allrows,
                                'allcols':allcols,
                                'npsleft':question.npsleft,
                                'npsright':question.npsright,
                                'npsmiddle':question.npsmiddle
                            }
                            console.log("response sent");
                            
                            res.status(200).json({
                                status:1,
                                message:"found",
                                data:retquestion
                            })
                        }).catch(function(err) {
                            console.log('error', err)
                        });
                    } else if(question.questiontype == 'customform'){
                        var alldata = [];
                        var promis_getallfields = new Promise(function(resolve, reject) {
                            questioncustomdata.find({'questionid':question._id}, function(err, allrow){
                                if(err){
                                    resolve([])
                                } else {
                                    resolve([allrow])
                                    alldata = allrow
                                }
                            })
                        });
                        Promise.all([promis_getallfields]).then(function(promisdata) {
                            var retquestion = {
                                '_id':question._id,
                                'surveyid':question.surveyid,
                                'groupid':question.groupid,
                                'questiontype':question.questiontype,
                                'status':question.status,
                                'questiontext':question.questiontext,
                                'havedescription':question.havedescription,
                                'description':question.description,
                                'haveimage':question.haveimage,
                                'image':question.image,
                                'required':question.required,
                                'other':question.other,
                                'havecomment':question.havecomment,
                                'othertext':question.othertext,
                                'commenttext':question.commenttext,
                                'maskformat':question.maskformat,
                                'maxrate':question.maxrate,
                                'length':question.length,
                                'rating':question.rating,
                                'order':question.order,
                                'qtype':question.qtype,
                                'customformdata':alldata,
                                'npsleft':question.npsleft,
                                'npsright':question.npsright,
                                'npsmiddle':question.npsmiddle
                            }
                            res.status(200).json({
                                status:1,
                                message:"found",
                                data:retquestion
                            })
                        }).catch(function(err) {
                            console.log('error', err)
                        });                    
                        
                        
                    } else if(question.questiontype == 'qtypeslider'){
                        var alllinks = [];
                        var promis_getalllinks = new Promise(function(resolve, reject) {
                            questionsliderlinks.find({'questionid':question._id}, function(err, alllink){
                                if(err){
                                    resolve([])
                                } else {
                                    alllinks = alllink
                                    resolve(alllinks)
                                }
                            })
                        });
                        Promise.all([promis_getalllinks]).then(function(promisdata) {
                            var retquestion = {
                                '_id':question._id,
                                'surveyid':question.surveyid,
                                'groupid':question.groupid,
                                'questiontype':question.questiontype,
                                'status':question.status,
                                'questiontext':question.questiontext,
                                'havedescription':question.havedescription,
                                'description':question.description,
                                'haveimage':question.haveimage,
                                'image':question.image,
                                'required':question.required,
                                'other':question.other,
                                'havecomment':question.havecomment,
                                'othertext':question.othertext,
                                'commenttext':question.commenttext,
                                'maskformat':question.maskformat,
                                'maxrate':question.maxrate,
                                'length':question.length,
                                'rating':question.rating,
                                'order':question.order,
                                'qtype':question.qtype,
                                'links':alllinks,
                                'npsleft':question.npsleft,
                                'npsright':question.npsright,
                                'npsmiddle':question.npsmiddle
                            }
                            res.status(200).json({
                                status:1,
                                message:"found",
                                data:retquestion
                            })
                        }).catch(function(err) {
                            console.log('error', err)
                        });                    
                        
                        
                    } else {
                        res.status(200).json({
                            status:1,
                            message:"found",
                            data:question
                        })
                    }
                }
            }
        })
    });
     router.route('/deletequestion')
     .post(function(req, res) {
          var questionid = req.body.questionid;
        logstore.createlog({action:"delete", module:"question", moduleid:questionid }, req)
         questions.deleteOne({_id:questionid},function(status, deleted) {
            questionoptions.deleteMany({questionid:questionid},function(status, deleted) {
            });
            questionsliderlinks.deleteMany({questionid:questionid},function(status, deleted) {
            });
            questionmatrixrows.deleteMany({questionid:questionid},function(status, deleted) {
            });
            questionmatrixcols.deleteMany({questionid:questionid},function(status, deleted) {
            });
            questioncustomdata.deleteMany({questionid:questionid},function(status, deleted) {
            });
            questionorder.deleteMany({questionid:questionid},function(status, deleted) {
            });
            questionlogicjump.deleteMany({questionid:questionid},function(status, deleted) {
            });
            res.status(200).json(deleted);
         });
      });
      router.route('/deleteoptions')
      .post(function(req, res) {
           var optionid = req.body.optionid;
        logstore.createlog({action:"delete", module:"option", moduleid:optionid }, req)
          questionoptions.deleteOne({_id:optionid},function(status, deleted) {
             res.status(200).json(deleted);
          });
       });
      router.route('/deletecustimfield')
      .post(function(req, res) {
           var fieldid = req.body.fieldid;
        logstore.createlog({action:"delete", module:"customfield", moduleid:fieldid }, req)
          questioncustomdata.deleteOne({_id:fieldid},function(status, deleted) {
             res.status(200).json(deleted);
          });
       });
       router.route('/deletesliderlinks')
       .post(function(req, res) {
            var linkid = req.body.linkid;
        logstore.createlog({action:"delete", module:"slide", moduleid:linkid }, req)
           questionsliderlinks.deleteOne({_id:linkid},function(status, deleted) {
              res.status(200).json(deleted);
           });
        });
        router.route('/deletematrixcols')
     .post(function(req, res) {
          var colid = req.body.colid;
            logstore.createlog({action:"delete", module:"column", moduleid:colid }, req)
         questionmatrixcols.deleteOne({_id:colid},function(status, deleted) {
            res.status(200).json(deleted);
         });
      });
     router.route('/deletematrixrows')
     .post(function(req, res) {
          var rowid = req.body.rowid;
            logstore.createlog({action:"delete", module:"row", moduleid:rowid }, req)
         questionmatrixrows.deleteOne({_id:rowid},function(status, deleted) {
            res.status(200).json(deleted);
         });
      });
     router.route('/addoptions')
     .post(function(req, res) {
        try{
            var questionid = req.body.questionid;
            var choicestate = req.body.choicestate;
            var choicetext = req.body.choicetext;
            questionoptions.create({
                questionid:questionid,
                choicestate:choicestate,
                choicetext:choicetext
            }, 
            function(createErr, result) {
                if (createErr) {
                    res.status(CodesAndMessages.dbErrHttpCode).send({
                        status:0,
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    });
                } else {
                    logstore.createlog({action:"add", module:"option", moduleid:result._id }, req)
                    res.status(200).json({
                        status:1,
                        message : "added succesfully.",
                        result    : result
                    });
                }
            })
        } catch(e){
            res.status(500).json({
                httpCode: CodesAndMessages.dbErrHttpCode,
                code: CodesAndMessages.dbErrCode,
                message: CodesAndMessages.dbErrMessage
            });
            console.log('catch update question', e);
        }
    });
    router.route('/addnewcustomfield')
    .post(function(req, res) {
       try{
           var questionid = req.body.questionid;
           var formdata = req.body.formdata;
           questioncustomdata.create({
                questionid:questionid,
                title:formdata.title,
                type:formdata.type,
                width:formdata.width,
                required:formdata.required
            }, 
           function(createErr, result) {
               if (createErr) {
                   res.status(CodesAndMessages.dbErrHttpCode).send({
                       status:0,
                       httpCode: CodesAndMessages.dbErrHttpCode,
                       code: CodesAndMessages.dbErrCode,
                       message: CodesAndMessages.dbErrMessage
                   });
               } else {
                    logstore.createlog({action:"add", module:"customfield", moduleid:result._id }, req)
                   res.status(200).json({
                       status:1,
                       message : "added succesfully.",
                       result    : result
                   });
               }
           })
       } catch(e){
           res.status(500).json({
               httpCode: CodesAndMessages.dbErrHttpCode,
               code: CodesAndMessages.dbErrCode,
               message: CodesAndMessages.dbErrMessage
           });
           console.log('catch update question', e);
       }
   });
   router.route('/addmatrixrow')
   .post(function(req, res) {
      try{
          var questionid = req.body.questionid;
          var option = req.body.option;
          var radioans = req.body.radioans;
          questionmatrixrows.create({
              questionid:questionid,
              option:option,
              option:radioans
          }, 
          function(createErr, result) {
              if (createErr) {
                  res.status(CodesAndMessages.dbErrHttpCode).send({
                      status:0,
                      httpCode: CodesAndMessages.dbErrHttpCode,
                      code: CodesAndMessages.dbErrCode,
                      message: CodesAndMessages.dbErrMessage
                  });
              } else {
                    logstore.createlog({action:"add", module:"row", moduleid:result._id }, req)
                  res.status(200).json({
                      status:1,
                      message : "added succesfully.",
                      result    : result
                  });
              }
          })
      } catch(e){
          res.status(500).json({
              httpCode: CodesAndMessages.dbErrHttpCode,
              code: CodesAndMessages.dbErrCode,
              message: CodesAndMessages.dbErrMessage
          });
          console.log('catch update question', e);
      }
  });
  router.route('/addmatrixcol')
   .post(function(req, res) {
      try{
          var questionid = req.body.questionid;
          var option = req.body.option;
          questionmatrixcols.create({
              questionid:questionid,
              option:option
          }, 
          function(createErr, result) {
              if (createErr) {
                  res.status(CodesAndMessages.dbErrHttpCode).send({
                      status:0,
                      httpCode: CodesAndMessages.dbErrHttpCode,
                      code: CodesAndMessages.dbErrCode,
                      message: CodesAndMessages.dbErrMessage
                  });
              } else {
                    logstore.createlog({action:"add", module:"column", moduleid:result._id }, req)
                  res.status(200).json({
                      status:1,
                      message : "added succesfully.",
                      result    : result
                  });
              }
          })
      } catch(e){
          res.status(500).json({
              httpCode: CodesAndMessages.dbErrHttpCode,
              code: CodesAndMessages.dbErrCode,
              message: CodesAndMessages.dbErrMessage
          });
          console.log('catch update question', e);
      }
  });
  router.route('/addsliderlink').post(function(req, res) {
     try{
         var questionid = req.body.questionid;
         var src = req.body.src;
         questionsliderlinks.create({
             questionid:questionid,
             src:src
         }, 
         function(createErr, result) {
             if (createErr) {
                 res.status(CodesAndMessages.dbErrHttpCode).send({
                     status:0,
                     httpCode: CodesAndMessages.dbErrHttpCode,
                     code: CodesAndMessages.dbErrCode,
                     message: CodesAndMessages.dbErrMessage
                 });
             } else {
                    logstore.createlog({action:"add", module:"slide", moduleid:result._id }, req)
                 res.status(200).json({
                     status:1,
                     message : "added succesfully.",
                     result    : result
                 });
             }
         })
     } catch(e){
         res.status(500).json({
             httpCode: CodesAndMessages.dbErrHttpCode,
             code: CodesAndMessages.dbErrCode,
             message: CodesAndMessages.dbErrMessage
         });
         console.log('catch update question', e);
     }
 });
 router.route('/updatequestion')
  .post(function(req, res) {
     try{
         var questionid = req.body.questionid;
         var questiontext = req.body.questiontext;
        
        questions.findOneAndUpdate({_id:questionid},{
         questiontext:questiontext
         },function(status,result) {
             if(!empty(result)){
                logstore.createlog({action:"update", module:"question", moduleid:questionid, surveyid:result.surveyid }, req)
                res.status(200).json({
                 status: 1,
                 message:"Updated",
             });
             } else {
             res.status(200).json({
                 status:0,
                 message:"Failed"
             });
             }
         });
     } catch(e){
         res.status(500).json({
             httpCode: CodesAndMessages.dbErrHttpCode,
             code: CodesAndMessages.dbErrCode,
             message: CodesAndMessages.dbErrMessage
         });
         console.log('catch update question', e);
     }
 });
 router.route('/updatehavedescription')
   .post(function(req, res) {
      try{
          var questionid = req.body.questionid;
            // logstore.createlog({action:"update", module:"question", moduleid:questionid }, req)
          var havedesc = req.body.havedesc;
          questions.findOneAndUpdate({_id:questionid},{
              havedescription:havedesc,
              imagefirst:true,
          },function(status,result) {
              if(!empty(result)){
                logstore.createlog({action:"update", module:"question", moduleid:questionid, surveyid:result.surveyid }, req)
              res.status(200).json({
                  status: 1,
                  message:"Updated",
              });
              } else {
              res.status(200).json({
                  status:0,
                  message:"Failed"
              });
              }
          });
      } catch(e){
          res.status(500).json({
              httpCode: CodesAndMessages.dbErrHttpCode,
              code: CodesAndMessages.dbErrCode,
              message: CodesAndMessages.dbErrMessage
          });
          console.log('catch update question', e);
      }
  });
    router.route('/updatehaveimage')
    .post(function(req, res) {
        try{
            var questionid = req.body.questionid;
            var haveimage = req.body.haveimage;
            // logstore.createlog({action:"update", module:"question", moduleid:questionid }, req)
            questions.findOneAndUpdate({_id:questionid},{
            haveimage:haveimage,
            imagefirst:false,
            image:""
            },function(status,result) {
                if(!empty(result)){
                    logstore.createlog({action:"update", module:"question", moduleid:questionid, surveyid:result.surveyid }, req)
                    res.status(200).json({
                    status: 1,
                    message:"Updated",
                });
                } else {
                res.status(200).json({
                    status:0,
                    message:"Failed"
                });
                }
            });
        } catch(e){
            res.status(500).json({
                httpCode: CodesAndMessages.dbErrHttpCode,
                code: CodesAndMessages.dbErrCode,
                message: CodesAndMessages.dbErrMessage
            });
            console.log('catch update question', e);
        }
    });
    router.route('/updatequestionimage')
    .post(function(req, res) {
        try{
            var questionid = req.body.questionid;
            var image = req.body.image;
            // logstore.createlog({action:"update", module:"question", moduleid:questionid }, req)
            questions.findOneAndUpdate({_id:questionid},{
                image:image
            },function(status,result) {
                if(!empty(result)){
                    logstore.createlog({action:"update", module:"question", moduleid:questionid, surveyid:result.surveyid }, req)
                    res.status(200).json({
                    status: 1,
                    message:"Updated",
                });
                } else {
                res.status(200).json({
                    status:0,
                    message:"Failed"
                });
                }
            });
        } catch(e){
            res.status(500).json({
                httpCode: CodesAndMessages.dbErrHttpCode,
                code: CodesAndMessages.dbErrCode,
                message: CodesAndMessages.dbErrMessage
            });
            console.log('catch update question', e);
        }
    });
    router.route('/updatemaxrate')
    .post(function(req, res) {
       try{
           var questionid = req.body.questionid;
           var maxrate = req.body.maxrate;
            // logstore.createlog({action:"update", module:"question", moduleid:questionid }, req)
           questions.findOneAndUpdate({_id:questionid},{
               maxrate:maxrate
           },function(status,result) {
               if(!empty(result)){
                logstore.createlog({action:"update", module:"question", moduleid:questionid, surveyid:result.surveyid }, req)
                   res.status(200).json({
                       status: 1,
                       message:"Updated",
                   });
               } else {
                   res.status(200).json({
                       status:0,
                       message:"Failed"
                   });
               }
           });
       } catch(e){
           res.status(500).json({
               httpCode: CodesAndMessages.dbErrHttpCode,
               code: CodesAndMessages.dbErrCode,
               message: CodesAndMessages.dbErrMessage
           });
           console.log('catch update maxrate', e);
       }
   });
   router.route('/updateqtype')
   .post(function(req, res) {
      try{
          var questionid = req.body.questionid;
          var qtypedata = req.body.qtypedata;
        // logstore.createlog({action:"update", module:"question", moduleid:questionid }, req)
          questions.findOneAndUpdate({_id:questionid},{
            qtype:qtypedata
          },function(status,result) {
              if(!empty(result)){
                logstore.createlog({action:"update", module:"question", moduleid:questionid, surveyid:result.surveyid }, req)
                  res.status(200).json({
                      status: 1,
                      message:"Updated",
                  });
              } else {
                  res.status(200).json({
                      status:0,
                      message:"Failed"
                  });
              }
          });
      } catch(e){
          res.status(500).json({
              httpCode: CodesAndMessages.dbErrHttpCode,
              code: CodesAndMessages.dbErrCode,
              message: CodesAndMessages.dbErrMessage
          });
          console.log('catch update maxrate', e);
      }
  });
  router.route('/updatelength')
   .post(function(req, res) {
      try{
          var questionid = req.body.questionid;
          var length = req.body.length;
        // logstore.createlog({action:"update", module:"question", moduleid:questionid }, req)
          questions.findOneAndUpdate({_id:questionid},{
            length:length
          },function(status,result) {
              if(!empty(result)){
                logstore.createlog({action:"update", module:"question", moduleid:questionid, surveyid:result.surveyid }, req)
                  res.status(200).json({
                      status: 1,
                      message:"Updated",
                  });
              } else {
                  res.status(200).json({
                      status:0,
                      message:"Failed"
                  });
              }
          });
      } catch(e){
          res.status(500).json({
              httpCode: CodesAndMessages.dbErrHttpCode,
              code: CodesAndMessages.dbErrCode,
              message: CodesAndMessages.dbErrMessage
          });
          console.log('catch update length', e);
      }
  });
  router.route('/updatequestionoption')
     .post(function(req, res) {
        logstore.createlog({action:"update", module:"option" }, req)
          var alloptions = req.body.alloption;
          alloptions.forEach(option => {
              questionoptions.findOneAndUpdate({_id:option._id},{
                choicetext:option.choicetext,
                choicestate:option.choicestate
              },function(status,result) {
                if(!empty(result)){
                    console.log("updated");
                    
                }
              })
          });
        res.status(200).json({
            status: 1,
            message:"Updated",
        });
     
    });
  router.route('/updatematrixcols')
     .post(function(req, res) {
        logstore.createlog({action:"update", module:"column" }, req)
          var allcols = req.body.allcols;
          allcols.forEach(col => {
              questionmatrixcols.findOneAndUpdate({_id:col._id},{
                option:col.option
              },function(status,result) {
                if(!empty(result)){
                    console.log("updated");
                }
              })
          });
        res.status(200).json({
            status: 1,
            message:"Updated",
        });
    });
  router.route('/updatematrixrows')
     .post(function(req, res) {
          var allrows = req.body.allrows;
        logstore.createlog({action:"update", module:"row" }, req)
          allrows.forEach(row => {
              questionmatrixrows.findOneAndUpdate({_id:row._id},{
                option:row.option
              },function(status,result) {
                if(!empty(result)){
                    console.log("updated");
                }
              })
          });
        res.status(200).json({
            status: 1,
            message:"Updated",
        });
    });
    router.route('/updatesurveyconfig')
     .post(function(req, res) {
         console.log(req.body);
         
          var surveyid = req.body.surveyid;
          var active = req.body.active;
          var display = req.body.display;
          var mode = req.body.mode;
          var anonymous = req.body.anonymous;
          var coverphoto = req.body.coverphoto;
          var multisubmission = req.body.multisubmission;
          var multisubmissionuser = req.body.multisubmissionuser;
          var editor = req.body.editor;
          var reviewer = req.body.reviewer;
          var resnotiftoedotor = req.body.resnotiftoedotor;
          var processapprovalbyedotor = req.body.processapprovalbyedotor;
          var processapprovaltoedotor = req.body.processapprovaltoedotor;
          var sendnotiftoreviewer = req.body.sendnotiftoreviewer;
          var sendnotiftoeditor = req.body.sendnotiftoeditor;
          var recaptcha = req.body.recaptcha;
          var skipnext = req.body.skipnext;
          var honeypot = req.body.honeypot;
          surveyconfig.findOne({"surveyid": surveyid}, function(err, oldconfig){
            if(err){
                return res.status(401).json({
                    status : 401,
                    message : "Failed",
                });
            } else {
                if(oldconfig == null){
                    console.log("added config");
                    surveyconfig.create({
                        surveyid:surveyid,
                        active:active,
                        display:display,
                        mode:mode,
                        anonymous:anonymous,
                        coverphoto:coverphoto,
                        multisubmission:multisubmission,
                        multisubmissionuser:multisubmissionuser,
                        editor:JSON.stringify(editor),
                        reviewer:JSON.stringify(reviewer),
                        resnotiftoedotor:resnotiftoedotor,
                        processapprovalbyedotor:processapprovalbyedotor,
                        processapprovaltoedotor:processapprovaltoedotor,
                        sendnotiftoreviewer:sendnotiftoreviewer,
                        sendnotiftoeditor:sendnotiftoeditor,
                        recaptcha,
                        skipnext,
                        honeypot
                    },function(status,result) {
                        // console.log(status);
                        console.log('result>>>', result)
                        logstore.createlog({action:"update", module:"surveyconfig", moduleid:result._id, surveyid:surveyid }, req)
                    res.status(200).json({
                        status: 1,
                            message:"Updated",
                        });
                    })
                } else {
                    console.log("Updated config");
                    surveyconfig.findOneAndUpdate({surveyid:surveyid},{
                      active:active,
                      display:display,
                      mode:mode,
                      anonymous:anonymous,
                      coverphoto:coverphoto,
                      multisubmission:multisubmission,
                      multisubmissionuser:multisubmissionuser,
                      editor:JSON.stringify(editor),
                      reviewer:JSON.stringify(reviewer),
                      resnotiftoedotor:resnotiftoedotor,
                      processapprovalbyedotor:processapprovalbyedotor,
                      processapprovaltoedotor:processapprovaltoedotor,
                      sendnotiftoreviewer:sendnotiftoreviewer,
                      sendnotiftoeditor:sendnotiftoeditor,
                      recaptcha,
                      skipnext,
                      honeypot
                    },function(status,result) {
                        surveys.findOneAndUpdate({_id:surveyid},{modifiedddate:Date.now()},function(status,result){})
                        logstore.createlog({action:"update", module:"surveyconfig", moduleid:result._id, surveyid:surveyid }, req)
                      res.status(200).json({
                            status: 1,
                            message:"Updated",
                        });
                    })
                }
            }
        });



    });
    router.route('/updatesliderlinks')
     .post(function(req, res) {
          var alllinks = req.body.links;
        logstore.createlog({action:"update", module:"slide" }, req)
          alllinks.forEach(link => {
              questionsliderlinks.findOneAndUpdate({_id:link._id},{
                src:link.src
              },function(status,result) {
                if(!empty(result)){
                    console.log("updated");
                }
              })
          });
        res.status(200).json({
            status: 1,
            message:"Updated",
        });
    });
    router.route('/updatecustomfields')
     .post(function(req, res) {
          var allfields = req.body.allfields;
            logstore.createlog({action:"update", module:"customfield" }, req)
          allfields.forEach(fielddata => {
              questioncustomdata.findOneAndUpdate({_id:fielddata._id},{
                title:fielddata.title,
                type:fielddata.type,
                width:fielddata.width,
                required:fielddata.required
              },function(status,result) {
                if(!empty(result)){
                    console.log("updated");
                }
              })
          });
        res.status(200).json({
            status: 1,
            message:"Updated",
        });
    });
    router.route('/updatequestionorder')
     .post(function(req, res) {
          var neworder = req.body.neworder;
          neworder.forEach(order => {
              questions.findOneAndUpdate({_id:order.id},{
                order:order.order
              },function(status,result) {
                if(!empty(result)){
                    console.log("updated");
                }
              })
          });
        res.status(200).json({
            status: 1,
            message:"Updated",
        });
    });
    router.route('/updatedescription')
    .post(function(req, res) {
         var questionid = req.body.questionid;
         var desctext = req.body.desctext;
            // logstore.createlog({action:"update", module:"question", moduleid:questionid }, req)
         
        questions.findOneAndUpdate({_id:questionid},{
           description:desctext
        },function(status,result) {
            if(!empty(result)){
                logstore.createlog({action:"update", module:"question", moduleid:questionid, surveyid:result.surveyid }, req)
               res.status(200).json({
                   status: 1,
                   message:"Updated",
               });
            } else {
               res.status(200).json({
                   status:0,
                   message:"Failed"
               });
            }
        });
   });
   router.route('/updatequestiongroup')
   .post(function(req, res) {
        var questionid = req.body.questionid;
        var groupid = req.body.groupid;
        // logstore.createlog({action:"update", module:"question", moduleid:questionid }, req)
       questions.findOneAndUpdate({_id:questionid},{
        groupid:groupid
       },function(status,result) {
           if(!empty(result)){
              res.status(200).json({
                  status: 1,
                  message:"Updated",
              });
           } else {
              res.status(200).json({
                  status:0,
                  message:"Failed"
              });
           }
       });
  });

    router.route('/updateattemptanswer')
    .post(function(req, res) {
         var surveyid = req.body.surveyid;
         var questionid = req.body.questionid;
         var attemptid = req.body.attemptid;
         var userid = req.body.userid;
         var clientip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //  var type = req.body.type;
         var answer = req.body.answer;
         var questionattemptCheck = new Promise(function(resolve, reject) {
             attemptanswer.findOne({
                 userid: userid,
                 surveyid: surveyid,
                 questionid: questionid,
                 attemptid: attemptid
             }, function(err, results) {
                 if (err) {
                     reject(err
                     )
                 } else {
                     if(results == null){
                        attemptanswer.create({
                            userid: userid,
                            surveyid: surveyid,
                            questionid: questionid,
                            attemptid: attemptid,
                            createdip:clientip,
                        }, function(err, results1) {
                            if (err) {
                                reject({
                                    httpCode: CodesAndMessages.dbErrHttpCode,
                                    code: CodesAndMessages.dbErrCode,
                                    message: CodesAndMessages.dbErrMessage
                                })
                            } else {
                                resolve(results1);
                            }
                        })
                     } else {
                        resolve(results)
                     }
                 }
             })
         });
         Promise.all([questionattemptCheck]).then(function(attemptcheck) {
            var quesattempt = attemptcheck[0]
            if(quesattempt == null){
                res.json({
                    status:0,
                    message:"failed to update"
                })
            } else {
                var qattemptid = quesattempt._id
                var finalanswer  = JSON.stringify(answer);
                if(answer.length > 0){
                    var Updatedoptions = {
                        answer:finalanswer,
                        otheranswer:""
                    }
                } else {
                    var Updatedoptions = {
                        answer:finalanswer
                    }
                }
                attemptanswer.findOneAndUpdate({_id:qattemptid},Updatedoptions,function(status,result) {
                    if(!empty(result)){
                        logstore.createlog({action:"update", module:"attemptanswer", moduleid:qattemptid }, req)
                        res.json({
                            status:1,
                            message:"updated"
                        })
                    } else {
                        res.json({
                            status:0,
                            message:"failed to update"
                        })                        
                    }
                })
            }
        }).catch(function(err) {
            console.log('error', err)
            res.status(err.httpCode).json(err);
        })
   });
    router.route('/updateattemptanswerother')
    .post(function(req, res) {
         var surveyid = req.body.surveyid;
         var questionid = req.body.questionid;
         var attemptid = req.body.attemptid;
         var userid = req.body.userid;
         var clientip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //  var type = req.body.type;
         var otheranswer = req.body.otheranswer;

         var questionattemptCheck = new Promise(function(resolve, reject) {
             attemptanswer.findOne({
                 userid: userid,
                 surveyid: surveyid,
                 questionid: questionid,
                 attemptid: attemptid
             }, function(err, results) {
                 if (err) {
                     reject(err
                     )
                 } else {
                     if(results == null){
                        attemptanswer.create({
                            userid: userid,
                            surveyid: surveyid,
                            questionid: questionid,
                            attemptid: attemptid,
                            createdip:clientip,
                        }, function(err, results1) {
                            if (err) {
                                reject({
                                    httpCode: err
                                })
                            } else {
                                resolve(results1);
                            }
                        })
                     } else {
                        resolve(results)
                     }
                 }
             })
         });
         Promise.all([questionattemptCheck]).then(function(attemptcheck) {
            var quesattempt = attemptcheck[0]
            if(quesattempt == null){
                res.json({
                    status:0,
                    message:"failed to update"
                })
            } else {
                var qattemptid = quesattempt._id
                attemptanswer.findOneAndUpdate({_id:qattemptid},{
                    otheranswer:otheranswer
                },function(status,result) {
                    if(!empty(result)){
                        logstore.createlog({action:"updateanswer", module:"attemptanswer", moduleid:result.questionid, surveyid:result.surveyid }, req)
                        res.json({
                            status:1,
                            message:"updated"
                        })
                    } else {
                        res.json({
                            status:0,
                            message:"failed to update"
                        })                        
                    }
                })
            }
        }).catch(function(err) {
            console.log('error', err)
            res.status(err.httpCode).json(err);
        })
   });
    router.route('/getattemptanswer')
    .post(function(req, res) {
         var questionid = req.body.questionid;
         var attemptid = req.body.attemptid;
        attemptanswer.findOne({
            attemptid: attemptid,
            questionid: questionid
        }, function(err, result) {
            if (err) {
                res.json({
                    httpCode: CodesAndMessages.dbErrHttpCode,
                    code: CodesAndMessages.dbErrCode,
                    message: CodesAndMessages.dbErrMessage
                })
            } else {
                if(result){
                    logstore.createlog({action:"get", module:"attemptanswer", moduleid:result._id }, req)
                }
                res.json({
                    status : 1,
                    message:"success",
                    data : result
                })
            }
        })
   });



     router.route('/getquestionsoption')
     .post(function(req, res) {
          var questionid = req.body.questionid;
          questionoptions.find({'questionid':questionid}, function(err, allcols){
            if(err){
                res.json([]);
            } else {
                res.json(allcols);
            }
        })
    });
     router.route('/getsliderlinks')
     .post(function(req, res) {
          var questionid = req.body.questionid;
          questionsliderlinks .find({'questionid':questionid}, function(err, alllinks){
            if(err){
                res.json([]);
            } else {
                res.json(alllinks);
            }
        })
    });
     router.route('/getmatrixcols')
     .post(function(req, res) {
          var questionid = req.body.questionid;
          questionmatrixcols.find({'questionid':questionid}, function(err, allcols){
            if(err){
                res.json([]);
            } else {
                res.json(allcols);
            }
        })
    });
     router.route('/getmatrixrows')
     .post(function(req, res) {
          var questionid = req.body.questionid;
          questionmatrixrows.find({'questionid':questionid}, function(err, allrows){
            if(err){
                res.json([]);
            } else {
                res.json(allrows);
            }
        })
    });
    router.route('/getcustomfields')
    .post(function(req, res) {
         var questionid = req.body.questionid;
         questioncustomdata.find({'questionid':questionid}, function(err, allfields){
           if(err){
               res.json([]);
           } else {
               res.json(allfields);
           }
       })
    });

    router.route('/updatequestionrequired')
    .post(function(req, res) { 
       try{
           var questionid = req.body.questionid;
           var required = req.body.required;
            logstore.createlog({action:"update", module:"question", moduleid:questionid }, req)
           questions.findOneAndUpdate({_id:questionid},{
               required:required
           },function(status,result) {
               if(!empty(result)){
               res.status(200).json({
                   status: 1,
                   message:"Updated",
               });
               } else {
               res.status(200).json({
                   status:0,
                   message:"Failed"
               });
               }
           });
       } catch(e){
           res.status(500).json(e);
           console.log('catch update question', e);
       }
   });
   router.route('/duplicatsurvey')
 .post(function(req, res) { 
    try{
        var surveyid = req.body.surveyid;
        var title = req.body.title;
        var user_id = req.body.user_id;
        var questionlogs = [];
        var grouplogs = [];
        var optionslogs = [];
        surveys.findOne({"_id": surveyid}, function(err, oldsurvey){
            if(err){
                return res.status(401).json({
                    status : 401,
                    message : "Failed",
                });
            } else {
                if(oldsurvey != null){
                    surveys.create({
                        surveyname:title,
                        category:oldsurvey.category,
                        createdby:user_id,
                        createddate:Date.now()
                    },function(status,result) {
                        surveyconfig.findOne({"surveyid": surveyid}, function(err, oldsurveyconfig){
                            if(err){
                                // return res.status(401).json({
                                //     status : 401,
                                //     message : "Failed",
                                // });
                            } else {
                                console.log("old config");
                                // console.log(oldsurveyconfig);
                                if(oldsurveyconfig != null){
                                    surveyconfig.create({
                                        // surveyname:title,
                                        surveyid:result._id,
                                        active:oldsurveyconfig.active,
                                        display:oldsurveyconfig.display,
                                        mode:oldsurveyconfig.mode,
                                        anonymous:oldsurveyconfig.anonymous,
                                        coverphoto:oldsurveyconfig.coverphoto,
                                        multisubmission:oldsurveyconfig.multisubmission,
                                        multisubmissionuser:oldsurveyconfig.multisubmissionuser,
                                        editor:oldsurveyconfig.editor,
                                        reviewer:oldsurveyconfig.reviewer,
                                        resnotiftoedotor:oldsurveyconfig.resnotiftoedotor,
                                        processapprovalbyedotor:oldsurveyconfig.processapprovalbyedotor,
                                        processapprovaltoedotor:oldsurveyconfig.processapprovaltoedotor,
                                        sendnotiftoreviewer:oldsurveyconfig.sendnotiftoreviewer,
                                        sendnotiftoeditor:oldsurveyconfig.sendnotiftoeditor,

                                        category:oldsurveyconfig.category,
                                        createdby:user_id,
                                        createddate:Date.now()
                                    },function(status,result) {

                                      console.log("inside config");
                                    //   console.log(result);
                                    });
                               }
                            }
                        })


                        questions.find({surveyid:surveyid, questiontype:"welcomepage"},function(err, wdata) {
                            wdata.forEach(oldquestion => {
                                questions.create({
                                    surveyid:result._id,
                                    groupid:oldquestion.groupid,
                                    dupqid:oldquestion.dupqid,
                                    questiontype:oldquestion.questiontype,
                                    status:oldquestion.status,
                                    questiontext:oldquestion.questiontext,
                                    description:oldquestion.description,
                                    havedescription:oldquestion.havedescription,
                                    image:oldquestion.image,
                                    haveimage:oldquestion.haveimage,
                                    required:oldquestion.required,
                                    maskformat:oldquestion.maskformat,
                                    maxrate:oldquestion.maxrate,
                                    order:oldquestion.order,
                                    length:oldquestion.length,
                                    rating:oldquestion.rating,
                                    qtype:oldquestion.qtype,
                                    createdby:oldquestion.createdby,
                                    createddate:Date.now()

                                },function(status,newquestion) {
                                    questionlogs.push({oldid:oldquestion._id, newid:newquestion._id})
                                })
                                
                            });
                            
                        });
                        questions.find({surveyid:surveyid, questiontype:"thankyoupage"},function(err, tdata) {
                            tdata.forEach(oldquestion => {
                                questions.create({
                                    surveyid:result._id,
                                    groupid:oldquestion.groupid,
                                    dupqid:oldquestion.dupqid,
                                    questiontype:oldquestion.questiontype,
                                    status:oldquestion.status,
                                    questiontext:oldquestion.questiontext,
                                    description:oldquestion.description,
                                    havedescription:oldquestion.havedescription,
                                    image:oldquestion.image,
                                    haveimage:oldquestion.haveimage,
                                    required:oldquestion.required,
                                    other:oldquestion.other,
                                    maskformat:oldquestion.maskformat,
                                    maxrate:oldquestion.maxrate,
                                    order:oldquestion.order,
                                    length:oldquestion.length,
                                    rating:oldquestion.rating,
                                    qtype:oldquestion.qtype,
                                    createdby:oldquestion.createdby,
                                    createddate:Date.now()

                                },function(status,newquestion) {
                                    questionlogs.push({oldid:oldquestion._id, newid:newquestion._id})
                                })
                            });
                        });


                        questiongroup.find({'surveyid':surveyid}, function(err, allgroup){
                            asyncLoop(allgroup, function (group, nextgroup){
                                questiongroup.create({
                                    surveyid:result._id,
                                    groupname:group.groupname,
                                    description:group.description,
                                    order:group.order,
                                    createdby:group.createdby,
                                    createddate:group.createddate,
                                    modifiedby:group.modifiedby,
                                    modifieddate:group.modifieddate,
                                    createddate:Date.now()
                                },function(status,groupresult) {
                                    grouplogs.push({oldid:group._id, newid:groupresult._id})
                                    questions.find({"groupid": group._id}, function(err, oldquestions){
                                        if(oldquestions){
                                            asyncLoop(oldquestions, function (oldquestion, nextquestion){
                                                questions.create({
                                                    surveyid:result._id,
                                                    groupid:groupresult._id,
                                                    questiontype:oldquestion.questiontype,
                                                    status:oldquestion.status,
                                                    questiontext:oldquestion.questiontext,
                                                    description:oldquestion.description,
                                                    havedescription:oldquestion.havedescription,
                                                    image:oldquestion.image,
                                                    haveimage:oldquestion.haveimage,
                                                    required:oldquestion.required,
                                                    other:oldquestion.other,
                                                    maskformat:oldquestion.maskformat,
                                                    maxrate:oldquestion.maxrate,
                                                    order:oldquestion.order,
                                                    length:oldquestion.length,
                                                    rating:oldquestion.rating,
                                                    qtype:oldquestion.qtype,
                                                    createdby:oldquestion.createdby,
                                                    createddate:oldquestion.createddate,
                                                    npsleft:oldquestion.npsleft,
                                                    npsright:oldquestion.npsright,
                                                    npsmiddle:oldquestion.npsmiddle
            
                                                },function(status,newquestion) {
                                                    questionlogs.push({oldid:oldquestion._id, newid:newquestion._id})
                                                    var pms_questioncustomdata = new Promise(function(resolve, reject) {
                                                        questioncustomdata.find({"questionid": oldquestion._id}, function(err, oldquestionscustomdata){
                                                            if(oldquestionscustomdata){
                                                                asyncLoop(oldquestionscustomdata, function (oldquestionscustomdatas, nextelement){
                                                                    if(oldquestionscustomdatas){
                                                                        questioncustomdata.create({
                                                                            questionid:newquestion._id,
                                                                            title:oldquestionscustomdatas.title,
                                                                            type:oldquestionscustomdatas.type,
                                                                            width:oldquestionscustomdatas.width,
                                                                            required:oldquestionscustomdatas.required,
                                                                            createdby:oldquestionscustomdatas.createdby,
                                                                            createddate:oldquestionscustomdatas.createddate
                                                                        },function(status,ghgjhgjh) {
                                                                            nextelement();
                                                                        });
                                                                    } else {
                                                                        nextelement();
                                                                    }
                                                                }, function (err)
                                                                {
                                                                    resolve([])
                                                                });
                                                            } else {
                                                                resolve([])
                                                            }
                                                        })
                                                    });
                                                    var pms_questionmatrixcols = new Promise(function(resolve, reject) {
                                                        questionmatrixcols.find({"questionid": oldquestion._id}, function(err, oldquestionmatrixcols){
                                                            if(oldquestionmatrixcols){
                                                                asyncLoop(oldquestionmatrixcols, function (oldquestionsmatrixs, nextelement){
                                                                    if(oldquestionsmatrixs){
                                                                        questionmatrixcols.create({
                                                                            questionid:newquestion._id,
                                                                            option:oldquestionsmatrixs.option,
                                                                            order:oldquestionsmatrixs.order,
                                                                            createdby:oldquestionsmatrixs.createdby,
                                                                            createddate:oldquestionsmatrixs.createddate
                                                                        },function(status,ghgjhgjh) {
                                                                            nextelement();
                                                                        });
                                                                    } else {
                                                                        nextelement();
                                                                    }
                                                                }, function (err)
                                                                {
                                                                    resolve([])
                                                                });
                                                            } else {
                                                                resolve([])
                                                            }
                                                        })
                                                    });
                                                    var pms_questionmatrixrows = new Promise(function(resolve, reject) {
                                                        questionmatrixrows.find({"questionid": oldquestion._id}, function(err, oldquestionmatrixrows){
                                                            if(oldquestionmatrixrows){
                                                                asyncLoop(oldquestionmatrixrows, function (oldquestionsmatrix, nextelement){
                                                                    if(oldquestionsmatrix){
                                                                        questionmatrixrows.create({
                                                                            questionid:newquestion._id,
                                                                            option:oldquestionsmatrix.option,
                                                                            order:oldquestionsmatrix.order,
                                                                            radioans:oldquestionsmatrix.radioans,
                                                                            createdby:oldquestionsmatrix.createdby,
                                                                            createddate:oldquestionsmatrix.createddate                                
                                                                        },function(status,fjdjdkjgkldfj) {
                                                                            nextelement();                                                                        
                                                                        });
                                                                    } else {
                                                                        nextelement();                                                                        
                                                                    }
                                                                }, function (err)
                                                                {
                                                                    resolve([])
                                                                });
                                                            } else {
                                                                resolve([])
                                                            }
                                                        })
                                                    });
                                                    var pms_questionoptions = new Promise(function(resolve, reject) {
                                                        questionoptions.find({"questionid": oldquestion._id}, function(err, oldquestionoptions){
                                                            if(oldquestionoptions){
                                                                asyncLoop(oldquestionoptions, function (oldquestionoption, nextelement){
                                                                    if(oldquestionoption){
                                                                        questionoptions.create({
                                                                            questionid:newquestion._id,
                                                                            choicestate:oldquestionoption.choicestate,
                                                                            choicetext:oldquestionoption.choicetext,
                                                                            order:oldquestionoption.order,
                                                                            correct:oldquestionoption.correct,
                                                                            createdby:oldquestionoption.createdby,
                                                                            createddate:oldquestionoption.createddate
                                    
                                                                        },function(status,newoption) {
                                                                            optionslogs.push({oldid:oldquestionoption._id, newid:newoption._id})
                                                                            nextelement();                                                                        
                                                                        });
                                                                    } else {
                                                                        nextelement();                                                                        
                                                                    }
                                                                }, function (err)
                                                                {
                                                                    resolve([])
                                                                });
                                                            } else {
                                                                resolve([])
                                                            }
                                                        })
                                                    });
                                                    var pms_questionslides = new Promise(function(resolve, reject) {
                                                        questionsliderlinks.find({"questionid": oldquestion._id}, function(err, oldquestionsliderlinks){
                                                            if(oldquestionsliderlinks){
                                                                asyncLoop(oldquestionsliderlinks, function (oldquestionsliderlink, nextelement){
                                                                    if(oldquestionsliderlink){
                                                                        questionsliderlinks.create({
                                                                            questionid:newquestion._id,
                                                                            src:oldquestionsliderlink.src,
                                                                            createdby:oldquestionsliderlink.createdby,
                                                                            createddate:oldquestionsliderlink.createddate
                                                                        },function(status,newfdhfghtytquestion) {
                                                                            nextelement();
                                                                        });
                                                                    } else {
                                                                        nextelement();
                                                                    }
                                                                }, function (err)
                                                                {
                                                                    resolve([])
                                                                });   
                                                            } else {
                                                                resolve([])
                                                            }
                                                        })
                                                    });
                                                    Promise.all([pms_questionslides,pms_questionoptions, pms_questionmatrixrows, pms_questionmatrixcols, pms_questioncustomdata]).then(function(finalprimise) {
                                                        nextquestion()                                                        
                                                    }).catch(function(err) {
                                                        console.log("cache error - ", err);
                                                        nextquestion()
                                                    });
                                                })

                                            }, function (err)
                                            {
                                                console.log("Question loop finished");
                                                nextgroup();
                                            });
                                        } else {
                                            nextgroup();
                                        }
                                    })
                                })
                            }, function (err)
                            {
                                console.log("Question group loop finished");
                                questionlogs.forEach(log => {
                                    questionlogicjump.find({"questionid": log.oldid}, function(err, oldquestionlogic){
                                        if(oldquestionlogic){
                                            oldquestionlogic.forEach(logics => {
                                                if(logics){
                                                    var newlogic = {}
                                                    var choiceid = ""
                                                    var nextquestion = ""
                                                    if(logics.choiceid != ""){
                                                        var found = optionslogs.find( o => o.oldid == logics.choiceid );
                                                        if(found){
                                                            choiceid = found.newid
                                                        }
                                                    }
                                                    if(logics.goto == 0){
                                                        var found = questionlogs.find( o => o.oldid == logics.nextquestion );
                                                        if(found){
                                                            nextquestion = found.newid
                                                        }
                                                    } else {
                                                        var found = grouplogs.find( o => o.oldid == logics.nextquestion );
                                                        if(found){
                                                            nextquestion = found.newid
                                                        }
                                                    }
                                                    newlogic.questionid = log.newid;
                                                    newlogic.nextquestion = nextquestion;
                                                    newlogic.choiceid = choiceid;
                                                    newlogic.surveyid = result._id;
                                                    newlogic.goto = logics.goto;
                                                    newlogic.condition = logics.condition;
                                                    newlogic.answer = logics.answer;
                                                    newlogic.createdby = logics.createdby;
                                                    console.log("logics:- ", logics);
                                                    console.log("newlogic- ", newlogic)
                                                    if(nextquestion){
                                                        questionlogicjump.create(newlogic,function(status,newlogicjump) {
                                                            console.log("newlogicjump- ",newlogicjump)
                                                            console.log("Sucess----------------------- ")
                                                        })
                                                    } else {
                                                        console.log("new question not found- ")

                                                    } 
                                                }
                                            });
                                        } else {
                                            console.log("NO logic there");
                                        }
                                    })
                               }); 
                               res.status(200).json({
                                   status:1,
                                   message:"created",
                                   data:result
                               });
                            });
                        })
                    });
                } else {
                    res.json({
                        status:0,
                        message:"not found"
                    })
                }
            }
        })
    } catch(e){
        res.status(500).json(e);
        console.log('catch update question', e);
    }
});




router.route('/responsecount')
    .post(function(req, res) {
            var surveyid = req.body.surveyid;
            surveyattempt.find({surveyid:surveyid},function(err, allquestions) {
            if (err)
            res.send(err);
            console.log("success");
            res.json(allquestions.length);
        });
    });

    router.route('/changesurveystate')
    .post(function(req, res) {
        var surveyid = req.body.surveyid;
        var value = req.body.active;
        logstore.createlog({action:"update", module:"survey", moduleid:surveyid, surveyid:surveyid }, req)
        surveys.findOneAndUpdate({"_id":surveyid},{
            active:value,
            modifiedddate:Date.now()
        },function(err, surveydata) {
            if (err)
                res.send(err);
            res.json(surveydata);
        });
    });


    router.route('/changesurveystatus')
    .post(function(req, res) {
        var surveyid = req.body.surveyid;
        logstore.createlog({action:"update", module:"survey", moduleid:surveyid, surveyid:surveyid }, req)
        var value = req.body.delete;
        surveys.findOneAndUpdate({"_id":surveyid},{
            delete:value,
            modifiedddate:Date.now()
        },function(err, surveydata) {
            if (err)
                res.send(err);

            res.json(surveydata);
        });
    });
    
    router.route('/allresponselist')
    .post(function(req, res) {
            var surveyid = req.body.surveyid;
            var allresponses = [];
            surveyattempt.find({surveyid:surveyid},function(err, responselist) {
            var newarray = [];
            if(responselist){
                newarray = responselist.sort(function(a, b){
                    return a.datestarted-b.datestarted
                })
            }
            asyncLoop(newarray, function (attempt, nextattempt){
                var pms_userdata = new Promise(function(resolve, reject) {
                    if(attempt.userid.indexOf("login")<0){
                        users.findOne({"_id":attempt.userid},{firstname:1,lastname:1,email:1}, function(err, userdata){
                            if(userdata){
                                resolve(userdata)
                            } else {
                                resolve({
                                    firstname:"user not found",
                                    lastname:"",
                                    email:""
                                })
                            }
                        })
                    } else if(attempt.useremail){
                        contactlistdata.findOne({"email":attempt.useremail},{firstname:1,lastname:1,email:1}, function(err, userdata){
                            if(userdata){
                                resolve(userdata)
                            } else {
                                resolve({
                                    firstname:"contact not found",
                                    lastname:"",
                                    email:""
                                })
                            }
                        })
                    } else {
                        resolve({
                            firstname:"No login",
                            lastname:"",
                            email:""
                        })
                    }
                });
                Promise.all([pms_userdata]).then(function(finalprimise) {
                    var pms_userdata = finalprimise[0];
                    allresponses.push({
                            useremail: attempt.useremail,
                            state: attempt.state,
                            approvedbyrev: attempt.approvedbyrev,
                            approvedrev: attempt.approvedrev,
                            anonymous: attempt.anonymous,
                            approvedbyrevdate: attempt.approvedbyrevdate,
                            approvedbyedi: attempt.approvedbyedi,
                            approvededi: attempt.approvededi,
                            approvedbyedidate: attempt.approvedbyedidate,
                            completedby: attempt.completedby,
                            completed: attempt.completed,
                            completeddate: attempt.completeddate,
                            createdip: attempt.createdip,
                            datestarted: attempt.datestarted,
                            userdetails:pms_userdata,
                            _id: attempt._id,
                            userid: attempt.userid,
                            surveyid: attempt.surveyid,
                            semesterid: attempt.semesterid,
                            datefinished: attempt.datefinished,
                    })
                    nextattempt()
                }).catch(function(err) {
                    console.log("cache error - ", err);
                    nextattempt()
                });
            }, function (err)
            {
                res.json(allresponses);
            });

        });
    });
    router.route('/responsedetails')
    .post(function(req, res) {
            var attemptid = req.body.attemptid;
            attemptanswer.find({attemptid:attemptid},function(err, responsedetails) {
            if (err)
            res.send(err);
            console.log("success");
            res.json(responsedetails);
        });
    });
    router.route('/allanswers')
    .post(function(req, res) {
            var questionid = req.body.questionid;
            attemptanswer.find({questionid:questionid},function(err, allanswers) {
            if (err)
            res.send(err);
            console.log("success");
            res.json(allanswers); 
        });
    });
    router.route('/totalattempt')
    .post(function(req, res) {
        var attemptid = req.body.attemptid;
        attemptanswer.find({attemptid:attemptid},function(err, allanswers) {
            if (err)
                res.send(0);
            res.json(allanswers.length); 
        });
    });
    router.route('/getwelcomethankyoudata')
    .post(function(req, res) {
            var surveyid = req.body.surveyid;
            var datatype = req.body.datatype;
            questions.findOne({surveyid:surveyid, questiontype:datatype},function(err, data) {
            if (err)
                res.send("");
            res.json(data); 
        });
    });
    router.route('/getallwelcomethankyoudata')
    .post(function(req, res) {
            var surveyid = req.body.surveyid;
            var datatype = req.body.datatype;
            questions.find({surveyid:surveyid, questiontype:datatype},function(err, data) {
            if (err)
                res.send("");
            var newarray = [];
            if(data){
                newarray = data.sort(function(a, b){
                        return a.order-b.order
                    })
            } else {
                newarray = data
            }                
            res.json(newarray); 
        });
    });
    router.route('/finishattempt')
    .post(function(req, res) {
            var clientip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var attemptid = req.body.attemptid;
            surveyattempt.findOneAndUpdate({_id:attemptid},{
                datefinished:Date.now(),
                createdip:clientip,
                state:1
            },function(err, data) {
                workflowevents.sendworkflownotification("responseadded", attemptid, "0", "0");
                workflowevents.submitsurveyonone(data);
                res.json(data); 
        });
    });



    router.route('/getoneproject')
    .post(function(req, res) {
        var projectid = req.body.projectid;
        projects.findOne({"_id":projectid},function(err, projectdata) {
            if (err)
                res.send(err);
            res.json(projectdata);
        });
    });
 router.route('/editproject')
   .post(function(req, res) {
      try{
          var projectid = req.body.projectid;
          var projectname = req.body.projectname;
          var allowgroups = req.body.allowgroups;
          projects.findOneAndUpdate({_id:projectid},{
            projectname:projectname,
            allowgroups:allowgroups
          },function(status,result) {
              if(!empty(result)){
                  res.status(200).json({
                      status: 1,
                      message:"Updated",
                  });
              } else {
                  res.status(200).json({
                      status:0,
                      message:"Failed"
                  });
              }
          });
      } catch(e){
          res.status(500).json({
              httpCode: CodesAndMessages.dbErrHttpCode,
              code: CodesAndMessages.dbErrCode,
              message: CodesAndMessages.dbErrMessage
          });
          console.log('update project', e);
      }
  });
  router.route('/getusersname')
  .post(function(req, res) {
      var userids = req.body.userids;
      userids = userids.split(",");
      var allnames = [];
      users.find({_id:userids},{
        password:0
      },function(err, allusers) {
          if (err)
              res.send([]);
          res.json(allusers); 
      });
});
 router.route('/getcustiomquestionsubs')
    .post(function(req, res) {
        var id = req.body.id;
        questioncustomdata.findOne({_id:id},{
        },function(err, customdata) {
            if (err)
                res.send([]);
            res.json(customdata); 
        });
  });
  router.route('/getmultitextsubs')
  .post(function(req, res) {
    var id = req.body.id;
    questionoptions.findOne({_id:id},{
    },function(err, optiondata) {
        if (err)
            res.send([]);
        res.json(optiondata); 
    });
});


router.route('/updateUser')
.post(function(req, res) {
    try{
        var user = req.body.user;

        users.findOneAndUpdate({_id:user._id},{
          firstname:user.firstname,
          lastname:user.lastname,
          role:user.role,
          email:user.email
        },function(status,result) {
            if(!empty(result)){
                res.status(200).json({
                    status: 1,
                    message:"Updated",
                });
            } else {
                res.status(200).json({
                    status:0,
                    message:"Failed"
                });
            }
        });
    } catch(e){
        res.status(500).json(e);
        console.log('update user error', e);
    }

});
router.route('/addquestiongroup') .post(function(req, res) {
    try{
        var surveyid = req.body.surveyid;
        var groupname = "";
        var description = "";
        var order = 0;
        var createdby = "";
        if(req.body.groupname != undefined){
            groupname = req.body.groupname;
        }
        if(req.body.description != undefined){
            description = req.body.description;
        }
        if(req.body.order != undefined){
            order = req.body.order;
        }
        if(req.body.createdby != undefined){
            createdby = req.body.createdby;
        }
        questiongroup.create({
            'surveyid': surveyid,
            'groupname': groupname,
            'description': description,
            'order': order,
            'createdby': createdby
        },function(status,newquestiongroup) {
            console.log("create question group");
            res.status(200).json(newquestiongroup);
        });
    } catch(e){
        res.status(500).json(e);
        console.log('update user error', e);
    }

});

router.route('/getquestiongroups').post(function(req, res) {
    try{
        var surveyid = req.body.surveyid;
        questiongroup.find({
            'surveyid': surveyid
        },function(status,questiongroups) {
            console.log("get question group");
            res.status(200).json(questiongroups);
        });
    } catch(e){
        res.status(500).json(e);
        console.log('update user error', e);
    }

});
router.route('/getquestionfromgroup').post(function(req, res) {
    try{
        var groupid = req.body.groupid;
        var surveyid = req.body.surveyid;
        questions.find({
            'groupid': groupid
        },function(status,questionfromgroups) {
            var newarray = []
            if(questionfromgroups.length > 0){
                newarray = questionfromgroups.sort(function(a, b){
                        return a.order-b.order
                })
            } else {
                newarray = questionfromgroups
            }
            res.status(200).json(newarray);
        });
    } catch(e){
        res.status(500).json(e);
        console.log('update user error', e);
    }

});

router.route('/createusecreateusersyncrole').post(function(req, res) {
    var rolerespondent = ["5","3","4","9","10"]
    var roleeditor = ["2","18","19","1"]
    var rolereviewer = ["7","11","12","14","15"]
    var usersdata = req.body.users
    usersdata.forEach(userdata => {
        var newrole="";
        if(rolerespondent.indexOf(userdata.roleid)){
            newrole = "5c94d67dde72f25c40c4630a"
        }
        if(roleeditor.indexOf(userdata.roleid)){
            newrole = "5c94d661de72f25c40c46309"
        }
        if(rolereviewer.indexOf(userdata.roleid)){
            newrole = "5c94d5f4de72f25c40c46308"
        }
        var datatoinsert = {
            "oneuserid":userdata.id,
            "firstname":userdata.firstname,
            "lastname":userdata.lastname,
            "username":userdata.username,
            "role":newrole,
            "email":userdata.email,
            "password":"lgfdghdfer%&^%HJGdw554",
        }
        // console.log(datatoinsert);
        try {
            var emailCheck = new Promise(function(resolve, reject) {
                users.find({
                    email: datatoinsert.email
                }, function(err, results) {
                    if (err) {
                        console.log("email errrr throw - "+datatoinsert.email);
                        console.log(err);
                    } else {
                        if(results.length > 0){
                            console.log("email already available- "+datatoinsert.email);
                            resolve(results[0]);
                        } else {
                            resolve(results[0]);
                        } 
                    }
                })
            });
            var usernameCheck = new Promise(function(resolve, reject) {
                users.find({
                    username: datatoinsert.username
                }, function(err, results) {
                    if (err) {
                        console.log("username errrr throw - "+datatoinsert.username);
                        console.log(err);
                        
                    } else {
                        if(results.length > 0){
                          console.log("username already available- "+datatoinsert.username);
                          resolve(results[0]);
                        } else {
                            resolve(results[0]);
                        } 
                    }
                })
            });
            Promise.all([emailCheck,usernameCheck]).then(function(results) {
                users.create({
                    'firstname': datatoinsert.firstname,
                    'lastname': datatoinsert.lastname,
                    'username': datatoinsert.username,
                    'email': datatoinsert.email,
                    'role': datatoinsert.role,
                    'password': datatoinsert.password,
                    'oneuserid': datatoinsert.oneuserid
                }, 
                function(createErr, result) {
                    if (createErr) {
                        console.log("failed to create user- "+datatoinsert.username);
                    } else {
                        console.log("user created- "+datatoinsert.username);
                    }
                    console.log('Success');
                })
            }).catch(function(err) {
                console.log('create cache error', err)
            });
        } catch (e) {
            res.status(500).json(e);
            console.log('catch login', e);
        }
    });
    res.status(200).send({
        'message': "Success",
        'code': 200,
        'data': req.body
    });
    // 

});

router.route('/changequestiongroupname')
.post(function(req, res) {
    var groupid = req.body.groupid;
    var groupname = req.body.groupname;
    questiongroup.findOneAndUpdate({"_id":groupid},{
        groupname:groupname
    },function(err, groupdata) {
        if (err)
            res.send(err);
        res.json(groupdata);
    });
});
router.route('/deletequestiongroup')
.post(function(req, res) {
    var groupid = req.body.groupid;
    questions.find({"groupid":groupid}, function(err, slist){
        if(err){
            res.send({
                status:0,
                message:"Failed to delete Question Group"
            });
        } else if(slist.length > 0) {
            res.send({
                status:1,
                message:"Question Group is not empty"
            });
        } else {
            questiongroup.deleteOne({_id:groupid},function(status, deleted) {
                res.send({
                    status:2,
                    message:"Question Group is deleted"
                });
            });
        }
   })

});
router.route('/getuserwithrole')
.post(function(req, res) {
    var roleid = req.body.roleid;
    roles.findOne({"roleid":roleid},function(err, roledata) {
        if (err)
            res.send(err);
        if(roledata == null){
            res.json([]);
        } else {
            console.log("role found");
            // console.log(roledata);
            var act_id = roledata._id;
            users.find({
                'role': act_id
            },{
                password:0,
                username:0,
                email:0
            },function(status,allusers) {
                res.json(allusers);
            });
        }
    });
    
});
router.route('/updaterole')
.post(function(req, res) {
    var userid = req.body.userid;
    var role = req.body.role;
    users.findOneAndUpdate({"_id":userid},{"role":role},function(err, userdata) {
        if (err)
            res.send(err);
        res.json(userdata);
    });
    
});
router.route('/updateroleforusers')
.post(function(req, res) {
    var userlist = req.body.users;
    var role = req.body.role;
    userlist.forEach(user => {
        // console.log(user._id);
        
        users.findOneAndUpdate({"_id":user._id},{"role":role},function(err, userdata) {
            if (err)
                res.send(err);

                // console.log("Updated");
                
            // res.json(userdata);
        });
    });
    res.json("lsdksjdflsdflk");
    
});
router.route('/addlogicjump')
.post(function(req, res) {
    var logicdata = req.body.logicdata;
    questionlogicjump.create(logicdata,function(err, logicdata) {
        if (err)
            res.send(err);
        res.json(logicdata);
    });
});
router.route('/getalllogicjump')
.post(function(req, res) {
    var questionid = req.body.questionid;
    questionlogicjump.find({"questionid":questionid},function(err, logicdata) {
        if (err)
            res.send(err);
        res.json(logicdata);
    });
});
router.route('/getalllogicjumpfromsurvey')
.post(function(req, res) {
    var surveyid = req.body.surveyid;
    questionlogicjump.find({"surveyid":surveyid},function(err, logicdata) {
        if (err)
            res.send(err);
        res.json(logicdata);
    });
});
router.route('/deletelogicjump')
.post(function(req, res) {
    var logicid = req.body.logicid;
    questionlogicjump.deleteOne({_id:logicid},function(status, deleted) {
        res.status(200).json(deleted);
     });
});
router.route('/deletesurveyresponse')
.post(function(req, res) {
    var responseid = req.body.responseid;
    surveyattempt.deleteOne({_id:responseid},function(status, deleted) {
        attemptanswer.deleteMany({attemptid:responseid},function(status, deleteda){});
        res.status(200).json(deleted);
     });
});

router.route('/updatelogicdata')
.post(function(req, res) {
     var alljumpdata = req.body.alljumpdata;
     alljumpdata.forEach(jumpdata => {
        questionlogicjump.findOneAndUpdate({_id:jumpdata._id},{
            choiceid:jumpdata.choiceid,
            condition:jumpdata.condition,
            answer:jumpdata.answer,
            goto:jumpdata.goto,
            nextquestion:jumpdata.nextquestion,
            modifieddate:Date.now()
         },function(status,result) {
            //  console.log(result);
             
           if(!empty(result)){
               console.log("logic data updated");
           }
         })
     });
    res.status(200).json({
        status: 1,
        message:"Updated",
    });
});

// router.route('/getnextquestion')
// .post(function(req, res) {
//      var currentquestion = req.body.currentquestion;
//      var surveyid = req.body.surveyid;
//      var groupid = req.body.groupid;
//      try {
//         var getquestionjump = new Promise(function(resolve, reject) {
//             questionlogicjump.find({'questionid':currentquestion},function(err, question){
//                 resolve(question);
//             })
//         });
//         var getcurrentquestion = new Promise(function(resolve, reject) {
//             questions.find({'_id':currentquestion},function(err, question){
//                 resolve(question);
//             })
//         });
//         var getnextquestion = new Promise(function(resolve, reject) {
//             if(currentquestion == 0){
//                 Promise.all([getcurrentquestion, getquestionjump]).then(function(results) {
                    
//                 }).catch(function(err) {
//                     console.log('error', err)
//                     res.status(500).json(err);
//                 });
//             } else {
                
//             }
//         });
//         var getprevquestion = new Promise(function(resolve, reject) {
//             if(currentquestion == 0){

//             } else {
                
//             }
//         });
//         var getcurrentgroup = new Promise(function(resolve, reject) {
//             if(currentquestion == 0){

//             } else {
                
//             }
//         });
//         var getnextgroup = new Promise(function(resolve, reject) {
//             if(currentquestion == 0){

//             } else {
                
//             }
//         });
//         var getprevgroup = new Promise(function(resolve, reject) {
//             if(currentquestion == 0){

//             } else {
                
//             }
//         });
//         Promise.all([projectCheck]).then(function(results) {
//             console.log("from promissed");
//         }).catch(function(err) {
//             console.log('error', err)
//             res.status(500).json(err);
//         });
//     } catch (e) {
//         res.status(500).json(e);
//         console.log('catch login', e);
//     }     
// });





router.route('/updatequestiontable')
.post(function(req, res) {
    // console.log(req.connection);
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var surveyid = req.body.surveyid;
    var grouporder =  questiongroup.find({
        'surveyid': surveyid
    },{order:1, _id:1}, function(status,questiongroups) {
        var arr_group = [];
        if(questiongroups){

            arr_group = questiongroups.sort(function(a, b){
                return a.order-b.order
            })
        }
        order = 0;
        if(arr_group.length > 0){
            asyncLoop(arr_group, function (group, outernext)
            {
                questions.find({groupid:group._id},{order:1, _id:1, surveyid:1}, async function(err, allquestions) {
                    if (err){
                        
                    }
                    var newarray = allquestions.sort(function(a, b){
                        return a.order-b.order
                    })
                    if(newarray.length > 0){
                        asyncLoop(newarray, function (question, next)
                        {
                            order++;
                            questionorder.findOneAndUpdate({"questionid":question._id},{
                                questionid:question._id,
                                surveyid:question.surveyid,
                                order:order
                            }, function(status, data){
                                if(data == null){

                                    questionorder.create({
                                        questionid:question._id,
                                        surveyid:question.surveyid,
                                        order:order
                                    },function(status, data){
                                        // console.log(data);
                                        // console.log(gindex+" Group id-"+group._id+" "+index+"- "+" Questionid= "+question._id+" order- "+order);
                                        console.log(question._id+"-created "+order);
                                        next();
                                        
                                    })
                                } else {
                                    console.log(question._id+"-Updated-"+order);
                                    // console.log(data);
                                    next();
                                    // console.log(gindex+" Group id-"+group._id+" "+index+"- "+" Questionid= "+question._id+" order- "+order);
                                }
                                // console.log(data);
                                // console.log("updated- "+order);
                            });
                        }, function (err)
                        {
                            if (err)
                            {
                                console.error('Inner Error: ' + err.message);
                                return;
                            }
                            outernext();
                            console.log('Inner Finished!');
                        });
                    }
                    else {
                        outernext();
                    }
                });
            }, function (err)
            {
                if (err)
                {
                    console.error('Outer Error: ' + err.message);
                    return;
                }
             
                console.log('Outer Finished!');
            });
        }
        console.log("get question group");
        // res.status(200).json(questiongroups);
    });

   res.status(200).json({
       status: 1,
       message:"Updated",
   });
});


router.route('/getquestionorder')
.post(function(req, res) {
    // console.log(req);
    
     var surveyid = req.body.surveyid;
     questionorder.find({
        'surveyid': surveyid
    },function(status,questioninorder) {
        console.log("get question in order", questioninorder);
        console.log(questioninorder);
        if(questioninorder.length > 0){
            var newarray = questioninorder.sort(function(a, b){
                    return a.order-b.order
                })
        } else {
            var newarray = questioninorder
        }
        res.status(200).json(newarray);
    });
});

router.route('/getgroupbyid')
.post(function(req, res) {
    // console.log(req.body);
    
   groups.findOne({"_id": req.body.groupid},{
       password:0
   },function(err, curentgroup) {
       if (err){
           res.send({
               status:0,
               err:err
           });
        } else {
            res.status(200).json({
               status:0,
               group:curentgroup
           });

        }
    });
 });
 router.route('/updategroup')
 .post(function(req, res) {
 try {
     var groupCheck = new Promise(function(resolve, reject) {
         groups.find({
             groupname: req.body.groupname
         }, function(err, results) {
             if (err) {
                 reject(err)
             } else {
                 if(results.length > 1){
                    results.forEach(ress => {
                        if(ress._id != req.body.groupid){
                            reject({
                                httpCode: 200,
                                code: 402,
                                message: 'Duplicate group name'
                            })
                        }
                    });
                    resolve(null)
                 } else {
                    resolve(null)
                 }
             }
         })
     });
     Promise.all([groupCheck]).then(function(results) {
        groups.findOneAndUpdate({"_id":req.body.groupid},{
            groupname:req.body.groupname,
            groupmemmbers:req.body.members,
            modifiedddate:Date.now()
         },function(err, surveydata) {
             if (err){
                 res.send(err);
             }
    
             res.json(surveydata);
         });
     }).catch(function(err) {
         console.log('error', err)
         res.status(err.httpCode).json(err);
     });
 } catch (e) {
     res.status(500).json({
         httpCode: CodesAndMessages.dbErrHttpCode,
         code: CodesAndMessages.dbErrCode,
         message: CodesAndMessages.dbErrMessage
     });
     console.log('catch login', e);
 }
});


router.route('/addworkflow')
.post(function(req, res) {
    var flowdata = req.body.flowdata;
    workflows.create(flowdata,function(err, resdata) {
        if (err)
            res.send(err);
        res.json(resdata);
    });
});
router.route('/getallworkflow')
.post(function(req, res) {
    var surveyid = req.body.surveyid;
    workflows.find({"surveyid":surveyid},function(err, flowdata) {
        if (err)
            res.send(err);
        res.json(flowdata);
    });
});
router.route('/deleteworkflow')
.post(function(req, res) {
    var flowid = req.body.flowid;
    workflows.deleteOne({_id:flowid},function(status, deleted) {
        res.status(200).json(deleted);
     });
});

router.route('/updateworkflow')
.post(function(req, res) {
     var allflowdata = req.body.allflowdata;
     allflowdata.forEach(flowdata => {
        workflows.findOneAndUpdate({_id:flowdata._id},{
            action:flowdata.action,
            role:flowdata.role,
            notifyrole:flowdata.notifyrole,
            modifieddate:Date.now()
         },function(status,result) {
            //  console.log(result);
           if(!empty(result)){
               console.log("flow data updated");
           }
         })
     });
    res.status(200).json({
        status: 1,
        message:"Updated",
    });
});

router.route('/sendtestmail')
.post(function(req, res) {
    // var mailOptions = {
    //     from: 'kteamlds.international@gmail.com',
    //     to: req.body.email,
    //     subject: 'Sending Email using Node.js',
    //     text: 'That was easy!'
    //   };
    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });    
    //  allflowdata.forEach(flowdata => {
    //     workflows.findOneAndUpdate({_id:flowdata._id},{
    //         action:flowdata.action,
    //         role:flowdata.role,
    //         modifieddate:Date.now()
    //      },function(status,result) {
    //          console.log(result);
    //        if(!empty(result)){
    //            console.log("flow data updated");
    //        }
    //      })
    //  });
    // console.log(req.headers);
    // console.log("----------------------------------");
    
    // console.log(req.connection);
    
    res.status(200).send({
        status: 1,
        message:"Updated"
    });
});


router.route('/addcontactlist')
.post(function(req, res) {
    var listid = req.body.listid;
    if(req.body.listid == "" || req.body.listid == undefined || req.body.listid == null){
        listid = "local_0";
    } 
    console.log(listid);
    
    console.log("request- ", req.body);
    var listname = req.body.listname;
    var userlist = req.body.userlist;
    var addedlist = [];
    var contactd = null;
try{    
    var listcheck = new Promise(function(resolve, reject) {
        contactlist.findOne({
            listid: listid
        }, function(err, listdata) {
            if (err) {
                reject(err)
            } else {
                if(listdata == null){
                    console.log("new list");
                    contactlist.create({
                        listid:listid,
                        listname:listname
                    }, 
                    function(createErr, list) {
                        if(createErr){
                            reject(createErr);
                        }
                        resolve(list)
                    })
                } else {
                    console.log("old list");
                    resolve(listdata)
                }
            }
        })
    });
    Promise.all([listcheck]).then(function(listdata) {
        const singlelist = listdata[0];
        console.log("listdata", singlelist);
        contactd = singlelist
        if(userlist.length > 0){
            asyncLoop(userlist, function (user, next)
            {
                var usercheck = new Promise(function(resolve, reject) {
                    users.findOne({
                        "email": user.email
                    }, function(err, userdata) {
                        if (err) {
                            reject(err)
                        } else {
                            if(userdata == null){
                                resolve({
                                    _id:"",
                                    oneuserid:user.id,
                                    firstname:user.firstname,
                                    lastname:user.lastname,
                                    username:user.email,
                                    email:user.email
                                })
                            } else {
                                console.log("old user");
                                resolve(userdata)
                            }
                        }
                    })
                });
                Promise.all([usercheck]).then(function(userdata) {
                    const singleuser = userdata[0];
                    // console.log(singleuser);
                    contactlistdata.findOne({
                        email:singleuser.email,
                        listid:singlelist._id,
                    }, 
                    function(createErr, listitemdata) {
                        console.log("to be addedd");
                        // console.log("{listid:singlelist._id,userid:singleuser._id,oneuserid:singleuser.oneuserid,email:singleuser.email}");
                        if(listitemdata == null){
                            contactlistdata.create({
                                listid:singlelist._id,
                                userid:singleuser._id,
                                oneuserid:singleuser.oneuserid,
                                firstname:singleuser.firstname,
                                lastname:singleuser.lastname,
                                email:singleuser.email
                            }, 
                            function(createErr, listitem1) {
                                console.log("createErr",createErr);
                                console.log("createErr",listitem1);
                                
                                addedlist.push(listitem1)
                                next();
                            })
                        } else {
                            addedlist.push(listitemdata)
                            next();
                        }
                    })
                }).catch(function(err) {
                    // res.status(err.httpCode).json(err);
                });
              
            }, function (err)
            {
                if (err)
                {
                    return;
                }
                res.status(200).send({
                    status: 1,
                    message:"Added to contact",
                    contactdata:contactd,
                    listcheck:addedlist
                });
            });
        } else {
            res.status(200).send({
                status: 1,
                message:"Added to contact",
                contactdata:contactd,
                listcheck:addedlist
            });
        }
    }).catch(function(err) {
        console.log('error', err)
        res.status(err.httpCode).json(err);
    });
} catch (e) {
    res.status(500).json(e);
    console.log('catch login', e);
}
    
});



router.route('/getcontacts')
.post(function(req, res) {
    contactlist.find({},function(err, flowdata) {
        if (err)
            res.send(err);
        res.json(flowdata);
    });
});
router.route('/getcontactsdata')
.post(function(req, res) {
    var listid = req.body.listid;
    contactlistdata.find({"listid":listid},function(err, flowdata) {
        if (err)
            res.send(err);
        res.json(flowdata);
    });
});


router.route('/addcontactemaildata')
.post(function(req, res) {
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var id = req.body.listid;
    contactlistdata.create({
        email:email,
        lastname:lastname,
        firstname:firstname,
        listid:id
    },
        function(err, resdata) {
        if (err)
            res.send(err);
        res.json(resdata);
    });
});
router.route('/validateshareuser')
.post(function(req, res) {
    sharedsurveytolist.findOne({ _id:req.body.shareid}, function(err, resdata) {
        users.findOne({email:req.body.email}, function(err, userdata) {
            res.json({
                share:resdata,
                user:userdata
            });
        })
    });
});
router.route('/sharelist')
.post(function(req, res) {
    var listid = req.body.listid;
    var mailtousers = req.body.mailtousers;
    var surveyid = req.body.surveyid;
    var sendtoone = req.body.sendtoone;
    sharedsurveytolist.create({
        surveyid:surveyid,
        contactid:listid,
    },
        function(err, createddata) {
        if (err)
            res.status(400).send(err);
        workflowevents.sharesurveytolist(createddata, mailtousers, sendtoone);
        res.json(createddata);
    });
});
router.route('/deleteuserfromcontact')
.post(function(req, res) {
    var contactuid = req.body.contactuid;
    contactlistdata.deleteOne({_id:contactuid},function(status, deleted) {
        res.status(200).json(deleted);
    });
});

 router.route('/approvebyeditor')
 .post(function(req, res) {
         var attemptid = req.body.attemptid;
         var status = req.body.status;
         var userid = req.body.userid;
         surveyattempt.findOneAndUpdate({_id:attemptid},{
            approvedbyedidate:Date.now(),
            approvedbyedi:userid,
            approvededi:status
         },function(err, data) {
            if(status == 1){
             workflowevents.sendworkflownotification("1", attemptid, "1", "1");
            }
             res.json(data); 
     });
 });
 router.route('/approvebyviewer')
 .post(function(req, res) {
         var attemptid = req.body.attemptid;
         var status = req.body.status;
         var userid = req.body.userid;
         surveyattempt.findOneAndUpdate({_id:attemptid},{
            approvedbyrevdate:Date.now(),
            approvedbyrev:userid,
             approvedrev:status
         },function(err, data) {
            if(status == 1){
                workflowevents.sendworkflownotification("2", attemptid, "1", "2");
            }
             res.json(data); 
     });
 });
 router.route('/attemptcompleted')
 .post(function(req, res) {
         var attemptid = req.body.attemptid;
         var status = req.body.status;
         var userid = req.body.userid;
         surveyattempt.findOneAndUpdate({_id:attemptid,approvedrev:1,approvededi:1},{
            completeddate:Date.now(),
            completedby:userid,
            completed:status
         },function(err, data) {
            if(status == 1){
             workflowevents.sendworkflownotification("responseadded", attemptid, "2");
            }
             res.json(data); 
     });
 });

 router.route('/deletesurvey')
.post(function(req, res) {
     var surveyid = req.body.surveyid;
     surveys.find({_id:surveyid,delete:1},function(status, surveyids) {
        questions.find({surveyid:surveyid},function(status, questionids) {
            questionids.forEach(function(val){
                questionoptions.deleteMany({questionid:val._id},function(status, deleted) {
                });
                questionsliderlinks.deleteMany({questionid:val._id},function(status, deleted) {
                });
                questionmatrixrows.deleteMany({questionid:val._id},function(status, deleted) {
                });
                questionmatrixcols.deleteMany({questionid:val._id},function(status, deleted) {
                });
                questioncustomdata.deleteMany({questionid:val._id},function(status, deleted) {
                });
                questionorder.deleteMany({questionid:val._id},function(status, deleted) {
                });
                questionlogicjump.deleteMany({questionid:val._id},function(status, deleted) {
                });
            });  
        });
        surveyconfig.deleteMany({surveyid:surveyid},function(status, deleted) {
        });
        surveyattempt.deleteMany({surveyid:surveyid},function(status, deleted) {
        });
        questiongroup.deleteMany({surveyid:surveyid},function(status, deleted) {
        });
        attemptanswer.deleteMany({surveyid:surveyid},function(status, deleted) {
        });
        workflows.deleteMany({surveyid:surveyid},function(status, deleted) {
        });
        sharedsurveytolist.deleteMany({surveyid:surveyid},function(status, deleted) {
        });
        questions.deleteMany({surveyid:surveyid},function(status, deleted) {
        });
        surveys.deleteOne({_id:surveyid},function(status, deleted) {
        });
    });
    res.status(200).json([]);
 });

 router.route('/deletecontactlist')
 .post(function(req, res) {
    var contactlistid = req.body.contactlistid;
    contactlistdata.deleteMany({listid:contactlistid},function(status, deleted) {
    });
    contactlist.deleteOne({_id:contactlistid},function(status, deleted) {
         res.status(200).json(deleted);
    });
 });
 router.route('/deletegroup')
 .post(function(req, res) {
    var groupid = req.body.groupid;
    groups.deleteOne({_id:groupid},function(status, deleted) {
         res.status(200).json(deleted);
    });
 });
 
router.route('/getsharedsurveytolist').post(function(req, res) {
     const surveyid = req.body.surveyid;
     sharedsurveytolist.find({
         surveyid:surveyid
     },function(err, shareddatadata) {
         if (err)
             res.send(err);
        var counter = 0;
        var alllist = [];
        console.log(shareddatadata);
        if(shareddatadata != undefined && shareddatadata.length > 0){
            asyncLoop(shareddatadata, function (slist, next)
            {
                console.log(slist);
                contactlist.findOne({_id:slist.contactid},function(error, cdata){
                    if(error){
                        next();
                    }
                    if(cdata){
                        alllist.push({
                            _id:slist._id,
                            senttoone:slist.senttoone,
                            mailsent:slist.mailsent,
                            deleted:slist.active,
                            createdby:slist.createdby,
                            createddate:slist.createddate,
                            modifiedddate:slist.modifiedddate,
                            surveyid:slist.surveyid,
                            contactid:slist.contactid,
                            contactname:cdata.listname
                        });
                    }
                    next();
                });
            }, function (err)
            {
                if (err)
                {
                    console.error('Inner Error: ' + err.message);
                    // return;
                }
                 res.json(alllist);
            });
        } else {
             res.json(alllist);

        }

    });
});

 




 router.route('/sendsharedsurveymail')
 .post(function(req, res) {
     const sharedid = req.body.sharedid;
     const sendtoone = req.body.sendtoone;
     const sendmail = req.body.sendmail;
     sharedsurveytolist.findOne({
         _id:sharedid
     },function(err, shareddatadata) {
         if (err)
             res.send(err);
        workflowevents.sharesurveytolist(shareddatadata, sendmail, sendtoone);
        res.json(shareddatadata);
     });
 });

 
 
 
 router.route('/deletesharedsurveytolist')
 .post(function(req, res) {
     const listid = req.body.listid;
     sharedsurveytolist.deleteOne({_id:listid},function(status, deleted) {
        res.status(200).json(deleted);
   });
});
router.route('/getusergroup')
 .post(function(req, res) {
     const userid = req.body.userid;
    groups.find({ 'groupmemmbers': new RegExp(userid, 'i') },function(err, items) {
        res.json(items);
    });
});
 
router.route('/getmailformate')
.post(function(req, res) {
    mailformat.find({},function(err, flowdata) {
        if (err)
            res.send(err);
        res.json(flowdata);
    });
});

router.route('/addmailformate')
.post(function(req, res) {
    
    var mailfor = req.body.mailfor;
    var mailsubject = req.body.mailsubject;
    var mailbody = req.body.mailbody;
    mailformat.findOneAndUpdate({mailfor:mailfor},{
        mailfor:mailfor,
        mailsubject:mailsubject,
        mailbody:mailbody
    },
    {upsert:true},
    function(err, resdata) {
        if (err)
            res.status(401).send(err);
        mailformat.find({},function(err, flowdata) {
            res.json(flowdata);
        });
    });
});




router.route('/duplicatquestion') .post(function(req, res) { 
    try{
        var questionid = req.body.questionid;
         questions.findOne({"_id": questionid}, function(err, oldquestion){
             if(oldquestion != null){
                 questions.create({
                     surveyid:oldquestion.surveyid,
                     groupid:oldquestion.groupid,
                     questiontype:oldquestion.questiontype,
                     status:oldquestion.status,
                     questiontext:oldquestion.questiontext,
                     description:oldquestion.description,
                     havedescription:oldquestion.havedescription,
                     image:oldquestion.image,
                     haveimage:oldquestion.haveimage,
                     required:oldquestion.required,
                     other:oldquestion.other,
                     maskformat:oldquestion.maskformat,
                     maxrate:oldquestion.maxrate,
                     order:oldquestion.order,
                     length:oldquestion.length,
                     rating:oldquestion.rating,
                     qtype:oldquestion.qtype,
                     createdby:oldquestion.createdby,
                     createddate:oldquestion.createddate,
                     npsleft:oldquestion.npsleft,
                     npsright:oldquestion.npsright,
                     npsmiddle:oldquestion.npsmiddle
 
                 },function(status,newquestion) {
 
                     questions.find({
                         'groupid': oldquestion.groupid
                     },function(sstatus,questionfromgroups) {
                         var newarray = []
                         if(questionfromgroups.length > 0){
                             newarray = questionfromgroups.sort(function(a, b){
                                     return a.order-b.order
                             })
                             var norder = 0;
                             newarray.forEach(qtion => {
                                 norder++;
                                 questions.findOneAndUpdate({"questionid":qtion._id},{
                                     order:norder
                                 }, function(){});
                             });
                         }
                     });
 
 
                     questioncustomdata.find({"questionid": oldquestion._id}, function(err, oldquestionscustomdata){
                         if(oldquestionscustomdata != null){
                             oldquestionscustomdata.forEach(oldquestionscustomdatas => {
                                 questioncustomdata.create({
 
                                     questionid:newquestion._id,
                                     title:oldquestionscustomdatas.title,
                                     type:oldquestionscustomdatas.type,
                                     width:oldquestionscustomdatas.width,
                                     required:oldquestionscustomdatas.required,
                                     createdby:oldquestionscustomdatas.createdby,
                                     createddate:oldquestionscustomdatas.createddate
 
                                 },function(status,ghgjhgjh) {});
                             });
                         }
                     })
 
                     questionmatrixcols.find({"questionid": oldquestion._id}, function(err, oldquestionmatrixcols){
                         if(oldquestionmatrixcols != null){
                             oldquestionmatrixcols.forEach(oldquestionsmatrixs => {
                                 questionmatrixcols.create({
                                     questionid:newquestion._id,
                                     option:oldquestionsmatrixs.option,
                                     order:oldquestionsmatrixs.order,
                                     createdby:oldquestionsmatrixs.createdby,
                                     createddate:oldquestionsmatrixs.createddate
                                 },function(status,ghjgjhgjgj) {
                                 });
                             });
                         }
                     })
                     questionmatrixrows.find({"questionid": oldquestion._id}, function(err, oldquestionmatrixrows){
                         if(oldquestionmatrixrows != null){
                             oldquestionmatrixrows.forEach(oldquestionsmatrix => {
                                 questionmatrixrows.create({
                                     questionid:newquestion._id,
                                     option:oldquestionsmatrix.option,
                                     order:oldquestionsmatrix.order,
                                     radioans:oldquestionsmatrix.radioans,
                                     createdby:oldquestionsmatrix.createdby,
                                     createddate:oldquestionsmatrix.createddate
 
                                 },function(status,fjdjdkjgkldfj) {
                                 });
                             });
                         }
                     })
                     questionoptions.find({"questionid": oldquestion._id}, function(err, oldquestionoptions){
                         if(oldquestionoptions != null){
                             oldquestionoptions.forEach(oldquestionoption => {
                                 questionoptions.create({
                                     questionid:newquestion._id,
                                     choicestate:oldquestionoption.choicestate,
                                     choicetext:oldquestionoption.choicetext,
                                     order:oldquestionoption.order,
                                     correct:oldquestionoption.correct,
                                     createdby:oldquestionoption.createdby,
                                     createddate:oldquestionoption.createddate
                                 },function(status,lksdflfsdfj) {
                                 });
                             }); 
                         }
                     })
                     questionsliderlinks.find({"questionid": oldquestion._id}, function(err, oldquestionsliderlinks){
                         if(oldquestionsliderlinks != null){
                             oldquestionsliderlinks.forEach(oldquestionsliderlink => {
                                 questionsliderlinks.create({
                                     questionid:newquestion._id,
                                     src:oldquestionsliderlink.src,
                                     createdby:oldquestionsliderlink.createdby,
                                     createddate:oldquestionsliderlink.createddate
                                 },function(status,newfdhfghtytquestion) {
                                 });
                             });
                         }
                     })
                     questionorder.findOne({"questionid":oldquestion._id},function(status, orderdata){
                         if(orderdata != null){
                             questionorder.create({
                                 questionid:newquestion._id,
                                 surveyid:orderdata.surveyid,
                                 order:orderdata.order
                             },function(status, data){});
                         }
                     });
                     questionlogicjump.find({"questionid": oldquestion._id}, function(err, oldquestionlogicjumps){
                         if(oldquestionlogicjumps != null){
                             oldquestionlogicjumps.forEach(oldquestionlogicjump => {
                                 questionlogicjump.create({
                                     questionid:newquestion._id,
                                     choiceid:oldquestionlogicjump.choiceid,
                                     surveyid:oldquestionlogicjump.surveyid,
                                     condition:oldquestionlogicjump.condition,
                                     answer:oldquestionlogicjump.answer,
                                     goto:oldquestionlogicjump.goto,
                                     nextquestion:oldquestionlogicjump.nextquestion,
                                     createdby:oldquestionlogicjump.createdby,
                                     createddate:oldquestionlogicjump.createddate,
                                     modifiedby:oldquestionlogicjump.modifiedby,
                                     modifieddate:oldquestionlogicjump.modifieddate,
                                 },function(status,newfdhfghtytquestion) {
                                 });
                             });
                         }
                     })
     
                 });
                 res.status(200).json(1);
             } else {
                 res.status(200).json(0);
             }
         });
    } catch(e){
        res.status(500).json(e);
        console.log('catch Duplicate question', e);
    }
 });
 router.route('/movequestion').post(function(req, res) { 
    try{
        var questionid = req.body.questionid;
        var movequestionid = req.body.movequestionid;
        questions.findOne({"_id": questionid}, function(err, oldquestion){
            if(oldquestion != null){
                var order1 = (parseInt(oldquestion.order)+0.0001)+""
                questions.findByIdAndUpdate({
                    _id:movequestionid,
                },{
                    groupid:oldquestion.groupid,
                    order:order1,
                },function(status,newquestion) {
                    // console.log("movedquestion- ", newquestion);
                    if(newquestion){
                        questions.find({
                            'groupid': oldquestion.groupid
                        },function(sstatus,questionfromgroups) {
                            var newarray = []
                            if(questionfromgroups.length > 0){
                                newarray = questionfromgroups.sort(function(a, b){
                                        return parseFloat(a.order)-parseFloat(b.order)
                                })
                                var norder = 0;
                                asyncLoop(newarray, function (qtion, next)
                                {
                                    norder++;
                                    console.log("questionid- "+qtion._id+" oldorder- "+qtion.order+" neworder- "+norder);
                                    
                                    questions.findOneAndUpdate({"_id":qtion._id},{
                                        order:norder
                                    }, function(astatus, data){
                                        // console.log("orderupdate status", astatus);
                                        // console.log("orderupdate data", data);
                                        
                                        next();
                                    });                                    
                                }, function (err)
                                {
                                    if (err)
                                    {
                                        console.error('Inner Error: ' + err);
                                    }
                                    res.status(200).json(1); 
                                });
                            } else {
                                res.status(200).json(1); 
                            }
                        });
                    } else {
                        res.status(200).json(0);
                    }
                });
            } else {
                res.status(200).json(0);
            }
        });
    } catch(e){
        res.status(500).json(e);
        console.log('catch Duplicate question', e);
    }
 });
  
router.route('/updatequestionopteroption')
.post(function(req, res) {
   try{
       var questionid = req.body.questionid;
       var extraoption = req.body.extraoption;
       questions.findOneAndUpdate({_id:questionid},{
        other:extraoption
       },function(status,result) {
           if(!empty(result)){
           res.status(200).json({
               status: 1,
               message:"Updated",
           });
           } else {
           res.status(200).json({
               status:0,
               message:"Failed"
           });
           }
       });
   } catch(e){
       res.status(500).json(e);
       console.log('catch update question', e);
   }
});



router.route('/downlaodresponsexls').get(function(req, res) {
    var respid = req.query.respid;
    var onlydata = req.query.onlydata;
    if(respid){
        const styles = {
            headerDark: {
                fill: {
                  fgColor: {
                    rgb: 'bfbfbf'
                  }
                },
                font: {
                  color: {
                    rgb: '000000'
                  },
                  sz: 14,
                  bold: true,
                  underline: true
                }
              },
              datanormal: {
                font: {
                  color: {
                    rgb: '000000'
                  },
                  sz: 11,
                  bold: false,
                  underline: false
                }
              },
            };
          
          surveyattempt.findOne({'_id': respid}, function(err, respiddetails){
            //   console.log("err-", err);
            //   console.log(respid+" =respiddetails-", respiddetails);
              
              if(respiddetails){

                var promis_getuser = new Promise(function(resolve, reject) {
                    var this_user = {
                        _id:"",
                        firstname:"",
                        lastname:"",
                        email:""
                    }
                    if(respiddetails.anonymous){
                        respiddetails.createdip = "Anonymous"
                        this_user._id="_nologin"
                        this_user.firstname="Anonymous"
                        this_user.lastname=""
                        this_user.email="Anonymous"
                        resolve(this_user);
                    } else {
                        if(!respiddetails.userid.includes("login")){
                            this_user._id=respiddetails.userid
                            users.findOne({"_id":respiddetails.userid}, function(err, userres){
                                if(userres){
                                    resolve(userres);
                                } else {
                                    resolve(this_user);
                                }
                            })
                        } else {
                            if(respiddetails.useremail){
                                contactlistdata.findOne({"email":respiddetails.useremail}, function(err, userres){
                                    this_user.email=respiddetails.useremail
                                    if(userres){
                                        this_user._id=respiddetails.userid
                                        this_user.firstname=userres.firstname
                                        this_user.lastname=userres.lastname
                                    }
                                    resolve(this_user);
                                })
                            } else {
                                this_user._id=respiddetails.userid
                                this_user.firstname="No "
                                this_user.lastname="Login "
                                this_user.email="No email"
                                resolve(this_user);
                            }
                        }
                    }
                });
                var promis_getsurvey = new Promise(function(resolve, reject) {
                    surveys.findOne({'_id':respiddetails.surveyid}, function(err, surveydata){
                        if(err){
                            resolve(null)
                        } else {
                            resolve(surveydata)
                        }
                    })
                });
                var surveyquestions = new Promise(function(resolve, reject) {
                    var allquestions = [];
                    questionorder.find({'surveyid':respiddetails.surveyid}, function(err, questioninorder){
                        var allgroup = []
                        if(questioninorder.length > 0){
                            allgroup = questioninorder.sort(function(a, b){
                                return a.order-b.order
                            })
                        }
                        asyncLoop(allgroup, function (group, nextgroup){
                            questions.findOne({"_id": group.questionid}, function(err, question){
                                var pms_questionoptions = new Promise(function(resolve, reject) {
                                    questionoptions.find({"questionid":question._id}, function(err, res){
                                        resolve(res)
                                    })
                                });
                                var pms_questionmatrixrows = new Promise(function(resolve, reject) {
                                    questionmatrixrows.find({"questionid":question._id}, function(err, res){
                                        resolve(res)
                                    })
                                });
                                var pms_questionmatrixcols = new Promise(function(resolve, reject) {
                                    questionmatrixcols.find({"questionid":question._id}, function(err, res){
                                        resolve(res)
                                    })
                                });
                                var pms_questioncustomdata = new Promise(function(resolve, reject) {
                                    questioncustomdata.find({"questionid":question._id}, function(err, res){
                                        resolve(res)
                                    })
                                });
                                Promise.all([pms_questionoptions, pms_questionmatrixrows, pms_questionmatrixcols, pms_questioncustomdata]).then(function(finalprimise) {
                                    allquestions.push({
                                        question:question,
                                        options:finalprimise[0],
                                        rows:finalprimise[1],
                                        cols:finalprimise[2],
                                        custom:finalprimise[3]
                                    })
                                    nextgroup()
                                }).catch(function(err) {
                                    console.log("cache error - ", err);
                                    nextgroup()
                                });
                            })
                        }, function (err)
                        {
                            this_questions = allquestions;
                            console.log("Question loop finished");
                            resolve(allquestions)
                        });
                    });
                });
                
                var promis_getresponsedata = new Promise(function(resolve, reject) {
                    var data = [];
                    Promise.all([surveyquestions]).then(function(allsurveyquestions) {
                        var questiondatas = allsurveyquestions[0];
                        asyncLoop(questiondatas, function (questiondata, nextquestion)
                        {
                            var question =questiondata.question; 
                            var alloption = questiondata.options;
                            var allrows = questiondata.rows;
                            var allcols = questiondata.cols;
                            var allcustom = questiondata.custom;
                            if(question.questiontext ){
                                if(noquestion.indexOf(question.questiontype) >= 0){
                                    nextquestion();
                                } else {
                                    var commenttext = ""
                                    var othertext = ""
                                    var comment = ""
                                    var comment1 = ""
                                    var other = ""
                                    if(question.havecomment){
                                        if(question.commenttext.length > 0){
                                            commenttext = question.commenttext+" => "
                                        } else {
                                            commenttext = "Enter comment here"+" => "
                                        }
                                    }
                                    if(question.other){
                                        if(question.othertext.length > 0){
                                            othertext = question.othertext+" => "
                                        } else {
                                            othertext = "Other, Please Specify => "
                                        }
                                    }
                                    questioncomments.findOne({questionid:question._id, attemptid:respid}, function(err, commentres){
                                        if(commentres){
                                            comment = commenttext + commentres.comment 
                                            comment1 = commentres.comment 
                                        }
                                        attemptanswer.findOne({attemptid:respid, questionid:question._id}, function(err, aquestion) {
                                            if(aquestion){
                                                if(!aquestion.answer && !aquestion.otheranswer){
                                                    // console.log("skipped aquestion-", aquestion);
                                                    data.push({
                                                        qno:data.length+1,
                                                        question:question.questiontext,
                                                        answer:"",
                                                        answer1:"",
                                                        commenttext:"",
                                                        othertext:othertext,
                                                        comment:comment,
                                                        other:"",
                                                        comment1:comment1,
                                                        other1:aquestion.otheranswer
                                                    });
                                                    nextquestion();
                                                } else if(optionanswer.indexOf(question.questiontype) >= 0){
                                                    if(aquestion.otheranswer){
                                                        data.push({
                                                            qno:data.length+1,
                                                            question:question.questiontext,
                                                            answer:"",
                                                            answer1:"",
                                                            commenttext:commenttext,
                                                            othertext:othertext,
                                                            comment:comment,
                                                            other:othertext + aquestion.otheranswer,
                                                            comment1:comment1,
                                                            other1:aquestion.otheranswer
                                                        });
                                                        nextquestion();
                                                    } else {
                                                        var givenanswer = JSON.parse(aquestion.answer);
                                                        if(!Array.isArray(givenanswer)){
                                                            givenanswer = [givenanswer]
                                                        }
                                                        var innans = [];
                                                        alloption.forEach((element, i) => {
                                                            if(element.choicetext != ""){
                                                                const found = givenanswer.find( answer => answer == element._id);
                                                                if(found){
                                                                    innans.push(element.choicetext) 
                                                                }
                                                            }
                                                        });
                                                        data.push({
                                                            qno:data.length+1,
                                                            question:question.questiontext,
                                                            answer:innans.join("/"),
                                                            answer1:innans.join("<br>"),
                                                            commenttext:commenttext,
                                                            othertext:othertext,
                                                            comment:comment,
                                                            other:other,
                                                            comment1:comment1,
                                                            other1:aquestion.otheranswer
                                                        });
                                                        nextquestion();
                                                    }
                                                } else if(multitextanswer.indexOf(question.questiontype) >= 0){
                                                    var givenanswer = JSON.parse(aquestion.answer);
                                                    var innans = [];
                                                    var innans = [];
                                                    alloption.forEach((element, i) => {
                                                        if(element.choicetext != ""){
                                                            var found = givenanswer.find( answer => answer.id == element._id );
                                                            if(found){
                                                                innans.push(element.choicetext+"=>"+found.answer);
                                                            } else {
                                                                innans.push(element.choicetext+"=>");
                                                            }
                                                        }
                                                    });
                                                    data.push({
                                                        qno:data.length+1,
                                                        question:question.questiontext,
                                                        answer:innans.join(","),
                                                        answer1:innans.join("<br>"),
                                                        commenttext:commenttext,
                                                        othertext:othertext,
                                                        comment:comment,
                                                        other:other,
                                                        comment1:comment1,
                                                        other1:""
                                                    });
                                                    nextquestion();
                                                } else if(question.questiontype == "ranking"){
                                                    var givenanswer = JSON.parse(aquestion.answer);
                                                    var innans = [];
                                                    var innans = [];
                                                    alloption.forEach((element, i) => {
                                                        if(element.choicetext != ""){
                                                            var found = givenanswer.find( answer => answer.option == element._id );
                                                            if(found){
                                                                innans.push(element.choicetext+"=>"+found.rank);
                                                            } else {
                                                                innans.push(element.choicetext+"=>");
                                                            }
                                                        }
                                                    });
                                                    data.push({
                                                        qno:data.length+1,
                                                        question:question.questiontext,
                                                        answer:innans.join(","),
                                                        answer1:innans.join("<br>"),
                                                        commenttext:commenttext,
                                                        othertext:othertext,
                                                        comment:comment,
                                                        other:other,
                                                        comment1:comment1,
                                                        other1:""
                                                    });
                                                    nextquestion();
                                                } else if(customformanswer.indexOf(question.questiontype) >= 0){
                                                    var givenanswer = JSON.parse(aquestion.answer);
                                                    var innans = [];
                                                    var innans = [];
                                                    allcustom.forEach((element, i) => {
                                                        if(element.title != ""){
                                                            var found = givenanswer.find( answer => answer.id == element._id );
                                                            if(found){
                                                                innans.push(element.title+"=>"+found.answer);
                                                            } else {
                                                                innans.push(element.title+"=>");
                                                            }
                                                        }
                                                    });
                                                    data.push({
                                                        qno:data.length+1,
                                                        question:question.questiontext,
                                                        answer:innans.join(","),
                                                        answer1:innans.join("<br>"),
                                                        commenttext:commenttext,
                                                        othertext:othertext,
                                                        comment:comment,
                                                        other:other,
                                                        comment1:comment1,
                                                        other1:""
                                                    });
                                                    nextquestion();
                                                } else if(matrixquestion.indexOf(question.questiontype) >= 0){
                                                    var givenanswer = JSON.parse(aquestion.answer);
                                                    var innans = [];
                                                    allrows.forEach((row, i) => {
                                                        var foundanswer = givenanswer.find( answer => answer.rowid == row._id);
                                                        if(foundanswer){
                                                            console.log("foundanswer= ", foundanswer);
                                                            if(Array.isArray(foundanswer.selected)){
                                                                var selected = []
                                                                foundanswer.selected.forEach(answer => {
                                                                    var foundcol = allcols.find( col => col._id == answer);
                                                                    if(foundcol){
                                                                        selected.push(foundcol.option); 
                                                                    }
                                                                });
                                                                if(selected.length > 0){
                                                                    innans.push(row.option+" => "+selected.join(","));
                                                                } else {
                                                                    innans.push(row.option+" => not selected");
                                                                }
                                                            } else {
                                                                var foundcol = allcols.find( col => col._id == foundanswer.selected);
                                                                if(foundcol){
                                                                    innans.push(row.option+" => "+foundcol.option);
                                                                } else {
                                                                    innans.push(row.option+" => no available");
                                                                }
                                                            }
                                                        } else {
                                                            innans.push(row.option+" => ")
                                                        }
                                                    });
                                                    data.push({
                                                        qno:data.length+1,
                                                        question:question.questiontext,
                                                        answer:innans.join(","),
                                                        answer1:innans.join("<br>"),
                                                        commenttext:commenttext,
                                                        othertext:othertext,
                                                        comment:comment,
                                                        other:other,
                                                        comment1:comment1,
                                                        other1:""
                                                    });
                                                    nextquestion();
                                                } else {
                                                    console.log("aquestion- ", aquestion)
                                                    data.push({
                                                        qno:data.length+1,
                                                        question:question.questiontext,
                                                        answer:JSON.parse(aquestion.answer),
                                                        answer1:JSON.parse(aquestion.answer),
                                                        commenttext:commenttext,
                                                        othertext:othertext,
                                                        comment:comment,
                                                        other:other,
                                                        comment1:comment1,
                                                        other1:""
                                                    });
                                                    nextquestion();
                                                }
                                            } else {
                                                data.push({
                                                    qno:data.length+1,
                                                    question:question.questiontext,
                                                    answer:"",
                                                    answer1:"",
                                                    commenttext:commenttext,
                                                    othertext:othertext,
                                                    comment:comment,
                                                    other:other,
                                                    comment1:comment1,
                                                    other1:""
                                                });
                                                nextquestion();
                                            }
                                        })
                                    })
                                }
                            } else {
                                nextquestion();
                            }

                        }, function (err) {
                            console.log("all Errror- ", err)
                            resolve(data)
                        });
                    }).catch(function(err) {
                        console.log("all Errror1- ", err)
                        resolve(data);
                    });
                });
                Promise.all([promis_getuser, promis_getsurvey, promis_getresponsedata]).then(function(promisdata) {
                    var userdata = promisdata[0];
                    if(!userdata){
                        userdata={
                            firstname:"Without login",
                            lastname:"",
                            email:"",
                        }
                    }
                    var surveydata = promisdata[1];
                    var answerdata = promisdata[2];
                    const heading = [
                      [{value: 'Survey name', style: styles.headerDark}, {value: surveydata.surveyname, style: styles.datanormal}],
                      [{value: 'User name', style: styles.headerDark}, {value: userdata.firstname + " "+ userdata.lastname, style: styles.datanormal}],
                      [{value: 'Email', style: styles.headerDark}, {value: userdata.email, style: styles.datanormal}],
                      [{value: 'Start time: ', style: styles.headerDark}, {value: dateFormat(respiddetails.datestarted,"yyyy/mm/dd hh:MM:ss TT"), style: styles.datanormal}],
                      [{value: 'finish time: ', style: styles.headerDark}, {value: dateFormat(respiddetails.datefinished,"yyyy/mm/dd hh:MM:ss TT"), style: styles.datanormal}],
                      [{value: '', style: styles.datanormal}],
                    ];
                    const specification = {
                        qno: { // <- the key should match the actual data key
                          displayName: 'Qno.', // <- Here you specify the column header
                          headerStyle: styles.headerDark, // <- Header style
                          cellFormat: function(value, row) { // <- style renderer function
                            // if the status is 1 then color in green else color in red
                            // Notice how we use another cell value to style the current one
                            return (value); // <- Inline cell style is possible 
                        },
                        width: 120 // <- width in pixels
                        },
                        question: {
                          displayName: 'Question',
                          headerStyle: styles.headerDark,
                          cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
                            return (value);
                          },
                          width: 120 // <- width in pixels
                        },
                        answer: {
                          displayName: 'Answer',
                          headerStyle: styles.headerDark,
                          width: 120 // <- width in pixels
                        },
                        othertext: {
                          displayName: 'Other',
                          headerStyle: styles.headerDark,
                          width: 120 // <- width in pixels
                        },
                        other: {
                          displayName: 'Other answer',
                          headerStyle: styles.headerDark,
                          width: 120 // <- width in pixels
                        },
                        commenttext: {
                          displayName: 'Comment Question ',
                          headerStyle: styles.headerDark,
                          width: 120 // <- width in pixels
                        },
                        comment1: {
                          displayName: 'Comment Answer ',
                          headerStyle: styles.headerDark,
                          width: 120 // <- width in pixels
                        }
                      }
                      const merges = []
                    if(onlydata){
                        return res.status(200).send({
                            name: 'Report', 
                            heading: heading, 
                            specification: specification, 
                            data: answerdata 
                        });
                    } else {
                        const report = excel.buildExport(
                            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                            {
                                name: 'Report', // <- Specify sheet name (optional)
                                heading: heading, // <- Raw heading array (optional)
                                merges: merges, // <- Merge cell ranges
                                specification: specification, // <- Report specification
                                data: answerdata // <-- Report data
                            }
                            ]
                        );
                        
                        // You can then return this straight
                        res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
                        return res.send(report);
                    }
                }).catch(function(err) {
                    console.log('promiss all error', err)
                    return res.send("promiss all error");
                });
              } else {
                  console.log("invalid response id");
                  return res.send("invalid response id");
              }
          })
        } else {
            return res.send("Invalid call");
        }
    });



router.route('/downlaodresponseuserxls').get(function(req, res) {
    var respid = req.query.surveyid;
    console.log(req.query);
    if(respid){
        const styles = {
            headerDark: {
                fill: {
                  fgColor: {
                    rgb: 'bfbfbf'
                  }
                },
                font: {
                  color: {
                    rgb: '000000'
                  },
                  sz: 14,
                  bold: true,
                  underline: true
                }
              },
              datanormal: {
                font: {
                  color: {
                    rgb: '000000'
                  },
                  sz: 11,
                  bold: false,
                  underline: false
                }
              },
            };
          
          surveys.findOne({"_id": respid}, function(err, surveydata){
              if(surveydata){
                  console.log("surveydata-", surveydata);
                  
                var promis_getallresponsedata = new Promise(function(resolve, reject) {
                    var data = [];
                    surveyattempt.find({'surveyid':surveydata._id}, function(err, orderdata){
                        if(err){
                            console.log("survey attempt error- ", orderdata);
                            resolve(data)
                        } else {
                            if(orderdata.length > 0){
                                var newarray = orderdata.sort(function(a, b){
                                        return a.datestarted-b.datestarted
                                    })
                            } else {
                                var newarray = orderdata
                            }
                            asyncLoop(newarray, function (attempt, outernext)
                            {   
                                var datestarted = "";
                                var datefinished = "";
                                if(attempt.datestarted != 0){
                                    datestarted = dateFormat(attempt.datestarted,"yyyy/mm/dd")
                                }
                                if(attempt.datefinished != 0){
                                    datefinished = dateFormat(attempt.datefinished,"yyyy/mm/dd")
                                }
                                
                                if(attempt.anonymous){
                                    data.push({
                                        qno:data.length+1,
                                        username:"Anonymous ",
                                        startdata:datestarted,
                                        enddate:datefinished
                                    })
                                    outernext();
                                } else {
                                    if(!attempt.userid.includes("login")){
                                        users.findOne({"_id":attempt.userid}, function(err, userdata){
                                            if(userdata){
                                                data.push({
                                                    qno:data.length+1,
                                                    username:userdata.firstname +" "+userdata.lastname,
                                                    startdata:datestarted,
                                                    enddate:datefinished
                                                })
                                                outernext();
                                            } else {
                                                outernext();
                                            }
                                        })
                                    } else {
                                        if(attempt.useremail){
                                            contactlistdata.findOne({"email":attempt.useremail}, function(err, userdata){
                                                if(userdata){
                                                    data.push({
                                                        qno:data.length+1,
                                                        username:userdata.firstname +" "+userdata.lastname,
                                                        startdata:datestarted,
                                                        enddate:datefinished
                                                    })
                                                    outernext();
                                                } else {
                                                    data.push({
                                                        qno:data.length+1,
                                                        username:attempt.useremail,
                                                        startdata:datestarted,
                                                        enddate:datefinished
                                                    })
                                                    outernext();
                                                }
                                            })
                                        } else {
                                            data.push({
                                                qno:data.length+1,
                                                username:"No Login ",
                                                startdata:datestarted,
                                                enddate:datefinished
                                            })
                                            outernext();
                                        }
                                    }
                                }
                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Outer Error: ' + err.message);
                                    return;
                                }
                                console.log("final data= ", data);
                                console.log('Outer Finished!');
                                resolve(data)
                            });
                        }
                    })
                });
                Promise.all([promis_getallresponsedata]).then(function(promisdata) {
                    var answerdata = promisdata[0];
                    const heading = [
                      [{value: 'Surveyname', style: styles.headerDark}, {value: surveydata.surveyname, style: styles.datanormal}],
                      [{value: '', style: styles.datanormal}],
                    ];
                    const specification = {
                        qno: { // <- the key should match the actual data key
                          displayName: 'Qno.', // <- Here you specify the column header
                          headerStyle: styles.headerDark, // <- Header style
                          cellFormat: function(value, row) { // <- style renderer function
                            // if the status is 1 then color in green else color in red
                            // Notice how we use another cell value to style the current one
                            return (value); // <- Inline cell style is possible 
                        },
                        width: 120 // <- width in pixels
                        },
                        username: {
                          displayName: 'Username',
                          headerStyle: styles.headerDark,
                          cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
                            return (value);
                          },
                          width: 120 // <- width in pixels
                        },
                        startdata: {
                            displayName: 'Start date',
                            headerStyle: styles.headerDark,
                            width: 120 // <- width in pixels
                        },
                        enddate: {
                            displayName: 'End date',
                            headerStyle: styles.headerDark,
                            width: 120 // <- width in pixels
                        }
                    }
                      const merges = [
                        // { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
                        // { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
                        // { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
                      ]
                      
                    const report = excel.buildExport(
                        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                            {
                                name: 'Report1', // <- Specify sheet name (optional)
                                heading: heading, // <- Raw heading array (optional)
                                merges: merges, // <- Merge cell ranges
                                specification: specification, // <- Report specification
                                data: answerdata // <-- Report data
                            }
                            ]
                    );
                    
                    // You can then return this straight
                    res.attachment('individualreport.xlsx'); // This is sails.js specific (in general you need to set headers)
                    return res.send(report);
                }).catch(function(err) {
                    console.log('promiss all error', err)
                    return res.send("promiss all error");
                });
              } else {
                  console.log("invalid response id");
                  return res.send("invalid response id");
              }
          })
        } else {
            return res.send("Invalid call");
        }
});





router.route('/downlaodresponseapproveduserxls').get(function(req, res) {
    var respid = req.query.surveyid;
    console.log(req.query);
    if(respid){
        const styles = {
            headerDark: {
                fill: {
                  fgColor: {
                    rgb: 'bfbfbf'
                  }
                },
                font: {
                  color: {
                    rgb: '000000'
                  },
                  sz: 14,
                  bold: true,
                  underline: true
                }
              },
              datanormal: {
                font: {
                  color: {
                    rgb: '000000'
                  },
                  sz: 11,
                  bold: false,
                  underline: false
                }
              },
            };
          
          surveys.findOne({"_id": respid}, function(err, surveydata){
              if(surveydata){
                  console.log("surveydata-", surveydata);
                  
                var promis_getallresponsedata = new Promise(function(resolve, reject) {
                    var data = [];
                    surveyattempt.find({'surveyid':surveydata._id}, function(err, orderdata){
                        if(err){
                            console.log("survey attempt error- ", orderdata);
                            resolve(data)
                        } else {
                            if(orderdata.length > 0){
                                var newarray = orderdata.sort(function(a, b){
                                        return a.datestarted-b.datestarted
                                    })
                            } else {
                                var newarray = orderdata
                            }
                            asyncLoop(newarray, function (attempt, outernext)
                            {   
                                var datestarted = "";
                                var datefinished = "";
                                var eapproved = "Not Approved";
                                var rapproved = "Not Approved";
                                var acompleted = "Not Completed";
                                if(attempt.approvededi == 1){
                                    eapproved = "Approved";
                                }
                                if(attempt.approvedrev == 1){
                                    rapproved = "Approved";
                                }
                                if(attempt.completed == 1){
                                    acompleted = "Completed";
                                }
                                if(attempt.datestarted != 0){
                                    datestarted = dateFormat(attempt.datestarted,"yyyy/mm/dd")
                                }
                                if(attempt.datestarted != 0){
                                    datefinished = dateFormat(attempt.datefinished,"yyyy/mm/dd")
                                }
                                if(attempt.anonymous){
                                    data.push({
                                        qno:data.length+1,
                                        username:"Anonymous ",
                                        startdata:datestarted,
                                        enddate:datefinished,
                                        edited:eapproved,
                                        reviewed:rapproved,
                                        completed:acompleted,
                                    })
                                    outernext();
                                } else {
                                    if(!attempt.userid.includes("login")){
                                        users.findOne({"_id":attempt.userid}, function(err, userdata){
                                            if(userdata){
                                                data.push({
                                                        qno:data.length+1,
                                                        username:userdata.firstname +" "+userdata.lastname,
                                                        startdata:datestarted,
                                                        enddate:datefinished,
                                                        edited:eapproved,
                                                        reviewed:rapproved,
                                                        completed:acompleted,
                                                    })
                                                    outernext();
                                                } else {
                                                outernext();
                                            }
                                        })
                                    } else {
                                        if(attempt.useremail){
                                            contactlistdata.findOne({"email":attempt.useremail}, function(err, userdata){
                                                if(userdata){
                                                    data.push({
                                                        qno:data.length+1,
                                                        username:userdata.firstname +" "+userdata.lastname,
                                                        startdata:datestarted,
                                                        enddate:datefinished,
                                                        edited:eapproved,
                                                        reviewed:rapproved,
                                                        completed:acompleted,
                                                    })
                                                    outernext();
                                                } else {
                                                    data.push({
                                                        qno:data.length+1,
                                                        username:attempt.useremail +" "+attempt.useremail,
                                                        startdata:datestarted,
                                                        enddate:datefinished,
                                                        edited:eapproved,
                                                        reviewed:rapproved,
                                                        completed:acompleted,
                                                    })
                                                    outernext();
                                                }
                                            })
                                        } else {
                                            data.push({
                                                qno:data.length+1,
                                                username:"No Login ",
                                                startdata:datestarted,
                                                enddate:datefinished,
                                                edited:eapproved,
                                                reviewed:rapproved,
                                                completed:acompleted,
                                            })
                                            outernext();
                                        }
                                    }
                                }
                            }, function (err)
                            {
                                if (err)
                                {
                                    console.error('Outer Error: ' + err.message);
                                    return;
                                }
                                console.log("final data= ", data);
                                console.log('Outer Finished!');
                                resolve(data)
                            });
                        }
                    })
                });
                Promise.all([promis_getallresponsedata]).then(function(promisdata) {
                    var answerdata = promisdata[0];
                    const heading = [
                      [{value: 'Surveyname', style: styles.headerDark}, {value: surveydata.surveyname, style: styles.datanormal}],
                      [{value: '', style: styles.datanormal}],
                    ];
                    const specification = {
                        qno: { // <- the key should match the actual data key
                          displayName: 'Qno.', // <- Here you specify the column header
                          headerStyle: styles.headerDark, // <- Header style
                          cellFormat: function(value, row) { // <- style renderer function
                            // if the status is 1 then color in green else color in red
                            // Notice how we use another cell value to style the current one
                            return (value); // <- Inline cell style is possible 
                        },
                        width: 120 // <- width in pixels
                        },
                        username: {
                          displayName: 'Username',
                          headerStyle: styles.headerDark,
                          cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
                            return (value);
                          },
                          width: 120 // <- width in pixels
                        },
                        startdata: {
                            displayName: 'Start date',
                            headerStyle: styles.headerDark,
                            width: 120 // <- width in pixels
                        },
                        enddate: {
                            displayName: 'End date',
                            headerStyle: styles.headerDark,
                            width: 120 // <- width in pixels
                        },
                        edited: {
                            displayName: 'Editor Approval',
                            headerStyle: styles.headerDark,
                            width: 120 // <- width in pixels
                        },
                        reviewed: {
                            displayName: 'Reviewer Approval',
                            headerStyle: styles.headerDark,
                            width: 120 // <- width in pixels
                        },
                        completed: {
                            displayName: 'Status',
                            headerStyle: styles.headerDark,
                            width: 120 // <- width in pixels
                        }
                    }
                      const merges = [
                        // { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
                        // { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
                        // { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
                      ]
                      
                    const report = excel.buildExport(
                        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                        {
                            name: 'Report', // <- Specify sheet name (optional)
                            heading: heading, // <- Raw heading array (optional)
                            merges: merges, // <- Merge cell ranges
                            specification: specification, // <- Report specification
                            data: answerdata // <-- Report data
                        }
                        ]
                    );
                    
                    // You can then return this straight
                    res.attachment('Approvalreport.xlsx'); // This is sails.js specific (in general you need to set headers)
                    return res.send(report);
                }).catch(function(err) {
                    console.log('promiss all error', err)
                    return res.send("promiss all error");
                });
              } else {
                  console.log("invalid response id");
                  return res.send("invalid response id");
              }
          })
        } else {
            return res.send("Invalid call");
        }
});


router.route('/downlaodsummaryreportxls').get(function(req, res) {
    var respid = req.query.surveyid;
    if(respid){
        const styles = {
            headerDark: {
                fill: {
                  fgColor: {
                    rgb: 'bfbfbf'
                  }
                },
                font: {
                  color: {
                    rgb: '000000'
                  },
                  sz: 14,
                  bold: true,
                  underline: true
                }
            },
            datanormal: {
                font: {
                  color: {
                    rgb: '000000'
                  },
                  sz: 11,
                  bold: false,
                  underline: false
                }
            },
        };
          
        surveys.findOne({"_id": respid}, function(err, surveydata){
            if(surveydata){
                const merges = []
                var finalreport = [];
                questionorder.find({'surveyid':surveydata._id}, function(err, orderdata){
                    if(err){
                        // resolve(data)
                        res.send("failed to show data");
                    } else {
                        if(orderdata.length > 0){
                            var newarray = orderdata.sort(function(a, b){
                                    return a.order-b.order
                                })
                        } else {
                            var newarray = orderdata
                        }
                        asyncLoop(newarray, function (order, outernext)
                        {
                            questions.findOne({_id:order.questionid},{_id:1, surveyid:1, questiontext:1, questiontype:1}, function(err, question) {
                                if (err){
                                    outernext();
                                } else if(question){
                                    const heading = [
                                        [{value: 'Survey name', style: styles.headerDark}, {value: surveydata.surveyname, style: styles.datanormal}],
                                        [{value: 'Question', style: styles.headerDark}, {value: question.questiontext, style: styles.datanormal}],
                                        [{value: '', style: styles.datanormal}],
                                    ];
                                    var specification = {
                                        qno: { 
                                            displayName: 'Slno.',
                                            headerStyle: styles.headerDark,
                                            cellFormat: function(value, row) {
                                                return (value);
                                            },
                                            width: 120
                                        },
                                        username: {
                                            displayName: 'User',
                                            headerStyle: styles.headerDark,
                                            cellFormat: function(value, row) {
                                                return (value);
                                            },
                                            width: 120 
                                        },
                                        dateanswered: {
                                            displayName: 'Date',
                                            headerStyle: styles.headerDark,
                                            cellFormat: function(value, row) {
                                                return (value);
                                            },
                                            width: 120 
                                        },
                                        answer: {
                                            displayName: 'Answer',
                                            headerStyle: styles.headerDark,
                                            cellFormat: function(value, row) {
                                                return (value);
                                            },
                                            width: 120 
                                        }
                                    }
                                    var specification1 = {
                                        qno: { 
                                            displayName: 'Slno.',
                                            headerStyle: styles.headerDark,
                                            cellFormat: function(value, row) {
                                                return (value);
                                            },
                                            width: 120
                                        },
                                        username: {
                                            displayName: 'User',
                                            headerStyle: styles.headerDark,
                                            cellFormat: function(value, row) {
                                                return (value);
                                            },
                                            width: 120 
                                        },
                                        dateanswered: {
                                            displayName: 'Date',
                                            headerStyle: styles.headerDark,
                                            cellFormat: function(value, row) {
                                                return (value);
                                            },
                                            width: 120 
                                        },
                                        subquestion: {
                                            displayName: 'Subquestion',
                                            headerStyle: styles.headerDark,
                                            cellFormat: function(value, row) {
                                                return (value);
                                            },
                                            width: 120 
                                        },
                                        answer: {
                                            displayName: 'Answer',
                                            headerStyle: styles.headerDark,
                                            cellFormat: function(value, row) {
                                                return (value);
                                            },
                                            width: 120 
                                        }
                                    }
                                    var data = [];
                                    var speciftype = 0;
                                    if(noquestion.indexOf(question.questiontype) >= 0){
                                        outernext();
                                    } else {
                                        attemptanswer.find({questionid:question._id}, function(err, answers) {
                                            if (err){
                                                outernext();
                                            } else {
                                                if(answers && answers.length > 0){
                                                    var answercounter = 1;
                                                    var newanswers = answers.sort(function(a, b){
                                                        return a.createdtime-b.createdtime
                                                    })
                                                    asyncLoop(newanswers, function (aquestion, innernext)
                                                    {
                                                        var promis_getuser = new Promise(function(resolve, reject) {
                                                            if(aquestion.anonymous){
                                                                resolve({
                                                                    firstname:"Anonymous",
                                                                    lastname:""
                                                                })          
                                                            } else {
                                                                if(!aquestion.userid.includes("login")){
                                                                    users.findOne({"_id":aquestion.userid}, function(err, user){
                                                                        if(user){
                                                                            resolve({
                                                                                firstname:user.firstname,
                                                                                lastname:user.lastname
                                                                            })
                                                                        } else {
                                                                            resolve({
                                                                                firstname:"",
                                                                                lastname:""
                                                                            })
                                                                        }
                                                                    })
                                                                } else {
                                                                    if(aquestion.useremail){
                                                                        contactlistdata.findOne({"email":aquestion.useremail}, function(err, user){
                                                                            if(user){
                                                                                resolve({
                                                                                    firstname:user.firstname,
                                                                                    lastname:user.lastname
                                                                                })
                                                                            } else {
                                                                                resolve({
                                                                                    firstname:aquestion.useremail,
                                                                                    lastname:""
                                                                                })
                                                                            }
                                                                        })
                                                                    } else {
                                                                        resolve({
                                                                            firstname:"No Login",
                                                                            lastname:""
                                                                        })
                                                                    }
                                                                }
                                                            }                 
                                                        });
                                                        // var promis_getuser = new Promise(function(resolve, reject) {
                                                        //     users.findOne({'_id':aquestion.userid}, function(err, user){
                                                        //         if(err){
                                                        //             resolve({
                                                        //                 firstname:"without login",
                                                        //                 lastname:""
                                                        //             });
                                                        //         } else {
                                                        //             resolve(user)
                                                        //         }
                                                        //     })                
                                                        // });
                                                        Promise.all([promis_getuser]).then(function(promisdata) {
                                                            console.log("promisdata", promisdata);
                                                            var userdata = promisdata[0];
                                                            console.log("aquestion-", aquestion);
                                                            if(!aquestion.answer && !aquestion.otheranswer){
                                                                data.push({
                                                                    qno:answercounter,
                                                                    username:userdata.firstname+" "+userdata.lastname,
                                                                    dateanswered:dateFormat(aquestion.createdtime, "yyyy/mm/dd hh:MM ss TT"),
                                                                    answer:""
                                                                });
                                                                answercounter++;
                                                                innernext();
                                                            } else if(optionanswer.indexOf(question.questiontype) >= 0){
                                                                if(aquestion.otheranswer){
                                                                    data.push({
                                                                        qno:answercounter,
                                                                        username:userdata.firstname+" "+userdata.lastname,
                                                                        dateanswered:dateFormat(aquestion.createdtime, "yyyy/mm/dd hh:MM ss TT"),
                                                                        answer:aquestion.otheranswer
                                                                    });
                                                                    answercounter++;
                                                                    innernext();
                                                                } else {
                                                                    var givenanswer = JSON.parse(aquestion.answer);
                                                                    // console.log(givenanswer);
                                                                    if(!Array.isArray(givenanswer)){
                                                                        givenanswer = [givenanswer]
                                                                    }
                                                                    // console.log(givenanswer);
                                                                    var innans = [];
                                                                    asyncLoop(givenanswer, function (answer, innernext1){
                                                                        // console.log("single answer-", answer);
                                                                        
                                                                        questionoptions.findOne({_id:answer},{choicetext:1}, function(err, qoption) {
                                                                            if (qoption){
                                                                                data.push({
                                                                                    qno:answercounter,
                                                                                    username:userdata.firstname+" "+userdata.lastname,
                                                                                    dateanswered:dateFormat(aquestion.createdtime, "yyyy/mm/dd hh:MM ss TT"),
                                                                                    answer:qoption.choicetext
                                                                                });
                                                                                // innans.push(qoption.choicetext);
                                                                                innernext1();
                                                                            } else {
                                                                                innernext1();
                                                                            }
                                                                        })
                                                                    }, function (err)
                                                                    {
                                                                        answercounter++;
                                                                        data.push({
                                                                            qno:"",
                                                                            username:" ",
                                                                            dateanswered:"",
                                                                            answer:""
                                                                        });
                                                                        innernext();
                                                                    })
                                                                }
                                                            } else if(multitextanswer.indexOf(question.questiontype) >= 0){
                                                                speciftype = 1;
                                                                var givenanswer = JSON.parse(aquestion.answer);
                                                                var innans = [];
                                                                if(Array.isArray(givenanswer)){
                                                                    asyncLoop(givenanswer, function (answer, innernext1){
                                                                        // console.log("multi text- ", answer);
                                                                        if(!answer.answer){
                                                                            innernext1();
                                                                        }
                                                                        questionoptions.findOne({_id:answer.id},{choicetext:1}, function(err, qoption) {
                                                                            if (err){
                                                                                innernext1();
                                                                            }
                                                                            data.push({
                                                                                qno:answercounter,
                                                                                username:userdata.firstname+" "+userdata.lastname,
                                                                                dateanswered:dateFormat(aquestion.createdtime, "yyyy/mm/dd hh:MM ss TT"),
                                                                                subquestion:qoption.choicetext,
                                                                                answer:answer.answer
                                                                            });
                                                                            // innans.push(qoption.choicetext+"=>"+answer.answer);
                                                                            innernext1();
                                                                        })
                                                                    }, function (err)
                                                                    {
                                                                        data.push({
                                                                            qno:"",
                                                                            username:" ",
                                                                            dateanswered:"",
                                                                            subquestion:"",
                                                                            answer:""
                                                                        });
                                                                        answercounter++
                                                                        innernext();
                                                                    })
                                                                } else {
                                                                    innernext();
                                                                }
                                                            } else if(customformanswer.indexOf(question.questiontype) >= 0){
                                                                speciftype = 1;
                                                                var givenanswer = JSON.parse(aquestion.answer);
                                                                var innans = [];
                                                                if(Array.isArray(givenanswer)){
                                                                    asyncLoop(givenanswer, function (answer, innernext1){
                                                                        // console.log("custom form- ", answer);
                                                                        if(!answer.answer){
                                                                            innernext1();
                                                                        }
                                                                        questioncustomdata.findOne({_id:answer.id},{title:1}, function(err, qoption) {
                                                                            if (err){
                                                                                innernext1();
                                                                            }
                                                                            data.push({
                                                                                qno:answercounter,
                                                                                username:userdata.firstname+" "+userdata.lastname,
                                                                                dateanswered:dateFormat(aquestion.createdtime, "yyyy/mm/dd hh:MM ss TT"),
                                                                                subquestion:qoption.title,
                                                                                answer:answer.answer
                                                                            });
                                                                            // innans.push(qoption.title+"=>"+answer.answer);
                                                                            innernext1();
                                                                        })
                                                                    }, function (err)
                                                                    {
                                                                        data.push({
                                                                            qno:"",
                                                                            dateanswered:"",
                                                                            subquestion:"",
                                                                            subquestion:"",
                                                                            answer:""
                                                                        });
                                                                        answercounter++
                                                                        innernext();
                                                                    })
                                                                } else {
                                                                    innernext();
                                                                }
                                                            } else if(matrixquestion.indexOf(question.questiontype) >= 0){
                                                                speciftype = 1;
                                                                var givenanswer = JSON.parse(aquestion.answer);
                                                                if(Array.isArray(givenanswer)){
                                                                    asyncLoop(givenanswer, function (answer, innernext1){
                                                                        // console.log("custom form- ", answer);
                                                                        if(!answer.selected){
                                                                            innernext1();
                                                                        } else {
                                                                            questionmatrixrows.findOne({_id:answer.rowid},{option:1}, function(err, qrow) {
                                                                                if (err){
                                                                                    innernext1();
                                                                                } else {
                                                                                    questionmatrixcols.findOne({_id:answer.selected},{option:1}, function(errcol, qcol) {
                                                                                        if (errcol){
                                                                                            innernext1();
                                                                                        }
                                                                                        data.push({
                                                                                            qno:answercounter,
                                                                                            username:userdata.firstname+" "+userdata.lastname,
                                                                                            dateanswered:dateFormat(aquestion.createdtime, "yyyy/mm/dd hh:MM ss TT"),
                                                                                            subquestion:qrow.option,
                                                                                            answer:qcol.option
                                                                                        });
                                                                                        innernext1();
                                                                                    })
                                                                                }
                                                                                // innans.push(qoption.title+"=>"+answer.answer);
                                                                                // innernext1();
                                                                            })
                                                                        }
                                                                    }, function (err)
                                                                    {
                                                                        data.push({
                                                                            qno:"",
                                                                            subquestion:"",
                                                                            subquestion:"",
                                                                            subquestion:"",
                                                                            answer:""
                                                                        });
                                                                        answercounter++
                                                                        innernext();
                                                                    })
                                                                } else {
                                                                    innernext();
                                                                }
                                                                // data.push({
                                                                //     qno:answercounter,
                                                                //     answer:aquestion.answer
                                                                // });
                                                                // answercounter++;
                                                                // innernext();
                                                            } else {
                                                                data.push({
                                                                    qno:answercounter,
                                                                    username:userdata.firstname+" "+userdata.lastname,
                                                                    dateanswered:dateFormat(aquestion.createdtime, "yyyy/mm/dd hh:MM ss TT"),
                                                                    answer:JSON.parse(aquestion.answer)
                                                                });
                                                                answercounter++;
                                                                innernext();
                                                            }
                                                        }).catch(function(err) {
                                                            console.log('promiss all error', err)
                                                        });                                                        
                                                        // data.push({
                                                        //     qno:answerdata.length+1,
                                                        //     answer:answer.answer
                                                        // })
                                                        // innernext();
                                                    }, function (err)
                                                    {
                                                        var usedspecific = specification;
                                                        if(speciftype == 1){
                                                            usedspecific = specification1;
                                                        }
                                                        finalreport.push({
                                                            name: 'Question'+(finalreport.length+1),
                                                            heading: heading, 
                                                            merges: merges, 
                                                            specification: usedspecific,
                                                            data: data 
                                                        });
                                                        outernext();
                                                    });
                                                } else {
                                                    outernext();
                                                }
                                            }
                                            
                                        })
                                    }
                                } else {
                                    outernext();

                                }
                            })
                        }, function (err)
                        {
                            if (err)
                            {
                                console.error('Outer Error: ' + err.message);
                                return;
                            }
                            const report = excel.buildExport(
                                finalreport
                            );
                            // You can then return this straight
                            res.attachment('summaryreport.xlsx'); // This is sails.js specific (in general you need to set headers)
                            return res.send(report);
                        });
                    }
                })
            } else {
                // console.log("invalid response id");
                return res.send("invalid response id");
            }
        })
    } else {
        return res.send("Invalid call");
    }
});


router.route('/addreminder').post(function(req, res) {
    var reminderdata = req.body.reminderdata;
    surveyreminders.create(reminderdata,function(err, resdata) {
        if (err)
            res.status(400).send(err);
        res.json(resdata);
    });
});
router.route('/getallreminder')
.post(function(req, res) {
    var surveyid = req.body.surveyid;
    surveyreminders.find({"surveyid":surveyid},function(err, flowdata) {
        if (err)
            res.status(400).send(err);
        res.json(flowdata);
    });
});


router.route('/updatereminder')
.post(function(req, res) {
    var allreminderdata = req.body.allreminderdata;
    allreminderdata.forEach(reminderdata => {
        surveyreminders.findOneAndUpdate({_id:reminderdata._id},{
            days:reminderdata.days,
            initialshare:reminderdata.initialshare,
            partialresponse:reminderdata.partialresponse,
            noresponse:reminderdata.noresponse,
            modifieddate:Date.now()
         },function(status,result) {
           if(!empty(result)){
               console.log("flow data updated");
           }
        })
    });
    res.status(200).json({
        status: 1,
        message:"Updated",
    });
});


router.route('/deletereminder')
.post(function(req, res) {
    var reminderid = req.body.reminderid;
    surveyreminders.deleteOne({_id:reminderid},function(status, deleted) {
        res.status(200).json(deleted);
     });
});




router.route('/sendsurveyreminder')
.get(function(req, res) {
    var today = new Date();
    surveyreminders.find({},function(err, allreminder) {
        allreminder.forEach(reminder => {
            var notificationfor = "surveyreminder";
            var corntime = new Date();
            var initialshare = Date.parse(reminder.initialshare);
            var initialshareend = initialshare + (24*60*60*1000);
            var dateOffset = (24*60*60*1000) * reminder.days;
            corntime.setTime(initialshare + dateOffset);
            console.log("initialshare- ", initialshare);
            console.log("initialshareend- ", initialshareend);
            sharedsurveytolist.find({
                surveyid:reminder.surveyid,
                createddate:{
                    $gte :initialshare
                },
                createddate:{
                    $lte :initialshareend
                }
            }, function(err, allshare){
                console.log("allshare:- ", allshare);
                allshare.forEach(share => {
                    var surveycheck = new Promise(function(resolve, reject) {
                        surveys.findOne({
                            _id: share.surveyid,
                            delete:0
                        }, function(err, sres) {
                            if (err) {
                                resolve(null)
                            } else {
                                resolve(sres);
                            }
                        })
                    });
                    var surveyconfigcheck = new Promise(function(resolve, reject) {
                        surveyconfig.findOne({
                            surveyid: share.surveyid,
                            active:1
                        }, function(err, scres) {
                            if (err) {
                                resolve(null)
                            } else {
                                resolve(scres);
                            }
                        })
                    });
                    var contactlistcheck = new Promise(function(resolve, reject) {
                        contactlistdata.find({
                            listid: share.contactid
                        }, function(err, scres) {
                            if (err) {
                                resolve([])
                            } else {
                                resolve(scres);
                            }
                        })
                    });
                    var getalluserscheck = new Promise(function(resolve, reject) {
                        Promise.all([surveycheck, surveyconfigcheck, contactlistcheck]).then(function(results) {
                            var data_survey = results[0];
                            var data_surveyconfig = results[1]
                            var data_surveycontactlist = results[2]
                            if(data_survey && data_surveyconfig && data_surveycontactlist){
                                data_surveycontactlist.forEach(shareduser => {
                                    if(shareduser.userid == ""){
                                        notifictionsmailsdata.findOne({
                                            surveyid:data_survey._id,
                                            notificationfor:"5",
                                            toemail:shareduser.email,
                                            reminderid:reminder._id,
                                        }, function(err, resp){
                                            console.log("err- ", err);
                                            console.log("resp- ", resp);
                                            if(!resp){
                                                surveyattempt.findOne({
                                                    surveyid:data_survey._id,
                                                    useremail:shareduser.email,
                                                    state:1
                                                }, function(err, respatt){
                                                    if(!respatt){
                                                        workflowevents.sendsurveyreminder(share,data_survey, shareduser, reminder);
                                                    }
                                                })
                                            }
                                        }).catch(function(err){
                                            console.log("cathc error- ", err);
                                        })
                                    } else {
                                        notifictionsmailsdata.findOne({
                                            surveyid:data_survey._id,
                                            notificationfor:"5",
                                            touser:shareduser.userid,
                                            reminderid:reminder._id,
                                        }, function(err, resp){
                                            if(!resp){
                                                users.findOne({
                                                    _id:shareduser.userid
                                                }, function(err, realuser){
                                                    if(realuser){
                                                        surveyattempt.findOne({
                                                            surveyid:data_survey._id,
                                                            userid:realuser._id,
                                                            state:1
                                                        }, function(err, respatt){
                                                            if(!respatt){
                                                                workflowevents.sendsurveyreminder(share, data_survey, realuser, reminder);
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                });
                            }
                            // console.log("results- ", results);
                            resolve([]);
                        }).catch(function(err) {
                            resolve([]);
                        });
                    });
                    Promise.all([getalluserscheck]).then(function(results1) {
                        console.log("results1- ", results1);
                    }).catch(function(err) {
                        console.log("results1- ", err);
                    });
                });
            });
            console.log("reminder-", reminder);
        });

        res.json(allreminder);
    });
});























router.route('/getfiltertypequestion').post(function(req, res) {
    var surveyid = req.body.surveyid;
    var questiontype = ["multic","singlec","dropdown","numbertext","ratestars","ratescal"];
    var skippedquestion = ["descriptionbox","thankyoupage","welcomepage","sectionheading", "qtypeslider"]
    var allquestions = [];
    questionorder.find({'surveyid':surveyid}, function(err, questioninorder){
        var allgroup = []
        if(questioninorder.length > 0){
            allgroup = questioninorder.sort(function(a, b){
                return a.order-b.order
            })
        }
        var counter = 0;
        asyncLoop(allgroup, function (group, nextgroup){
            questions.findOne({"_id": group.questionid}, function(err, question){
                if(question && skippedquestion.indexOf(question.questiontype) < 0){
                    if(questiontype.indexOf(question.questiontype) >=0){
                        counter++
                        var pms_questionoptions = new Promise(function(resolve, reject) {
                            questionoptions.find({"questionid":question._id}, function(err, res){
                                resolve(res)
                            })
                        });
                        Promise.all([pms_questionoptions]).then(function(finalprimise) {
                            allquestions.push({
                                _id : question._id,
                                questiontype : question.questiontype,
                                questiontext : counter+". "+question.questiontext,
                                options : finalprimise[0]
                            });
                            nextgroup()
                        }).catch(function(err) {
                            nextgroup()
                        });
                    } else {
                        counter++;
                        nextgroup()
                    }
                } else {
                    nextgroup()
                }
            })
        }, function (err)
        {
            res.json(allquestions);
        });
    });
});


router.route('/getfiltereddata').post(function(req, res) {
    var surveyid = req.body.surveyid;
    var allcondition = req.body.questions;
    var allresponse = [];
    allcondition.forEach((element, i) => {
        if((!element.condition) || element.condition == "" || i == 0 ){
            allcondition[i].condition = "and"
        }
    });
    surveyattempt.find({surveyid:surveyid}, function(err, attempts){
        asyncLoop(attempts, function (attempt, next)
        {
            var usercheck = new Promise(function(resolve, reject) {
                if(attempt.userid.indexOf("login") < 0){
                    users.findOne({
                        _id:attempt.userid,
                    },
                    {
                        firstname:1,
                        lastname:1,
                        email:1
                    },
                    function(err, user) {
                        resolve(user);
                    }).catch(function(err) {
                        resolve(null);
                    });
                } else {
                    resolve({
                        firstname:(attempt.useremail == "")?"nologin":attempt.useremail,
                        lastname:"",
                        email:attempt.useremail,
                    })
                }
            });
            var questioncheck = new Promise(function(resolve, reject) {
                var allcheck = true;
                var matchcondition = [];
                asyncLoop(allcondition, function (condition, conditionnext)
                {
                    attemptanswer.findOne({attemptid:attempt._id, questionid:condition.question._id}, function(err, atmp_answer){
                        if(atmp_answer){
                            const answerp = JSON.parse(atmp_answer.answer);
                            if(answerp){
                               if(Array.isArray(answerp) && answerp.indexOf(condition.answer) < 0){
                                   allcheck = false;
                                   // next();
                                   conditionnext();
                                } else if(!Array.isArray(answerp) && answerp != condition.answer){
                                    allcheck = false;
                                    // next();
                                    conditionnext();
                                } else {
                                    console.log("matched- ", condition.condition)
                                    matchcondition.push(condition.condition)
                                    conditionnext();
                                }
                            } else {
                                allcheck = false;
                                // next();
                                conditionnext();
                            }
                        } else {
                            allcheck = false;
                            // next();
                            conditionnext();
                        }
                    }).catch(function(err) {
                        matchcondition.push(condition.condition)
                        conditionnext();
                    }); 
                }, function (err)
                {
                    const totaland = allcondition.filter(a => a.condition == 'and');
                    const totalor = allcondition.filter(a => a.condition == 'or');
                    const filterand = matchcondition.filter(a => a == 'and');
                    const filteror = matchcondition.filter(a => a == 'or');
                    const filterblank = matchcondition.filter(a => a == '');
                    // console.log("totalor.length- ", totalor.length);
                    // console.log("filteror.length- ", filteror.length);
                    // console.log("totaland.length- ", totaland.length);
                    // console.log("filterand.length- ", filterand.length);
                    // console.log("filterblank.length- ", filterblank.length);
                    
                    if(totalor.length != 0 && filteror.length > 0 ){
                        resolve(true)
                    } else if(totaland.length == filterand.length && totaland.length != 0 ) {
                        resolve(true)
                    } else if(filterblank.length > 0) {
                        resolve(true) 
                    } else {
                        resolve (false)
                    }
                });
            });
            Promise.all([usercheck,questioncheck]).then(function(results1) {
                console.log("questiondatacheck- ", results1);
                if(results1[1]){
                    allresponse.push({ 
                        _id: attempt._id,
                        user:results1[0],
                        useremail: attempt.useremail,
                        state: attempt.state,
                        approvedbyrev: attempt.approvedbyrev,
                        approvedrev: attempt.approvedrev,
                        approvedbyrevdate: attempt.approvedbyrevdate,
                        approvedbyedi: attempt.approvedbyedi,
                        approvededi: attempt.approvededi,
                        approvedbyedidate: attempt.approvedbyedidate,
                        completedby: attempt.completedby,
                        completed: attempt.completed,
                        completeddate: attempt.completeddate,
                        createdip: attempt.createdip,
                        datestarted: (attempt.datestarted)? dateFormat(attempt.datestarted, "yyyy/mm/dd"):"",
                        userid: attempt.userid,
                        surveyid: attempt.surveyid,
                        semesterid: attempt.semesterid,
                        datefinished: (attempt.datefinished)? dateFormat(attempt.datefinished, "yyyy/mm/dd"):"",
                        });
                }
                next();
            }).catch(function(err) {
                next();
            }); 
        }, function (err)
        {
            res.json(allresponse);
        });
    });
});
router.route('/getfiltereddataexcel').get(function(req, res) {
    var filterid = req.query.filterid;
    console.log("filterid- ", filterid);
    filterreportshistory.findOne({
        _id:filterid
    },function(err, filterdata) {
        console.log("filterdata- ", filterdata);
        
        if(filterdata){
            var surveyid = filterdata.surveyid;
            var allcondition = JSON.parse(filterdata.filterdata);
            var allresponse = [];
            allcondition.forEach((element, i) => {
                if((!element.condition) || element.condition == "" || i == 0 ){
                    allcondition[i].condition = "and"
                }
            });
            surveyattempt.find({surveyid:surveyid}, function(err, attempts){
                asyncLoop(attempts, function (attempt, next)
                {
                    var usercheck = new Promise(function(resolve, reject) {
                        if(attempt.userid.indexOf("login") < 0){
                            users.findOne({
                                _id:attempt.userid,
                            },
                            {
                                firstname:1,
                                lastname:1,
                                email:1
                            },
                            function(err, user) {
                                resolve(user);
                            }).catch(function(err) {
                                resolve(null);
                            });
                        } else {
                            resolve({
                                firstname:(attempt.useremail == "")?"nologin":attempt.useremail,
                                lastname:"",
                                email:attempt.useremail,
                            })
                        }
                    });
                    var questioncheck = new Promise(function(resolve, reject) {
                        var allcheck = true;
                        var matchcondition = [];
                        asyncLoop(allcondition, function (condition, conditionnext)
                        {
                            attemptanswer.findOne({attemptid:attempt._id, questionid:condition.question._id}, function(err, atmp_answer){
                                if(atmp_answer){
                                    const answerp = JSON.parse(atmp_answer.answer);
                                    if(answerp){
                                       if(Array.isArray(answerp) && answerp.indexOf(condition.answer) < 0){
                                           allcheck = false;
                                           // next();
                                           conditionnext();
                                        } else if(!Array.isArray(answerp) && answerp != condition.answer){
                                            allcheck = false;
                                            // next();
                                            conditionnext();
                                        } else {
                                            console.log("matched- ", condition.condition)
                                            matchcondition.push(condition.condition)
                                            conditionnext();
                                        }
                                    } else {
                                        allcheck = false;
                                        // next();
                                        conditionnext();
                                    }
                                } else {
                                    allcheck = false;
                                    // next();
                                    conditionnext();
                                }
                            }).catch(function(err) {
                                matchcondition.push(condition.condition)
                                conditionnext();
                            }); 
                        }, function (err)
                        {
                            const totaland = allcondition.filter(a => a.condition == 'and');
                            const totalor = allcondition.filter(a => a.condition == 'or');
                            const filterand = matchcondition.filter(a => a == 'and');
                            const filteror = matchcondition.filter(a => a == 'or');
                            const filterblank = matchcondition.filter(a => a == '');
                            // console.log("totalor.length- ", totalor.length);
                            // console.log("filteror.length- ", filteror.length);
                            // console.log("totaland.length- ", totaland.length);
                            // console.log("filterand.length- ", filterand.length);
                            // console.log("filterblank.length- ", filterblank.length);
                            
                            if(totalor.length != 0 && filteror.length > 0 ){
                                resolve(true)
                            } else if(totaland.length == filterand.length && totaland.length != 0 ) {
                                resolve(true)
                            } else if(filterblank.length > 0) {
                                resolve(true) 
                            } else {
                                resolve (false)
                            }
                        });
                    });
                    Promise.all([usercheck,questioncheck]).then(function(results1) {
                        if(results1[1]){
                            const userdata = results1[0];
                            allresponse.push({ 
                                qno: allresponse.length+1,
                                username:userdata.firstname + " " + userdata.lastname ,
                                useremail: attempt.useremail,
                                createdip: attempt.createdip,
                                datestarted: (attempt.datestarted)? dateFormat(attempt.datestarted, "yyyy/mm/dd"):"",
                                userid: attempt.userid,
                                surveyid: attempt.surveyid,
                                datefinished: (attempt.datefinished)? dateFormat(attempt.datefinished, "yyyy/mm/dd"):"",
                            });
                        }
                        next();
                    }).catch(function(err) {
                        next();
                    }); 
                }, function (err)
                {
                    const heading = [
                        [{value: 'Surveyname', style: excelstyles.headerDark}, {value: "surveydata.surveyname", style: excelstyles.datanormal}],
                        [{value: '', style: excelstyles.datanormal}],
                      ];
                      const specification = {
                        qno: { // <- the key should match the actual data key
                          displayName: 'Qno.', // <- Here you specify the column header
                          headerStyle: excelstyles.headerDark, // <- Header style
                          cellFormat: function(value, row) { // <- style renderer function
                            // if the status is 1 then color in green else color in red
                            // Notice how we use another cell value to style the current one
                            return (value); // <- Inline cell style is possible 
                        },
                        width: 120 // <- width in pixels
                        },
                        username: {
                          displayName: 'Username',
                          headerStyle: excelstyles.headerDark,
                          cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
                            return (value);
                          },
                          width: 120 // <- width in pixels
                        },
                        datestarted: {
                            displayName: 'Start date',
                            headerStyle: excelstyles.headerDark,
                            width: 120 // <- width in pixels
                        },
                        datefinished: {
                            displayName: 'End date',
                            headerStyle: excelstyles.headerDark,
                            width: 120 // <- width in pixels
                        }
                    }
                    const merges = []
                    const report = excel.buildExport(
                        [ 
                            {
                                name: 'Report1', // <- Specify sheet name (optional)
                                heading: heading, // <- Raw heading array (optional)
                                merges: merges, // <- Merge cell ranges
                                specification: specification, // <- Report specification
                                data: allresponse // <-- Report data
                            }
                        ]
                    );
                    res.attachment('Filterreport.xlsx'); // This is sails.js specific (in general you need to set headers)
                    return res.send(report);
                    // res.send(allresponse);
                });
            });
        } else {
            res.send("Invalid request");

        }
    });
});
router.route('/savesurveyfilter')
.post(function(req, res) {
    var surveyid = req.body.surveyid;
    var filtername = req.body.filtername;
    var filterdata = req.body.filterdata;
    var createdby = req.body.createdby;
    var saved = 0;
    if(filtername){
        saved = 1;
    }
    filterreportshistory.create({
        surveyid:surveyid,
        filtername:filtername,
        filterdata:JSON.stringify(filterdata),
        createdby:createdby,
        saved:saved,
    },function(err, resdata) {
        res.send(resdata);
    });
});
router.route('/updatesurveyfilter')
.post(function(req, res) {
    var filterid = req.body.filterid;
    var filterdata = req.body.filterdata;
    filterreportshistory.findOneAndUpdate({
        _id:filterid
    },{
        filterdata:JSON.stringify(filterdata),
    },function(err, resdata) {
        res.send(resdata);
    });
});
router.route('/getfilters')
.post(function(req, res) {
    var surveyid = req.body.surveyid;
    filterreportshistory.find({
        surveyid:surveyid,
        saved:1
    },function(err, resdata) {
        // console.log("resdata- ", resdata);
        // asyncLoop(resdata, function (filterdata, next)
        // {
        //     console.log("filterdata- ", filterdata);
        // }, function (err)
        // {
        //     // res.send(resdata);
        // });
        
        res.send(resdata);
    });
});


router.route('/addmedia')
.post(function(req, res) {
    medialibrary.create(req.body, function(err, resdata) {
        res.json(resdata);
    });
});
router.route('/getallmedia')
.post(function(req, res) {
    medialibrary.find({}, function(err, resdata) {
        res.json(resdata);
    });
});
router.route('/updatemedia')
.post(function(req, res) {
    medialibrary.findOneAndUpdate({_id:req.body.id},{filename:req.body.filename, public:req.body.public}, function(err, resdata) {
        res.json(resdata);
    });
});
router.route('/deletemedia')
.post(function(req, res) {
    medialibrary.deleteOne({_id:req.body.id, filepath:req.body.filepath},function(status, deleted) {
        if(deleted.n){
            fs.unlink("."+req.body.filepath,(err) => {
                console.log(err);
            })
        }
        res.json(deleted);
    });
});


   router.route('/getquestioncomments').post(function(req, res) {
    var questionid = req.body.questionid;
    var attemptid = req.body.attemptid;
    questioncomments.findOne({
       attemptid: attemptid,
       questionid: questionid
   }, function(err, result) {
           res.json(result)
   })
});
router.route('/submitquestioncomments').post(function(req, res) {
    var questionid = req.body.questionid;
    var attemptid = req.body.attemptid;
    var commenttext = req.body.commenttext;
    questioncomments.findOneAndUpdate({
        attemptid: attemptid,
        questionid: questionid
     },{
        attemptid: attemptid,
        questionid: questionid,
        comment:commenttext
     },{
        upsert: true
    }, function(err, result) {
        res.json(result)
    })
});

 router.route('/updatequestionothercomment')
  .post(function(req, res) {
     try{
         var questionid = req.body.questionid;
         var othertext = req.body.othertext;
         var commenttext = req.body.commenttext;
         questions.findOneAndUpdate({_id:questionid},{
            commenttext:commenttext,
            othertext:othertext
         },function(status,result) {
             if(!empty(result)){
             res.status(200).json({
                 status: 1,
                 message:"Updated",
             });
             } else {
             res.status(200).json({
                 status:0,
                 message:"Failed"
             });
             }
         });
     } catch(e){
         console.log('catch update question', e);
         res.status(500).json(e);
     }
 });

router.route('/updatequestionhavecomment')
.post(function(req, res) {
   try{
       var questionid = req.body.questionid;
       var havecomment = req.body.havecomment;
       questions.findOneAndUpdate({_id:questionid},{
        havecomment:havecomment
       },function(status,result) {
           if(!empty(result)){
           res.status(200).json({
               status: 1,
               message:"Updated",
           });
           } else {
           res.status(200).json({
               status:0,
               message:"Failed"
           });
           }
       });
   } catch(e){
       res.status(500).json(e);
       console.log('catch update question', e);
   }
});


router.route('/getexceptionreportlist').post(function(req, res) {
    try{
        var surveyid = req.body.surveyid;
        var contactid = req.body.contactd;
        var allresponse = []
        var noresponse = []
        contactlistdata.find({"listid":contactid}, function(err, alldata){
            if(alldata){
                asyncLoop(alldata, function (contact, nextcontact){
                    var pms_userdata = new Promise(function(resolve, reject) {
                        users.findOne({"email":contact.email},{password:0}, function(err, userdata){
                            console.log("userdata- ", userdata)
                            if(userdata){
                                resolve({
                                    userid:userdata._id,
                                    firstname:userdata.firstname,
                                    lastname:userdata.lastname,
                                    email:userdata.email
                                })
                            } else {
                                resolve(contact)
                            }
                        })
                    });
                    Promise.all([pms_userdata]).then(function(finalprimise) {
                        var pms_userdata = finalprimise[0];
                        var attemptfilter = {
                            surveyid:surveyid,
                            $or:[
                                {userid:pms_userdata.userid},
                                {useremail:pms_userdata.email}
                            ]
                        }
                        console.log("attemptfilter- ", attemptfilter)
                        surveyattempt.find(attemptfilter,function(err, responselist) {
                            if(responselist.length > 0){
                                asyncLoop(responselist, function (attempt, nextresponse){
                                    allresponse.push({
                                        useremail: attempt.useremail,
                                        state: attempt.state,
                                        approvedbyrev: attempt.approvedbyrev,
                                        approvedrev: attempt.approvedrev,
                                        approvedbyrevdate: attempt.approvedbyrevdate,
                                        approvedbyedi: attempt.approvedbyedi,
                                        approvededi: attempt.approvededi,
                                        approvedbyedidate: attempt.approvedbyedidate,
                                        completedby: attempt.completedby,
                                        completed: attempt.completed,
                                        completeddate: attempt.completeddate,
                                        createdip: attempt.createdip,
                                        datestarted: attempt.datestarted,
                                        userdetails:pms_userdata,
                                        _id: attempt._id,
                                        userid: attempt.userid,
                                        surveyid: attempt.surveyid,
                                        semesterid: attempt.semesterid,
                                        datefinished: attempt.datefinished,
                                    })
                                    nextresponse()
                                }, function (err)
                                {
                                    nextcontact()
                                });
                            } else {
                                allresponse.push({
                                    useremail: "",
                                    state: 0,
                                    approvedbyrev: "",
                                    approvedrev: 0,
                                    approvedbyrevdate: 0,
                                    approvedbyedi: "",
                                    approvededi: 0,
                                    approvedbyedidate: 0,
                                    completedby: "",
                                    completed: 0,
                                    completeddate: 0,
                                    createdip: "",
                                    datestarted: 0,
                                    userdetails:contact,
                                    _id: "",
                                    userid: "",
                                    surveyid: surveyid,
                                    semesterid: "",
                                    datefinished: 0,
                                })
                                noresponse = noresponse.concat(contact)
                                nextcontact()
                            }
                        })
                    }).catch(function(err) {
                        console.log("cache error - ", err);
                        nextcontact()
                    });
                    
                }, function (err)
                {
                    console.log('Loop Finished', err);
                    res.status(200).send({
                        allresponse:allresponse,
                        noresponse:noresponse
                    });
                });
            } else {
                console.log('No contact Finished');
                res.status(200).send({
                    allresponse:allresponse,
                    noresponse:noresponse
                });
            }
        })
   } catch(e){
       console.log('catch update question', e);
       res.status(500).json(e);
   }
});





router.route('/getallresponsedataexcel').get(function(req, res) {
    var respid = req.query.surveyid;
    var attemptids = "";
    if(req.query.ids){
        attemptids = req.query.ids.split(",")
    }
    var onlydata = req.query.onlydata;
    var optionanswer =["multic","singlec","dropdown"];
    var multitextanswer =["multipletext"];
    var customformanswer =["customform"];
    var matrixquestion =["matrixquestion"];
    var Arr_displayquesdrtions = ["multic","multipletext", "ranking", "matrixquestion", "customform"]
    var skippedquestion = ["descriptionbox","thankyoupage","welcomepage","sectionheading", "qtypeslider"]
    if(respid){
        surveys.findOne({"_id": respid}, function(err, surveydata){
            if(surveydata){
                var this_questions = [];
                var surveyquestions = new Promise(function(resolve, reject) {
                    var allquestions = [];
                    questionorder.find({'surveyid':respid}, function(err, questioninorder){
                        var allgroup = []
                        if(questioninorder.length > 0){
                            allgroup = questioninorder.sort(function(a, b){
                                return a.order-b.order
                            })
                        }
                        asyncLoop(allgroup, function (group, nextgroup){
                            questions.findOne({"_id": group.questionid}, function(err, question){
                                var pms_questionoptions = new Promise(function(resolve, reject) {
                                    questionoptions.find({"questionid":question._id}, function(err, res){
                                        resolve(res)
                                    })
                                });
                                var pms_questionmatrixrows = new Promise(function(resolve, reject) {
                                    questionmatrixrows.find({"questionid":question._id}, function(err, res){
                                        resolve(res)
                                    })
                                });
                                var pms_questionmatrixcols = new Promise(function(resolve, reject) {
                                    questionmatrixcols.find({"questionid":question._id}, function(err, res){
                                        resolve(res)
                                    })
                                });
                                var pms_questioncustomdata = new Promise(function(resolve, reject) {
                                    questioncustomdata.find({"questionid":question._id}, function(err, res){
                                        resolve(res)
                                    })
                                });
                                Promise.all([pms_questionoptions, pms_questionmatrixrows, pms_questionmatrixcols, pms_questioncustomdata]).then(function(finalprimise) {
                                    allquestions.push({
                                        question:question,
                                        options:finalprimise[0],
                                        rows:finalprimise[1],
                                        cols:finalprimise[2],
                                        custom:finalprimise[3]
                                    })
                                    nextgroup()
                                }).catch(function(err) {
                                    console.log("cache error - ", err);
                                    nextgroup()
                                });
                            })
                        }, function (err)
                        {
                            this_questions = allquestions;
                            console.log("Question loop finished");
                            resolve(allquestions)
                        });
                    });
                });
                var excelheader = new Promise(function(resolve, reject) {
                    Promise.all([surveyquestions]).then(function(finalprimise) {
                        var allquestion = finalprimise[0];
                        var heading1 = [
                            {value: 'Respondent ID', style: excelstyles.greenLight},
                            {value: 'Start Date', style: excelstyles.greenLight},
                            {value: 'End Date', style: excelstyles.greenLight},
                            {value: 'Email', style: excelstyles.greenLight},
                            {value: 'First Name', style: excelstyles.greenLight},
                            {value: 'Last Name', style: excelstyles.greenLight},
                        ];
                        var heading2 = [
                            {value: '', style: excelstyles.lightCyan},
                            {value: '', style: excelstyles.lightCyan},
                            {value: '', style: excelstyles.lightCyan},
                            {value: '', style: excelstyles.lightCyan},
                            {value: '', style: excelstyles.lightCyan},
                            {value: '', style: excelstyles.lightCyan},
                        ];
                        // console.log("total allquestion- in header ", allquestion.length);
                        var counter = 0;
                        asyncLoop(allquestion, function (question, nextquestion){
                            var this_question =question.question; 
                            var alloption = question.options;
                            var allrows = question.rows;
                            var allcustom = question.custom;
                            if(this_question.questiontext =="" || skippedquestion.indexOf(this_question.questiontype) >= 0){
                                nextquestion();
                            } else {
                                if(Arr_displayquesdrtions.indexOf(this_question.questiontype) < 0){
                                    heading1.push({value: this_question.questiontext, style: excelstyles.greenLight})
                                    heading2.push({value: "Response", style: excelstyles.lightCyan})
                                } else {
                                    heading1.push({value: this_question.questiontext, style: excelstyles.greenLight})
                                    if(optionanswer.indexOf(this_question.questiontype) >= 0 || this_question.questiontype == "ranking" || this_question.questiontype == "multipletext"){
                                        alloption.forEach((element, i) => {
                                            if(element.choicetext != "" || this_question.questiontype == "multipletext"){
                                                if(i != 0){
                                                    heading1.push({value: "", style: excelstyles.greenLight})
                                                }
                                                heading2.push({value: element.choicetext, style: excelstyles.lightCyan})
                                            } 
                                        });
                                    } else if(customformanswer.indexOf(this_question.questiontype) >= 0){
                                        allcustom.forEach((element, i) => {
                                            if(element.title != ""){
                                                if(i != 0){
                                                    heading1.push({value: "", style: excelstyles.greenLight})
                                                }
                                                heading2.push({value: element.title, style: excelstyles.lightCyan})
                                            } 
                                        });
                                    } else if(matrixquestion.indexOf(this_question.questiontype) >= 0){
                                        allrows.forEach((element, i) => {
                                            if(element.option != ""){
                                                if(i != 0){
                                                    heading1.push({value: "", style: excelstyles.greenLight})
                                                }
                                                heading2.push({value: element.option, style: excelstyles.lightCyan})
                                            } 
                                        });
                                    } else {
    
                                    }
                                }
                                if(this_question.other){
                                    heading1.push({value: this_question.othertext, style: excelstyles.greenLight})
                                    heading2.push({value: "Other", style: excelstyles.lightCyan})
                                }
                                if(this_question.havecomment){
                                    heading1.push({value: this_question.commenttext, style: excelstyles.greenLight})
                                    heading2.push({value: "Comments", style: excelstyles.lightCyan})
                                }
                                
                                nextquestion();
                            }
                        }, function (err)
                        {
                            console.log("header allquestion finished");
                            resolve([heading1, heading2])
                        });
                    }).catch(function(err) {
                        // console.log("header allquestion catch", err);
                        resolve([])
                    }); 
                });
                var exceldata = new Promise(function(resolve, reject) {
                    var alldata = []
                    var dataquery = {}
                    dataquery.surveyid = respid
                    if(Array.isArray(attemptids)){
                        dataquery._id = {$in:attemptids};
                    }
                    console.log("attempt filter query - ", dataquery)
                    surveyattempt.find(dataquery, function(err, attempts){
                        asyncLoop(attempts, function (attempt, nextattempt){
                            var pms_userdata = new Promise(function(resolve, reject) {
                                var this_user = {
                                    _id:"",
                                    firstname:"",
                                    lastname:"",
                                    email:""
                                }
                                if(attempt.anonymous){
                                    attempt.createdip = "Anonymous"
                                    this_user._id="_nologin"
                                    this_user.firstname="Anonymous "
                                    this_user.lastname=" "
                                    this_user.email="Anonymous"
                                    resolve(this_user);
                                }else{
                                    if(!attempt.userid.includes("login")){
                                        this_user._id=attempt.userid
                                        users.findOne({"_id":attempt.userid}, function(err, userres){
                                            if(userres){
                                                resolve(userres);
                                            } else {
                                                resolve(this_user);
                                            }
                                        })
                                    } else {
                                        if(attempt.useremail){
                                            this_user._id=attempt.userid
                                            this_user.firstname="firstname"
                                            this_user.lastname="lastname"
                                            this_user.email=attempt.useremail
                                            resolve(this_user);
                                        } else {
                                            this_user._id=attempt.userid
                                            this_user.firstname="No "
                                            this_user.lastname="Login "
                                            this_user.email="No email"
                                            resolve(this_user);
                                        }
                                    }
                                }
                            });
                            Promise.all([pms_userdata, surveyquestions]).then(function(finalprimise) {
                                var allquestion = finalprimise[1];
                                // console.log("this_questions- ", allquestion)
                                const thisuser = finalprimise[0]
                                var this_attempt = [];
                                this_attempt['val0'] = attempt.userid
                                this_attempt['val1'] = (attempt.datestarted)? dateFormat(attempt.datestarted, "yyyy/mm/dd hh:MM ss TT"):"",
                                this_attempt['val2'] = (attempt.datestarted)? dateFormat(attempt.datefinished, "yyyy/mm/dd hh:MM ss TT"):"",
                                this_attempt['val3'] = thisuser.email
                                this_attempt['val4'] = thisuser.firstname
                                this_attempt['val5'] = thisuser.lastname
                                var counter = 6;
                                //     var thisattempt =  Object.assign({}, this_attempt);
                                //     alldata.push(thisattempt)
                                // nextattempt()

                                console.log("allquestion- ", allquestion);

                                asyncLoop(allquestion, function (questiondata, nextquestion){
                                    var question =questiondata.question; 
                                    var alloption = questiondata.options;
                                    var allrows = questiondata.rows;
                                    // console.log("question- ", question);
                                    
                                    var allcols = questiondata.cols;
                                    var allcustom = questiondata.custom;
                                    var otherselection = "otherselected";
                                    var commententry = "commententry";
                                    var questionindex = "commententry";
                                    if(question.questiontext == "" || skippedquestion.indexOf(question.questiontype) >= 0){
                                        nextquestion();
                                    } else {
                                        if(Arr_displayquesdrtions.indexOf(question.questiontype)<0){
                                            questionindex = 'val'+(counter++);
                                        } else {
                                            questionindex = 'val'+counter;
                                        }
                                        attemptanswer.findOne({questionid:question._id, attemptid:attempt._id}, function(err, answerres){
                                            // console.log("answerres- ", answerres);
                                            // console.log("questiontype- "+counter+"-------------------------------------------------------------", question.questiontype);
                                            if(answerres){
                                                if(answerres.answer){
                                                    var answer = JSON.parse(answerres.answer);
                                                }
                                                if(answerres.otheranswer){
                                                    var answer = answerres.otheranswer;
                                                    // this_attempt[otherselection] = answer 
                                                }
                                                if(optionanswer.indexOf(question.questiontype) >= 0){
                                                    var answerfound = false;
                                                    if(Arr_displayquesdrtions.indexOf(question.questiontype)<0){
                                                        this_attempt[questionindex] = ""
                                                    }
                                                    alloption.forEach((element, i) => {
                                                        if(element.choicetext != ""){
                                                            // console.log("option answer-", answer);
                                                            const found = answer.indexOf(element._id.toString())
                                                            // console.log("option answer found-", found);
                                                            if(Arr_displayquesdrtions.indexOf(question.questiontype)<0){
                                                                if(found != -1 && !answerfound){
                                                                    answerfound = true
                                                                    this_attempt[questionindex] = element.choicetext 
                                                                }
                                                            } else {
                                                                if(found != -1){
                                                                    this_attempt['val'+(counter++)] = element.choicetext 
                                                                } else {
                                                                    this_attempt['val'+(counter++)] = ""
                                                                }
                                                            }
                                                        } 
                                                    });
                                                } else if(question.questiontype == "multipletext"){
                                                    alloption.forEach((element, i) => {
                                                        const found = answer.find( a => a.id == element._id );
                                                        if(found){
                                                            this_attempt['val'+(counter++)] = found.answer 
                                                        } else {
                                                            this_attempt['val'+(counter++)] = "" 
                                                        }
                                                    });
                                                } else if(question.questiontype == "ranking"){
                                                    alloption.forEach((element, i) => {
                                                        if(element.choicetext != ""){
                                                            // console.log("Raking =", answer);
                                                            
                                                            const found = answer.find( a => a.option == element._id );
                                                            if(found){
                                                                this_attempt['val'+(counter++)] = found.rank 
                                                            } else {
                                                                this_attempt['val'+(counter++)] = "" 
                                                            }
                                                        } 
                                                    });
                                                } else if(matrixquestion.indexOf(question.questiontype) >= 0){
                                                    // console.log("Metrix questions- ");
                                                    allrows.forEach((element, i) => {
                                                        if(element.option != ""){
                                                            const found = answer.find( a => a. rowid == element._id );
                                                            if(found){
                                                                const found1 = allcols.find( a => a._id == found.selected );
                                                                if(found1){
                                                                    this_attempt['val'+(counter++)] = found1.option 
                                                                }
                                                            } else {
                                                                this_attempt['val'+(counter++)] = "" 
                                                            }
                                                        } else {
                                                            this_attempt['val'+(counter++)] = "" 
                                                        }  
                                                    });
                                                } else if(customformanswer.indexOf(question.questiontype) >= 0){
                                                    allcustom.forEach((element, i) => {
                                                        if(element.title != ""){
                                                            const found = answer.find( a => a.id == element._id );
                                                            if(found){
                                                                this_attempt['val'+(counter++)] = found.answer 
                                                            } else {
                                                                this_attempt['val'+(counter++)] = "" 
                                                            }
                                                        } 
                                                    });
                                                } else if(question.questiontype == 'fileupload') {
                                                    if(answer){
                                                        this_attempt[questionindex] = req.headers.host+"/public?file="+answer
                                                    } else {
                                                        this_attempt[questionindex] = ""
                                                    }
                                                } else {
                                                    this_attempt[questionindex] = answer
                                                }
                                            } else {
                                                if(optionanswer.indexOf(question.questiontype) >= 0 || question.questiontype == "ranking" || question.questiontype == "multipletext"){
                                                    if(Arr_displayquesdrtions.indexOf(question.questiontype)<0){
                                                        // counter++
                                                         // this_attempt[questionindex] = "s option"
                                                    } else {
                                                        alloption.forEach((element, i) => {
                                                            if(element.choicetext != "" || question.questiontype == "multipletext"){
                                                                // this_attempt['val'+(counter)] = "option"+i
                                                                counter++
                                                            } 
                                                        });
                                                    }
                                                } else if(customformanswer.indexOf(question.questiontype) >= 0){
                                                    allcustom.forEach((element, i) => {
                                                        if(element.title != ""){
                                                            // this_attempt['val'+(counter)] = "custom"+i
                                                            counter++
                                                        } 
                                                    });
                                                } else if(matrixquestion.indexOf(question.questiontype) >= 0){
                                                    allrows.forEach((element, i) => {
                                                        if(element.option != ""){
                                                            // this_attempt['val'+(counter)] = "row"+i
                                                            counter++
                                                        } 
                                                    });
                                                } else {
                
                                                }
                                            }
                                            if(question.other){
                                                otherselection = 'val'+(counter++)
                                            }
                                            if(question.havecomment){
                                                commententry = 'val'+(counter++);
                                            }
                                            if(answerres && answerres.otheranswer){
                                                var answer = answerres.otheranswer;
                                                this_attempt[otherselection] = answer 
                                            }
                                            questioncomments.findOne({questionid:question._id, attemptid:attempt._id}, function(err, commentres){
                                                if(commentres){
                                                    this_attempt[commententry] = commentres.comment 
                                                }
                                                nextquestion();
                                            })
                                        })
                                    }
                                }, function (err)
                                {
                                    // console.log("this_attempt-", this_attempt);
                                    
                                    var thisattempt =  Object.assign({}, this_attempt);
                                    // console.log("thisattempt-", thisattempt);
                                    alldata.push(thisattempt)
                                    nextattempt();
                                });
                            }).catch(function(err) {
                                console.log("header allquestion catch", err);
                                nextattempt()
                            }); 
                        }, function (err)
                        {
                            console.log("alldata finished");
                            resolve(alldata)
                        });
                    });
                });
                Promise.all([excelheader,exceldata]).then(function(finalprimise1) {
                    var excelheader = finalprimise1[0]
                    // var specification1 = finalprimise1[0].specific
                    var exceldata = finalprimise1[1]
                    console.log("exceldata-", exceldata );
                    // console.log("exceldata-", req.headers.host );
                    
                    var specification1 = []
                    for (let index = 0; index < excelheader[1].length; index++) {
                        // console.log("header 2", excelheader[1][index].value);
                        specification1["val"+index] = {
                            displayName: excelheader[1][index].value,
                            // displayName: 'val-'+index,
                            headerStyle: excelstyles.lightCyan,
                            cellStyle: excelstyles.datanormal,
                            cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
                                return (value) ? value : '';
                            },
                            width: 220 
                        }
                    }
                    var specification2  = Object.assign({}, specification1);
                    // console.log("specification2- ", specification2);
                    if(onlydata){
                        return res.send({
                            headers:excelheader,
                            exceldata:exceldata
                        });
                    } else {
                        const report = excel.buildExport(
                            [ 
                                {
                                    name: 'allresponse', // <- Specify sheet name (optional)
                                    heading: [excelheader[0]], // <- Raw heading array (optional)
                                    merges: [], // <- Merge cell ranges
                                    specification: specification2, // <- Report specification
                                    data: exceldata // <-- Report data
                                }
                            ]
                        );
                        res.attachment('allresponse'+Date.now()+'.xlsx'); // This is sails.js specific (in general you need to set headers)
                        return res.send(report);

                    }
                    // return res.send(specification2);
                    // return res.send(finalprimise1);
                }).catch(function(err) {
                    console.log("final promiss all Exec Failed - ", err)
                    return res.send("Exec Failed");
                }); 

            } else {
                return res.send("invalid response id");
            }
        })
    } else {
        return res.send("Invalid call");
    }
});




router.route('/deleteproject')
.post(function(req, res) {
   var projectid = req.body.projectid;
   surveys.find({"category":projectid}, function(err, slist){
        if(err){
            res.send({
                status:0,
                message:"Failed to delete project"
            });
        } else if(slist.length > 0) {
            res.send({
                status:1,
                message:"Project is not empty"
            });
        } else {
            projects.deleteOne({"_id":projectid},function(status, deleted) {
                res.send({
                    status:2,
                    message:"Project is deleted"
                });
             })
        }
   })
});


router.route('/summaryreportpdf').get(function(req, res) {
    summaryexport.summaryreportpdf(req, res,"pdf");
})
router.route('/summaryreportexcel').get(function(req, res) {
    summaryexport.summaryreportpdf(req, res,"excel");
})
router.route('/summaryreportpdf1').get(function(req, res) {
    summaryexport.summaryreportpdf1(req, res,"pdf");
})
router.route('/summaryreportexcel1').get(function(req, res) {
    summaryexport.summaryreportpdf1(req, res,"excel");
})
router.route('/sendreminders').get(function(req, res) {
    allcrons.sendreminderemails();
    res.send("Reminder cron is running");
});

router.route('/testchart').get(function(req, res) {
    summaryexport.testchartjs(req, res);
});


router.route('/updatequestionmaskformat')
.post(function(req, res) {
   try{
       var questionid = req.body.questionid;
       var maskformat = req.body.maskformat;
       questions.findOneAndUpdate({_id:questionid},{
            maskformat:maskformat
       },function(status,result) {
           if(!empty(result)){
           res.status(200).json({
               status: 1,
               message:"Updated",
           });
           } else {
           res.status(200).json({
               status:0,
               message:"Failed"
           });
           }
       });
   } catch(e){
       console.log('catch update question', e);
       res.status(500).json(e);
   }
});

router.route('/checkallquestionattempt').post(function(req, res) {
    try{
        var surveyid = req.body.surveyid;
        var attemptid = req.body.attemptid;
        questions.find({surveyid:surveyid, required:"1", questiontext:{ $ne : "" } },function(status,result) {
            if(!empty(result)){
                allquestionid = []
                result.forEach(q => {
                    allquestionid.push(q._id);
                });
                console.log("total required question", allquestionid.length);
                
                attemptanswer.find({attemptid:attemptid ,questionid: { $in : allquestionid }},function(status,answered) {
                    if(!empty(answered)){
                        console.log("total answered", answered.length);
                        allansweredid = []
                        answered.forEach(qa => {
                            const answer = JSON.parse(qa.answer);
                            const otheranswer = qa.otheranswer;
                            console.log("answer- ", answer);
                            console.log("otheranswer- ", otheranswer);
                            
                            if(otheranswer.length > 0 || answer.length > 0 || answer || answer===0){
                                allansweredid.push(qa._id);
                            } else {
                                console.log("qa- ", qa);
                                   
                            }
                        });
                        console.log("allansweredid- ", allansweredid);
                        console.log("total answered question", allansweredid.length);
                        if(allquestionid.length == allansweredid.length){
                            res.status(200).json("1");
                        } else {
                            res.status(200).json("0");
                        }
                    } else {
                        res.status(200).json("0");
                    }
                });
            } else {
                res.status(200).json("1");
            }
        });
    } catch(e){
        res.status(200).json("0");
    }
});


router.route('/getsentreminder').post(function(req, res) {
    try{
        var surveyid = req.body.surveyid;
        var remtype = req.body.remtype;
        var query = {}
        if(surveyid){
            query.surveyid = surveyid
        }
        if(remtype){
            query.notificationfor = remtype
        }
        console.log("query= ", query)
        notifictionsmailsdata.find(query,function(status,result) {
            console.log("result- ", result)
            if(!empty(result)){
                var allmails = []
                asyncLoop(result, function (maildata, nextmail){
                    var sdata = {};
                    sdata._id = maildata._id
                    sdata.toemail = maildata.toemail
                    sdata.surveyid = maildata.surveyid
                    sdata.reminderid = maildata.reminderid
                    sdata.notificationfor = maildata.notificationfor
                    sdata.data = maildata.data
                    sdata.createddate = maildata.createddate
                    var pms_survey = new Promise(function(resolve, reject) {
                        surveys.findOne({"_id":maildata.surveyid}, function(err, res){
                            resolve(res)
                        })
                    });
                    var pms_user = new Promise(function(resolve, reject) {
                        users.findOne({"email":maildata.toemail}, function(err, res){
                            if(res){
                                resolve(res)
                            } else {
                                contactlistdata.findOne({"email":maildata.toemail}, function(err, res1){
                                    if(res1){
                                        resolve(res1)
                                    } else {
                                        resolve({
                                            firstname:"",
                                            lastname:"",
                                            email:maildata.toemail
                                        })
                                    }
                                })
                            }
                        })
                    });
                    Promise.all([pms_survey, pms_user]).then(function(finalprimise) {
                        const surveydata = finalprimise[0]
                        const userdata = finalprimise[1]
                        sdata.surveyname = ""
                        sdata.username = ""
                        if(surveydata){
                            sdata.surveyname = surveydata.surveyname
                        }
                        if(surveydata){
                            sdata.username = userdata.firstname +" "+userdata.lastname
                        }
                        allmails.push(sdata)
                        nextmail()
                    }).catch(function(err) {
                        console.log("cache error - ", err);
                        nextmail()
                    });
                }, function (err)
                {
                    res.status(200).json(allmails);
                });
            } else {
                 res.status(200).json([]);
            }
        });
    } catch(e){
        res.status(500).json([]);
    }
 });
  router.route('/getallsurveys')
 .post(function(req, res) {
     var projectid = req.body.projectid
     surveys.find({category:projectid}, function(err, allsurveys) {
         if (err)
             res.send([]);
         res.json(allsurveys);
     });
 });


router.route('/getsentmaildetails').post(function(req, res) {
    try {
        var mailid = req.body.mailid;
        notifictionsmailsdata.findOne({_id:mailid},function(status,maildata) {
            if(!empty(maildata)){
                var sdata = {};
                sdata._id = maildata._id
                sdata.toemail = maildata.toemail
                sdata.surveyid = maildata.surveyid
                sdata.reminderid = maildata.reminderid
                sdata.notificationfor = maildata.notificationfor
                sdata.data = maildata.data
                sdata.createddate = maildata.createddate
                sdata.date = dateFormat(maildata.createddate,"yyyy/mm/dd hh:MM:ss TT")
                var pms_survey = new Promise(function(resolve, reject) {
                    surveys.findOne({"_id":maildata.surveyid}, function(err, res){
                        resolve(res)
                    })
                });
                var pms_user = new Promise(function(resolve, reject) {
                    users.findOne({"email":maildata.toemail}, function(err, res){
                        if(res){
                            resolve(res)
                        } else {
                            contactlistdata.findOne({"email":maildata.toemail}, function(err, res1){
                                if(res1){
                                    resolve(res1)
                                } else {
                                    resolve({
                                        firstname:"",
                                        lastname:"",
                                        email:maildata.toemail
                                    })
                                }
                            })
                        }
                    })
                });
                Promise.all([pms_survey, pms_user]).then(function(finalprimise) {
                    const surveydata = finalprimise[0]
                    const userdata = finalprimise[1]
                    sdata.surveyname = ""
                    sdata.username = ""
                    if(surveydata){
                        sdata.surveyname = surveydata.surveyname
                    }
                    if(surveydata){
                        sdata.username = userdata.firstname +" "+userdata.lastname
                    }
                    res.status(200).json(sdata);
                }).catch(function(err) {
                    console.log(err);
                    res.status(500).json("Error getting details");
                });
            } else {
                res.status(500).json("Details Not Available");
            }
        });
    } catch(e){
        res.status(500).json("Something went wrong...");
    }
 });

router.route('/getcontactdetails').post(function(req, res) {
    contactlist.findOne({_id:req.body.listid},function(err, contactdata) {
        if(contactdata){
            contactlistdata.find({"listid":req.body.listid},function(err, flowdata) {
                if(!flowdata){
                    flowdata = []
                }
                res.json({
                    contactdetails:contactdata,
                    list:flowdata
                });
            });
        } else {
            res.json(null);
        }
    });
});
router.route('/getsurveyshareddetails').post(function(req, res) {
    sharedsurveytolist.findOne({_id:req.body.sid},function(err, sharedata) {
        var pms_getsurvey = new Promise(function(resolve, reject) {
            surveys.findOne({"_id":sharedata.surveyid}, function(err, survey){
                resolve(survey)
            })
        });
        var pms_contacts = new Promise(function(resolve, reject) {
            contactlist.findOne({"_id":sharedata.contactid}, function(err, contact){
                resolve(contact)
            })
        });
        Promise.all([pms_getsurvey, pms_contacts]).then(function(finalprimise) {
            var contact = finalprimise[1];
            var survey = finalprimise[0];
            var finallist = [];
            contactlistdata.find({"listid":sharedata.contactid}, function(err, userlist){
                asyncLoop(userlist, function (user, nextuser){
                    if(user){
                        var pms_getuserdata = new Promise(function(resolve, reject) {
                            users.findOne({"email":user.email},{password:0}, function(err, thisuser){
                                if(thisuser){
                                    user.userid = thisuser._id
                                    user.firstname = thisuser.firstname
                                    user.lastname = thisuser.lastname
                                    resolve(user)
                                } else {
                                    resolve(user)
                                }
                            })
                        });
                        var pms_checksahred = new Promise(function(resolve, reject) {
                            sharedsurveyusermails.findOne({surveyid:sharedata.surveyid, email:user.email},function(err, sssss){
                                resolve(sssss)
                            })
                        });
                        Promise.all([pms_getuserdata, pms_checksahred]).then(function(innerprimise) {
                            var thisuser = innerprimise[0]
                            var shared = innerprimise[1]
                            var mailsent = 0
                            var createddate = 0
                            var createdat = ""
                            if(shared){
                                mailsent = 1
                                createddate = shared.createddate
                                createdat = dateFormat(shared.createddate,"yyyy/mm/dd hh:MM:ss TT")
                            }
                            finallist.push({
                                contactid: thisuser._id,
                                userid: thisuser.userid,
                                username: thisuser.firstname + " "+thisuser.lastname,
                                email: thisuser.email,
                                mailsent:mailsent,
                                senttodashboard:sharedata.senttoone,
                                createddate:createddate,
                                createdat:createdat,

                            })
                            nextuser();
                        }).catch(function(err) {
                            console.log(err);
                            nextuser();
                        });

                    } else {
                        nextuser();
                    }

                }, function (err)
                {
                    res.send({
                        share:sharedata,
                        survey:survey,
                        contact:contact,
                        finallist:finallist,
                    });
                });

            })


        }).catch(function(err) {
            console.log(err);
            res.send(null);
        });
    });
});

router.route('/sharesurveytocontact').post(function(req, res) {
    var slistid = req.body.slistid;
    var conatctitemid = req.body.conatctitemid;
    sharedsurveytolist.findOne({_id:slistid}, function(err, sharedlist) {
        if (sharedlist){
            workflowevents.sharesurveytocontact(sharedlist, conatctitemid);
            res.json(sharedlist);
        } else {
            res.status(400).send(err);
        }
    });
});

router.route('/testapi').post(function(req, res) {
    // console.log(req.headers);
    logstores.findOne({})
    .sort('-createddate')  // give me the max
    .exec(function (err, log) {
        res.send(log)
    });

    // res.send("sadasd");
});
router.route('/getdashboard').post(function(req, res) {
    var dashboarddata = {};
    // const userid = req.headers.loginuser
    const userid = req.body.userid
    console.log("userid-", userid);
    var pms_usergroup = new Promise(function(resolve, reject) {
        groups.find({ 'groupmemmbers': new RegExp(userid, 'i') },function(err, items) {
            if(items){
                resolve(items)
            } else {
                resolve([])
            }
        });
    });
    var pms_allprojects = new Promise(function(resolve, reject) {
        var allprojectdetails = []
        var deletedprojectdetails = []
        Promise.all([pms_usergroup]).then(function(finalpromise) {
            const usergroup = finalpromise[0]
            var projectfilter = [{allowgroups:null},{allowgroups:""}];
            usergroup.forEach(element => {
                projectfilter.push({
                    allowgroups:new RegExp(element._id, 'i')
                })
            });
            console.log("project filter:- ", projectfilter);
            
            projects.find({
                $or:projectfilter
            },function(err, allprojects) {
                if(allprojects){
                    asyncLoop(allprojects, function (project, nextproject){
                        surveys.find({
                            category:project._id,
                            delete:"0"
                        },function(err, allsurveys) {
                            var allsurvey = []
                            if(allsurveys.length > 0){
                                asyncLoop(allsurveys, function (survey, nextsurvey){
                                    surveyconfig.findOne({
                                        surveyid:survey._id,
                                    },function(err, config) {
                                        var pms_editor = new Promise(function(resolve, reject) {
                                            var editor = []
                                            if(config.editor){
                                                editor = config.editor.split(",")
                                            }
                                            users.find({  _id : { $in : editor } }, {password:0},function(err, alleditor) {
                                                if(alleditor){
                                                    resolve(alleditor)
                                                } else {
                                                    resolve([])
                                                }
                                            });
                                        });
                                        var pms_reviewer = new Promise(function(resolve, reject) {
                                            var reviewer = []
                                            if(config.reviewer){
                                                reviewer = config.reviewer.split(",")
                                            }
                                            users.find({  _id : { $in : reviewer } }, {password:0},function(err, allreviewer) {
                                                if(allreviewer){
                                                    resolve(allreviewer)
                                                } else {
                                                    resolve([])
                                                }
                                            });
                                        });
                                        Promise.all([pms_editor, pms_reviewer]).then(function(finalpromise) {
                                            allsurvey.push({
                                                survey:survey,
                                                config:config,
                                                editor:finalpromise[0],
                                                reviewer:finalpromise[1]
                                            })
                                            nextsurvey()
                                        }).catch(function(err) {
                                            allsurvey.push({
                                                survey:survey,
                                                config:config,
                                                editor:[],
                                                reviewer:[]
                                            })
                                            nextsurvey()
                                        }); 
                                    })
                                }, function (err)
                                {
                                    allprojectdetails.push({
                                        project:project,
                                        survey:allsurvey
                                    })
                                    nextproject();
                                });
                            } else {
                                allprojectdetails.push({
                                    project:project,
                                    survey:allsurvey
                                })
                                nextproject();
                            }
                        })
                    }, function (err)
                    {
                        surveys.find({
                            delete:"1"
                        },function(err, allsurveys) {
                            var allsurvey = []
                            if(allsurveys.length > 0){
                                asyncLoop(allsurveys, function (survey, nextsurvey){
                                    surveyconfig.findOne({
                                        surveyid:survey._id,
                                    },function(err, config) {
                                        var pms_editor = new Promise(function(resolve, reject) {
                                            var editor = []
                                            if(config.editor){
                                                editor = config.editor.split(",")
                                            }
                                            users.find({  _id : { $in : editor } }, {password:0},function(err, alleditor) {
                                                if(alleditor){
                                                    resolve(alleditor)
                                                } else {
                                                    resolve([])
                                                }
                                            });
                                        });
                                        var pms_reviewer = new Promise(function(resolve, reject) {
                                            var reviewer = []
                                            if(config.reviewer){
                                                reviewer = config.reviewer.split(",")
                                            }
                                            users.find({  _id : { $in : reviewer } }, {password:0},function(err, allreviewer) {
                                                if(allreviewer){
                                                    resolve(allreviewer)
                                                } else {
                                                    resolve([])
                                                }
                                            });
                                        });
                                        Promise.all([pms_editor, pms_reviewer]).then(function(finalpromise) {
                                            allsurvey.push({
                                                survey:survey,
                                                config:config,
                                                editor:finalpromise[0],
                                                reviewer:finalpromise[1]
                                            })
                                            nextsurvey()
                                        }).catch(function(err) {
                                            allsurvey.push({
                                                survey:survey,
                                                config:config,
                                                editor:[],
                                                reviewer:[]
                                            })
                                            nextsurvey()
                                        }); 
                                    })
                                }, function (err)
                                {
                                    deletedprojectdetails.push({allsurvey})
                                    resolve({allprojectdetails:allprojectdetails,deletedprojectdetails:deletedprojectdetails })
                                });
                            } else {
                                deletedprojectdetails.push(allsurvey)
                                resolve({allprojectdetails:allprojectdetails,deletedprojectdetails:deletedprojectdetails })
                            }
                        })
                    });
                } else {
                    resolve({allprojectdetails:allprojectdetails,deletedprojectdetails:deletedprojectdetails })
                }
            });
        }).catch(function(err) {
            console.log("project promise error- ", err);
            
            resolve({allprojectdetails:allprojectdetails,deletedprojectdetails:deletedprojectdetails })
        });
    });
    Promise.all([pms_usergroup, pms_allprojects]).then(function(finalpromise) {
        const usergroup = finalpromise[0]
        const pmsprojects = finalpromise[1]
        dashboarddata.usergroup = usergroup
        dashboarddata.allprojects = pmsprojects.allprojectdetails
        dashboarddata.deletedprojects = pmsprojects.deletedprojectdetails
        res.send(dashboarddata)
    }).catch(function(err) {
        console.log("last promise- ",err);
        
        res.send(dashboarddata)
    });
}); 

router.route('/updatequestionnsp')
.post(function(req, res) {
    var questionid = req.body.questionid;
    var npsleft = req.body.npsleft;
    var npsright = req.body.npsright;
    var npsmiddle = req.body.npsmiddle;
    questions.findOneAndUpdate({"_id":questionid},{
        npsleft:npsleft,
        npsright:npsright,
        npsmiddle:npsmiddle,
        modifiedddate:Date.now()
    },function(err, questiondata) {
        if (err){
            res.send(err);
        } else {
            logstore.createlog({action:"update", module:"question", moduleid:questionid, surveyid:questiondata.surveyid}, req)
            res.json(questiondata);
        }
    });
});

router.route('/savesurveymailtemplate').post(function(req, res) {
    surveyController.savetemplate(req, res);
})
router.route('/getsurveymailtemplate').post(function(req, res) {
    surveyController.gettemplate(req, res);
})
router.route('/deletesurveymailtemplate').post(function(req, res) {
    surveyController.deletetemplate(req, res);
})
router.route('/getsurveymailtemplatedetails').post(function(req, res) {
    surveyController.gettemplatedetails(req, res);
})
router.route('/getuserlogs').post(function(req, res) {
    logstore.getlog(req, res);
})
router.route('/getserversettings').post(function(req, res) {
    serversettings.getserversettings(req,res);
})
router.route('/updateserversettings').post(function(req, res) {
    serversettings.updateserversettings(req,res);
})
router.route('/getcontact').post(function(req, res) {
    contactcontroller.getContacts(req,res);
})
router.route('/mapallcontacts').post(function(req, res) {
    contactcontroller.mapallcontacts(req,res);
})
router.route('/addnewcontact').post(function(req, res) {
    contactcontroller.addnewContacts(req,res);
})
router.route('/importnewcontact').post(function(req, res) {
    contactcontroller.importnewContacts(req,res);
})
router.route('/createorg').post(function(req, res) {
    contactcontroller.createorg(req,res);
})
router.route('/getorg').post(function(req, res) {
    contactcontroller.getorg(req,res);
})
router.route('/delorg').post(function(req, res) {
    contactcontroller.deleteorg(req,res);
})
router.route('/updateorganization').post(function(req, res) {
    contactcontroller.updateorganization(req,res);
})
 // hex to color
 router.route('/hextoimage').post(function(req, res) {
    hexToImage.hexToImage(req,res);
})
router.route('/updatedetail').get(function(req, res) {
    updateDetail.updateDetail(req, res);
});

router.route('/getalldata').post(function(req, res) {
    updateDetail.getAllData(req, res);
});

router.route('/getbotresponse').get(function (req, res) {
    botResponse.getBotResponse(req, res)
});
router.route('/postbotresponse').post(function (req, res) {
    botResponse.postBotResponse(req, res)
})







filerouter.route('/')
    .get(function(req, res) {
        res.sendFile(req.query.file ,{root:__dirname});
    });
  app.use('/api',router);
  app.use('/public',filerouter);
app.get('/*', function(req, res){
  res.sendFile('/dist/index.html' ,{root:__dirname});
});
var port = process.env.PORT || 3001;
var hostname = '127.0.0.1';
app.listen(port, hostname, function (){
    console.log(`Server running at http://${hostname}:${port}/`);
});
// var port = process.env.PORT || 3003;
// app.listen(port);
