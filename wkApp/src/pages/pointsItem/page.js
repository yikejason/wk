// 积分明细【页面18】

import * as React from "react";
import ReactEcharts from 'echarts-for-react';
import {Toast} from 'antd-mobile';
import styles from './page.less'
import api from '../../api'
import router from 'umi/router';
import Config from '../../api/config';

export default class Home extends React.Component {
  state = {
    TotalPoint: '',//累计积分
    ExchangePoint: '',//已兑换积分
    AvailPoint: '',//可用积分
    weekList: [],//周积分明细列表
    HasNext: false,
    CursorID: 0,
  };

  componentDidMount() {
    api.GetPointDetlView().then(res => {
      if (res.Ret === 0) {
        this.setState({
          TotalPoint: res.Data.TotalPoint,
          ExchangePoint: res.Data.ExchangePoint,
          AvailPoint: res.Data.AvailPoint,
          weekList: res.Data.PointDetl.ViewModelList,
          HasNext: res.Data.PointDetl.HasNext,
          CursorID: res.Data.PointDetl.CursorID,
        })
      } else {
        Toast.fail(res.Msg);
      }
    });
    this.getPrizeNumber();

  };

  //积分明细分页
  GetTopPointWeekSum = (TopSize, CursorID) => {
    api.GetTopPointWeekSum({TopSize: 2, CursorID: this.state.CursorID, IsAsc: false}).then(res => {
      if (res.Ret === 0) {
        const weekList = [...this.state.weekList, ...res.Data.ViewModelList];
        this.setState({
          ...res.Data, weekList,
          HasNext: res.Data.HasNext,
        })
      }
    })
  };
  //获取echarts数据
  getOption = (name) => {
    const {AvailPoint, TotalPoint} = this.state;
    let option;
    return option = {
      title: {
        text: AvailPoint,
        subtext: name,
        x: 'center',
        y: 'center',
        itemGap: 2,
        subtextStyle: {
          fontSize: 40,
          fontWeight: 'bold'
        },
        textStyle: {
          fontSize: 50,
          fontWeight: 'bold'
        }
      },
      color: ['#41B0FD', '#E5E5E5'],
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['80%', '100%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          legendHoverLink: false,
          silent: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {value: TotalPoint, name: '总积分'},
            {value: AvailPoint, name: '可用积分'},
          ]
        }
      ]
    };
  };

  //获取当前用户可用抽奖次数和活动id
  getPrizeNumber = () => {
    api.GetPrizeTimes().then(res => {
      if (res.Ret === 0) {
        this.setState({
          CurrPrizeTimes: res.Data.CurrPrizeTimes,
          ActivityID: res.Data.ActivityID
        })
      }
    })
  };
  //根据当前抽奖次数跳转页面
  goPage = () => {
    const {CurrPrizeTimes, ActivityID} = this.state;
    if (CurrPrizeTimes > 0) {
      window.location.href = `${Config.prizeUrl}/prizeH5/lottery.html?activityID=${ActivityID}&appenname=UCUX`;
    } else {
      router.push('./prizeNumber')
    }
  };
  //去商城兑换商品
  goShop = () => {window.location.href = Config.shopUrl};
  render() {
    const {ExchangePoint, TotalPoint, weekList, HasNext} = this.state;
    return <div className={styles.pointsItem}>
      <div className={styles.header}>
        <ReactEcharts className={styles.pie} option={this.getOption('可用积分')} style={{height: 380, width: 380}}/>
        <div className={styles.pieText}>
          <div className={styles.total}>
            累计积分 <span className={styles.number}>{!TotalPoint ? 0 : TotalPoint}</span>
          </div>
          {/*<div className={styles.exchange}>*/}
            {/*兑换积分 <span className={styles.number}>{!ExchangePoint ? 0 : ExchangePoint}</span>*/}
          {/*</div>*/}
        </div>
      </div>

      <div className={styles.black}>
        &nbsp;&nbsp;积分明细
      </div>
      {
        weekList && weekList.length > 0 ?
          weekList.map((item, index) => {
            return <div key={index} className={styles.content}>
              <div className={styles.contentTitle}>
                <div className={styles.left}>
                  第 {item.WeekID} 周({item.SDate.substr(5, 6).trim()}-{item.EDate.substr(5, 6).trim()})
                </div>
                <div className={styles.right}>
                  <span>获取{item.SumIncPoint}</span>
                  {/*<span className={styles.change}>兑换{item.SumSubPoint}</span>*/}
                </div>
              </div>
              {
                !item.Detls ? '' :
                  item.Detls.map((item, index) => {
                    return <div key={index} className={styles.item}>
                      <div className={styles.top}>
                        <span>{item.Title}</span>
                        <span>+{item.CalcPoint}</span>
                      </div>
                      <div className={styles.bottom}>
                        <span>
                          总计
                          <span className={styles.number}>{item.AvailPoint}</span>
                        </span>
                        <span>{item.Date.substr(0, 10)}</span>
                      </div>
                    </div>
                  })
              }
              <div className={styles.black}>

              </div>
            </div>
          }) : <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 0'
          }}>
            <img src={require("../../public/assets/kong1.png")} alt=""
                 style={{width: '248px', height: '214px', margin: '20px 0'}}/>
            <span>暂无相关数据</span>
          </div>
      }
      {
        weekList && weekList.length == 0 ? '' : HasNext ?
          <span style={{display: 'flex', justifyContent: 'center', padding: '30px 0', marginBottom: '1rem'}}
                onClick={() => this.GetTopPointWeekSum(2, 1)}>点击加载更多</span> :
          <span style={{display: 'flex', justifyContent: 'center', padding: '30px 0'}}>没有更多了</span>
      }
      {/*积分大于0去抽奖显示*/}
      {this.state.AvailPoint > 0 ? <div className={styles.btn}>
          <span className={styles.luckyDraw}>
            <span className={styles.goPrize} onClick={this.goPage}>去抽奖</span>
          </span>
          <span className={styles.shop}>
            <span className={styles.goShop} onClick={this.goShop}>兑换商品</span>
          </span>
      </div> : null}
      {/*积分等于0显示去学习*/}
      {this.state.AvailPoint === 0 ?
        <div className={styles.goLearn}>
          <button className={styles.learnBtn} onClick={() => {router.push('./courseList');}}>去学习</button>
        </div> : null}
    </div>
  }

}