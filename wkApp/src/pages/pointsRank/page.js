//积分排名【页面17】
import * as React from "react";
import ReactEcharts from 'echarts-for-react';
import styles from './page.less'
import {Tabs, WhiteSpace, Toast} from 'antd-mobile';
import api from '../../api'
import router from 'umi/router';
import Config from '../../api/config';

export default class Home extends React.Component {
    state = {
        data: {},
      AvailPoint: '',//可用积分
    };

    componentDidMount() {
        api.GetPointOverView().then(res => {
            if (res.Ret === 0) {
                this.setState({
                    data: res.Data,
                  AvailPoint: res.Data.AvailPoint,
                })
            } else {
                Toast.fail(res.Msg);
            }
        });
        this.getPrizeNumber();
    };

    //转换时间
  changeTime = (second) => {
    const seconds = second % 60;
    const minutes = Math.floor(second / 60) % 60;
    const hours = Math.floor(second / (60*60)) % 24;
    const days = Math.floor(second / (60*60*24)) % 365;
    const years = Math.floor(second / (60*60*24*365));
    if(years){
      return `${years}年${days}天${hours}小时${minutes}分${seconds}秒`;
    }
    if(days){
      return `${days}天${hours}小时${minutes}分${seconds}秒`;
    }
    if(hours){
      return `${hours}小时${minutes}分${seconds}秒`;
    }
    if(minutes){
      return `${minutes}分${seconds}秒`;
    }
    return `${seconds}秒`;
  };

    //积分规则
    goPointsRuler = () => {
        router.push('/pointsRuler');
    };
    //积分明细
    goPointsItem = () => {
        let {data} = this.state;
        data.TotalPoint && router.push('/pointsItem');
    };
    //去学习
    goStudy = () => {
        router.push('./courseList');
    };

  //获取当前用户可用抽奖次数和活动id
  getPrizeNumber = () => {
    api.GetPrizeTimes().then(res => {
      if (res.Ret === 0) {
        this.setState({
          CurrPrizeTimes: res.Data.CurrPrizeTimes,
          ActivityID: res.Data.ActivityID
        },()=>{})
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
        const tabs = [
            {title: '班级排名', sub: '1'},
            {title: '全国排名', sub: '2'},
        ];
        const {data} = this.state;
        return <div className={styles.pointsRank}>
            <div className={styles.title}>
                <div className={styles.number}>
                    <div style={{textAlign:'center'}}>
                      {!data.TotalPoint ? 0 : data.TotalPoint}
                        {
                            data && data.TotalPoint > 0 ?
                            <span onClick={this.goPointsItem}  className={styles.ruler} style={{color:"#ffffff"}} >积分明细</span>
                            :
                            <span className={styles.ruler} style={{color:"#e0e0e0"}}>积分明细</span>
                        }
                    </div>
                </div>
                <div className={styles.explain}>
                    <span>
                    <span>累计积分</span>
                    <img src={require('../../public/assets/gz.png')} alt="" onClick={this.goPointsRuler}/>
                    </span>
                </div>

            </div>

            <div className={styles.twoPoints}>
                <div className={styles.left}>
                    今日积分：{!data.TodayPoint ? 0 : data.TodayPoint}
                </div>
                <div className={styles.line}>

                </div>
                <div className={styles.right}>
                    可用积分：{!data.AvailPoint ? 0 : data.AvailPoint}
                </div>

            </div>

            <Tabs tabs={tabs}
                  initialPage={0}
                  tabBarPosition="top"
                  renderTab={tab => <span>{tab.title}</span>}
            >
                <div className={styles.classRank}>
                    {
                        !data.SelfRankOfClass ? '' : <div className={styles.myRank}>
                        <span className={styles.rankNumber}>
                            {data.SelfRankOfClass.Rank === 0 ?
                                <span style={{opacity: 0}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                                
                                    data.SelfRankOfClass.Rank > 3 ? <span>&nbsp;&nbsp;{data.SelfRankOfClass.Rank}</span> :
                                        <img src={require(`../../public/assets/jiangpai${data.SelfRankOfClass.Rank}.png`)} alt="" className={styles.rankCake}/>
                            }
                                
                        </span>
                            <div className={styles.rankImg}>
                                <img src={data.SelfRankOfClass.UPic} alt=""/>
                            </div>
                            <span className={styles.rankItem}>
                            <div className={styles.itemOne}>
                                <span className={styles.name}>{data.SelfRankOfClass.UName}</span>
                                {data.SelfRankOfClass.Rank === 0 ? '' :
                                    <span>积分 &nbsp;&nbsp;&nbsp;&nbsp;{data.SelfRankOfClass.TotalPoint}</span>}
                            </div>
                            <div className={styles.itemTwo}>
                                {data.SelfRankOfClass.Rank === 0 ? <span>暂无排名</span> :
                                    <span>{data.SelfRankOfClass.HonorRollCnt}次上荣誉榜</span>}
                                {data.SelfRankOfClass.Rank === 0 ? '' :
                                    <span>学习时长 &nbsp;{this.changeTime(data.SelfRankOfClass.LearnSeconds)}</span>}
                            </div>

                        </span>
                        </div>
                    }

                    {!data.SelfRankOfClass ? '' : <WhiteSpace className={styles.aaa}/>}

                    {
                        data.ClassRank && data.ClassRank.length > 0 ? data.ClassRank.map((item, index) =>
                                <div key={index} className={styles.myRank}>
                        <span className={styles.rankNumber}>
                            {
                                item.Rank > 3 ? <span>{item.Rank}</span> :
                                    <img src={require(`../../public/assets/jiangpai${item.Rank}.png`)} alt="" className={styles.rankCake}/>
                            }
                        </span>
                                    <div className={styles.rankImg}>
                                        <img src={item.UPic} alt=""/>
                                    </div>
                                    <span className={styles.rankItem}>
                            <div className={styles.itemOne}>
                                <span className={styles.name}>{item.UName}</span>
                                <span>积分 &nbsp;&nbsp;&nbsp;&nbsp;{item.TotalPoint}</span>
                            </div>
                            <div className={styles.itemTwo}>
                                <span>{item.HonorRollCnt}次上荣誉榜</span>
                                <span>学习时长 &nbsp;{this.changeTime(item.LearnSeconds)}</span>
                            </div>
                        </span>
                                </div>
                        ) : <span style={{display: 'flex', justifyContent: 'center', padding: '30px'}}>暂无数据</span>
                    }


                </div>


                <div className={styles.classRank}>

                    {
                        !data.SelfRankOfAll ? '' : <div className={styles.myRank}>
                        <span className={styles.rankNumber}>
                        {data.SelfRankOfAll.Rank === 0 ?
                                <span style={{opacity: 0}}></span> :
                                    data.SelfRankOfAll.Rank > 3 ? <span>{data.SelfRankOfAll.Rank}</span> :
                                    <img src={require(`../../public/assets/jiangpai${data.SelfRankOfAll.Rank}.png`)} alt="排名" className={styles.rankCake}/>
                            }
                        </span>
                            <div className={styles.rankImg}>
                                <img src={data.SelfRankOfAll.UPic} alt=""/>
                            </div>
                            <span className={styles.rankItem}>
                            <div className={styles.itemOne}>
                                <span className={styles.name}>{data.SelfRankOfAll.UName}</span>
                                {data.SelfRankOfAll.Rank === 0 ? '' :
                                    <span>积分 &nbsp;&nbsp;{data.SelfRankOfAll.TotalPoint}</span>}
                            </div>
                            <div className={styles.itemTwo}>
                                {data.SelfRankOfAll.Rank === 0 ? <span>暂无排名</span> :
                                    <span>{data.SelfRankOfAll.HonorRollCnt}次上荣誉榜</span>}
                                {data.SelfRankOfAll.Rank === 0 ? '' :
                                    <span>学习时长 &nbsp;{this.changeTime(data.SelfRankOfAll.LearnSeconds)}</span>}
                            </div>

                        </span>
                        </div>
                    }


                    {!data.SelfRankOfAll ? '' : <WhiteSpace className={styles.aaa}/>}

                    {
                        data.AllRank && data.AllRank.length > 0 ? data.AllRank.map((item, index) =>
                                <div key={index} className={styles.myRank}>
                        <span className={styles.rankNumber}>
                            {
                                item.Rank > 3 ? <span>{item.Rank}</span> :
                                    <img src={require(`../../public/assets/jiangpai${item.Rank}.png`)} alt="" className={styles.rankCake}/>
                            }
                        </span>
                                    <div className={styles.rankImg}>
                                        <img src={item.UPic} alt=""/>
                                    </div>
                                    <span className={styles.rankItem}>
                            <div className={styles.itemOne}>
                                <span className={styles.name}>{item.UName}</span>
                                <span>积分 &nbsp;&nbsp;{item.TotalPoint}</span>
                            </div>
                            <div className={styles.itemTwo}>
                                <span>{item.HonorRollCnt}次上荣誉榜</span>
                                <span>学习时长 &nbsp;{this.changeTime(item.LearnSeconds)}</span>
                            </div>
                        </span>
                                </div>
                        ) : <span style={{display: 'flex', justifyContent: 'center', padding: '40px'}}>暂无数据</span>
                    }


                </div>
            </Tabs>
          {/*积分大于0去抽奖显示*/}
          {this.state.AvailPoint > 0 ? <div className={styles.sbBtn}>
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