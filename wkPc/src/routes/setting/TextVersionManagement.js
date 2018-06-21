import React from 'react'
import {Card, Tabs, Button, Table, Pagination, Icon, Popconfirm, Form, Modal, Input, Select,Row} from 'antd'
import styles from './TextVersionManagement.less'
import ResConditionSearch_Text from './ResConditionSearch_Text'
import {connect} from 'dva'
import {PHASE_OF_STUDY_TYPE} from './constant'
import FomModal from './FomModal'
import {routerRedux} from 'dva/router'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {stringify} from 'qs';

const TabPane = Tabs.TabPane;


@connect(
  ({textVersionManagement, loading, common}) => ({
    common,
    textVersionManagement,
    loading: loading.models.textVersionManagement,
  })
)
export default class TextVersionManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isClick: false,
      visible: false,
      status:null,
    }
  }

  componentDidMount() {
    const {
      dispatch, common: {Publisher = [], Fascicule = [], Modul = [], BaseProperList = []},
      textVersionManagement: {gid, phaseIDArray, activePhaseID}
    } = this.props
    if (Publisher.length === 0) dispatch({type: 'common/fetchGetPublisherList'})
    if (Fascicule.length === 0) dispatch({type: 'common/fetchGetFasciculeList', payload: {fasciculeID: 0}})
    if (Modul.length === 0) dispatch({type: 'common/fetchGetGradeListByPhase', payload: {phaseID: '30040'}})
    // if (SubjectListByPhase.length === 0) {
    //     dispatch({ type: 'common/fetchSubjectListByPhase', payload: '30020' })
    //     dispatch({ type: 'common/fetchSubjectListByPhase', payload: '30030' })
    //     dispatch({ type: 'common/fetchSubjectListByPhase', payload: '30040' })
    // }
    // if (BaseProperList === null) {
    //     dispatch({type: 'common/fetchGetBaseProperList', payload: {gid: 0}})
    // }
    if (gid && phaseIDArray) {
      dispatch({type: 'textVersionManagement/fetch', payload: {gid, phaseID: activePhaseID}})
    }

  }

  handleSearch = async (value) => {
    const {gid: {key: gid, label: gidName}, Phase: phaseIDArray} = value
    const {dispatch} = this.props
    await dispatch({
      type: 'textVersionManagement/saveCondition',
      payload: {gid, phaseIDArray, activePhaseID: phaseIDArray[0], gidName}
    })
    await phaseIDArray && this.handleChangeTabs(`${phaseIDArray[0]}`)
  }

  handleChangeTabs = (activePhaseID) => {
    const {dispatch} = this.props
    dispatch({
      type: 'textVersionManagement/saveCondition',
      payload: {activePhaseID}
    })
    this.setState({
      isClick: true
    })
  }

  handleDelete = (bookConfigID) => {
    const {dispatch} = this.props
    dispatch({
      type: 'textVersionManagement/delete',
      payload: {bookConfigID}
    })
  }

  handleModify = (values) => {
    const {dispatch} = this.props
    const {ID, ModulID, FasciculeID, PublisherID} = values
    dispatch({
      type: 'textVersionManagement/modify',
      payload: {ID, ModulID, FasciculeID, PublisherID}
    })
  }

  handleAdd = (activePhaseID) => {
    const {dispatch, textVersionManagement: {gid, gidName}} = this.props
    dispatch(routerRedux.push({
      pathname: '/setting/NewTextVersion',
      search: stringify({phaseID: activePhaseID, GID: gid, GIDName: gidName}),
      state: {phaseID: activePhaseID, GID: gid, GIDName: gidName}
    }))

  }
  //预览
  handleSee = (record) => {
    this.setState({visible:true,status:record.Status},()=>{
      //预览获取匹配的资源包
      this.props.dispatch({
        type:'textVersionManagement/getPreview',
        payload:{
          gid:record.GID,//学校id
          phaseID:record.PhaseID,//学段id
          gradeID:record.GradeID !=='0' ? record.GradeID : record.ModulID,//小初直接传年级id，高中传模块id
          subjectID:record.SubjectID,//科目
          publisherID:record.PublisherID,//出版社
          fasciculID:record.FasciculeID,//册别
        },
      })
    })
  };
  //取消预览
  handleSeeCancel = () => {
    this.setState({visible:false},()=>{
      this.props.dispatch({type:'textVersionManagement/clear'})
    })
  };


  render() {
    const {
      textVersionManagement: {list = [], phaseIDArray = [], activePhaseID, gid, gidName,previewData = []},
      loading,
      common: {Publisher = [], Fascicule = [], Modul = []},
    } = this.props
    let defaultValue = null
    if (gid && gidName) {
      defaultValue = {label: gidName, key: gid}
    }

    const columns = (item) => [
      {
        title: '年级',
        dataIndex: 'GradeName',
      }, {
        title: '科目',
        dataIndex: 'SubjectName',
      }, {
        title: '教材版本',
        dataIndex: 'PublisherName',
      },
      {
        title: '模块',
        dataIndex: 'ModulName',
      },
      {
        title: '册别',
        dataIndex: 'FasciculeName',
      },
      {
        title: '资源配置状态',
        dataIndex: 'StatusName',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record, index) => {
          const {PublisherID, FasciculeID, ModulID} = record
          const data = {Publisher, Fascicule, Modul, PublisherID, FasciculeID, ModulID}
          return <div>
            <FomModal {...data} modify={(values) => this.handleModify({...record, ...values})}>
              <a href='javascript:void(0);'> 修改</a>
            </FomModal>
            <span style={{padding: '0 10px'}}></span>
            <Popconfirm title="确定删除么？" onConfirm={() => this.handleDelete(record.ID)}>
              <a href='javascript:void(0);'> <Icon type='delete'/></a>
            </Popconfirm>
            <span style={{padding: '0 10px'}}></span>
            <span><a href='javascript:void(0);' onClick={()=>this.handleSee(record)}> <Icon type='eye-o'/></a></span>
          </div>
        }
      },
    ];
    return <PageHeaderLayout>
      <Modal
        title="资源配置详情"
        visible={this.state.visible}
        onCancel={this.handleSeeCancel}
        footer={null}
        width={900}
      >
        {(previewData.length !==0 && this.state.status === 2)&& <div>为{previewData.GradeName}{previewData.SubjectName}（{previewData.PublisherName}，{previewData.FasciculeName}）共匹配了 {previewData.QtyPackage}  个 同步资源</div>}
        <Tabs  onChange={this.handleTabChange} activeKey={1}>
          {(previewData.length !==0 && previewData.SimpleMatePackageList && this.state.status === 2) && previewData.SimpleMatePackageList.map((shop,i) => (
            <TabPane tab={
              <Row gutter={8} style={{ width: 350, margin: '8px 0' }}>
                <Card hoverable className={styles.card}>
                  <Card.Meta
                  className={styles.courseContent}
                  avatar={<img alt="" className={styles.courseImg} src={shop.PackageImg || 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'}/>}
                  title={<h3>{shop.PackageName}</h3>}
                  description={(
                  <div>
                  {/*<div style={{height:'72px'}}><h3>{item.Name}</h3></div>*/}
                  <p>年级：{shop.GradeName}</p>
                  <p>科目：{shop.SubjectName}</p>
                  <p>教材版本：{shop.PublisherName}</p>
                  </div>
                  )}
                  />
                </Card>
            </Row>
            } key={i}>
            </TabPane>
          ))}
        </Tabs>
        {(previewData.length !==0 && this.state.status === 1)&& <div>正在为{previewData.GradeName}{previewData.SubjectName}（{previewData.PublisherName} {previewData.FasciculeName}）配置资源，请稍后，如有疑问，请联系官方客服人员</div>}
      </Modal>
      <Card>
        <div className={styles.management}>
          <div className={styles.menu}>
            <ResConditionSearch_Text onSearch={this.handleSearch} defaultValue={defaultValue}/>
          </div>
          <div className={styles.content}>
            {phaseIDArray && phaseIDArray.length ?
              <Tabs tabBarExtraContent={this.state.isClick &&
              <Button type={'primary'} onClick={() => this.handleAdd(activePhaseID)}>新增</Button>} onChange={this.handleChangeTabs} activeKey={activePhaseID}>{phaseIDArray && phaseIDArray.length ? phaseIDArray.map((item, index) =>
                  <TabPane tab={PHASE_OF_STUDY_TYPE[item]} key={item}>
                    <Table
                      loading={loading}
                      columns={columns(item)}
                      dataSource={list}
                      pagination={false}
                      rowKey="ID"
                    />
                  </TabPane>
                ) : null}
              </Tabs> : null}
          </div>
        </div>
      </Card>
    </PageHeaderLayout>
  }
}


