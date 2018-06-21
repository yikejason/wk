//学习报告   页面16
import * as React from "react";
import ReactEcharts from 'echarts-for-react';
import {Toast} from 'antd-mobile';
import styles from './page.less'
import router from 'umi/router';
import api from '../../api'
import {changeTimeFuc} from '../../components';
// import changeTimeFuc from '../../components/changeTimeFuc'


export default class Home extends React.Component {
  state = {
    data: {},
    PhaseID: JSON.parse(sessionStorage.getItem('user')).PhaseID,//30020表示是小学,获取缓存数据判断用户是不是小学生
    loading:true,
  };

  componentDidMount() {
    Toast.loading('加载中...',1);
    api.GetLearnReport().then(res => {
      this.setState({loading:false});
      if (res.Ret === 0) {
        this.setState({
          data: res.Data,
        });
      } else {
        Toast.fail(res.Msg);
      }
    });
  };

  //查看全部
  //查看积分排名
  goPointsRank = () => {
    router.push('/pointsRank');
  };
  //柱形图数据
  barData = (data, typeName) => {
    if(data){
    var newData = data.map(e => {
      if (typeName !== '累计学习时长') {
        return e;
      }
      return (Math.ceil(e));
    });
  }

     data = newData;
   
    let option;
    return option = {
      tooltip: {
        trigger: 'item',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (data) => {
          if (typeName !== '累计学习时长') {
            return '<div style="font-size:27px; line-height: 1.1;">' + data.name + '<br/>' + typeName + '：'+(data.value) + '</div>';
          }
          return '<div style="font-size:27px; line-height: 1.1;">' + data.name + '<br/>' + typeName + '：'+changeTimeFuc(data.value) + '</div>';
      }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['个人', '班级最高', '全国最高'],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {textStyle: {fontSize: 25}},
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {textStyle: {fontSize: 25}},
        },
      ],
      series: [
        {
          name: typeName,
          type: 'bar',
          barWidth: '30%',
          data: data,
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                var colorList = ['#A4D8FD', '#F5D781', '#F88C66'];
                return colorList[params.dataIndex];
              }
            },
            emphasis : {
              color : '#ddd'
            }
          },
          label: {
            normal: {
              show: true,            //显示数字
              position: 'top',      //这里可以自己选择位置
              formatter: (data) => {
                if (typeName !== '累计学习时长') {
                  return data.value;
                }
                return changeTimeFuc(data.value);
              },
              textStyle: {fontSize: 20, color: '#585858'},

            }
          },
          axisLabel: {textStyle: {fontSize: 25}},


        }
      ]
    }
  };
  //折线图数据
  lineData = (x, y) => {
    let option;
    return option = {
      color: ['#EAF3FE', '#6AB7ED',],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: x,
        axisLabel: {textStyle: {fontSize: 25}},
      },
      yAxis: {
        type: 'value',
        axisLabel: {textStyle: {fontSize: 25}},
      },
      series: [{
        data: y,
        type: 'line',
        areaStyle: {},
        lineStyle: {
          color: ['#5da9da'],
        }
      }]
    }
  };

  //去学习
  goStudy = () => {
    router.push('./courseList');
  };


  render() {
    const {data, PhaseID} = this.state;
    const ClassName = JSON.parse(sessionStorage.getItem('user')).ClassName;
    return <div>
      {this.state.loading ? '': data && !data.IsLearn ?
        <div className={styles.noData}>
          <div className={styles.title}>
            <img src={require('../../public/assets/noData.png')} alt=""/>
            <span>你还没有学习，暂无学习报告，继续加油哦!</span>
            <div className={styles.study} onClick={this.goStudy}>
              去学习
            </div>
            <div className={styles.line}>

            </div>
          </div>
          <div className={styles.numberRank}>
            <div className={styles.header}>
              <span>{ClassName}</span>学习排行
            </div>
            {
              data && data.PointRankList && data.PointRankList !== 0 ?
                data.PointRankList.map((item, index) => {
                  return <div key={index} className={styles.classItem}>
                    <div className={styles.itemImg}>
                      {
                        index > 2 ? <span className={styles.number}>{index + 1}</span> :
                          <img src={require(`../../public/assets/jiangpai${index + 1}.png`)} alt=""/>
                      }
                      <span className={styles.name}>{item.UName}</span>
                    </div>
                    <span>{item.Point}分</span>

                  </div>

                }) : <span style={{display: 'flex', justifyContent: 'center', padding: '30px'}}>暂无数据</span>

            }
            <div className={styles.btn} onClick={this.goPointsRank}>
              <span>查看全部</span>
            </div>
          </div>
        </div>
        :
        <div className={styles.report}>

          <div className={styles.total}>
            <span className={styles.totalNumber}>{data && data.LearnReport ? data.LearnReport.PointReport.Point : 0}</span>
            <span>累计积分</span>
          </div>

          <div className={styles.rank}>
            <div className={styles.rankLeft}>
                                <span className={styles.rankLeftTop}>
                                    班级排名：{data && data.LearnReport && data.LearnReport.PointReport.ClassRank ? `第${data.LearnReport.PointReport.ClassRank}名` : "暂无排名"}
                                </span>
              <span className={styles.rankLeftBottom}>
                                    班级最高：{data && data.LearnReport && data.LearnReport.PointReport && data.LearnReport.PointReport.ClassMaxPoint ? `${data.LearnReport.PointReport.ClassMaxPoint}` : "暂无"}
                                </span>
            </div>
            <div className={styles.rankRight}>
              <div className={styles.rankRightTop}>
                全国排名：{data && data.LearnReport && data.LearnReport.PointReport.ClassRank ? `第${data.LearnReport.PointReport.AllRank}名` : "暂无排名"}
              </div>
              <div className={styles.rankRightBottom}>
                全国最高：{data && data.LearnReport ? `${data.LearnReport.PointReport.AllMaxPoint}` :  "暂无"}
              </div>
            </div>
          </div>

          <div className={styles.chart}>
            <p className={styles.chartTitle}>累计学习时长</p>
            <p>
              个人学习时长累计
              <span>{data && data.LearnReport ? changeTimeFuc(data.LearnReport.LearnSecondsReport.LearnSeconds) : 0}</span>，
              班级排名<span>{data && data.LearnReport ? data.LearnReport.LearnSecondsReport.ClassRank : 0}</span>名，
              全国排名<span>{data && data.LearnReport ? data.LearnReport.LearnSecondsReport.AllRank : 0}</span>名
            </p>
            <div>
              <ReactEcharts
                option={this.barData(data && data.LearnReport ? data.LearnReport.LearnSecondsReport.ChartData : 0, '累计学习时长')}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
              />
            </div>

          </div>

          {
            PhaseID === '30020' ? <div className={styles.chart}>
                <p className={styles.chartTitle}>连续学习天数</p>
                {
                    data && data.LearnReport && data.LearnReport.ContinLearnDaysReport && (data.LearnReport.ContinLearnDaysReport.MaxDays > 0)
                        ?
                        <p>
                          个人连续学习记录有
                          <span>{data && data.LearnReport && data.LearnReport.ContinLearnDaysReport ? data.LearnReport.ContinLearnDaysReport.ContinRecodeCnt : null}</span>次，
                          最大天数为<span>{data && data.LearnReport && data.LearnReport.ContinLearnDaysReport ? data.LearnReport.ContinLearnDaysReport.MaxDays : null}</span>天，
                          班级排名<span>{data && data.LearnReport && data.LearnReport.ContinLearnDaysReport ? data.LearnReport.ContinLearnDaysReport.ClassRank : null}</span>名，
                          全国排名<span>{data && data.LearnReport && data.LearnReport.ContinLearnDaysReport ? data.LearnReport.ContinLearnDaysReport.AllRank : null}</span>名，
                        </p>
                        :
                        <p>
                          你还没有连续学习的记录,学习贵在坚持,从现在开始吧
                        </p>
                }

                <div>
                  <ReactEcharts
                    option={this.barData(data && data.LearnReport && data.LearnReport.ContinLearnDaysReport ? data.LearnReport.ContinLearnDaysReport.ChartData : null, '连续学习天数')}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"theme_name"}
                  />
                </div>
              </div> :
              <div className={styles.chart}>
                <p className={styles.chartTitle}>累计学习天数</p>
                  {
                      data && data.LearnReport && data.LearnReport.AccumuLearnDaysReport && (data.LearnReport.AccumuLearnDaysReport.AccumDays > 0)
                          ?
                          <p>
                            个人累计学习：
                            {data && data.LearnReport && data.LearnReport.AccumuLearnDaysReport ? `最大天数为${data.LearnReport.AccumuLearnDaysReport.AccumDays}天` : '暂未学习'}，
                            {data && data.LearnReport && data.LearnReport.AccumuLearnDaysReport ? `班级排名为${data.LearnReport.AccumuLearnDaysReport.ClassRank}名` : '暂无班级排名'}，
                            {data && data.LearnReport && data.LearnReport.AccumuLearnDaysReport ? `全国排名为${data.LearnReport.AccumuLearnDaysReport.AllRank}名` : '暂无全国排名'}
                           
                          </p>
                          :
                          <p>
                            你还没有累计学习的记录,学习贵在坚持,从现在开始吧
                          </p>

                  }

                <div>
                  <ReactEcharts
                    option={this.barData(data && data.LearnReport && data.LearnReport.AccumuLearnDaysReport ? data.LearnReport.AccumuLearnDaysReport.ChartData : null, '连续学习天数')}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"theme_name"}
                  />
                </div>

              </div>

          }


          <div className={styles.chart}>
            <p className={styles.chartTitle}>学习习惯</p>
            <p>
              你累计学习
              <span>{data && data.LearnReport ? data.LearnReport.HabitReport.AccumuDays : null}</span>天，
             <span> 学习时间集中在 {data && data.LearnReport ? data.LearnReport.HabitReport.Concentrate : null} 点</span>
              {PhaseID === '30040' ? '' : <span>
                                ，
                {PhaseID === '30020' ? '21:00' : '10:30'}前学习<span>{data && data.LearnReport ? data.LearnReport.HabitReport.BeforDays : null}</span>天，
                {PhaseID === '30020' ? '21:00' : '10:30'}后学习<span>{data && data.LearnReport ? data.LearnReport.HabitReport.AfterDays : null}</span>天，
                {
                  data && data.LearnReport && data.LearnReport.HabitReport.BeforDays > data.LearnReport.HabitReport.AfterDays ?
                    <span>学习习惯良好，继续加油</span>
                    : <span>学习习惯有待改善 ，加油哟</span>
                }
                            </span>}

            </p>
            <div>
              <ReactEcharts
                option={this.lineData(data && data.LearnReport ? data.LearnReport.HabitReport.ChartData.XAxials : null, data && data.LearnReport ? data.LearnReport.HabitReport.ChartData.YAxials : null)}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
              />
            </div>

          </div>

          <div className={styles.bottom}>
            <div className={styles.bottomLeft} onClick={this.goPointsRank}>
              查看积分排名
            </div>
            <div className={styles.bottomRight} onClick={this.goStudy}>
              <span>学习一下</span>
            </div>
          </div>


        </div>
      }

    </div>


  }
}