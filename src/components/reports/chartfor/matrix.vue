 <template>
    <div class="chart-container">
            <horizontalchart :height="defaultheight" v-if="showchart == 1"  :chartdata="chartdata" :options="options"></horizontalchart>
        <br/>
        <v-layout style='page-break-before: always;'>
         <v-container>
            <div class="matrix">
                <table class="table charttable">

                    <tr>
                        <td></td>
                        <td v-for="(row, i) in allrows" :key="`dsada${i}`">{{row}}</td>
                    </tr>

                    <template v-for="(smatrix, index) in matrix">
                      <tr v-bind:key="`rank${index}`">
                          <td>{{smatrix.name}}</td>

                    <template v-for="(rmatrixindex, indexs) in smatrix.alldata">
                          <td :key="indexs">{{rmatrixindex.percent}}<br>
                          ({{rmatrixindex.selected}})</td>
                    </template>
                      </tr>
                    </template>
                </table>
            </div>
          </v-container>
        </v-layout>



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
            matrix:[],
            chartcolors :[ "#A7226E", "#EC2049", "#F26B38", "#F7DB4F", "#2F9599", "#E1F5C4", "#EDE574", "# F9D423", "#FC913A", "#FF4E50" ],
            chartdata:{labels: [],datasets: [{label: '',data: [],backgroundColor: [],borderColor: [],borderWidth: 1}]},
            options:{ responsive: true,tooltips: {"enabled": false},"hover": {"animationDuration": 0},"animation": {"onComplete": function() {var chartInstance = this.chart,ctx = chartInstance.ctx;ctx.textAlign = 'center';ctx.textBaseline = 'bottom';this.data.datasets.forEach(function(dataset, i) {var meta = chartInstance.controller.getDatasetMeta(i);meta.data.forEach(function(bar, index) {var data = dataset.data[index]+"%";ctx.fillText(data, bar._model.x+20, bar._model.y + 7);});});}}, maintainAspectRatio: false,legend: {display: true,labels: {fontColor: 'rgb(255, 99, 132)'}},scales: {xAxes: [{ticks: {beginAtZero: true,callback: (value) => value+"%",suggestedMin:2,suggestedMax:100,}}]}},
            allrows:[],
            matrixtotal1:[],
            datas:4,
            showchart:0,
            chartdata: {
                chart: {
                    type: 'bar',
                    backgroundColor:'#F5F5F5'
                },
                title: {
                    text: ''
                },
                colors: ['#A7226E', '#EC2049', '#F26B38', '#F7DB4F','#2F9599','#E1F5C4','#EDE574', '#  F9D423', '#FC913A', '#FF4E50'],
                seriesColor: '#6fcd98',
                xAxis: {
                    categories: [],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    title: {
                        text: 'Progress Rate (%)'
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
        }
    },
    methods :{
        getfilterdata:function(){
            this.showchart = 0
            axios.post(`/allanswers`,{'questionid':this.question._id}).then(response => {
                if(response.data == null){
                } else { 
                    var all_answer = [];
                    const all_rows = this.question.allrows
                    const all_cols = this.question.allcols
                    this.allanswers = response.data;
                    response.data.forEach(answer => {
                        if(this.contactuserid.length > 0 && this.contactuserid.indexOf(answer.userid)<0){
                            return;
                        } else {
                            var only_as = JSON.parse(answer.answer);
                            if(only_as){
                                all_answer = all_answer.concat(only_as); 
                            }
                        }
                    });
                    var categories = [];
                    var totalcategorydata = [];
                    var totalanswer = 0;
                    var matrixtotal =[];
                    var allchartdata = []
                    var totalHcounter = 1;
                    this.allrows = []            
                    // console.log("all_answer- ", all_answer)

                    var newallchartdata = []
                    all_cols.forEach(col => {
                        if(col.option == ""){
                            return;
                        }
                        var crowdata = [];
                        var totalcount = 0;
                        all_rows.forEach((row, cindex) => {
                            if(row.option == ""){
                                return;
                            }
                            if(this.question.qtype == "1"){
                                var thischoice = all_answer.filter( function(item) {
                                    return (item.rowid == row._id && (item.selected.indexOf(col._id)>=0));
                                });
                            } else {
                                var thischoice = all_answer.filter( function(item) {
                                    return (item.rowid == row._id && item.selected == col._id);
                                });
                            }
                            var thisrow = all_answer.filter( function(item) {
                                return (item.rowid.indexOf(row._id)>=0 && (item.selected.length>0));
                            });
                            if(!thischoice){thischoice=[]}
                            if(!thisrow){thisrow=[]}
                            totalcount = thisrow;
                            crowdata.push({
                                rowid:row._id,
                                option:row.option,
                                totalcount:totalcount.length,
                                data:thischoice.length
                            })
                        });
                        newallchartdata.push({
                            colid:col._id,
                            option:col.option,
                            totalcount:totalcount,
                            data:crowdata
                        })
                    });
                    var finald = [];
                    var allchartdata = [];
                    var matrixtotal = [];
                    var totalHcounter = 0;
                    all_rows.forEach((row, cindex) => {
                            if(row.option == ""){
                                return;
                            }
                            var alldata=[];
                            all_cols.forEach(col => {
                                if(col.option == ""){
                                    return;
                                }
                                totalHcounter++;
                                alldata.push({ "selected": 0, "total": 0, "percent": "0%" })
                            });
                            matrixtotal.push({
                                name:row.option,
                                alldata:alldata
                            });
                    });
                    newallchartdata.forEach((col, cindex) => {
                        this.allrows.push(col.option)
                        var rowd = col.data;
                        var data = [];
                        var  alllabelcolors = [];
                        var alltd = []
                        rowd.forEach((row, j) => {
                            var per_data = (row.data * 100)/(row.totalcount)
                            if(!per_data){
                                per_data = 0;
                            }
                            alllabelcolors.push(this.chartcolors[cindex % this.chartcolors.length])
                            per_data = per_data.toFixed(2);
                            data.push(per_data);
                            matrixtotal[j].alldata[cindex] = {
                                selected:row.data,
                                total:row.totalcount,
                                percent:per_data+"%"
                            };
                        });
                        allchartdata.push(
                            {
                                label:col.option,
                                data:data,
                                backgroundColor:alllabelcolors
                            }
                        )
                    });
                    var allrowlabels = []
                    all_rows.forEach(row => {
                        if(row.option == ""){
                            return;
                        }
                        allrowlabels.push(row.option)
                        categories.push(row.option);
                    })
                    this.chartdata.labels = allrowlabels
                    this.chartdata.datasets = allchartdata
                    this.defaultheight = 50 * totalHcounter / 2;
                    this.showchart = 1
                    this.matrix = matrixtotal;
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
          console.log("watch report",ncontactuserid);
          this.getfilterdata();
      }
    },
}
</script>


