<template>
  <v-container fluid>


<div class="col-md-12">

<ul class="col-md-4 col-md-offset-3 surveytopli">
<a href="#"> <li><i class="fa fa-folder"></i><span class="fontinfo">Add a Project</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-file"></i><span class="fontinfo">Create a survey</span></li></a> 
</ul>

</div>


<div class="tab tabone col-md-8">
  <button class="tablinks" onClick="openCity(event, 'London')" id="defaultOpen">Recent</button>
  <button class="tablinks" onClick="openCity(event, 'Paris')">AGPT</button>
  <button class="tablinks" onClick="openCity(event, 'Tokyo')">Accreditation</button>

</div>

<div class="col-md-4">
 <input type="text" placeholder="Search" name="search2" class="placesearch col-md-6">
 
 <div class="dropdown col-md-6">
  <button class="dropbtn col-md-12">Semester <i class="fa fa-chevron-down"></i></button>
  <div class="dropdown-content">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
</div><!------>

</div>
<div id="London" class="tabcontent">



<div class="col-md-4">
<div class="12">

<div class="redcard">
<h5 class="placement">Placement Test</h5>
<p class="fontsmall fonsmall1">Created by: Jane Longmire</p>
<p class="fontsmall fonsmall2">Created by: 01/02/2019 <span class="responseright"> 23 Responses</span></p>
</div><!--redcard-->

<div class="infocard">
<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Preview</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Edit</span></li></a> 
<a href="#"> <li class="marginli"><i class="fa-file-o"></i></i><span class="fontinfo">Duplicate</span></li></a>
 </li>
</ul>

<ul>
<a href="#"> <li><i class="fa fa-file-alt"></i><span class="fontinfo">Report</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Archive</span></li></a> 
 </li>
</ul>
</div><!--infocard-->

</div>
</div><!--4--->


<div class="col-md-4">
<div class="12">

<div class="greencard">
<h5 class="placement">Placement Test</h5>
<p class="fontsmall fonsmall1">Created by: Jane Longmire</p>
<p class="fontsmall fonsmall2">Created by: 01/02/2019 <span class="responseright"> 23 Responses</span></p>
</div><!--redcard-->

<div class="infocard">
<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Preview</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Edit</span></li></a> 
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Duplicate</span></li></a>
 </li>
</ul>

<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Report</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Archive</span></li></a> 
 </li>
</ul>
</div><!--infocard-->

</div>
</div><!--4--->



<div class="col-md-4 positiongreen">
<div class="12">

<div class="greencard">
<h5 class="placement">Placement Test</h5>
<p class="fontsmall fonsmall1">Created by: Jane Longmire</p>
<p class="fontsmall fonsmall2">Created by: 01/02/2019 <span class="responseright"> 23 Responses</span></p>
</div><!--redcard-->

<div class="infocard">
<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Preview</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Edit</span></li></a> 
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Duplicate</span></li></a>
 </li>
</ul>

<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Report</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Archive</span></li></a> 
 </li>
</ul>
</div><!--infocard-->

</div>
</div><!--4--->


<div class="col-md-4">
<div class="12">

<div class="greycard">
<h5 class="placement">Placement Test</h5>
<p class="fontsmall fonsmall1">Created by: Jane Longmire</p>
<p class="fontsmall fonsmall2">Created by: 01/02/2019 <span class="responseright"> 23 Responses</span></p>
</div><!--redcard-->

<div class="infocard">
<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Preview</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Edit</span></li></a> 
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Duplicate</span></li></a>
 </li>
</ul>

<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Report</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Archive</span></li></a> 
 </li>
</ul>
</div><!--infocard-->

</div>
</div><!--4--->


<div class="col-md-4">
<div class="12">

<div class="greycard">
<h5 class="placement">Placement Test</h5>
<p class="fontsmall fonsmall1">Created by: Jane Longmire</p>
<p class="fontsmall fonsmall2">Created by: 01/02/2019 <span class="responseright"> 23 Responses</span></p>
</div><!--redcard-->

<div class="infocard">
<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Preview</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Edit</span></li></a> 
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Duplicate</span></li></a>
 </li>
</ul>

<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Report</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Archive</span></li></a> 
 </li>
</ul>
</div><!--infocard-->

</div>
</div><!--4--->


<div class="col-md-4">
<div class="12">

<div class="greycard">
<h5 class="placement">Placement Test</h5>
<p class="fontsmall fonsmall1">Created by: Jane Longmire</p>
<p class="fontsmall fonsmall2">Created by: 01/02/2019 <span class="responseright"> 23 Responses</span></p>
</div><!--redcard-->

<div class="infocard">
<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Preview</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Edit</span></li></a> 
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Duplicate</span></li></a>
 </li>
</ul>

<ul>
<a href="#"> <li><i class="fa fa-user"></i><span class="fontinfo">Report</span></li></a>
<a href="#"> <li class="marginli"><i class="fa fa-user"></i><span class="fontinfo">Archive</span></li></a> 
 </li>
</ul>
</div><!--infocard-->

</div>
</div><!--4--->

</div><!---ID-->

<div id="Paris" class="tabcontent">

  <h3>AGPT</h3>

</div>

<div id="Tokyo" class="tabcontent">

  <h3>Accreditation</h3>
 
</div>
  </v-container>
</template>
<style>
.redcard{background:#E65959;     padding: 10px;     color: #fff;}
.placement{font-size: 13px;    font-weight: bold;     padding-bottom: 25px;}
.fontsmall{    font-size: 11px;}
.fonsmall1{margin-bottom:0;}
.fonsmall2{margin:0;}
.responseright{  font-size: 14px;float: right;font-weight: bolder;}
.infocard ul li {list-style:none;    color: #8B784A; display:inline;}
.marginli{margin-left:40px;}
.infocard ul{padding:0;}
.fontinfo{  padding-left: 10px;}
.infocard{    padding: 15px;box-shadow: 0px 1px 3px #8b784a;}

.greencard{background: #B0CA36;    padding: 10px;     color: #fff;	}
.greycard{background:#cccac7;    padding: 10px;     color: #fff; margin-top:30px;	}



/* Style the tab */
.tab {
  overflow: hidden;

}

/* Style the buttons inside the tab */
.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  font-size: 17px;
}

/* Change background color of buttons on hover */


/* Create an active/current tablink class */
.tabone button.active {color: #8b784a; border-bottom:2px solid #8b784a;}
.tabone button{color: #d8d1c1;}

/* Style the tab content */
.tabcontent {
  display: none;
  padding: 6px 12px;
  border: none;

}

.surveytopli{list-style: none;      margin-top: 30px;}
.surveytopli li{ color:#8b784a;display: inline;}
.surveytopli a{text-decoration: none;}
/* Style the close button */



.tabone{border-bottom: 1px solid #d8d1c1!important;    margin-bottom: 30px;}
.dropbtn {    background: transparent;
  position: relative;
    padding: 5px;
    border-radius: 2px;
    border: 1px solid #d8d1c1;
    top: 25px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {top: 60px;
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {background-color: #ddd;}

.dropdown:hover .dropdown-content {display: block;}


.placesearch{position: relative;
    padding: 5px;
    border-radius: 2px;
    border: 1px solid #d8d1c1;
    top: 25px;}

</style>

