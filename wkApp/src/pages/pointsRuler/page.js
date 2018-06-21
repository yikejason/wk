//积分规则
import * as React from "react";
import styles from './page.less'
import router from 'umi/router';
import api from "../../api";
import Config from '../../api/config';

export default class Home extends React.Component {

  componentDidMount(){
    this.getPrizeNumber();
  }

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
  //去抽奖
  goPrize = () => {
    const {CurrPrizeTimes, ActivityID} = this.state;
    if (CurrPrizeTimes > 0) {
      window.location.href = `${Config.prizeUrl}/prizeH5/lottery.html?activityID=${ActivityID}&appenname=UCUX`;
    } else {
      router.push('./prizeNumber')
    }
  };
  //去商城兑换
  goShop = () => {window.location.href = Config.shopUrl};
  goStudy = () => {router.push('/learningReport');};
  goExchange = () => {router.push('/courseList');};

  render() {
    return <div className={styles.pointsRuler}>
      <div className={styles.header}>
        <span className={styles.title}>积分有什么用</span>
        <span className={styles.headline}>1、积分可以参与抽取奖品</span>
        <span className={styles.text}>每抽取一次奖品将消耗2个积分，每日参与次数以具体活动规则为准</span>
        <div className={styles.prizeBtn} onClick={this.goPrize}>
          <span className={styles.goPrize}>去抽奖</span>
        </div>
        <span className={styles.headline}>2、积分可以在积分商城兑换商品</span>
        <span className={styles.text}>根据商品定价消耗相应的积分</span>
        <div className={styles.shopBtn} onClick={this.goShop}>
          <span className={styles.goShop}>兑换商品</span>
        </div>
      </div>

      <div className={styles.black}>

      </div>

      <div className={styles.header}>
        <span className={styles.title}>如何获得积分</span>
        <span className={styles.headline}>1、学习微课获得积分</span>
        <span className={styles.text}>学习时长满5分钟可以获得10个积分，满5分钟后，每增长1分钟获得1个积分。每日最多可以获取50个积分（不含奖励积分）</span>
        <span className={styles.headline}>2、评价微课奖励积分</span>
        <span className={styles.text}>评价微课每次奖励2个积分</span>
        <span className={styles.headline}>3、连续学习奖励积分</span>
        <span className={styles.text}>连续学习满3天奖励5个积分，满3天后每连续学习增加1天奖励奖励2个积分</span>
        <span className={styles.headline}>4、荣登每周荣誉榜奖励积分</span>
        <span className={styles.text}>荣登每周荣誉榜，每次奖励5积分</span>
        <div className={styles.btn} onClick={this.goExchange}>
          去学习
        </div>
      </div>

    </div>
  }

}