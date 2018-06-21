/**
 * Created by Yu Tian Xiong on 2017/05/04.
 * fileName:观看统计routes 页面view
 */
import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Row, Col, Icon, Card, Tabs,DatePicker, Tooltip} from 'antd';
import {ChartCard,Bar, Pie,WatchlineChart} from '../../components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './WatchStc.less'
import numeral from 'numeral';
import {getTimeDistance} from '../../utils/utils';
import moment from 'moment';
const {TabPane} = Tabs;
const {RangePicker} = DatePicker;

//装饰器获取状态strore里的数据
@connect(({watchStc, loading}) => ({
  watchStcstate: watchStc,
  loading: loading.models.watchStc,
}))
//观看统计组件
export default class WatchStc extends Component {
  state = {
    currentTabKey: '',
    rangePickerValue: getTimeDistance('month'),
    ChooseType:'1',//页面进入默认选择为年级
  };
  componentDidMount() {
    this.getWatchData();
    this.getBarChart();
    this.getWatchRank();
    this.getAccounte();
    this.getWatchNumber();
  }
  //获取观看统计数据
  getWatchData = () => {
    this.props.dispatch({
      type: 'watchStc/getWatchData',
      payload: {}
    })
  };
  //获取观看次数柱形图数据
  getBarChart = () => {
    const {rangePickerValue,ChooseType} = this.state;
    this.props.dispatch({
      type: 'watchStc/getBarChart',
      payload:{
        type:ChooseType,
        StartDate:moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        EndDate:moment(rangePickerValue[1]).format('YYYY-MM-DD')
      }
    })
  };
  //获取观看排名数据
  getWatchRank = () => {
    const {rangePickerValue,ChooseType} = this.state;
    this.props.dispatch({
      type:'watchStc/getWatchRank',
      payload:{
        type:ChooseType,
        StartDate:moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        EndDate:moment(rangePickerValue[1]).format('YYYY-MM-DD')
      }
    })
  };
  //获取观看次数占比
  getAccounte = () =>{
    const {rangePickerValue} = this.state;
    this.props.dispatch({
      type:'watchStc/getAccounte',
      payload:{
        StartDate:moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        EndDate:moment(rangePickerValue[1]).format('YYYY-MM-DD')
      }
    })
  };
  //获取各时间段观看数据
  getWatchNumber = () => {
    const {rangePickerValue} = this.state;
    this.props.dispatch({
      type:'watchStc/getWatchNumber',
      payload:{
        // GID:'',
        StartDate:moment(rangePickerValue[0]).format('YYYY-MM-DD'),
        EndDate:moment(rangePickerValue[1]).format('YYYY-MM-DD')
      }
    })
  };
  //时间选择框时间change事件
  handleRangePickerChange = rangePickerValue => {
    this.setState({rangePickerValue},()=>{
      this.getBarChart();
      this.getAccounte();
      this.getWatchNumber();
      this.getWatchRank();
    });
  };
  //日周月年tab切换
  selectDate = type => {
    this.setState({rangePickerValue: getTimeDistance(type)},()=>{
      this.getBarChart();
      this.getAccounte();
      this.getWatchNumber();
      this.getWatchRank();
    });
  };
  //科目年级切换
  handleSg = (key) => {
    this.setState({ChooseType:key},()=>{
      this.getBarChart();
      this.getWatchRank();
    })
  };
  //根据类型改变tab active样式
  isActive(type) {
    const {rangePickerValue} = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const {watchStcstate, loading} = this.props;
    const {rangePickerValue,ChooseType} = this.state;
    const {watchData,barChartData,rankData,accounteData,watchNumberData} = watchStcstate;
    const topColResponsiveProps = {xs: 24, sm: 12, md: 12, lg: 12, xl: 6, style: {marginBottom: 24},};
    const salesExtra = (
      <div className={styles.salesExtraWrap}>
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
          style={{width: 256}}
        />
        <Link to={`/dataStc/watch-detail`} style={{marginLeft:24}}>查看详情</Link>
      </div>
    );
    return (
      <PageHeaderLayout>
      <Fragment>
        {/*数据统计*/}
        {watchData.length !== 0 && <Row gutter={24}>
          <Col {...topColResponsiveProps} style={{marginBottom: 10}}>
            <ChartCard
              bordered={false}
              title="微课总数"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              }
              total={numeral(watchData.CoursePeroidPlayStat.CoursePeroidCnt).format('0,0')}
              contentHeight={10}
            >
            </ChartCard>
            <Row gutter={24} style={{margin: 0, background: '#fff'}}>
              <Col span={12}>
                <Pie
                  animate={false}
                  color={'#1890ff'}
                  inner={0.55}
                  tooltip={false}
                  margin={[0, 0, 0, 0]}
                  percent={
                    watchData.CoursePeroidPlayStat.PlayedRate!==0 && watchData.CoursePeroidPlayStat.PlayedRate>0.01 ?
                      watchData.CoursePeroidPlayStat.PlayedRate * 100 : watchData.CoursePeroidPlayStat.PlayedRate<0.01 && watchData.CoursePeroidPlayStat.PlayedRate>0 ?
                      0.01*100 : 0.01}
                  height={100}
                />
              </Col>
              <Col span={12} style={{paddingTop: 36}}>
                <div>被观看资源总数</div>
                <div>{watchData.CoursePeroidPlayStat.PlayedCnt}</div>
              </Col>
            </Row>
          </Col>
          <Col {...topColResponsiveProps} style={{marginBottom: 10}}>
            <ChartCard
              bordered={false}
              title="小学资源"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              }
              total={numeral(watchData.PrimarySchoolPlayStat.CoursePeroidCnt).format('0,0')}
              contentHeight={10}
            >
            </ChartCard>
            <Row gutter={24} style={{margin: 0, background: '#fff'}}>
              <Col span={12}>
                <Pie
                  animate={false}
                  color={'#1890ff'}
                  inner={0.55}
                  tooltip={false}
                  margin={[0, 0, 0, 0]}
                  percent={
                    watchData.PrimarySchoolPlayStat.PlayedRate!==0 && watchData.PrimarySchoolPlayStat.PlayedRate>0.01 ?
                    watchData.PrimarySchoolPlayStat.PlayedRate * 100 : watchData.PrimarySchoolPlayStat.PlayedRate<0.01 && watchData.PrimarySchoolPlayStat.PlayedRate>0 ?
                    0.01*100 : 0.01}
                  height={100}
                />
              </Col>
              <Col span={12} style={{paddingTop: 36}}>
                <div>被观看资源总数</div>
                <div>{watchData.PrimarySchoolPlayStat.PlayedCnt}</div>
              </Col>
            </Row>
          </Col>
          <Col {...topColResponsiveProps} style={{marginBottom: 10}}>
            <ChartCard
              bordered={false}
              title="初中资源"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              }
              total={numeral(watchData.JuniorHighSchoolPlayStat.CoursePeroidCnt).format('0,0')}
              contentHeight={10}
            >
            </ChartCard>
            <Row gutter={24} style={{margin: 0, background: '#fff'}}>
              <Col span={12}>
                <Pie
                  animate={false}
                  color={'#1890ff'}
                  inner={0.55}
                  tooltip={false}
                  margin={[0, 0, 0, 0]}
                  percent={
                    watchData.JuniorHighSchoolPlayStat.PlayedRate!==0 && watchData.JuniorHighSchoolPlayStat.PlayedRate>0.01 ?
                      watchData.JuniorHighSchoolPlayStat.PlayedRate * 100 : watchData.JuniorHighSchoolPlayStat.PlayedRate<0.01 && watchData.JuniorHighSchoolPlayStat.PlayedRate>0 ?
                      0.01*100 : 0.01}
                  height={100}
                />
              </Col>
              <Col span={12} style={{paddingTop: 36}}>
                <div>被观看资源总数</div>
                <div>{watchData.JuniorHighSchoolPlayStat.PlayedCnt}</div>
              </Col>
            </Row>
          </Col>
          <Col {...topColResponsiveProps} style={{marginBottom: 10}}>
            <ChartCard
              bordered={false}
              title="高中资源"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              }
              total={numeral(watchData.HighSchoolPlayStat.CoursePeroidCnt).format('0,0')}
              contentHeight={10}
            >
            </ChartCard>
            <Row gutter={24} style={{margin: 0, background: '#fff'}}>
              <Col span={12}>
                <Pie
                  animate={false}
                  color={'#1890ff'}
                  inner={0.55}
                  tooltip={false}
                  margin={[0, 0, 0, 0]}
                  percent={
                    watchData.HighSchoolPlayStat.PlayedRate!==0 && watchData.HighSchoolPlayStat.PlayedRate>0.01 ?
                      watchData.HighSchoolPlayStat.PlayedRate * 100 : watchData.HighSchoolPlayStat.PlayedRate<0.01 && watchData.HighSchoolPlayStat.PlayedRate>0 ?
                      0.01*100 : 0.01}
                  height={100}
                />
              </Col>
              <Col span={12} style={{paddingTop: 36}}>
                <div>被观看资源总数</div>
                <div>{watchData.HighSchoolPlayStat.PlayedCnt}</div>
              </Col>
            </Row>
          </Col>
        </Row>}
        {/*数据分析*/}
        <Card loading={loading} bordered={false} bodyStyle={{padding: 0}} title="数据分析">
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{marginBottom: 24}} onChange={this.handleSg} activeKey={ChooseType}>
              <TabPane tab="年级" key="1">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar height={295} title="各年级观看次数" data={barChartData}/>
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>观看次数排名</h4>
                      <ul className={styles.rankingList}>
                        {rankData && rankData.map((item, i) => (
                          <li key={item.Name}>
                            <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                            <span>{item.Name}</span>
                            <span>{numeral(item.PlayCnt).format('0,0')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="科目" key="2">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar height={295} title="各科目观看次数" data={barChartData}/>
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>观看次数排名</h4>
                      <ul className={styles.rankingList}>
                        {rankData && rankData.map((item, i) => (
                          <li key={item.Name}>
                            <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                            <span>{item.Name}</span>
                            <span>{numeral(item.PlayCnt).format('0,0')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
        {/*资源观看数占比*/}
        <Card bordered={false} bodyStyle={{padding: 0}} title="资源观看数占比" style={{marginTop:30}}>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              className={styles.salesCard}
              title={<span style={{fontSize:14}}>各学段观看次数占比</span>}
              bodyStyle={{padding: 150}}
              style={{marginTop: 18, minHeight: 400}}
            >
              {Object.keys(accounteData).length!==0 && <Pie
                hasLegend
                subTitle="总观看次数"
                total={numeral(accounteData.ZPlayCnt).format('0,0')}
                data={accounteData.PhasePlayRateList}
                height={248}
                lineWidth={4}
              />}
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              className={styles.salesCard}
              title={<span style={{fontSize:14}}>各科目观看次数占比</span>}
              bodyStyle={{padding: 150}}
              style={{marginTop: 18, minHeight: 400}}
            >
              {Object.keys(accounteData).length!==0 && <Pie
                hasLegend
                subTitle="总观看次数"
                total={numeral(accounteData.ZPlayCnt).format('0,0')}
                data={accounteData.SubjectPlayRateList}
                height={248}
                lineWidth={4}
              />}
            </Card>
          </Col>
        </Row>
        </Card>
        <Card
          loading={loading}
          className={styles.offlineCard}
          bordered={false}
          bodyStyle={{padding: '0 0 32px 0'}}
          style={{marginTop: 32}}
          title="各时间段用户观看数"
        >
          {(Object.keys(watchNumberData).length!==0 && watchNumberData.LineChart.length!==0) && <WatchlineChart data={watchNumberData}/>}
        </Card>
      </Fragment>
      </PageHeaderLayout>
    );
  }
}

 
 