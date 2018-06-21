//学生每周荣誉榜
import * as React from "react";
import styles from './page.less'
import {Toast, WhiteSpace} from 'antd-mobile'
import api from '../../api'
import router from "umi/router";
import Config from '../../api/config';
import * as globalFn from '../../utils/globalFn'

const share = require('../../public/assets/ryb_share.png')
const princess = require('../../public/assets/ryb_princess.png')
const getPrice= require('../../public/assets/ryb_jf.png')

const nodata = <div>
    <img src={require('../../public/assets/noPoins.png')}
         style={{width: '294px', height: '238px', marginBottom: '40px'}} alt=""/>
    <p style={{marginBottom: '20px'}}>暂无数据，差一点就上榜了</p>
    <p>从现在开始冲榜吧</p>
</div>;
const noone = <div>
    <img src={require('../../public/assets/ryb_noone.png')} alt=""/>
    <p style={{color: '#888', marginTop: 15}}>暂无人员上榜</p>
</div>;
const cName = !sessionStorage.getItem('user') ? 0 : JSON.parse(sessionStorage.getItem('user')).ClassName;
export default class Home extends React.PureComponent {
    state = {
        data: {
            SDate: '',
            EDate: '',
            HonorRoll: {
                HabitRankList: [],
                LearnDaysRankList: [],
                LearnSecondsRankList: [],
                PointRankList: []
            }
        },
        weekID: 0,
        hashid: 0,//分享url的hashid
        urlHashid: getQueryString('hashid'),
        loading: true,
        HonorRoll:  {
            HabitRankList: {}, LearnDaysRankList: {}, LearnSecondsRankList: {}, PointRankList: {}
        },
        PhaseID: 0,
    };

    componentWillMount() {
        Toast.loading('加载中', 1.5);
    }
    // 1.页面token校验
    //   调用原生app的协议getAppInfo获取token，若有token进入2，若仍然没有，进入3
    // 2.页面身份信息校验
    //   2.1 判断缓存中是否已经包含了身份信息，若有，进入2.2，若没有，则跳转到身份选择界面home
    //   2.2 url中获取weekID，进入4
    // 3.页面hashid获取
    //   从url中获取参数hashid，若获取失败，则提示错误，若获取成功，进入4
    // 4.调用接口获取每周荣誉榜的数据
    //   接口参数： token、weekID、hashid、身份信息  （这些参数，不会同时有值，注意空值的兼容处理）
    componentDidMount() {
        
        //所有环境，检查hashid，hashid权重大于token,先获取hashid，有直接传，没有取检查token
        if (!getQueryString('hashid')) {
            // window.location.href = 'ucux://getappinfo?callback=ongetappinfo';
            if (sessionStorage.getItem('user')) {
                // alert(JSON.stringify(sessionStorage.getItem('user')));
                this.GetWeekHonorRoll({
                    weekID: getQueryString('WeekID'),
                    token: sessionStorage.getItem('UCUX_OCS_AccessToken'),
                });

            } else {
                sessionStorage.setItem('goBack', '1');
                router.push('./home');
            }
            //     window.ongetappinfo = (data) => {
            //         let res = JSON.parse(data);
            //         // alert('协议token=='+ res.Token);
            //         if (JSON.parse(data)) {
            //             // alert("协议获取到token");
            //             if (sessionStorage.getItem('user')) {
            //                 // alert(JSON.stringify(sessionStorage.getItem('user')));
            //                 this.GetWeekHonorRoll({
            //                     weekID: getQueryString('WeekID'),
            //                     token: sessionStorage.getItem('UCUX_OCS_AccessToken'),
            //                 });
            //             } else {
            //                 router.push('./home');
            //             }
            //         } else {
            //             // alert("协议没有token");
            //             if (!getQueryString('hashid')) {
            //                 // alert("hashid获取失败");
            //                 Toast.fail('会话无效');
            //             } else {
            //                 // alert("hashid获取成功");
            //                 this.GetWeekHonorRoll({
            //                     hashid: getQueryString('hashid'),
            //                 });
            //             }
            //         }
            //     }
            // } else {
            //     // alert("hashid获取成功");
            //     this.GetWeekHonorRoll({
            //         hashid: getQueryString('hashid'),
            //     });
            // }

        } else {
            this.GetWeekHonorRoll({
                hashid: getQueryString('hashid'),
            });
        }
        Toast.hide();
        
    }


    //获取荣誉榜数据
    GetWeekHonorRoll = (params) => {
        // alert(JSON.stringify(params));
        api.GetWeekHonorRoll(params).then(res => {
            console.log(res.Data);
            
            if (res.Ret === 0) {
                res.Data.EDate = res.Data.EDate.slice(0, 10);
                res.Data.SDate = res.Data.SDate.slice(0, 10);
                const Ranks = {1: true, 2: true, 3: true};
                const HonorRoll = {
                    HabitRankList: {}, LearnDaysRankList: {}, LearnSecondsRankList: {}, PointRankList: {}
                };
                for (let x in res.Data.HonorRoll) {
                   let arr = [];
                    if (Array.isArray(res.Data.HonorRoll[x]) && res.Data.HonorRoll[x].length) {
                        for (const y in res.Data.HonorRoll[x]) {
                            // if (Ranks[res.Data.HonorRoll[x][y].Rank] === true) {
                                arr.push(res.Data.HonorRoll[x][y]);
                                // HonorRoll[x][res.Data.HonorRoll[x][y].Rank] = res.Data.HonorRoll[x][y];
                                HonorRoll[x][y*1+1] = res.Data.HonorRoll[x][y];
                            // }
                        }
                    } 
                    res.Data.HonorRoll[x] = arr;
                }
                this.setState({
                    data: res.Data,
                    weekID: res.Data.WeekID,
                    loading: false,
                    HonorRoll: HonorRoll,
                    PhaseID: res.Data.PhaseID,
                }, () => {
                    this.getHashID();//获取分享时url需要的hashid
                })
            } else {
                // alert(res.Msg);
                this.getHashID();//获取分享时url需要的hashid
            }
        });
    };

    //领取奖励
    getPrize = () => {
        api.GetAward({weekID: this.state.weekID}).then(res => {
            if (res.Ret === 0) {
                Toast.success(`你已经成功领取${res.Data}积分，将进入学习页面`, 1);
                setTimeout(() => {
                    router.push('./courseList');
                }, 2000);
            } else {
                Toast.fail(res.Msg);
            }
        })
    };
    //获取分享时url需要的hashid
    getHashID = () => {
        api.GetWeekHonorShareHashID({weekID: this.state.weekID}).then(res => {
            if (res.Ret === 0) {
                this.setState({
                    hashid: res.Data,
                    loading: false,
                });
            }
        });
    };

    //分享
    share = () => {
        const {SDate, EDate, WeekID, IsHonorRoll} = this.state.data;
        // alert(JSON.stringify(this.state.data));
        let obj = {
            Desc: !IsHonorRoll ? `微课学堂  ${cName}第${WeekID}周荣誉榜新鲜出炉，快开看看哪些人榜上有名吧` : `微课学堂   我荣登${cName}，第${WeekID}周的荣誉榜，快来点赞吧，要不咱俩来比比？`,
            Title: `第${WeekID}周荣誉榜(${SDate}至${EDate})`,
            ThumbImg: Config.shareIocn,
            Url: `${Config.shareUrl}studentReport.html?hashid=${this.state.hashid}&WeekID=${this.state.weekID}`,
            Type: 7,
        };
        window.location.href = 'ucux://forward?contentjscall=share';
        window.share = () => {
            return JSON.stringify(obj);
        };
        let propms = {
            CoursePeriodID: null,
            ContentType: 7,
            Content: JSON.stringify(obj),
        }
        api.Share({body: propms}).then(res => {
            if (res.Ret === 0) {
                // Toast.success("分享成功");
            } else {
                Toast.fail(res.Msg);
            }
        })
    };


    //我要冲榜
    goRank = () => {
        router.push('./courseList')
    };

    setLoading = () => {
        if (this.state.loading) {
            return null;
        } else {
            return (<div className={styles.body}>{nodata}</div>);
        }
    }

    renderFooter = () => {
        let footer = null;
        if (this.state.urlHashid) {
            return null;
        }
        if (!this.state.data.IsHonorRoll || !this.state.data.IsLearnClass) {
            footer = (
                <React.Fragment>
               
                <div onClick={this.goRank}  style={{color:'rgba(39,173,252,1)', fontSize: 34}}>
                    <a>
                        <img  style={{ height:46, width:50, margin:"0px 22px 0px 0px"}} src={princess} alt=""/>我要冲榜
                    </a>
                </div>
            </React.Fragment>
            );
        } else if (!this.state.data.IsReceiveAward) {
            footer = (
                <React.Fragment>
                <div onClick={this.share}>
                <a>
                    <img  style={{ height:46, width: 46, margin:"0px 22px 0px 0px"}}  src={share} alt=""/>炫耀一下
                </a>
            </div>
            <div onClick={this.getPrize}  style={{color:'rgba(39,173,252,1)', fontSize:  '0.34rem'}}>
                <a style={{marginLeft: -34}}>
                    <img style={{ height:46, width:50, margin:"0px 22px 0px 0px"}} src={getPrice} alt=""/>领取奖励
                </a>
            </div>
            </React.Fragment>
            );
        } else {
            footer = (
                <React.Fragment>
                <div onClick={this.share}>
                <a>
                    <img  style={{ height:46, width: 46, margin:"0px 0.22rem 0px 0px"}}  src={share} alt=""/>炫耀一下
                </a>
            </div>
            <div onClick={this.goRank} style={{color:'rgba(39,173,252,1)', fontSize: '0.34rem'}}>
                <a style={{marginLeft: -34}}>
                    <img style={{ height:46, width:50, margin:"0px 0.22rem 0px 0px"}} src={princess} alt=""/>去学习
                </a>
            </div>
            </React.Fragment>
            );
            
        }
       
        return (
            <div className={styles.btn}>
            <div className={styles.btn_wrap}>
            { footer }
              
            </div>
        </div>
        );
    }


    handerIsLearnCard(list, object, title, unit, second = false) {
       
        if (title === '好习惯' && !globalFn.isPupil(this.state.PhaseID)) {
            return null;
        }
        console.log(list);
        const NumberEmun = {1:'one', 2: 'second', 3: 'three'};
        return (
            <div className={styles.card}>
                 <div className={styles.title}>
                    { title }
                </div>
                <div className={styles.content}>
                    {
                        !list.length ? noone : [2,1,3].map(i => {
                            const e = object[i];
                            if (e) {
                                const number = second ? Math.round(e.Num / 60) : e.Num;
                                if (NumberEmun[i]) {
                                    return<div key={e.UName} className={styles[`${NumberEmun[i]}_wrap`]}>
                                        <div className={styles.cake}>
                                            <div className={styles[NumberEmun[i]]}>
                                               <img className={styles[`${NumberEmun[i]}_bg`]} src={require(`../../public/assets/ryb_${i}.png`)} alt=""/>
                                               <img className={styles[`${NumberEmun[i]}_upic`]} src={e.UPic} alt=""/>
                                            </div>
                                        </div>
                                        <div className={styles[`${NumberEmun[i]}_name`]}>
                                            <p>{e.UName}</p>
                                            <small>{`${number}  ${unit}`}</small>
                                        </div>
                                    </div>
                                } 
                            } else {
                                return<div key={i} className={styles[`${NumberEmun[i]}_wrap`]}>
                                </div>
                            }
                        
                        })
                    }
                </div>    
            </div>
           
        )
       
    }

    render() {
        const {data, HonorRoll} = this.state;
        
        return (<div>
            <div className={styles.head}>
                <h4>第{data.WeekID}周（{`${data.SDate}至${data.EDate}`}）</h4>
                <small style={{color: '#888'}}>在学习中心-每周荣誉也能看到哟</small>
            </div>

            {
                !data.IsLearnClass ? <div className={styles.body}>{this.setLoading()} </div> :
                    <div style={{marginBottom: '1rem'}}>
                     
                        
                        {this.handerIsLearnCard(data.HonorRoll.PointRankList, HonorRoll.PointRankList, '积分', '分')}
                        {this.handerIsLearnCard(data.HonorRoll.LearnSecondsRankList, HonorRoll.LearnSecondsRankList,  '学习时长', '分钟', true)}
                        {this.handerIsLearnCard(data.HonorRoll.LearnDaysRankList, HonorRoll.LearnDaysRankList,  '连续学习天数', '天')}
                        {this.handerIsLearnCard(data.HonorRoll.HabitRankList,HonorRoll.HabitRankList,  '好习惯', '天')}

                        <div className={styles.card}>
                            <div className={styles.title} style={{backgroundColor: '#f74e2d'}}>
                                {data.IsShare ? <span>{!data.ShareUName ? '' : data.ShareUName}的周记录</span>
                                    : <span>我的周记录</span>
                                }

                            </div>

                            {
                                !data.IsLearnSelf 
                                    ?
                                    <div style={{width: '80%', margin: '50px auto', textAlign:'center'}}>
                                        <p>{!data.ShareUName ? '' : data.ShareUName}没有学习，暂无学习记录</p>
                                        <p>学习贵在坚持，从现在开始也不晚</p>
                                    </div> 
                                    :
                                    <div className={styles.mydata}>
                                        <div className={styles.item}>
                                            <div>
                                                <img src={require('../../public/assets/ryb_jf.png')} alt=""/>
                                            </div>
                                            <h4>{data.WeekLearnSelf.Point}</h4>
                                            <p>获取积分</p>
                                        </div>
                                        <div className={styles.item}>
                                            <div>
                                                <img src={require('../../public/assets/ryb_time.png')} alt=""/>
                                            </div>
                                            <h4>{Math.round(data.WeekLearnSelf.LearnSeconds/60)}
                                                <small>分钟</small>
                                            </h4>
                                            <p>学习时长</p>
                                        </div>
                                        <div className={styles.item}>
                                            <div>
                                                <img src={require('../../public/assets/ryb_learn.png')} alt=""/>
                                            </div>
                                            <h4>{data.WeekLearnSelf.LearnDays}
                                                <small>天</small>
                                            </h4>
                                            <p>连续学习</p>
                                        </div>
                                        <div className={styles.item}>
                                            <div>
                                                <img src={require('../../public/assets/ryb_read.png')} alt=""/>
                                            </div>
                                            <h4>{data.WeekLearnSelf.HabitDays}
                                                <small>天</small>
                                            </h4>
                                            <p>好习惯</p>
                                        </div>
                                    </div>
                            }


                        </div>
                    </div>
            }
            <WhiteSpace/>
            {this.renderFooter()}
        </div>)
    }
}


function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}