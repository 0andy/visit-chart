const chartDataNew = []

let app = getApp()

Page({
  data: {
    id: null,
    width: 200,
    height: 200,
    chart: null,
    items: [],
    details: [],
    type: null
  },
  onLoad(query) {
    if (query.id) {
      this.setData({ id: query.id });
    }
  },
  onReady() {

  },
  onDraw(ddChart, F2) {
    this.getAreaChar(ddChart, F2);
  },
  getAreaChar(ddChart, F2) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/GrowerAreaRecord/GetAreaOrganization',
      method: 'Get',
      data: {
        id: this.data.id,
        type: this.data.type
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        //         this.setData({
        //   items: [],
        //   details: []
        // });
        this.setData({
          items: res.data.result.list,
          details: res.data.result.detail
        });
        console.log(this.data.details);
        // this.setData({ actual:res.data.result.actual,expected:res.data.result.expected,items: res.data.result.list });
        const chartDataNew = this.data.items;
        if (!this.data.chart) {
          ddChart.clear()
          // ddChart.source(chartDataNew, {
          //   population: {
          //     tickCount: 5
          //   }
          // })
          ddChart.source(chartDataNew)
          ddChart.coord({
            transposed: true
          })
          ddChart.axis('areaName', {
            line: F2.Global._defaultAxis.line,
            grid: null
          });
          ddChart.axis('area', {
            line: null,
            grid: F2.Global._defaultAxis.grid,
            label: function label(text, index, total) {
              var textCfg = {};
              if (index === 0) {
                textCfg.textAlign = 'left';
              } else if (index === total - 1) {
                textCfg.textAlign = 'right';
              }
              return textCfg;
            }
          });
          // ddChart.interval().position('areaName*area').color('groupName', ['#13C2C2', '#9AC2AB', '#FE5D4D']).adjust('stack');
          ddChart.interval().position('areaName*area').color('groupName').adjust({
            type: 'dodge',
            marginRatio: 1 // 设置分组间柱子的间距
          });
          ddChart.render()
          this.data.chart = ddChart;
          this.setData({type: ''});
        } else {
          ddChart.changeData(chartDataNew);
        }
      },
      fail: function(res) {
        dd.hideLoading();
        dd.alert({ content: '获取数据异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
  onItemMothClick(index) {
    //     console.log(index.index);


    // console.log(this.data.details[index.index].departmentId);
    this.setData({type: 'children',id:this.data.details[index.index].departmentId});
    this.onDraw(this.data.chart);
    }
})