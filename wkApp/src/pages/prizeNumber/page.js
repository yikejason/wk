/**
 * Created by Yu Tian Xiong on 2018/5/03.
 * fileName:兑换抽奖次数
 */
import React, {Component} from 'react';
import {Toast, Flex} from 'antd-mobile';
import styles from './page.less';
import api from '../../api';
import Config from '../../api/config';

export default class PrizeNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '1',//键盘输入框的值
      CurrPoint: '',//可用积分
      CurrPrizeTimes: '',//抽奖次数
      chance:'',//当前可兑换积分次数
    };
    this.getPrizeTimes();//初次加载获取次数和积分
  }

  //兑换抽奖次数
  changePrizeNumber = () => {
    const {inputValue,CurrPoint} = this.state;
    if (inputValue === ''||inputValue === '0') {
      Toast.info('请输入需要兑换的抽奖次数')
    } else if(CurrPoint === 0){
      Toast.info('请获取积分')
    } else if(inputValue * 2 > CurrPoint){
      Toast.info('积分不足')
    }else{
      api.ExchangePrizeTimes({times: inputValue}).then(res => {
        if (res.Ret === 0) {
          this.setState({
            CurrPoint: res.Data.CurrPoint,
            CurrPrizeTimes: res.Data.CurrPrizeTimes,
          });
          Toast.success(`您已成功兑换${inputValue}次抽奖机会，共需要消耗${inputValue * 2}个积分`, 1, () => {
            //跳转抽奖页面
            window.location.href = `${Config.prizeUrl}/prizeH5/lottery.html?activityID=${res.Data.ActivityID}&appenname=UCUX`;
          })
        }
      })
    }
  };
  //获取输入框的值
  handleChange = () => {
    let inputValue = document.getElementById('inputValue').value;
    this.setState({inputValue})
  };
  //获取抽奖次数和积分
  getPrizeTimes = () => {
    api.GetPrizeTimes().then(res => {
      if (res.Ret === 0) {
        this.setState({
          CurrPrizeTimes: res.Data.CurrPrizeTimes,
          CurrPoint: res.Data.CurrPoint,
          chance:parseInt(res.Data.CurrPoint/2),
        })
      }
    })
  };
  //添加兑换次数  input中的值
  handleAdd = () => {
    let inputValue = Number(document.getElementById('inputValue').value);
    this.setState({inputValue: (inputValue + 1).toString()})
  };
  //减少兑换次数  input中的值
  handleReduce = () => {
    let inputValue = Number(document.getElementById('inputValue').value);
    if (inputValue === 0) {
      return false;
    } else {
      this.setState({inputValue: (inputValue - 1).toString()})
    }
  };

  render() {
    const {inputValue, CurrPoint, CurrPrizeTimes,chance} = this.state;
    return (
      <div className={styles.content}>
        <div className={styles.prizeNumber}>
          <Flex className={styles.prizeFlex}>
            <Flex.Item className={styles.flexDiv}>
              <div className={styles.prizeNumberItem}>
                <span className={styles.prizeNumberItemNumber}>{CurrPrizeTimes}</span>次
              </div>
              <div className={styles.prizeNumberCake}>可用抽奖次数</div>
            </Flex.Item>
            <Flex.Item className={styles.flexDiv}>
              <div className={styles.prizeNumberFen}>
                <span className={styles.prizeNumberFenItem}>{CurrPoint}</span>分
              </div>
              <div className={styles.prizeNumberCake}>可用积分</div>
            </Flex.Item>
          </Flex>
          <div className={styles.inputContent}>
            <div className={styles.inputBackground}>
              <h3>兑换抽奖次数</h3>
              <div>只需两个积分就可以获得一次抽奖机会</div>
              <div className={styles.flexInput}>
                <div className={styles.inputReduce}>
                  <img src={require('../../public/assets/add.png')} alt="" className={styles.inputImg} onClick={this.handleAdd}/>
                </div>
                <div className={styles.inputStyle}>
                  <input type="number" className={styles.keybord} id="inputValue" onChange={this.handleChange} value={inputValue} placeholder="请输入你需要兑换的抽奖次数"/>
                </div>
                <div className={styles.inputAdd}>
                  <img src={require('../../public/assets/reduce.png')} alt="" className={styles.inputImgTwo} onClick={this.handleReduce}/>
                </div>
              </div>
              <div className={styles.inputText}>当前最多可兑换{chance}次抽奖机会</div>
              <div className={styles.inputBtn} onClick={this.changePrizeNumber}>
                <span>兑换</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}