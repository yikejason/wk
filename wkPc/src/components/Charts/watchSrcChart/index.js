/**
 * Created by Yu Tian Xiong on 2017/05/08.
 * fileName:各时段用户数组件   折线图
 */
import React, {Component} from 'react';
import {Chart, Axis, Geom, Tooltip} from 'bizcharts';
import Slider from 'bizcharts-plugin-slider';
import DataSet from '@antv/data-set';

export default class WatchlineChart extends Component {

  //回调函数更改折线颜色
  handleChangeColor = () => {
    return "#3bc562"
  };
  //截取前100字符
  changeString = (str) => {
    let strOne = str.substr(0, 100);
    if (strOne.replace(/[^\x00-\xff]/g, "01").length > 100) {
      strOne = strOne + '......'
    }
    return strOne;
  };

  render() {
    const {data} = this.props;
    const cols = {'number': {min: 0}, 'time': {range: [0, 1]}};
    //图表联动
    const ds = new DataSet({
      state: {
        start: data.LineChart[0].time,
        end: data.LineChart[data.LineChart.length - 1].time,
      },
    });
    const dv = ds.createView();
    dv.source(data.LineChart)
      .transform({
        type: 'filter',
        callback: (obj) => {
          const date = obj.time;
          return date <= ds.state.end && date >= ds.state.start;
        },
      });
    //配置显示框
    const tooltip = [
      'time*number',
      (time, number) => ({
        name:'观看人数',
        value: number,
      }),
    ];
    return (
      <div>
        {Object.keys(data).length !== 0 &&
        <div>
          <Chart height={400} data={dv} scale={cols} forceFit>
          <Axis name="time"/>
          <Axis name="number"/>
          <Tooltip showTitle={false}/>
          <Geom type="line" position="time*number" size={2} style={['sales*city', {lineWidth: 1, stroke: this.handleChangeColor}]} tooltip={tooltip}/>
          </Chart>
          <div><Slider
            padding={[60, 50, 40, 40]}
            width="auto"
            height={26}
            xAxis="time"
            yAxis="number"
            data={data.LineChart}
            start={data.LineChart[0].time}
            end={data.LineChart[data.LineChart.length - 1].time}
            backgroundChart={{type: 'line'}}
            onChange={({startValue, endValue}) => {ds.setState('start', startValue);ds.setState('end', endValue);}}
          />
            <div style={{marginTop:10,textAlign:'center'}}>{this.changeString(data.Conclusion)}</div>
          </div>
        </div>}
      </div>
    )
  }
}