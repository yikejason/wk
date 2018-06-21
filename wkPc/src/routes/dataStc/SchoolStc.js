/**
 * Created by Yu Tian Xiong on 2017/05/04.
 * fileName:学校统计view
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import {Link,routerRedux} from 'dva/router';
import {Select, Form, Row, Col, Button, Icon, DatePicker, AutoComplete, Tooltip,Card,Tabs,message} from 'antd';
import {ChartCard, Bar, Pie, WatchlineChart,SchoolStcBar} from '../../components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SchoolStc.less'
import numeral from "numeral";
import {getTimeDistance} from '../../utils/utils';
import moment from 'moment';
import NumberInfo from '../../components/NumberInfo';


const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;
const { TabPane } = Tabs;


@connect(({schoolStc,teachersDetail, loading}) => ({
  teachersDetail,
  schoolStcstate: schoolStc,
  loading: loading.models.schoolStc,
}))
@Form.create()
export default class SchoolStc extends Component {
  state = {
    partnerID: null,//合作伙伴ID
    schoolID: null,//学校id
    Grade:null,//年级
    Phase:null,//学段
    rangePickerValue: getTimeDistance('month'),
    currentTabKey:'',
    showBox:false,
    schoolValues:{
      partnerName:undefined,//合作伙伴名
      GName:undefined,//学校名
      GradeName:undefined,//年级名
      fixedTime:'month',//时间
      timeFrame:[moment(getTimeDistance('month')[0]).format('YYYY-MM-DD'),moment(getTimeDistance('month')[1]).format('YYYY-MM-DD')],//时间值
    },
    idValues:{
      PartnerID:undefined,//合作伙伴id
      GID:undefined,//学校id
      Grade:undefined,//年级
      Phase:undefined,//学段
      PageIndex:1,
      PageSize:10,
      SDate:moment(getTimeDistance('month')[0]).format('YYYY-MM-DD'),
      EDate:moment(getTimeDistance('month')[1]).format('YYYY-MM-DD'),
    },
    schoolValue:{
      partnerName:undefined,
      GName:undefined,
      fixedTime:'month',//时间
      timeFrame:[moment(getTimeDistance('month')[0]).format('YYYY-MM-DD'),moment(getTimeDistance('month')[1]).format('YYYY-MM-DD')],//时间值
    },
    idValue:{
      PartnerID:undefined,//合作伙伴id
      GID:undefined,//学校id
      PageIndex:1,
      PageSize:10,
      SDate:moment(getTimeDistance('month')[0]).format('YYYY-MM-DD'),
      EDate:moment(getTimeDistance('month')[1]).format('YYYY-MM-DD'),
    },
    schoolTitle:'',//学校基础数据标题
    schoolChar:true,//柱状图宽度显示状态
  };

  componentDidMount() {

  }
  //卸载组件时清空store里的状态
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({type: 'schoolStc/clear'});
  }

  //模糊查询合作伙伴
  handlePartnerSearch = (value) => {
    //过滤空字符串
    let partnterName = value.trim();
    if(partnterName.length !== 0){
      this.props.dispatch({
        type: 'schoolStc/getPartnter',
        payload: {keyword:value}
      })
    }
  };
  //获取合作伙伴ID查询学校
  handlePartnerOnSelect = (value) => {
    let key = value.split(',');
    this.setState({
      partnerID: key[0],
      idValues:{...this.state.idValues,PartnerID:key[0]},//组装数据
      schoolValues:{...this.state.schoolValues,partnerName:key[1]},//组装数据
      schoolValue:{...this.state.schoolValue,partnerName:key[1]},
      idValue:{...this.state.idValue,PartnerID:key[0]}
    })
  };

  //模糊查询学校
  handleSchoolSearch = (value) => {
    const {partnerID} = this.state;
    this.props.dispatch({
      type: 'schoolStc/getSchool',
      payload: {
        keyword: value,
        partnerID: partnerID
      }
    })
  };
  //获取学校id查询基础数据
  handleSchoolOnSelect = (value) => {
    let key = value.split(',');
    this.setState({
      schoolID: key[0],
      idValues:{...this.state.idValues,GID:key[0]},//组装数据
      schoolValues:{...this.state.schoolValues,GName:key[1]},//组装数据
      schoolValue:{...this.state.schoolValue,GName:key[1]},
      idValue:{...this.state.idValue,GID:key[0]}
    })
  };

  //查询数据
  handleQuery = () => {
    const {partnerID,schoolID,schoolValue} = this.state;
    if(!partnerID){
      message.info('请选择合作伙伴');
      return false;
    }else if(!schoolID){
      message.info('请选择学校');
      return false;
    }else{
      this.setState({showBox:true,schoolTitle:schoolValue.GName},()=>{
        this.getBaseSchool();//学校基础数据
        this.getSchoolGrade();//年级
        this.getWatchSchool();//观看次数
        this.getSubjectWatch();//各科目观看率
        this.getUserWatch();//各时间段用户观看数
        this.getTeacherStudent();//教师与学生互动统计

      });
    }
  };
  //获取学校基础数据
  getBaseSchool = () => {
    const {schoolID} = this.state;
    this.props.dispatch({
      type: 'schoolStc/getBaseSchool',
      payload: {
        GID: schoolID
      }
    })
  };
  //获取年级
  getSchoolGrade = () => {
    const {schoolID} = this.state;
    this.props.dispatch({
      type: 'schoolStc/getSchoolGrade',
      payload: {
        GID: schoolID
      }
    })
  };
  //获取学校观看次数统计数据
  getWatchSchool = () => {
    const {schoolID,Grade,Phase,rangePickerValue} = this.state;
    this.props.dispatch({
      type: 'schoolStc/getWatchSchool',
      payload:{
        GID:schoolID,
        Grade:Grade,
        Phase:Phase,
        StartDate:moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        EndDate:moment(rangePickerValue[1]).format('YYYY-MM-DD'),
      }
    })
  };
  //获取各个科目观看率
  getSubjectWatch = () => {
    const {schoolID,rangePickerValue} = this.state;
    this.props.dispatch({
      type: 'schoolStc/getSubjectWatch',
      payload:{
        GID:schoolID,
        StartDate:moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        EndDate:moment(rangePickerValue[1]).format('YYYY-MM-DD'),
      }
    })
  };
  //获取各时间段用户观看数
  getUserWatch = () => {
    const {schoolID,rangePickerValue} = this.state;
    this.props.dispatch({
      type: 'schoolStc/getUserWatch',
      payload:{
        GID:schoolID,
        StartDate:moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        EndDate:moment(rangePickerValue[1]).format('YYYY-MM-DD'),
      }
    })
  };
  //获取教师与学生互动统计
  getTeacherStudent = () => {
    const {schoolID,rangePickerValue} = this.state;
    this.props.dispatch({
      type: 'schoolStc/getTeacherStudent',
      payload:{
        GID:schoolID,
        StartDate:moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        EndDate:moment(rangePickerValue[1]).format('YYYY-MM-DD'),
      }
    })
  };

  //select帅选年级处理点击获取的Grade和Phase
  handleGrade = (value) => {
    this.props.dispatch({type: 'schoolStc/clearWatchSchoolData'});//点击下拉框清空数据避免闪动
    if (value === undefined) {
      this.setState({Grade: null, Phase: null, schoolChar: true}, () => {
        this.getWatchSchool()
      })
    } else {
      let key = value.split(',');
      this.setState({
        schoolChar: false,
        Grade: key[0],
        Phase: key[1],
        idValues: {...this.state.idValues, Grade: key[0], Phase: key[1]},//组装数据
        schoolValues: {...this.state.schoolValues, GradeName: key[2]}//组装数据
      }, () => {
        this.getWatchSchool()
      })
    }
  };


  //根据类型改变tab active样式
  isActive(type) {
    const {rangePickerValue} = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }
  //日周月年tab切换
  selectDate = type => {
    this.setState({rangePickerValue: getTimeDistance(type)},()=>{
      const {rangePickerValue} = this.state;
      let start = moment(rangePickerValue[0]).format('YYYY-MM-DD');
      let end = moment(rangePickerValue[1]).format('YYYY-MM-DD');
      this.setState({
        schoolValues:{...this.state.schoolValues, fixedTime:type,timeFrame:[start,end]},//组装数据
        idValues:{...this.state.idValues,SDate:start,EDate:end},//组装数据
        schoolValue:{...this.state.schoolValue,fixedTime:type,timeFrame:[start,end]},
        idValue:{...this.state.idValues,SDate:start,EDate:end}
      });
      this.getWatchSchool();
      this.getUserWatch();
      this.getSubjectWatch();
      this.getTeacherStudent();
    });
  };
  //科目切换tab的值
  handleTabChange = (key) => this.setState({currentTabKey: key});

  //观看次数查看详情带入组装数据进入详情
  handleSeeDetail = () => {
    const {schoolValues,idValues} = this.state;
    const {partnterData,schoolData,schoolGradeData} = this.props.schoolStcstate;
    this.props.dispatch({type:'teachersDetail/clearState'});
    this.props.dispatch({
      type:'teachersDetail/fetchStudentList',
      payload:{...idValues}
    }).then(() =>{
      this.props.dispatch({
        type:'teachersDetail/studyListUpdate',
        payload:{partnterData,schoolData,schoolGradeData}
      });
      this.props.dispatch({
        type:'teachersDetail/studyNameUpdate',
        payload:{...schoolValues}
      });
      this.props.dispatch(routerRedux.push('/dataStc/study-behavior'));
    });
  };
  //教师与学生互动统计带入组装数据进入详情
  handleTeacherStudent = () => {
    const {schoolValue,idValue} = this.state;
    const {partnterData,schoolData} = this.props.schoolStcstate;
    this.props.dispatch({type:'teachersDetail/clearState'});
    this.props.dispatch({
      type:'teachersDetail/fetchList',
      payload:{...idValue}
    }).then(() =>{
      this.props.dispatch({
        type:'teachersDetail/studyListUpdate',
        payload:{partnterData,schoolData}
      });
      this.props.dispatch({
        type:'teachersDetail/studyNameUpdate',
        payload:{...schoolValue}
      });
      this.props.dispatch(routerRedux.push('/dataStc/teachers-interaction'));
    });

  };


  render() {
    const {getFieldDecorator} = this.props.form;
    const {partnterData,schoolData,schoolBaseData,schoolGradeData,watchSchoolData,subjectWatchData,userWatchData,teacherStudentData} = this.props.schoolStcstate;
    const {partnerID, schoolID,rangePickerValue,currentTabKey,showBox,schoolChar} = this.state;
    const topColResponsiveProps = {xs: 24, sm: 12, md: 12, lg: 12, xl: 8, style: {marginBottom: 24},};
    const topColResponsive = {xs: 24, sm: 12, md: 12, lg: 12, xl: 12, style: {marginBottom: 24},};
    const salesExtra = (
      <div>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            本月
          </a>
          {/*<a className={this.isActive('year')} onClick={() => this.selectDate('year')}>*/}
            {/*全年*/}
          {/*</a>*/}
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{width: 258}}
        />
      </div>
    );
    const activeKey = currentTabKey || (subjectWatchData[0] && subjectWatchData[0].SubjectName);
    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.SubjectName}
            subTitle="观看率"
            gap={2}
            total={`${data.PlayRate}%`}
            theme={currentKey !== data.SubjectName && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.SubjectName && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.PlayRate ? data.PlayRate : 0.01*100}
            height={70}
          />
        </Col>
      </Row>
    );
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form layout="inline" className={styles.school}>
            <FormItem>
              {getFieldDecorator('type')(
                <AutoComplete
                  style={{width: 200}}
                  onSearch={this.handlePartnerSearch}
                  placeholder="合作伙伴"
                  onSelect={this.handlePartnerOnSelect}
                >
                  {(partnterData && partnterData.length !== 0) && partnterData.map((item) => <Option
                    key={[item.ID,item.Name]}>{item.Name}</Option>)}
                </AutoComplete>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('cake')(
                <AutoComplete
                  style={{width: 200}}
                  onSearch={this.handleSchoolSearch}
                  placeholder="学校"
                  onSelect={this.handleSchoolOnSelect}
                  disabled={!partnerID}
                >
                  {(schoolData && schoolData.length !== 0) && schoolData.map((item) => <Option
                    key={[item.ID,item.Name]}>{item.Name}</Option>)}
                </AutoComplete>
              )}
            </FormItem>
            <FormItem>
              <Button type="primary"  onClick={this.handleQuery}>查询</Button>
            </FormItem>
          </Form>
        </Card>
        {showBox && <Card
          title={`${this.state.schoolTitle}——学习报告`}
          style={{marginBottom:10,paddingTop:10}}
          bordered={false}
          >

          {Object.keys(schoolBaseData).length!==0 &&
          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <div style={{border:'1px solid #ddd'}}>
                <ChartCard
                  bordered={false}
                  bodyStyle={{padding: '20px 90px 8px'}}
                  title="分配的资源总数"
                  total={numeral(schoolBaseData.CoursePeroidCnt).format('0,0')}
                  contentHeight={46}
                >
                </ChartCard>
              </div>
            </Col>
            <Col {...topColResponsiveProps}>
              <div style={{border:'1px solid #ddd'}}>
                <ChartCard
                bordered={false}
                title="累积观看次数"
                bodyStyle={{padding: '20px 90px 8px'}}
                total={numeral(schoolBaseData.PlayCnt).format('0,0')}
                contentHeight={46}
              >
              </ChartCard>
              </div>
            </Col>
            <Col {...topColResponsiveProps}>
              <div style={{border:'1px solid #ddd'}}>
                <ChartCard
                bordered={false}
                title="累积观看时长（分）"
                bodyStyle={{padding: '20px 90px 8px'}}
                total={numeral(schoolBaseData.LearnSeconds).format('0,0')}
                contentHeight={46}
              >
              </ChartCard>
              </div>
            </Col>
          </Row>}
          {/*第二排数据*/}
          {Object.keys(schoolBaseData).length!==0  && <Row gutter={24}>
            <Col {...topColResponsiveProps} style={{marginBottom: 10}}>
              <div style={{border:'1px solid #ddd'}}>
                <ChartCard
                  bordered={false}
                  title="开通率"
                  bodyStyle={{padding: '20px 90px 0px'}}
                  total={numeral(schoolBaseData.FuncBoughtCond.FuncBoughtRate).format('0,0')+'%'}
                  contentHeight={10}
                >
                </ChartCard>
                <Row gutter={24} style={{margin: 0, background: '#fff'}}>
                  <Col span={12} style={{paddingTop: 16,paddingLeft:80}}>
                    <div>已开通&nbsp;{schoolBaseData.FuncBoughtCond.FuncBought}</div>
                    <div>未开通&nbsp;{schoolBaseData.FuncBoughtCond.NoFuncBought}</div>
                  </Col>
                  <Col span={12}>
                    <Pie
                      animate={false}
                      color={'#1890ff'}
                      inner={0.55}
                      tooltip={false}
                      margin={[0, 0, 0, 0]}
                      percent={schoolBaseData.FuncBoughtCond.FuncBoughtRate ? schoolBaseData.FuncBoughtCond.FuncBoughtRate : 0.01}
                      height={100}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
            <Col {...topColResponsiveProps} style={{marginBottom: 10}}>
              <div style={{border:'1px solid #ddd'}}>
                <ChartCard
                  bordered={false}
                  title="资源观看率"
                  bodyStyle={{padding: '20px 90px 0px'}}
                  total={numeral(schoolBaseData.PlayCond.PlayedRate).format('0,0')+'%'}
                  contentHeight={10}
                >
                </ChartCard>
                <Row gutter={24} style={{margin: 0, background: '#fff'}}>
                  <Col span={12} style={{paddingTop: 16,paddingLeft:80}}>
                    <div>已观看{schoolBaseData.PlayCond.PlayedCnt}</div>
                    <div>未观看{schoolBaseData.PlayCond.NoPlayedCnt}</div>
                  </Col>
                  <Col span={12}>
                    <Pie
                      animate={false}
                      color={'#1890ff'}
                      inner={0.55}
                      tooltip={false}
                      margin={[0, 0, 0, 0]}
                      percent={schoolBaseData.PlayCond.PlayedRate ? schoolBaseData.PlayCond.PlayedRate : 0.01}
                      height={100}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
            <Col {...topColResponsiveProps} style={{marginBottom: 10}}>
              <div style={{border:'1px solid #ddd'}}>
                <ChartCard
                  bordered={false}
                  title="平均观看时长"
                  bodyStyle={{padding: '20px 90px 0px'}}
                  total={`${parseFloat(schoolBaseData.PlaySecondsCond.AvgPlaySeconds/60).toFixed(2)}分钟`}
                  contentHeight={10}
                >
                </ChartCard>
                <Row gutter={24} style={{margin: 0, background: '#fff'}}>
                  <Col span={24} style={{paddingTop: 16,height:100}}>
                    <div style={{width:'70%',margin:'0 auto',fontSize:16}}>最高时长{`${parseInt(schoolBaseData.PlaySecondsCond.MaxPlaySeconds/60)}分钟`}</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>}
        </Card>}
        {/*数据分析*/}
        { showBox && <Card title="数据分析" extra={salesExtra}>
          <Card title={<span style={{fontSize:14}}>观看次数</span>} extra={<span style={{cursor:'pointer'}} onClick={this.handleSeeDetail}>查看详情</span>} bordered={false}>
            <div>
              <Select style={{width:200,marginRight:10}} onChange={this.handleGrade} disabled={!schoolID} placeholder="全部">
                <Option value={undefined}>全部</Option>
                {schoolGradeData && Object.keys(schoolGradeData).length!==0 && schoolGradeData.map((item)=><Option key={[item.Grade,item.Phase,item.Name]}>{item.Name}</Option>)}
              </Select>
              <Tooltip title="指标说明">
                <Icon type="info-circle-o"/>
              </Tooltip>
            </div>
            <Row>
              <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  {schoolChar &&<SchoolStcBar height={295} data={watchSchoolData} width={300}/>}
                  {!schoolChar &&<SchoolStcBar height={295} data={watchSchoolData} width={700}/>}
                </div>
              </Col>
            </Row>
          </Card>
          {/*各个科目观看率*/}
          <Card title={<span style={{fontSize:14}}>各个科目观看率</span>} bordered={false} className={styles.offlineCard}>
            <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
              {subjectWatchData && subjectWatchData.map(shop => (
                <TabPane tab={<CustomTab data={shop} currentTabKey={activeKey}/>} key={shop.SubjectName}>
                </TabPane>
              ))}
            </Tabs>
          </Card>
          {/*各时间段用户观看数*/}
          <Card title={<span style={{fontSize:14}}>各时间段用户观看数</span>} bordered={false} bodyStyle={{padding: '0 0 32px 0'}} className={styles.offlineCard}>
            {(Object.keys(userWatchData).length!==0 && userWatchData.LineChart.length!==0) && <WatchlineChart data={userWatchData}/>}
          </Card>
          {/*教师与学生互动统计*/}
          <Card title={<span style={{fontSize:14}}>教师与学生互动统计</span>} bordered={false} extra={<span style={{cursor:'pointer'}} onClick={this.handleTeacherStudent}>查看详情</span>}>
            {Object.keys(teacherStudentData).length!==0 && <Row gutter={24}>
              <Col {...topColResponsive} style={{marginBottom: 10}}>
                <div style={{border:'1px solid #ddd'}}>
                <ChartCard
                  bordered={false}
                  bodyStyle={{padding: '20px 70px 8px'}}
                  title="提醒"
                  total={numeral(teacherStudentData.Remind.Cnt).format('0,0')+'次'}
                  contentHeight={10}
                >
                </ChartCard>
                <Row gutter={24} style={{margin: 0, background: '#fff'}}>
                  <Col span={12} style={{paddingTop: 36,paddingLeft:70}}>
                    <div>已提醒&nbsp;{`${teacherStudentData.Remind.TCnt}个教师`}</div>
                    <div>未提醒&nbsp;{`${teacherStudentData.Remind.NTCnt}个教师`}</div>
                  </Col>
                  <Col span={12}>
                    <Pie
                      animate={false}
                      color={'#1890ff'}
                      inner={0.55}
                      tooltip={false}
                      total={`${teacherStudentData.Remind.TCntRate}%`}
                      margin={[0, 0, 0, 0]}
                      lineWidth={6}
                      height={128}
                      percent={teacherStudentData.Remind.TCntRate ? teacherStudentData.Remind.TCntRate  : 0.01}
                    />
                  </Col>
                </Row>
                </div>
              </Col>
              <Col {...topColResponsive} style={{marginBottom: 10}}>
                <div style={{border:'1px solid #ddd'}}>
                <ChartCard
                  bordered={false}
                  bodyStyle={{padding: '20px 70px 8px'}}
                  title="表扬"
                  total={numeral(teacherStudentData.Praise.Cnt).format('0,0')+'次'}
                  contentHeight={10}
                >
                </ChartCard>
                <Row gutter={24} style={{margin: 0, background: '#fff'}}>
                  <Col span={12} style={{paddingTop: 36,paddingLeft:70}}>
                    <div>已表扬{`${teacherStudentData.Praise.TCnt}个教师`}</div>
                    <div>未表扬{`${teacherStudentData.Praise.NTCnt}个教师`}</div>
                  </Col>
                  <Col span={12}>
                    <Pie
                      animate={false}
                      color={'#1890ff'}
                      inner={0.55}
                      tooltip={false}
                      total={`${teacherStudentData.Praise.TCntRate}%`}
                      margin={[0, 0, 0, 0]}
                      lineWidth={6}
                      height={128}
                      percent={teacherStudentData.Praise.TCntRate ? teacherStudentData.Praise.TCntRate  : 0.01}
                    />
                  </Col>
                </Row>
                </div>
              </Col>
              <Col {...topColResponsive} style={{marginBottom: 10}}>
                <div style={{border:'1px solid #ddd'}}>
                  <ChartCard
                    bordered={false}
                    title="推荐"
                    bodyStyle={{padding: '20px 70px 8px'}}
                    total={numeral(teacherStudentData.Recommend.Cnt).format('0,0')+'次'}
                    contentHeight={10}
                  >
                  </ChartCard>
                  <Row gutter={24} style={{margin: 0, background: '#fff'}}>
                    <Col span={12} style={{paddingTop: 36,paddingLeft:70}}>
                      <div>已推荐&nbsp;{`${teacherStudentData.Recommend.TCnt}个教师`}</div>
                      <div>未推荐&nbsp;{`${teacherStudentData.Recommend.NTCnt}个教师`}</div>
                    </Col>
                    <Col span={12}>
                      <Pie
                        animate={false}
                        color={'#1890ff'}
                        inner={0.55}
                        tooltip={false}
                        total={`${teacherStudentData.Recommend.TCntRate}%`}
                        margin={[0, 0, 0, 0]}
                        lineWidth={6}
                        height={128}
                        percent={teacherStudentData.Recommend.TCntRate ? teacherStudentData.Recommend.TCntRate  : 0.01}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col {...topColResponsive} style={{marginBottom: 10}}>
                <div style={{border:'1px solid #ddd'}}>
                  <ChartCard
                    bordered={false}
                    title="分享"
                    bodyStyle={{padding: '20px 70px 8px'}}
                    total={numeral(teacherStudentData.Faward.Cnt).format('0,0')+'次'}
                    contentHeight={10}
                  >
                  </ChartCard>
                  <Row gutter={24} style={{margin: 0, background: '#fff'}}>
                    <Col span={12} style={{paddingTop: 36,paddingLeft:70}}>
                      <div>已分享{`${teacherStudentData.Faward.TCnt}个教师`}</div>
                      <div>未分享{`${teacherStudentData.Faward.NTCnt}个教师`}</div>
                    </Col>
                    <Col span={12}>
                      <Pie
                        animate={false}
                        color={'#1890ff'}
                        inner={0.55}
                        tooltip={false}
                        total={`${teacherStudentData.Faward.TCntRate}%`}
                        margin={[0, 0, 0, 0]}
                        lineWidth={6}
                        height={128}
                        percent={teacherStudentData.Faward.TCntRate ? teacherStudentData.Faward.TCntRate  : 0.01}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>}
          </Card>
        </Card>}
      </PageHeaderLayout>
    );
  }
}

 
 