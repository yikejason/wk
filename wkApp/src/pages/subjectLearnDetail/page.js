//微课观看统计
import * as React from "react";
import {Tabs, Toast} from 'antd-mobile'
import api from '../../api'
import styles from './page.less'
import router from 'umi/router';

export default class SubjectLearnDetail extends React.Component {
  state = {
    subjects: [],
    detail: {
      CoursePeriodCnt: undefined,
      Duration: undefined,
      PlayPeriodCnt: undefined,
      PlayPeriodPer: undefined,
    },
    currentSubject: undefined,
    activeIndex: 0,
    tabIndex: 0,
    // list: [],
    loading:true,
  };

  componentDidMount() {
    // const tabIndex = sessionStorage.getItem('tabIndex') ? +sessionStorage.getItem('tabIndex') : 0;
    // const activeIndex = sessionStorage.getItem('activeIndex') ? +sessionStorage.getItem('activeIndex') : 0;

    const tabIndex = 0;
    const activeIndex =  0;
    //获取科目列表
    api.GetSubjectList().then(res => {
      if (res.Ret === 0) {
        let arr = res.Data.map(e => {
          e.title = e.Name;
          return e;
        });

        //默认获取第一个科目的详情
        this.getDetail(res.Data[tabIndex].ID);
        this.getList(res.Data[tabIndex].ID, activeIndex);

        //获取返回后选中的科目、已学或者为学
        this.setState({
          subjects: arr,
          currentSubject: res.Data[tabIndex].ID,
          tabIndex,
          activeIndex,
        });

      } else {
        Toast.fail(res.Msg);
      }
    })

  };

  //获取科目详情
  getDetail = (sid) => {
    api.GetPlayStatis({subjectID: sid}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          detail: res.Data
        })
      }
    })
  };
  //获取人员列表
  getList = (sid, index) => {
    Toast.loading("加载中",1);
    if (index === 0) {
      setTimeout(()=>{api.GetSubjectLearnList({subjectID: sid}).then(res => {
        if (res.Ret === 0) {
          this.setState({
            list: res.Data,
            loading:false
          })
        } else {
          Toast.fail(res.Msg);
        }
      })},500)
    } else {
      setTimeout(()=>{api.GetSubjectNoLearnList({subjectID: sid}).then(res => {
        if (res.Ret === 0) {
          this.setState({
            list: res.Data,
            loading:false
          })
        } else {
          Toast.fail(res.Msg);
        }
      })},500)
    }
  };
  //查看已学为学人员
  onChangeStatus = (index) => {
    sessionStorage.setItem('activeIndex', index);
    this.setState({
      activeIndex: index,
      list:undefined
    });
    this.getList(this.state.currentSubject, index)
  };
  //切换选项卡
  tabChange = (tab, index) => {
    sessionStorage.setItem('tabIndex', index);
    this.setState({
      currentSubject: tab.ID,
      activeIndex: 0,
      list:undefined
    }, () => {
      this.getDetail(this.state.currentSubject)
      this.getList(this.state.currentSubject, 0);
    })
  };
  //提醒
  goRemind = (i) => {
    const {list} = this.state;
    sessionStorage.setItem('UMs', JSON.stringify(list));
    sessionStorage.setItem('RemindOperateType', i);
    sessionStorage.setItem('SubjectID', this.state.currentSubject);
    sessionStorage.setItem('IsWeek', false);
    sessionStorage.setItem('IsSubject', true);
    if (i === -1) {
      sessionStorage.setItem('RemindUserType', 2);
    }

    router.push('/remind');
  };
  //表扬
  praise = () => {
    const {list, currentSubject} = this.state;
    const node = list.map(item => {return {UID: item.UID, UMID: item.UMID}});
    api.RemindUser({
      body: {
        RemindOperateType: 1,
        SubjectID: currentSubject,
        UMs: node,
        Content: '一分耕耘一份收获，希望你继续勤奋学习哟',
      }
    }).then(res => {
      if (res.Ret === 0) {
        Toast.info('表扬成功', 1);
      } else {
        Toast.fail(res.Msg);
      }
    })
  };
  renderContent = tab => (<div style={{backgroundColor: '#fff'}}>
    <div
      style={{padding: '25px'}}>共有 {this.state.detail.CoursePeriodCnt} 个微课，微课时长共计 {Math.round(this.state.detail.Duration / 60)} 分钟，
      被观看微课 {this.state.detail.PlayPeriodCnt} 个，占总微课数的 {this.state.detail.PlayPeriodPer}%
    </div>
    <div>
      <div style={{
        backgroundColor: '#EEEEEE',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px 30px'
      }}>
        <span onClick={() => this.onChangeStatus(0)} style={{color: `${this.state.activeIndex === 0 ? '#41B0FD' : '#888'}`}}>已学人员</span>
        <span onClick={() => this.onChangeStatus(1)} style={{color: `${this.state.activeIndex === 1 ? '#41B0FD' : '#888'}`}}>未学人员</span>
      </div>
    </div>

    {
      this.state.loading ?  '' : Array.isArray(this.state.list) && this.state.list.length === 0 ? <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px 0'
        }}>
          <img src={require("../../public/assets/kong1.png")} alt=""
               style={{width: '248px', height: '214px', margin: '20px 0'}}/>
          <span>暂无相关数据</span>
        </div> :
        this.state.activeIndex === 0 ?
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {Array.isArray(this.state.list) && this.state.list.map((e, i) => <div className={styles.userli} key={i}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <img src={e.UPic} alt=""/>
                <span>{e.UName}</span>
              </div>
              <div style={{
                color: '#333',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <p>已学完 {e.Cnt} 个微课</p>
                <p style={{paddingTop: 12}}>累计学习时长 {Math.round(e.LearnSeconds / 60)} 分钟</p>
              </div>
            </div>)}
          </div> :
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {
              Array.isArray(this.state.list) && this.state.list.map((e, i) => <div className={styles.user} key={i}>
                <img src={e.UPic} alt=""/>
                <p>{e.UName}</p>
              </div>)
            }
          </div>
    }
  </div>);
  render() {
    const {subjects, tabIndex} = this.state;
    return (
      <div>
        {
          subjects.length === 0 ? <div></div> : <div className={styles.sld}>
            <Tabs tabs={subjects}
              //animated={false}
                  onChange={this.tabChange}
                  initialPage={tabIndex}
                  key={1}
                  renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3}/>}>
              {this.renderContent}
            </Tabs>
          </div>
        }
          {
            this.state.activeIndex === 0 && Array.isArray(this.state.list) ?
              (this.state.list.length > 0 ?
                <div className={styles.bottom} key={2}>
                  <a onClick={this.praise} className={styles.praise}>表扬一下</a>
                </div>:
                <div className={styles.bottom} key={2}>
                  <a className={styles.praise2}>表扬一下</a>
                </div>):null
          }
          {
            this.state.activeIndex === 1 && Array.isArray(this.state.list) ?
              <div className={styles.bottom} key={2}>
                <a onClick={() => this.goRemind(-1)} className={styles.praise}>提醒一下</a>
              </div>:null
          }
      </div>)
  }
};