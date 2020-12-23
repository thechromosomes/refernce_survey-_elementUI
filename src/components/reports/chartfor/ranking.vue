 <template>
    <div class="chart-container">
        <!-- <v-layout>
            <highcharts v-if="showchart == 1" height="600px" :options="colchart" ></highcharts>
        </v-layout> -->
            <horizontalchart :height="defaultheight" :styles="myStyles" v-if="showchart == 1"  :chartdata="chartdata" :options="options"></horizontalchart>
        <br/>
            <horizontalchart :height="defaultmultiheight" v-if="showchart == 1"  :chartdata="chartdatamulti" :options="multioptions"></horizontalchart>
        <br/>
        <!-- <v-layout page-break-before: always;>
            <highcharts v-if="showchart == 1" height="600px" :options="chartdata" ></highcharts>
        </v-layout> -->
 
        <v-layout style='page-break-before: always;'>
         <v-container>
            <div class="totalranking">
                <table class="table charttable">

                    <tr>
                        <td></td>
                        <td v-for="i in datas" :key="`aaa${i}`">{{i}}</td>
                        <td>Total</td>
                        <td>Score</td>
                    </tr>

                    <template v-for="(sranking, index) in totalranking">
                      <tr v-bind:key="`rank${index}`">
                          <td>{{sranking.name}}</td>

                    <template v-for="(rankingindex, indexs) in sranking.alldata">
                          <td :key="indexs">{{rankingindex.percent}}<br>
                          {{rankingindex.selected}}</td>
                    </template>
                      </tr>
                    </template>
                </table>
            </div>
          </v-container>
        </v-layout>

        <br/>
    </div>
</template>
<script>
import horizontalchart from "./horizontalchart"
export default {
    props:['question','contactuserid'],
    components: {horizontalchart},
    data() {
    return {
        questiondata:this.question,
        allanswers:[],
        totalranking:[],
        defaultheight:"200",
        defaultmultiheight:"200",
        datas:0,
        chartcolors :[ "#A7226E", "#EC2049", "#F26B38", "#F7DB4F", "#2F9599", "#E1F5C4", "#EDE574", "# F9D423", "#FC913A", "#FF4E50" ],
        chartdata:{labels: [],datasets: [{label: '',data: [],backgroundColor: [],borderColor: [],borderWidth: 1}]},
        options:{ responsive: true, "hover": {"animationDuration": 0},"animation": {"onComplete": function() {var chartInstance = this.chart,ctx = chartInstance.ctx;ctx.textAlign = 'center';ctx.textBaseline = 'bottom';this.data.datasets.forEach(function(dataset, i) {var meta = chartInstance.controller.getDatasetMeta(i);meta.data.forEach(function(bar, index) {var data = dataset.data[index]+"%";ctx.fillText(data, bar._model.x+20, bar._model.y + 7);});});}},maintainAspectRatio: false,legend: {display: false},tooltips: {"enabled": false},scales: {xAxes: [{ticks: {beginAtZero: true,callback: (value) => value+"%",suggestedMin:2,suggestedMax:100,}}]}},
        multioptions:{ responsive: true,tooltips: {"enabled": false}, "hover": {"animationDuration": 0},"animation": {"onComplete": function() {var chartInstance = this.chart,ctx = chartInstance.ctx;ctx.textAlign = 'center';ctx.textBaseline = 'bottom';this.data.datasets.forEach(function(dataset, i) {var meta = chartInstance.controller.getDatasetMeta(i);meta.data.forEach(function(bar, index) {var data = dataset.data[index]+"%";ctx.fillText(data, bar._model.x+20, bar._model.y + 7);});});}}, maintainAspectRatio: false,legend: {display: true,labels: {fontColor: 'rgb(255, 99, 132)'}},scales: {xAxes: [{ticks: {beginAtZero: true,callback: (value) => value+"%",suggestedMin:2,suggestedMax:100,}}]}},
        chartdatamulti:{labels: [],datasets: []},
        showchart:0,
        chartdata: {
            chart: {
                type: 'bar',
                backgroundColor:'#F5F5F5'
            },
            title: {
                text: 'Ranking by Percentage'
            },
            colors: ['#A7226E', '#EC2049', '#F26B38', '#F7DB4F','#2F9599','#E1F5C4','#EDE574', '#  F9D423', '#FC913A', '#FF4E50'],
            seriesColor: '#6fcd98',
            xAxis: {
                categories: [
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                max: 100, 
                title: {
                    text: '(%)'
                }
            },
            tooltip: {
                headerFormat:'<span style="font-size:10px">Rank:- {point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                },

            },
            series: []
        },
        colchart:{
            chart: {
                type: 'column',
                inverted: true,
                backgroundColor:'#F5F5F5'
            },
            title: {
                text: 'Weighted Chart'
            },
            subtitle: {
                text: ''
            },
            colors: ['#A7226E', '#EC2049', '#F26B38', '#F7DB4F','#2F9599','#E1F5C4','#EDE574', '#  F9D423', '#FC913A', '#FF4E50'],
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: ''
                },
                min: 0,
                max: 100,

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },

            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="font-size:14px">{point.name}</span><br><span style="color:{point.color}">Weight</span>: <b>{point.y:.2f}%</b><br/>'
            },
            series: [
                {
                    name: "",
                    colorByPoint: true,
                    data: [
                        {
                            name: "Chrome",
                            y: 62.74
                        },
                        {
                            name: "Firefox",
                            y: 10.57,
                        },
                        {
                            name: "Internet Explorer",
                            y: 7.23,
                        },
                        {
                            name: "Safari",
                            y: 5.58,
                        },
                        {
                            name: "Edge",
                            y: 4.02,
                        },
                        {
                            name: "Opera",
                            y: 1.92,
                        },
                        {
                            name: "Other",
                            y: 7.62,
                        }
                    ]
                }
            ]
        }
    }
},
methods :{
        getfilterdata:function(){
            this.showchart = 0
            axios.post(`/allanswers`,{'questionid':this.question._id}).then(response => {
                if(response.data == null){
                } else {
                    var all_answer = [];
                    const all_choice = this.question.choice
                    this.allanswers = response.data;
                    response.data.forEach(answer => {
                        if(this.contactuserid.length > 0 && this.contactuserid.indexOf(answer.userid)<0){
                            return;
                        } else {
                            var only_as = JSON.parse(answer.answer);
                            all_answer = all_answer.concat(only_as); 
                        }
                    });
                    // console.log(all_answer);
                    
                    var categories = [];
                    var totalcategorydata = [];
                    var totalanswer = 0;
                    var allmultichartdata = []
                    for (let index = 1; index <= all_choice.length; index++) {
                        var categorydata = [];
                        var total = 0;
                        var  alllabels = [];
                        var  alllabelcolors = [];
                        all_choice.forEach(choice => {
                                if(choice.choicetext == ""){
                                    return;
                                }
                                alllabelcolors.push(this.chartcolors[index % this.chartcolors.length])
                                alllabels.push(choice.choicetext)
                            const thischoice = all_answer.filter( function(item) {
                                return (item.option == choice._id && item.rank == index);
                            });
                            total += thischoice.length
                            categorydata.push(thischoice.length);
                        });
                        totalanswer += total
                        var singlechart = []
                        categorydata.forEach((data, i) => {
                            var per_date = (data * 100)/total
                            if(!per_date){
                                per_date = 0;
                            }
                            per_date = per_date.toFixed(2);
                            categorydata[i] = per_date
                            singlechart.push(per_date)
                        })
                        allmultichartdata.push({
                            label:index,
                            data:singlechart,
                            backgroundColor:alllabelcolors
                        })
                        totalcategorydata.push({
                            name:index,
                            data:categorydata
                        })
                    }
                    var allmiltilabels = []
                    all_choice.forEach(choice => {
                        if(choice.choicetext == ""){
                            return;
                        }
                        categories.push(choice.choicetext);
                        allmiltilabels.push(choice.choicetext);
                    })
                    this.datas = categories.length;
                    var columnwdata = [];
                        var rankingtotal = [];
                    var  alllabels = [];
                    var  alllabelcolors = [];
                    var allchartdata = []

                    all_choice.forEach(choice => {
                        if(choice.choicetext == ""){
                            return;
                        }
                        alllabels.push(choice.choicetext)
                        alllabelcolors.push(this.chartcolors[alllabelcolors.length % this.chartcolors.length])
                        var total1 = 0;
                        var weightsum = 0;
                        var singlrdata = []
                        for (let index = 1; index <= all_choice.length; index++) {
                            const thischoice = all_answer.filter( function(item) {
                                return (item.option == choice._id && item.rank == index);
                            });
                            const thisrank = all_answer.filter( function(item) {
                                return (item.rank == index);
                            });
                            total1 += thischoice.length
                            var this_rankweight = (thischoice.length / thisrank.length)*100;
                            if(!this_rankweight){
                                this_rankweight = 0;
                            }
                            this_rankweight = this_rankweight.toFixed(2)

                            singlrdata.push({
                                rank:index,
                                selected:thischoice.length,
                                total:thisrank.length,
                                percent:this_rankweight+"%",
                            })
                            weightsum += thischoice.length *((all_choice.length - index)+1);
                        }
                        columnwdata.push({
                            name: choice.choicetext,
                            y: (weightsum/total1).toFixed(2),
                        })
                        allchartdata.push((weightsum/total1).toFixed(2));
                            singlrdata.push({
                                rank:"",
                                selected:total1,
                                total:"",
                                percent:""
                            })
                            var vsum = weightsum/total1
                            if(!vsum){
                                vsum = 0;
                            }
                            vsum = vsum.toFixed(2)
                            singlrdata.push({
                                rank:"",
                                selected:vsum,
                                total:"",
                                percent:""
                            })
                        rankingtotal.push({
                            name:choice.choicetext,
                            alldata:singlrdata

                        })
                    });
                    this.chartdata.labels = alllabels
                    this.chartdata.datasets = [{
                        label: '',
                        data: allchartdata,
                        backgroundColor: alllabelcolors,
                        borderColor: alllabelcolors,
                        borderWidth: 1
                    }]
                    this.options.scales.xAxes = [{
                        ticks: {
                            beginAtZero: true,
                            callback: (value) => '' + value,
                            suggestedMin:2,
                            suggestedMax:alllabels.length,
                        }
                    }]
                    this.defaultheight = 50 * (allmiltilabels.length);
                    this.defaultmultiheight = 50 * (allmiltilabels.length * allmiltilabels.length);
                    this.chartdatamulti.labels = allmiltilabels
                    this.chartdatamulti.datasets = allmultichartdata

                    this.chartdata.xAxis.categories = categories;
                    this.chartdata.series = totalcategorydata
                    this.colchart.yAxis.max = all_choice.length

                    this.totalranking = rankingtotal;



                    this.colchart.series = [
                        {
                            name: "",
                            colorByPoint: true,
                            data: columnwdata
                        }
                    ]

                    this.showchart = 1

                    
                }
            })

        }
},
  created(){
      this.getfilterdata();
  },
     watch: {
      // whenever question changes, this function will run
      contactuserid: function (ncontactuserid, ocontactuserid) {
          console.log("watch report",ncontactuserid);
          this.getfilterdata();
      }
    },
  computed: {
    myStyles () {
      return {
        height: `${this.height}px`,
        position: 'relative'
      }
    }
  }
}
</script>


