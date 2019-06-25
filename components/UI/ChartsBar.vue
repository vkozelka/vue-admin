<script>
  import {Bar} from 'vue-chartjs'
  import chartjsPluginDatalabels from "chartjs-plugin-datalabels";

  export default {
    extends: Bar,
    name: 'chart',
    props: ['count'],

    mounted() {
      this.addPlugin({
        id: 'my-plugin',
      })

      if (this.count && this.count.data) {
        this.chartData.labels = this.count.dates
        this.chartData.datasets[0].data = this.count.data
        this.chartData.total=this.count.total
        this.charOptions.title.text=this.t('Total')+': '+this.count.total+' | '+this.t('Today')+': '+this.count.today+' | '+this.t('Yesterday')+': '+this.count.yesterday
        this.renderChart(this.chartData, this.charOptions)
      }

    },
    data() {
      return {
        chartData: {
          labels: [],
          datasets: [
            {
              label: this.t('Visits'),
              backgroundColor: '#2195f3',
              data: []
            }
          ],
          total:0
        },
        charOptions: {
          legend: {display: false},
          responsive: true,
          maintainAspectRatio: false,
          showTooltips: false,
          plugins: {
            datalabels: {
              anchor:'end',
              align:  'start',
              color: 'black',
              font: {
                weight: 'bold',
                size: '15'
              },
              rotation: 0,
              offset: -30,
              formatter: function(value, context) {
                if(value==0){
                  return ''
                }

              }
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                min: 0,
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return  value;

                  }
                },

              }
            }]
          },
          title:{
            display:true,
            text:''
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>