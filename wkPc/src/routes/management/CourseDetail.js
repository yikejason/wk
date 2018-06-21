import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Badge, Table, Divider, Button, Tag, Icon, Collapse,Spin} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './SupplyDetail.less';

const {Description} = DescriptionList;
const Panel = Collapse.Panel;
const progressColumns = [{
    title: '时间',
    dataIndex: 'time',
    key: 'time',
}, {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text => (
        text === 'success' ? <Badge status="success" text="成功"/> : <Badge status="processing" text="进行中"/>
    ),
}, {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
}, {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
}];
var a = 0;
@connect(({courseDetail, loading}) => ({
    info: courseDetail,
    loading: loading.effects['courseDetail/fetchBasic'],
}))

export default class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShelves : null
        }
    }
    async componentDidMount() {
        const {dispatch, match} = this.props;
      await dispatch({
            type: 'courseDetail/fetchBasic',
            payload: match.params.id
        })
      await this.setState({
        isShelves : this.props.info.Data.IsShelves
      })
    }
    

    //生成collpase最外层
    create_collpase = (list) => {
        let my_collpase = list.map((e, i) => {
            if (!e.IsHasChild) {
                return (<Panel header={<div className={styles.list_li}>
                    <span>{e.Name}</span>
                    <div className={styles.list_li_right}>
                        <span><Button
                            onClick={() => {
                                this.setTrySee(e.ResourceID, e.IsOpenTry)
                            }}>{e.IsOpenTry ? '取消试看' : '开启试看'}</Button></span>
                        <span><Icon onClick={this.playVideo} type='play-circle' style={{fontSize: '24px'}}/></span>
                    </div>
                </div>} key={i}>
                    <p>weqweqweqeqwe</p>
                </Panel>)
            } else if (e.IsHasChild) {
                return (
                    <Collapse>
                        <Panel header={`${e.Name}`} key={i}>
                            <p>{this.create_collpase(e.SonChapterModel)}</p>
                        </Panel>
                    </Collapse>
                )
            } else {
                return null
            }
        })
        return my_collpase;
    }
    playVideo = () => {

    }
    //单个试看
    setTrySee = (id, isOpenTry) => {
        this.props.dispatch({
            type: 'courseDetail/fetchUpdateResTrySeeByRes',
            payload: {
                coursePackageID: this.props.match.params.id,
                isOpenTry: !isOpenTry,
                resourceID: id
            }
        })
    }
    //批量试看
    setAllTrySee = () => {
        this.props.dispatch({
            type: 'courseDetail/fetchUpdateResTrySeeByCourse',
            payload: {
                coursePackageID: this.props.match.params.id,
                isOpenTry: true
            }
        })
    }
    //上下架
    putOnoff = async () => {
       await this.props.dispatch({
            type: 'courseDetail/putOnoff',
            payload: {
                CoursePackageIDList: [this.props.match.params.id],
                IsShelves: !this.state.isShelves
            }
        })
        await this.setState({
            isShelves : !this.state.isShelves
        })
    }
    //累积观看时长处理
    changeTime = (second) =>{
        let commomTime;
        if (second < 60) {
          commomTime = `${second}秒`;
        } else if (second > 60 && second < 3600) {
          commomTime = parseInt(second / 60) + '分' + second % 60 + '秒'
        } else if (second >= 3600) {
          commomTime = parseInt(second / 3600) + '时' + parseInt((second % 3600 / 60)) + '分'
        }else if(second>=86400){
          commomTime = parseInt(second / 86400) + '天' 
        }
        return commomTime
    }

    render() {
        const {Data} = this.props.info
        const info = {ChapterList: [], ...Data}
        const {loading} = this.props;
        const {isShelves} = this.state;

        const {ChapterList = []} = info
        const goodsColumns = [{
            title: '',
            dataIndex: 'Name',
            key: 'Name',
        }, {
            title: '',
            dataIndex: 'PublisherName',
            key: 'PublisherName',
            align: 'right',
            render: () => <Button>设为试看</Button>,
        }, {
            title: '',
            dataIndex: 'QtyRes',
            key: 'QtyRes',
            align: 'right',
            render: (text, row, index) => {
                return (<Icon type="play-circle" style={{fontSize: '24px'}} spin={true}/>)
            }
        }];
        return (
            <PageHeaderLayout
                title={<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>{info ? info.Name : ''}课程详情</h2>
                    <div><Button onClick={this.putOnoff}>{(isShelves !== null) && isShelves ? '下架' : '上架'}</Button><Button onClick={this.setAllTrySee}>设置为试看</Button>
                    </div>
                </div>}>
                <Card bordered={false}>
                    <DescriptionList size="large" title="基本信息" style={{marginBottom: 32}}>
                        <Description term="年级">{info ? info.GradeName : ''}</Description>
                        <Description term="科目">{info ? info.SubjectName : ''}</Description>
                        <Description term="教材版本">{info ? info.PublisherName : ''}</Description>
                        <Description term="供应商">{info ? info.SupplierName : ''}</Description>
                        <Description term="章节数">{info ? info.QtyRes : ''}</Description>
                        <Description className={info && !info.ModulName ? styles.modul_hide : null} term="模块">{info ? info.ModulName : ''}</Description>
                        <Description term="册别">{info ? info.FasciculeName : ''}</Description>
                    </DescriptionList>
                    <p>描述：{info ? info.Desc : ''}</p>
                    <Divider style={{marginBottom: 32}}/>

                    <DescriptionList size="large" title="观看数据" style={{marginBottom: 32}}>
                        <Description
                            term="观看总数">{info && info.WatchDataModel ? info.WatchDataModel.CntWatch : '0'}</Description>
                        <Description
                            term="累积观看时长">{info && info.WatchDataModel ? this.changeTime(info.WatchDataModel.TotalTimes) : '0'}</Description>
                        <Description
                            term="评论数">{info && info.WatchDataModel ? info.WatchDataModel.CntComment : '0'}</Description>
                        <Description
                            term="分享数">{info && info.WatchDataModel ? info.WatchDataModel.CntShare : '0'}</Description>
                    </DescriptionList>

                    <div>
                        {
                            info && info.WatchDataModel ? info.WatchDataModel.CommentList.map(e => <Tag
                                key={e.CommentID}>{e.Name}&nbsp;{e.Times}次</Tag>) : null
                        }
                    </div>

                    <Divider style={{marginBottom: 32}}/>
                    {/*{*/}
                    {/*ChapterList ? ChapterList.map(e => <DescriptionList key={e.ID} size="large"*/}
                    {/*title={`${e.Name}`}*/}
                    {/*style={{marginBottom: 32}}>*/}
                        {/*{*/}
                            {/*this.create_collpase(ChapterList)*/}
                        {/*}*/}
                    {/*</DescriptionList>) : null*/}
                    {/*}*/}
                    <Spin spinning={this.props.loading}>
                        {
                            this.create_collpase(ChapterList)
                        }
                    </Spin>
                </Card>
            </PageHeaderLayout>
        );
    }
}
