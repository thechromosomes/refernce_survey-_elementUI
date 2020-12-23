<template>
  <v-layout wrap  class="conatiner_builder">
    <v-flex :class="`${tabsize}`">
      <template>
        <v-tabs v-if="scrolled < 80"
          class="builder_navbar"
          v-model="activetab"
          centered
          color="#8b784a"
          slider-color="#8b784a"
        >
          <v-tab key=0 class="toolbarsection" >
            <img v-if="activetab == '0'" class ="iconinsidebtn" src="../../assets/icons/edit-light-white.svg" />
            <img v-else class ="iconinsidebtn" src="../../assets/icons/edit-light.svg" />
            Build
          </v-tab>
          <v-tab key=1 class="toolbarsection" >
            <img v-if="activetab == '1'" class ="iconinsidebtn" src="../../assets/icons/presentation-light-white.svg" />
            <img v-else  class ="iconinsidebtn" src="../../assets/icons/presentation-light.svg" />
            Preview
          </v-tab>
          <v-tab key=2 class="toolbarsection" >
            <img v-if="activetab == '2'" class ="iconinsidebtn" src="../../assets/icons/edit-light-white.svg" />
            <img v-else class ="iconinsidebtn" src="../../assets/icons/edit-light.svg" />
            Configure
          </v-tab>
          <v-tab key=3 class="toolbarsection" >
            <img v-if="activetab == '3'" class ="iconinsidebtn" src="../../assets/icons/share-alt-light-white.svg" />
            <img v-else class ="iconinsidebtn" src="../../assets/icons/share-alt-light.svg" />
            Share
          </v-tab>
          <v-tab key=4 class="toolbarsection" >
            <img v-if="activetab == '4'" class ="iconinsidebtn20" src="../../assets/icons/file-chart-line-light-white.svg" />
            <img v-else class ="iconinsidebtn20" src="../../assets/icons/file-chart-line-light.svg" />
            Report
          </v-tab>
          <v-tab key=5 class="toolbarsection alwayshide"  >
          </v-tab>
          
        </v-tabs>
        <v-tabs v-else
          class="builder_navbar active"
          v-model="activetab"
          centered
          color="#8b784a"
          slider-color="#8b784a"
        >
          <v-tab key=0 class="toolbarsection" >
            <img v-if="activetab == '0'" class ="iconinsidebtn" src="../../assets/icons/edit-light-white.svg" />
            <img v-else class ="iconinsidebtn" src="../../assets/icons/edit-light.svg" />
            Build
          </v-tab>
          <v-tab key=1 class="toolbarsection" >
            <img v-if="activetab == '1'" class ="iconinsidebtn" src="../../assets/icons/presentation-light-white.svg" />
            <img v-else  class ="iconinsidebtn" src="../../assets/icons/presentation-light.svg" />
            Preview
          </v-tab>
          <v-tab key=2 class="toolbarsection" >
            <img v-if="activetab == '2'" class ="iconinsidebtn" src="../../assets/icons/edit-light-white.svg" />
            <img v-else class ="iconinsidebtn" src="../../assets/icons/edit-light.svg" />
            Configure
          </v-tab>
          <v-tab key=3 class="toolbarsection" >
            <img v-if="activetab == '3'" class ="iconinsidebtn" src="../../assets/icons/share-alt-light-white.svg" />
            <img v-else class ="iconinsidebtn" src="../../assets/icons/share-alt-light.svg" />
            Share
          </v-tab>
          <v-tab key=4 class="toolbarsection" >
            <img v-if="activetab == '4'" class ="iconinsidebtn20" src="../../assets/icons/file-chart-line-light-white.svg" />
            <img v-else class ="iconinsidebtn20" src="../../assets/icons/file-chart-line-light.svg" />
            Report
          </v-tab>
          <v-tab key=5 class="toolbarsection alwayshide" >
          </v-tab>
        </v-tabs>
      </template>
      <v-tabs-items v-model="activetab">
        <v-tab-item key=0 >
          <div :style="`min-height:${minheight}px;`" ref="thisbuilder">
            <v-layout>
              <v-flex xs12 v-if="welcomenotes.length > 0">
                <div class="qustiongroup" v-for="(welcomenote, windex) in welcomenotes" :key="`welcomenotesid${windex}`">
                  <welcomethankyoueditor :question = "welcomenote" :index="windex" :total="welcomenotes.length"></welcomethankyoueditor>
                </div>
              </v-flex>
            </v-layout>
            <v-layout row class="buildercontainer" id="buildercontainer" >
              <v-flex xs12 v-if="readyfordisplayeditor == true">
                <div class="qustiongroup" v-for="(questiongroup, index) in questiongroups" :key="`builderqid${index}`">
          <div class="tobedeletesect">
            <v-btn class="btn-extrasmall top" v-if="index != 0"  @click ="deleteGroup(index)" fab><img class ="deletequestion" src="../../assets/icons/trash-alt-light.svg" /></v-btn>
                  <questiongroup :gdata="questiongroup"  ></questiongroup>
          </div>
                </div>
              </v-flex>
            </v-layout>
            <v-layout> 
              <v-flex xs12 v-if="thankyounotes.length > 0">
                <div class="qustiongroup" v-for="(thankyounote, tindex) in thankyounotes" :key="`thankyouid${tindex}`">
                  <welcomethankyoueditor :question = "thankyounote" :index="tindex" :total="thankyounotes.length"></welcomethankyoueditor>
                </div>
              </v-flex>
              
            </v-layout>
          </div>
        </v-tab-item>
        <v-tab-item key=1>
          <div>
            <v-container class="previewcontainer" id="previewcontainer" v-if="previewsurvey != ''">
                <previewsurvey :printnow="printnow" :surveyid="previewsurvey"></previewsurvey>
            </v-container>
          </div>
        </v-tab-item>
        <v-tab-item key=2>
          <v-container class="configcontainer" id="previewcontainer">
            <div class="config_block">
            <div class="config_section">
              <v-layout row wrap paddingbottom15>
                <v-flex xs3 fieldtitle>Survey Project</v-flex>
                <v-flex xs9>
                  <v-select
            :items="projects"
            v-model="surveyprojects"
            item-value="_id"
            item-text="projectname"
            @change="changeproject"
            ></v-select>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom15>
                <v-flex xs3 fieldtitle>Survey Semester</v-flex>
                <v-flex xs9>
                  <v-select
            :items="semesters"
            v-model="surveysemester"
            item-value="_id"
            item-text="semesterName"
            @change="changeproject"
            ></v-select>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Survey title</v-flex>
                <v-flex xs9>
                  <v-text-field class="input_text base_inputtext"
                      label=""
                      @input="changetitle"
                      v-model="surveytitle"
                    ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Survey active</v-flex>
                <v-flex xs9>
                  <v-radio-group v-model="surveyconfig.active" @change="changeconfig" row>
                    <v-radio label="Active" value="1"></v-radio>
                    <v-radio label="Not active" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Survey display</v-flex>
                <v-flex xs9>
                  <v-radio-group v-model="surveyconfig.display" @change="changeconfig" row>
                    <v-radio label="One question at a time" value="1"></v-radio>
                    <v-radio label="All question at once" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Anonymous mode</v-flex>
                <v-flex xs9>
                  <v-radio-group v-model="surveyconfig.anonymous" @change="changeconfig" row>
                    <v-radio label="Yes" value="1"></v-radio>
                    <v-radio label="No" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Kiosk mode</v-flex>
                <v-flex xs9>
                  <v-radio-group v-model="surveyconfig.mode" @change="changeconfig" row>
                    <v-radio label="Yes" value="1"></v-radio>
                    <v-radio label="No" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Skip Next on Single Input</v-flex>
                <v-flex xs9>
                  <v-radio-group v-model="surveyconfig.skipnext" @change="changeconfig" row>
                    <v-radio label="Yes" value="1"></v-radio>
                    <v-radio label="No" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Cover photo</v-flex>
                <v-flex xs9>
                  <div class="config_file">
                    <div>
                      <div class="btn-chooseunsplash" @click="choosefromsplash()">
                        <v-icon>broken_image</v-icon>choose from unsplash
                      </div>
                    </div>
                    <span class="or_sect">or</span>
                    <div>
                      <form class="form_dropzone_inline" enctype="multipart/form-data">
                        <div class="dropzone">
                          <div>
                            <input type="file" ref="file" @change="sendconfigSurveyFile" class="file-upload-input" />
                            <a class="btn-chooseunsplash"><v-icon>cloud_upload</v-icon>File upload</a>
                          </div>
                        </div>
                      </form>
                    </div>
                    <span class="or_sect">or</span>
                    <div>
                    <div>
                      <div class="btn-chooseunsplash" @click="selectfrompicker()">
                        <v-icon>broken_image</v-icon>Color Picker
                      </div>
                    </div>
                    <MyColorPicker v-if="selectfromcolorpicker" @changeColor="createImagefromhex" @closeModel="selectfromcolorpicker = false"></MyColorPicker>
                    <!-- <chrome-picker v-if="selectfromcolorpicker == true" v-model="imagecolor" ></chrome-picker> -->
                    </div>
                    <div class="survey-image" v-if="surveyconfig.coverphoto != ''">
                      <img :src="surveyfinalimageurl"/>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Survey mail template</v-flex>
                <v-flex xs9 >
                  <a class="exportbutton" @click="openmailtemplate">
                    <div class="">Template</div>
                  </a>

                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Multiple submission from same device</v-flex>
                <v-flex xs9 fieldtitle>
                  <v-radio-group v-model="surveyconfig.multisubmission" @change="changeconfig" row>
                    <v-radio  :disabled="(surveyconfig.mode == '1')" label="Yes" value="1"></v-radio>
                    <v-radio  :disabled="(surveyconfig.mode == '1')" label="No" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Multiple submission from same User</v-flex>
                <v-flex xs9 fieldtitle>
                  <v-radio-group v-model="surveyconfig.multisubmissionuser" @change="changeconfig" row>
                    <v-radio  :disabled="(surveyconfig.mode == '1')" label="Yes" value="1"></v-radio>
                    <v-radio  :disabled="(surveyconfig.mode == '1')" label="No" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>ReCaptcha</v-flex>
                <v-flex xs9>
                  <v-radio-group v-model="surveyconfig.recaptcha" @change="changeconfig" row>
                    <v-radio label="Yes" value="1"></v-radio>
                    <v-radio label="No" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Honypot Field</v-flex>
                <v-flex xs9>
                  <v-radio-group v-model="surveyconfig.honeypot" @change="changeconfig" row>
                    <v-radio label="Yes" value="1"></v-radio>
                    <v-radio label="No" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Add editor</v-flex>
                <v-flex xs9>
                  <div class="userbblelist">
                    <div class="inlineblock" v-for="editor in arr_editors" v-bind:key="editor._id">
                      <span v-if="survey_editor.indexOf(editor._id) != -1" class="bubbleuser" >{{editor.firstname}} {{editor.lastname}}<v-icon @click="removeeditor(survey_editor.indexOf(editor._id))">maximize</v-icon></span>
                    </div>
                  </div>
                    <input type="text" class="base_inputtext" v-model="search_editor" placeholder="Editor" list="dataeditors" />
                    <div class="hiddendatalist">
                      <div v-for="editor in arr_editors" v-bind:key="editor._id">
                        <span v-if="editor.firstname.toLowerCase().concat(editor.lastname).includes(search_editor) && search_editor != '' && survey_editor.indexOf(editor._id) == -1" class="databble" @click="addeditor(editor._id)">
                          {{editor.firstname}} {{editor.lastname}}
                        </span>
                      </div>
                    </div>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Add reviewer</v-flex>
                <v-flex xs9>
                  <div class="userbblelist">
                    <div class="inlineblock" v-for="reviewer in arr_reviewer" v-bind:key="reviewer._id">
                      <span v-if="survey_reviewer.indexOf(reviewer._id) != -1" class="bubbleuser" >{{reviewer.firstname}} {{reviewer.lastname}}<v-icon @click="removereviewer(survey_reviewer.indexOf(reviewer._id))">maximize</v-icon></span>
                    </div>
                  </div>
                    <input type="text" class="base_inputtext" v-model="search_reviewer" placeholder="Reviewer"/>
                    <div class="hiddendatalist">
                      <div v-for="reviewer in arr_reviewer" v-bind:key="reviewer._id">
                        <span v-if="reviewer.firstname.toLowerCase().concat(reviewer.lastname).includes(search_reviewer) && search_reviewer != '' && survey_reviewer.indexOf(reviewer._id) == -1" class="databble" @click="addreviewer(reviewer._id)">
                          {{reviewer.firstname}} {{reviewer.lastname}}
                          
                        </span>
                      </div>
                    </div>
                </v-flex>
              </v-layout>
              <v-layout row wrap paddingbottom30>
                <v-flex xs3 fieldtitle>Workflow</v-flex>
                <v-flex xs9>
                  <!-- <div><v-checkbox v-model="surveyconfig.resnotiftoedotor" @change="changeconfig" label="Send response notification to editor"></v-checkbox></div>
                  <div><v-checkbox v-model="surveyconfig.processapprovalbyedotor" @change="changeconfig"  label="Workflow process approval by editor"></v-checkbox></div>
                  <div class="paddingleft30"><v-checkbox v-model="surveyconfig.processapprovaltoedotor" @change="changeconfig"  label="Send process approval to editor"></v-checkbox></div>
                  <div class="paddingleft30"><v-checkbox v-model="surveyconfig.sendnotiftoreviewer" @change="changeconfig" label="Send notification to reviewer for approval"></v-checkbox></div>
                  <div class="paddingleft30"><v-checkbox v-model="surveyconfig.sendnotiftoeditor" @change="changeconfig"  label="Send notification to editor after review"></v-checkbox></div> -->
                  <workflow :survey="id"></workflow>
                </v-flex>
              </v-layout>
            </div>
              
            </div>
          </v-container>
        </v-tab-item>
        <v-tab-item key=3>
          <div class="sharesurveybox">
            <div class="shareelement">Direct Link</div>
            <div class="sharedata">{{getsurveylinkwlogin}}</div>
            <div class="sharebutton">
              <button class="copysurveylink" @click="copylinktoclipboard(0);">Copy link</button>
            </div>
          </div>
          <div class="sharesurveybox">
            <div class="shareelement">Direct Link- without login</div>
            <div class="sharedata">{{getsurveylinkwtlogin}}</div>
            <div class="sharebutton">
              <button class="copysurveylink" @click="copylinktoclipboard(1);">Copy link</button>
            </div>
          </div>
          <div class="sharesurveybox">
            <div class="shareelement">Embed code</div>
            <div class="sharedata">{{getsurveyembadecode}}</div>
            <div class="sharebutton">
              <button class="copysurveylink" @click="copylinktoclipboard(2);">Copy</button>
            </div>
          </div>
          <div class="sharesurveybox">
            <div class="shareelement">Share to Contact</div>
            <div class="sharedata">
              <v-flex xs12 d-flex>
<model-list-select :list="contacts" class="sharedata"
                     v-model="shareto"
                     option-value="_id"
                     option-text="listname"
                     placeholder="Select Contact list">
  </model-list-select>
                </v-flex>
            </div>
            <div class="sharebutton">
              <v-checkbox v-model="sharewithmail" label="Send Email"></v-checkbox>
              <!-- <v-checkbox v-model="anonymousresp" label="Send to Dashboard"></v-checkbox> -->
              <v-checkbox v-model="sharetoone" label="Send to Dashboard"></v-checkbox>
              <button class="copysurveylink" @click="sharetocontactlist">Share</button>
            </div>
          </div>
          <div class="sharesurveybox" v-if="surveydata!= null">
            <sharedsurveylist  :survey="surveydata"></sharedsurveylist>
          </div>
          <div class="sharesurveybox">
            <v-container>
              <v-layout row wrap paddingbottom15 v-if="activetab == 3">
                <v-flex xs3 fieldtitle>Reminder</v-flex>
                <v-flex xs9>
                  <surveyreminder :survey="id"></surveyreminder>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </v-tab-item>
        <v-tab-item key=4 class="alwayshide"></v-tab-item>
        <v-tab-item key=5 >
            <v-container class="surveymailtemplate" id="surveymailtemplate">
                <surveymailtemplate v-if="surveydata" :surveyid="id" :surveydata="surveydata"></surveymailtemplate>
            </v-container>
        </v-tab-item> 
      </v-tabs-items>
    </v-flex>
    <v-flex xs3 v-if="tabsize != 'xs12'">
      <v-flex class="toolbarsection customscroll stickytop50">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 class="toolhead"> Choice</v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('multic')">
                <div class="roundgreen"><img class ="iconinsidebtnsmall" src="../../assets/icons/ballot-check-light-white.svg" /></div>
                <div class="greenlabel">Multiple Choice</div>
              </a>
            </v-flex>
            <v-flex xs6>
              <a class="toolbtn" @click="addquestion('singlec')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/check-double-regular-white.svg" /> 
                </div>
                <div class="greenlabel">
                Single Choice
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('ratescal')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/sliders-h-square-light-white.svg" />
                </div>
                <div class="greenlabel">
                 Rating Scale
                </div>
              </a>
            </v-flex>
            <v-flex xs6>
              <a class="toolbtn" @click="addquestion('ratestars')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/star-half-alt-solid-white.svg" /> 
                </div>
                <div class="greenlabel">
                Rating Stars
                </div>
              </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('nps')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/sliders-h-square-light-white.svg" />
                </div>
                <div class="greenlabel">
                 Net Promoter Score
                </div>
              </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('qtypeslider')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/layer-plus-light-white.svg" /> 
                </div>
                <div class="greenlabel">
                Slider
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
            <a class="toolbtn" @click="addquestion('qtypedatetime')">
              <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/calendar-day-light-white.svg" />
              </div>
              <div class="greenlabel">
                Date and Time
              </div>
               </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('dropdown')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/chevron-square-down-light-white.svg" />
                </div>
                <div class="greenlabel">
                Dropdown
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
            <a class="toolbtn" @click="addquestion('matrixquestion')">
                <div class="roundgreen">
              <v-icon>grid_on</v-icon>
                </div>
                <div class="greenlabel">
               Matrix Question
                </div>
               </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('ranking')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/random-light-white.svg" />
                </div>
                <div class="greenlabel">
                Ranking
                </div>
                </a>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 class="toolhead"> Text</v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('singletext')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/edit-light-white.svg" />
                </div>
                <div class="greenlabel">
                Single Text Box
                </div>
                </a>
            </v-flex>
            <v-flex xs6>
              <a class="toolbtn" @click="addquestion('multipletext')">
                <div class="roundgreen">
                  <img class ="iconinsidebtnsmall" src="../../assets/icons/edit-light-white.svg" />
                </div>
                <div class="greenlabel">
                  Multiple Text Box
                </div>
              </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('commenttext')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/brackets-light-white.svg" /> 
                </div>
                <div class="greenlabel">
                Comments Box
                </div>
              </a>
            </v-flex>
            <v-flex xs6>
              <a class="toolbtn" @click="addquestion('numbertext')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/list-ol-light-white.svg" />
                </div>
                <div class="greenlabel">
                Numbers
                </div>
              </a>
            </v-flex>
            <v-flex xs6 >
              <a class="toolbtn" @click="addquestion('customform')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/play-circle-light-white.svg" />
                </div>
                <div class="greenlabel">
                Custom form
                </div>
                </a>
            </v-flex>
            <v-flex xs6>
              <a class="toolbtn" @click="addquestion('emailtext')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/at-light-white.svg" />
                </div>
                <div class="greenlabel">
                Email
                </div>
                </a>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 class="toolhead"> Sections</v-flex>
            <!-- <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('pagebreak')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/file-alt-light-white.svg" />
                </div>
                <div class="greenlabel">
                Page Break
                </div>
                </a>
            </v-flex> -->
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('fileupload')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/cloud-upload-light-white.svg" />
                </div>
                <div class="greenlabel">
                File Upload
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('sectionheading')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/h2-light-white.svg" />
                </div>
                <div class="greenlabel">
                Section Heading
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('descriptionbox')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/play-circle-light-white.svg" />
                </div>
                <div class="greenlabel">
                Description
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('welcomepage')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/play-circle-light-white.svg" />
                </div>
                <div class="greenlabel">
                Welcome Page
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('thankyoupage')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/stop-circle-light-white.svg" />
                </div>
                <div class="greenlabel">
                Thankyou Page
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestiongroup(id)">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/play-circle-light-white.svg" />
                </div>
                <div class="greenlabel">
                Question group
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="openmodelgallery">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/play-circle-light-white.svg" />
                </div>
                <div class="greenlabel">
                Gallery
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('contactInfo')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/play-circle-light-white.svg" />
                </div>
                <div class="greenlabel">
                Contact info
                </div>
                </a>
            </v-flex>
            <v-flex xs6 class="toolsection">
              <a class="toolbtn" @click="addquestion('dataTable')">
                <div class="roundgreen">
                <img class ="iconinsidebtnsmall" src="../../assets/icons/play-circle-light-white.svg" />
                </div>
                <div class="greenlabel">
                Data Table
                </div>
                </a>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex class="text-center">
                <button @click="saveSurvey" class="btn-custom1">Save Survey</button>
            </v-flex> 
          </v-layout>

        </v-container>
      </v-flex>
    </v-flex>
      <gallery @removeModel="model_gallery = $event"  v-if="model_gallery == true" :dialogstate="model_gallery"></gallery>
    <div class="messagebox" v-if="successmessage != ''">{{successmessage}}</div>
</v-layout>
</template>
<script>
var username=localStorage.username;
var datetime = new Date();
var mylibrary = require("../../models/mainlib.js");
import Vue from 'vue'
import finalqestion from '../question/finalquestion'
import displayheading from '../question/sectionheading'
import questiongroup from './questiongroup'
import surveymailtemplate from './surveymailtemplate'
import welcomethankyoueditor from './welcomethankyoueditor'
import previewsurvey from './previewsurvey'
import workflow from './workflow'
import surveyreminder from './reminder'
import sharedsurveylist from './sharedsurveylist'
import gallery from '../models/gallery'
// import mycolorpicker from '../mycolorpicker'
import axios from 'axios';
import copytoclip from 'copy-to-clipboard';
import { ModelListSelect } from 'vue-search-select'
import {Chrome} from 'vue-color';
import MyColorPicker from '../models/MyColorPicker'

  export default {
  components: {
    MyColorPicker, 
    'chrome-picker':Chrome, 
    surveymailtemplate,gallery,questiongroup, displayheading,finalqestion,welcomethankyoueditor,previewsurvey,workflow, sharedsurveylist, surveyreminder, ModelListSelect},
   data() {
    return {
      id:this.$route.params.id,
      activetab:"0",
      printnow:true,
      tabsize:"xs9",
      readyfordisplayeditor : true,
      scrolled:0,
      imagecolor:"#ffffff",
      tempdata:"",
      previewsurvey:"",
      builderqno:0,
      previewqno:0,
      builderarray:[],
      questiongroups:[],
      arr_editors:[],
      selectfromcolorpicker:false,
      arr_reviewer:[],
      search_reviewer:"",
      search_editor:"",
      survey_reviewer:[],
      survey_editor:[],
      thankyounotes:[],
      welcomenotes:[],
      surveyconfig:{},
      minheight:0,
      surveytitle:"",
      surveydata:null,
      surveyprojects:null,
      surveysemester:null,
      lastquestiongroup:"",
      currentuser:null,
      groupname:null,
      successmessage:"",
      projects:[],
      semesters:[],
      contacts:[],
      shareto:"",
      sharewithmail:false,
      anonymousresp:false,
      model_gallery:false,
      sharetoone:false,
       model: 'tab-Build',

       colors: {
        hex: '#194d33',
        hsl: {
          h: 150,
          s: 0.5,
          l: 0.2,
          a: 1
        },
        hsv: {
          h: 150,
          s: 0.66,
          v: 0.30,
          a: 1
        },
        rgba: {
          r: 25,
          g: 77,
          b: 51,
          a: 1
        },
        a: 1
      },
          breadcreamps: [{'icon':'../../assets/icons/edit-light.svg','text':'Build'},{'icon':'phone','text':'Configure'},{'icon':'phone','text':'Preview'},{'icon':'phone','text':'Mobile Preview'},{'icon':'phone','text':'Share'}],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },  
  methods: {
    selectfrompicker(){
      this.selectfromcolorpicker = !this.selectfromcolorpicker;
    },
    openmailtemplate(){
      this.activetab = "5"
      this.tabsize = "xs12";
    },
    openmodelgallery(){
      this.model_gallery=true
    },
    deleteGroup(index){
      console.log("delete group");
      var groupid = this.questiongroups[index]._id
      axios.post(`/deletequestiongroup`,{'groupid':groupid}).then(response => {
        if(response.data.status==2){
          this.questiongroups.splice(index,1);
        } else {
          this.$toast.open({
            message:response.data.message,
            position:"top",
            type:"error"
          })
        }
      }).catch(e => {
          this.$toast.open({
            message:response.data.message,
            position:"top",
            type:"error"
          })
      })
    },
    sharetocontactlist(){
      if(this.shareto == ""){
        alert("Must select List");
      } else {
        axios.post(`/sharelist`,{'listid':this.shareto,'surveyid':this.id, 'mailtousers':this.sharewithmail, 'sendtoone':this.sharetoone}).then(response => {
          alert("success");
        }).catch(e => {
          alert("Failed to share the data");
        })
      }
    },
    changedquestionGroup(){
      console.log("change group from builder");
      // this.readyfordisplayeditor = false
      // this.readyfordisplayeditor = true
    },
    saveSurvey(){
      this.successmessage = "Saved Successfully"
      console.log(this.successmessage);
      
    },
    Clearmessage(){
      this.successmessage = ""
    },
    changeconfig(textdata){
      this.debouncedupdateConfigdata();
    },
    changetitle(textdata){
      this.debouncedUpdateSurveytitle();
      
    },
    changeproject(textdata){
      this.debouncedUpdateSurveyproject();
      
    },
    updateConfigdata(){
      if(this.surveyconfig.mode == "1" && (this.surveyconfig.multisubmission == "0" || this.surveyconfig.multisubmissionuser =="0")){
        this.surveyconfig.multisubmission = "1"; 
        this.surveyconfig.multisubmissionuser = "1";
        this.$toast.open({
          message:"Multiple submission can be disabled only if Kiosk mode is disabled",
          position:"top",
          type:"warning"
        })
      }
        axios.post(`/updatesurveyconfig`,{
          'surveyid':this.id,
          'active':this.surveyconfig.active,
          'display':this.surveyconfig.display,
          'mode':this.surveyconfig.mode,
          'anonymous':this.surveyconfig.anonymous,
          'coverphoto':this.surveyconfig.coverphoto,
          'multisubmission':this.surveyconfig.multisubmission,
          'multisubmissionuser':this.surveyconfig.multisubmissionuser,
          'editor':this.survey_editor,
          'reviewer':this.survey_reviewer,
          'resnotiftoedotor':this.surveyconfig.resnotiftoedotor,
          'processapprovalbyedotor':this.surveyconfig.processapprovalbyedotor,
          'processapprovaltoedotor':this.surveyconfig.processapprovaltoedotor,
          'sendnotiftoreviewer':this.surveyconfig.sendnotiftoreviewer,
          'sendnotiftoeditor':this.surveyconfig.sendnotiftoeditor,
          'honeypot': this.surveyconfig.honeypot,
          'skipnext': this.surveyconfig.skipnext,
          'recaptcha': this.surveyconfig.recaptcha,
          'honeypot': this.surveyconfig.honeypot
          }).then(response => {
            console.log(response);
            
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    UpdateSurveytitle(){
        axios.post(`/updatesurveytitle`,{
          'surveyid':this.id,
          'title':this.surveytitle
          }).then(response => {
            console.log(response);
            
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    UpdateSurveyproject(){
      console.log("update project");
        axios.post(`/updatesurveyproject`,{
          'surveyid':this.id,
          'project':this.surveyprojects,
          'semester':this.surveysemester
          }).then(response => {
            console.log(response);
            
        }).catch(e => {
          this.errors.push(e)
        })        
    },
    addquestion(qtype){
      this.activetab = "0";
      var data = {
        questionno:0,
        questiontext:"",
        haveimage:"0",
        havedescription:"0",
        description:"",
        image:"",
        maskformat:"",
        maxrate:"",
        groupid:this.lastquestiongroup,
        required:"0",
        length:"",
        rating:"",
        qtype:"",
        order:this.lastgroupsize
      }
      if(qtype == "multic"){
        data.choice=[{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""}]
      } else if(qtype == "singlec"){
        data.choice=[{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""}]
      } else if(qtype == "multipletext"){
        data.choice=[{choicestate :0, choicetext :""},{name:""},{name:""},{name:""}]
      } else if(qtype == "dropdown"){
        data.choice=[{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""}]
      } else if(qtype == "singletext"){
        data.choice=[{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""}]
      } else if(qtype == "ranking"){
        data.choice=[{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""},{choicestate :0, choicetext :""}]
      } else if(qtype == "commenttext"){
        data.commenttext=""
      } else if(qtype == "qtypedatetime"){
        data.dateselection=""
      } else if(qtype == "sectionheading"){
        data.sectionheading=""
      } else if(qtype == "numbertext"){
        data.maskformat=3
      } else if(qtype == "ratestars"){
        data.maxrate="20"
      } else if(qtype == "contacttext"){
        data.contactform={}
      } else if(qtype == "contactInfo"){
        data.contactInfo = ""
      } else if(qtype == "dataTable"){
        data.contactInfo = ""
        data.allcols=[{
          option:""
        }]
        data.allrows=[]
      } else if(qtype == "customform"){
        data.customformdata=[
          {
            "title":"Firstname",
            "type":"Text",
            "width":"50%",
            "required":false
          },
          {
            "title":"Lastname",
            "type":"Text",
            "width":"50%",
            "required":false
          },
          {
            "title":"Phone",
            "type":"Phone",
            "width":"100%",
            "required":false
          },
          {
            "title":"Email",
            "type":"Email",
            "width":"100%",
            "required":false
          },
          {
            "title":"Address",
            "type":"Textarea",
            "width":"100%",
            "required":false
          }
        ]
      } else if(qtype == "ratescal"){
        data.length="10"
        data.ratings="0"
      } else if(qtype == "matrixquestion"){
        data.allrows=[{
          option:"",
          radioans:"",
          checkans:[]
        }]
        data.allcols=[{
          option:""
        }]
        data.qtype="0"
      } else if(qtype == "qtypeslider"){
        data.links=[
          {src:"https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg"},
          {src:"https://cdn.vuetifyjs.com/images/carousel/sky.jpg"},
          {src:"https://cdn.vuetifyjs.com/images/carousel/bird.jpg"},
          {src:"https://cdn.vuetifyjs.com/images/carousel/planet.jpg"}
        ]
      } else if(qtype == "welcomepage"){
        data.order = this.welcomenotes.length
        data.groupid="welcome"
      // } else if(qtype == "thankyoupage"){
        // data.order = this.thankyounotes.length
        // data.groupid="thankyou"
      }
      data.type=qtype
      // console.log(JSON.stringify(data));
      this.readyfordisplayeditor = false
      axios.post('/addquestion',{"surveyid":this.id,"questions":data})
      .then(response => {
        if(response.status == 200){
          this.successmessage = "Question Added"
          this.readyfordisplayeditor = true
          if(qtype == "welcomepage"){
            this.welcomenotes.push(response.data.result)
          // } else if(qtype == "thankyoupage"){
            // this.thankyounotes.push(response.data.result)
          } else {
            console.log("height-",this.$refs.thisbuilder.clientHeight);
            console.log("window-",window);
            // this.$refs.thisbuilder.scrollTo(500);

            window.scrollTo(0,this.$refs.thisbuilder.clientHeight+1000);
            this.lastgroupsize++;
          }
          axios.post(`/updatequestiontable`,{'surveyid':this.id}).then(response => {
            // console.log(response);
          }).catch(e => {
            this.errors.push(e)
          }) 

        } else {
          this.readyfordisplayeditor = true
          console.log("error");
        }
      })
      .catch(e => {
        this.readyfordisplayeditor = true
        console.log("error");
        console.log(e);
      });
    },
    deleteelement(ele_index, type){
      var array_index=[]
      if(type == 1){
        var questionid = this.welcomenotes[ele_index]._id
        axios.post(`/deletequestion`,{'questionid':questionid}).then(response => {
          if(response.data.n==1){
            this.welcomenotes.splice(ele_index,1);
            this.welcomenotes.forEach((question, index) => {
              array_index.push({
                order:index,
                id:question._id
              })
            });
            this.updatequestionorder(array_index);
          }
        }).catch(e => {
          this.errors.push(e)
        })
      } else if(type == 2){
        var questionid = this.thankyounotes[ele_index]._id
        axios.post(`/deletequestion`,{'questionid':questionid}).then(response => {
          if(response.data.n==1){
            this.thankyounotes.splice(ele_index,1);
            this.thankyounotes.forEach((question, index) => {
              array_index.push({
                order:index,
                id:question._id
              })
            });
            this.updatequestionorder(array_index);
          }
        }).catch(e => {
          this.errors.push(e)
        })
      }
    },
    async choosefromsplash(){
      const res = await axios.get("https://source.unsplash.com/collection/4728778/1600x900");
      this.surveyconfig.coverphoto = res.request.responseURL
      this.changeconfig("from fil upload")
      
    },
    async sendconfigSurveyFile(){
      const file = this.$refs.file.files[0];
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      try{
        console.log("need to handle upload");
        const res = await axios.post("/upload", formData);
        console.log(res);
        this.surveyconfig.coverphoto = res.data.file
        this.changeconfig("from fil upload")
      } catch(err){
        console.log(err);
        this.error = true;
      }
    },
    createImagefromhex(data){
      this.selectfromcolorpicker = false;
      axios.post(`/hextoimage`,{'color':data.hex}).then(response => {
        if(response.data.status){
          this.surveyconfig.coverphoto = response.data.imageName
          this.changeconfig("from fil upload")
          this.selectfromcolorpicker = false;
        } else {
          this.$toast.open({
            message:response.data.message,
            position:"top",
            type:"error"
          })
        }
        }).catch(e => {
          this.errors.push(e)
        })
    },
    moveelement(ele_index, pos, type){
      var array_index = [];
      console.log("move from builder");
      
      if(type == 1){
        var celement = this.welcomenotes[ele_index];
        var otherelement = this.welcomenotes[ele_index + pos];
        Vue.set(this.welcomenotes, ele_index, otherelement);
        Vue.set(this.welcomenotes, ele_index + pos, celement);
        this.welcomenotes.forEach((question, index) => {
          array_index.push({
            order:index,
            id:question._id
          })
        });
      } else if(type == 2){
        var celement = this.thankyounotes[ele_index];
        var otherelement = this.thankyounotes[ele_index + pos];
        Vue.set(this.thankyounotes, ele_index, otherelement);
        Vue.set(this.thankyounotes, ele_index + pos, celement);
        this.thankyounotes.forEach((question, index) => {
          array_index.push({
            order:index,
            id:question._id
          })
        });
      }
      this.updatequestionorder(array_index);
    },
    updatequestionorder(questionarray){
      axios.post(`/updatequestionorder`,{'neworder':questionarray}).then(response => {
        console.log(response);
      }).catch(e => {
        this.errors.push(e)
      }) 
    },
    addreviewer(revid){
      console.log("reviewerid:- "+revid);
      this.survey_reviewer.push(revid);
      this.search_reviewer = "";
      this.debouncedupdateConfigdata();
    },
    removeeditor(editindex){
      this.survey_editor.splice(editindex,1);
      this.debouncedupdateConfigdata();
    },
    removereviewer(revindex){
      this.survey_reviewer.splice(revindex,1);
      this.debouncedupdateConfigdata();
    },
    addeditor(editorid){
      console.log("editorid:- "+editorid);
      this.survey_editor.push(editorid);
      this.search_editor = "";
      this.debouncedupdateConfigdata();
    },
    addquestiongroup(surveyid){
      axios.post(`/addquestiongroup`,{
        'surveyid':this.id,
        'groupname':"New Default",
        'description':"",
        'order':this.questiongroups.length,
        }).then(response => {
          this.lastquestiongroup = response.data._id;
          this.questiongroups.push(response.data)
          this.lastgroupsize ++
      })

    },
    getquestionno(index){
      var qno = 0;
      for (let i = 0; i < this.builderarray.length; i++) {
        if(i >= index){
          break;
        }
        var queselement = this.builderarray[i];
        if(queselement.type == 'welcomepage' || queselement.type == 'thankyoupage'  || queselement.type == 'sectionheading'  || queselement.type == 'pagebreak' || queselement.type == 'descriptionbox'){

        } else if(queselement.data.questiontext != ""){
          qno+=1;
        } else {
        } 
      }
      return qno;
    },
    copylinktoclipboard(copyfrom){
      if(copyfrom == 0){
        copytoclip(this.getsurveylinkwlogin);
      } else if(copyfrom == 1){
        copytoclip(this.getsurveylinkwtlogin);
      } else if(copyfrom == 2){
        copytoclip(this.getsurveyembadecode);
      } else {

      }
      
    },
    handleScroll(e){

      this.scrolled = window.scrollY;
      if(this.$refs.thisbuilder){
        var thisdata = {
          height:this.$refs.thisbuilder.clientHeight,
          scroll:window.scrollY
        }
        localStorage.setItem(this.id, JSON.stringify(thisdata));
      }
    }
  },
  updated: function () {
    // var scorlto = localStorage.getItem('builderscorl');
    // if(!scorlto){
    //   scorlto = 0;
    // }
    // console.log("scorlto1-", scorlto);
    // setTimeout(() => {
    //   console.log("scorlto2-", scorlto);
      
    //   window.scrollTo(0, scorlto);
    // }, 1000);
  },
  created() {
    var this_data =  localStorage.getItem(this.id);
    this_data = JSON.parse(this_data);
      console.log("this_data- ", this_data);
    if(this_data){
      this.minheight = this_data.height;
    }
    
    this.debouncedupdatecolorimage = _.debounce(this.createImagefromhex, 500)
    this.debouncedupdateConfigdata = _.debounce(this.updateConfigdata, 500)
    this.debouncedUpdateSurveytitle = _.debounce(this.UpdateSurveytitle, 500)
    this.debouncedUpdateClearmessage = _.debounce(this.Clearmessage, 3000)
    this.debouncedUpdateSurveyproject = _.debounce(this.UpdateSurveyproject, 500)
    axios.post(`/getcurrentuser`,{'username':username}).then(response => {
        // JSON responses are automatically parsed.
        this.currentuser = response.data._id
        if(mylibrary.is_roleassigned(response.data.roles, "1") || mylibrary.is_roleassigned(response.data.roles, "2") || mylibrary.is_roleassigned(response.data.roles, "3")){
        } else {
          this.$router.push('/')

        }
    })
    .catch(e => {
      this.errors.push(e)
    })
    if(this.id == "" || this.id == undefined){
      this.$router.push('/')
    } else { 
        axios.post(`/getsemesters`).then(response => {
            this.semesters = response.data;
        })
        .catch(e => {
          this.errors.push(e)
        })
      axios.post(`/getsurvey`,{'surveyid':this.id}).then(response => {
        this.surveydata = response.data;
        this.surveytitle = response.data.surveyname;
        console.log(response.data);
        this.surveyprojects = response.data.category;
        this.surveysemester = response.data.semester;
      })
      axios.get(`/getusers`).then(response => {
        this.arr_reviewer = response.data;
        this.arr_editors = response.data;
      })
      axios.post(`/getsurveyconfig`,{'surveyid':this.id}).then(response => {
        this.surveyconfig = response.data.data
        this.survey_editor = this.surveyconfig.editor
        this.survey_reviewer = this.surveyconfig.reviewer
        if(this.surveyconfig.coverphoto == ""){
          this.choosefromsplash();
          this.changeconfig("cover updated");
        }
      })
      axios.post(`/getallwelcomethankyoudata`,{'surveyid':this.id,datatype:'welcomepage'}).then(response => {
        if(response.data == null){
        } else {
            this.welcomenotes = response.data;
        }
      })
      axios.post(`/getallwelcomethankyoudata`,{'surveyid':this.id,datatype:'thankyoupage'}).then(response => {
        if(response.data == null){

        } else {
            this.thankyounotes = response.data;
        }
      })
      axios.post(`/getquestiongroups`,{'surveyid':this.id}).then(response => {
        console.log("Questiongroup");
        var allquestiongroup = response.data;
        if(allquestiongroup.length == 0){
          axios.post(`/addquestiongroup`,{
            'surveyid':this.id,
            'groupname':"Default",
            'description':"",
            'order':0,
            }).then(response => {
              this.lastquestiongroup = response.data._id;
              // var allquestiongroup = [];
              this.questiongroups.push(response.data)
              this.lastgroupsize = 0
          })
        } else {
          this.lastquestiongroup = allquestiongroup[allquestiongroup.length - 1]._id;
          axios.post(`/getquestionfromgroup`,{'groupid':this.lastquestiongroup}).then(response => {
      // console.log(JSON.stringify(response.data));
          this.lastgroupsize = response.data.length
          })

          this.questiongroups = allquestiongroup
        }
      })
          axios.post(`/updatequestiontable`,{'surveyid':this.id}).then(response => {
            // console.log(response);
          }).catch(e => {
            this.errors.push(e)
          })
          axios.post(`/getcontacts`,{}).then(response => {
            if(Array.isArray(response.data)){
              var newarray = response.data.sort(function(a, b){
                if( a.listname.toLowerCase() == b.listname.toLowerCase()){
                  return 0
                } else if( a.listname.toLowerCase() >= b.listname.toLowerCase()){
                  return 1
                } else {
                  return -1
                }
                return a.listname > b.listname
              })
              this.contacts = newarray
            }
          })
          .catch(e => {
            // this.errors.push(e)
          }) 

    }
    axios.get(`/getprojects`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.projects = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })

  },
  watch: {
    // whenever question changes, this function will run
    selectfromcolorpicker: function (oldaselectfromcolorpicker, newselectfromcolorpicker) {
      // console.log(this.selectfromcolorpicker);
      // if(!this.selectfromcolorpicker){
      //   // this.debouncedupdatecolorimage();
      // }
    },
    builderarray: function (oldaBuilderArray, newaBuilderArray) {
      return this.builderarray;
    },
    successmessage: function (oldasuccessmessage, newsuccessmessage) {
      this.debouncedUpdateClearmessage()
      return this.successmessage;
    },
    search_reviewer: function (oldsearch_reviewer, newsearch_reviewer) {
      return this.search_reviewer;
    },
    surveyconfig: function(oldconfig, newconfig) {
      console.log("fjghkdfghkdfh");
      
      return this.surveyconfig;
    },
    activetab: function(newactivetab, oldactivetab) {
      console.log("newactivetab- ",newactivetab);
      console.log("oldactivetab- ",oldactivetab);
      console.log("activetab- ",this.activetab);
      
      if(newactivetab != "5"){
        this.tabsize = "xs9"
      }
      if(this.activetab == '4'){
        this.$router.push('/responsereport/'+this.id);
      } else if(this.activetab == '5'){
        // this.$router.push('/responsereport/'+this.id);
      } else {
        if(newactivetab == '1'){
          this.previewsurvey = this.id
        } else {
          this.previewsurvey = ""
        }
        
      }
      return this.activetab;
    }

  },
  computed: {
    // a computed getter
    surveyfinalimageurl: function () {
      if(this.surveyconfig.coverphoto != undefined){
        if(this.surveyconfig.coverphoto.indexOf('unsplash.com') >= 0){
          return this.surveyconfig.coverphoto;
        } else {
          return window.publicfileurl+this.surveyconfig.coverphoto;
        }
      }
      return ""
    },
    getsurveylinkwlogin: function(){
      return window.siteurl+"swl/"+this.id;
    },
    getsurveylinkwtlogin: function(){
      return window.siteurl+"swtl/"+this.id;
    },
    getsurveyembadecode: function(){
      return '<iframe id="gpex-survey"src="'+window.siteurl+'swtl/'+this.id+'" width="100%" height="1000px" allowtransparency="true" style="frameborder:0; border: 0; margin: 0 auto; background: transparent; background-color: transparent;" ></iframe>';
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    // var scorlto = localStorage.getItem('builderscorl');
    // if(!scorlto){
    //   scorlto = 0;
    // }
    // console.log("scorlto1-", scorlto);
    // setTimeout(() => {
    //   console.log("scorlto2-", scorlto);
      
    //   window.scrollTo(0, scorlto);
    // }, 1000);
  },

   onChange (val) {
      this.colors = val
      console.log("this is colors",  this.colors)
    }
}
</script>
<style scoped>
.questions{
  width: 100%;
  padding: 15px;
}
</style>
