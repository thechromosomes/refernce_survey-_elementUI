 <template>
    <div class="chart-container">
        <!-- <v-layout>
            <highcharts v-if="showchart == 1" height="600px" :options="colchart" ></highcharts>
        </v-layout> -->
            <horizontalchart :height="defaultheight" v-if="showchart == 1"  :chartdata="chartdata" :options="options"></horizontalchart>
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
export default {
    props:['question','contactuserid'],
    components: {horizontalchart},
    data() {
    return {
        questiondata:this.question,
        allanswers:[],
        defaultheight:"200",
        datafortable:[],
        chartcolors :[ "#A7226E", "#EC2049", "#F26B38", "#F7DB4F", "#2F9599", "#E1F5C4", "#EDE574", "# F9D423", "#FC913A", "#FF4E50" ],
        chartdata:{labels: [],datasets: [{label: '',data: [],backgroundColor: [],borderColor: [],borderWidth: 1}]},
        options:{ responsive: true,tooltips: {"enabled": false},"hover": {"animationDuration": 0},"animation": {"onComplete": function() {var chartInstance = this.chart,ctx = chartInstance.ctx;ctx.textAlign = 'center';ctx.textBaseline = 'bottom';this.data.datasets.forEach(function(dataset, i) {var meta = chartInstance.controller.getDatasetMeta(i);meta.data.forEach(function(bar, index) {var data = dataset.data[index]+"%";ctx.fillText(data, bar._model.x+20, bar._model.y + 7);});});}},maintainAspectRatio: false,legend: {display: false},scales: {xAxes: [{ticks: {beginAtZero: true,callback: (value) => value+"%",suggestedMin:2,suggestedMax:100,}}]}},
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
                const maxrate = this.question.length
                response.data.forEach(answer => {
                    if(this.contactuserid.length > 0 && this.contactuserid.indexOf(answer.userid)<0){
                        return;
                    } else {
                        var only_as = JSON.parse(answer.answer);
                        all_answer = all_answer.concat(only_as); 
                    } 
                    var only_as = JSON.parse(answer.answer);
                    all_answer = all_answer.concat(only_as); 
                });
                var col_categorydata = [];
                var rating = [];
                var totalanswer = 0;
                var  alllabels = [];
                var  alllabelcolors = [];
                var allchartdata = []
                for (let index = 1; index <= maxrate; index++) {
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

                this.defaultheight = 50 * (alllabels.length);
                this.chartdata.labels = alllabels
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


