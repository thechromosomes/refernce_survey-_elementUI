 <template>
    <div class="chart-container">
        <!-- <v-layout>
            <highcharts v-if="showchart == 1" height="600px" :options="colchart" ></highcharts>
        </v-layout> -->
            <horizontalchart :height="defaultheight" v-if="showchart == 1"  :chartdata="chartdata" :options="options"></horizontalchart>
            <doughnut :width="dwidth" :height="dheight" v-if="showchart == 1"  :chartdata="dchartdata" :options="doptions"></doughnut>
         <v-layout style='page-break-before: always;'>
         <v-container>
              <div class="datafortable">
                <table class="table charttable">
                    <tr>
                        <td>Slno</td>
                        <td>Selected</td>
                        <td>Percentage</td>
                        <td>Total</td>
                    </tr>
                    <template v-for="(sdata, index) in datafortable" >
                      <tr v-bind:key="`aaaa${index}`">
                          <td>{{sdata.name}}</td>
                          <td>{{sdata.selected}}</td>
                          <td>{{sdata.percentage}}%</td>
                          <td>{{sdata.total}}</td>
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
import doughnut from "./doughnut"
export default {
    props:['question','contactuserid'],
    components: {horizontalchart, doughnut},
    data() {
    return {
        questiondata:this.question,
        allanswers:[],
        defaultheight:"200",
        dwidth:600,
        dheight:400,
        datafortable:[],
        chartcolors :[ "#A7226E", "#EC2049", "#F26B38", "#F7DB4F", "#2F9599", "#E1F5C4", "#EDE574", "# F9D423", "#FC913A", "#FF4E50" ],
        chartdata:{labels: [],datasets: [{label: '',data: [],backgroundColor: [],borderColor: [],borderWidth: 1}]},
        dchartdata:{labels: [],datasets: [{label: '',data: [],backgroundColor: [],borderColor: [],borderWidth: 1}]},
        options:{ responsive: true,tooltips: {"enabled": false},"hover": {"animationDuration": 0},"animation": {"onComplete": function() {var chartInstance = this.chart,ctx = chartInstance.ctx;ctx.textAlign = 'center';ctx.textBaseline = 'bottom';this.data.datasets.forEach(function(dataset, i) {var meta = chartInstance.controller.getDatasetMeta(i);meta.data.forEach(function(bar, index) {var data = dataset.data[index]+"%";ctx.fillText(data, bar._model.x+20, bar._model.y + 7);});});}},maintainAspectRatio: false,legend: {display: false},scales: {xAxes: [{ticks: {beginAtZero: true,callback: (value) => value+"%",suggestedMin:2,suggestedMax:100,}}]}},
        doptions:{ responsive: false,maintainAspectRatio: false,rotation: 1 * Math.PI,circumference: 1 * Math.PI, title: {"display":true,"fontStyle":"bold", "fontSize":50,"fullWidth":true,"padding":-100,"position":"bottom","text":"","weight":1000},
        tooltips: {"enabled": true},"hover": {"animationDuration": 0},
        "animation": {"onComplete": function() {var chartInstance = this.chart,
        ctx = chartInstance.ctx;ctx.textAlign = 'center';ctx.textBaseline = 'bottom';this.data.datasets.forEach(function(dataset, i) {var meta = chartInstance.controller.getDatasetMeta(i);meta.data.forEach(function(bar, index) {var data = "";
        ctx.fillText(data, 0, 200);});});} 
        }
        },
        showchart:0,
        colchart:{
            chart: {
                type: 'column',
                inverted: true,
                backgroundColor:'#F5F5F5'
            },
            title: {
                text: ''
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
                    text: '(%)'
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
                const maxrate = 10
                response.data.forEach(answer => {
                    if(this.contactuserid.length > 0 && this.contactuserid.indexOf(answer.userid)<0){
                        return;
                    } else {
                        var only_as = JSON.parse(answer.answer);
                        all_answer = all_answer.concat(only_as); 
                    } 
                    // var only_as = JSON.parse(answer.answer);
                    // all_answer = all_answer.concat(only_as); 
                });
                var col_categorydata = [];
                var rating = [];
                var totalanswer = 0;
                var  alllabels = [];
                var  alllabelcolors = [];
                var allchartdata = []
                var detractor=0
                var passives=0
                var promoters=0
                for (let index = 0; index <= maxrate; index++) {
                    alllabels.push(index)
                    alllabelcolors.push(this.chartcolors[alllabelcolors.length % this.chartcolors.length])
                    var count = 0;
                    all_answer.forEach(answer => {
                        if(index == answer){
                            count ++;
                        }
                    });
                    totalanswer += count
                    col_categorydata.push({
                        name:index,
                        y:count
                    });
                }
                col_categorydata.forEach((data, i) => {
                    var thispercent =(data.y * 100)/totalanswer
                    if(!thispercent){
                        thispercent = 0;
                    } 
                    if(data.name <=6){
                        detractor+=data.y
                    } else if(data.name <=8){
                        passives+=data.y
                    } else {
                        promoters+=data.y
                    }

                    thispercent = thispercent.toFixed(2)
                    rating.push({
                        percentage:thispercent,
                        selected:data.y,
                        total:totalanswer,
                        name:data.name,

                    })
                    col_categorydata[i].y = thispercent
                    allchartdata.push(thispercent);
                })
                var per_detractor = (detractor/(all_answer.length))*100
                var per_passives = (passives/(all_answer.length))*100
                var per_promoters = (promoters/(all_answer.length))*100
                if(!per_detractor){per_detractor = 0;}
                if(!per_passives){per_passives = 0;}
                if(!per_promoters){per_promoters = 0;}
                per_detractor = per_detractor.toFixed(2)
                per_passives = per_passives.toFixed(2)
                per_promoters = per_promoters.toFixed(2)
                var npsscore = (per_promoters - per_detractor)?(per_promoters - per_detractor).toFixed(2):0;
                this.defaultheight = 50 * (alllabels.length);
                this.chartdata.labels = alllabels
                this.dchartdata.labels = ["Detractors", "Passives", "Promoters"]
                this.doptions.title.text = npsscore+" NPS"
                this.dchartdata.datasets = [{
                    label: '',
                    data: [per_detractor, per_passives, per_promoters],
                    backgroundColor: ["#ec2049","#f7db4f", "#2f9599" ],
                    borderColor: ["#ec2049","#f7db4f", "#2f9599" ],
                    borderWidth: 1
                }]
                this.chartdata.datasets = [{
                    label: '',
                    data: allchartdata,
                    backgroundColor: alllabelcolors,
                    borderColor: alllabelcolors,
                    borderWidth: 1
                }]
                this.datafortable = rating;
                this.colchart.series = [{
                    name: "",
                    colorByPoint: true,
                    data: col_categorydata
                }]
                this.showchart = 1
            }
        })
    }
},

  created(){
    this.getfilterdata()
  },
    watch: {
    // whenever question changes, this function will run
    contactuserid: function (ncontactuserid, ocontactuserid) {
        // console.log("watch report",ncontactuserid);
        this.getfilterdata();
    }
    },
}
</script>


