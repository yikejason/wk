import React, {Component} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import { stringify } from 'qs';
import basicConfig from './../../utils/basicConfig';
import {DatePicker, Radio, Select, Button, Form, Card,  Input,message} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import WatchCourseTab from './stepWatch/WatchCourseTab'
import styles from './WatchDetail.less';

 
const Option = Select.Option;
const FormItem = Form.Item;
const Search = Input.Search;
const RadioButton = Radio.Button;
const { Group } = Radio;
const { RangePicker } = DatePicker;

@connect(({watchDetail, loading}) => ({
    watchDetail,
    loading: loading.models.watchDetail,
}))
@Form.create()
export default class WatchCourse extends Component {
    constructor(props){
        super(props);
        this.state = {
          isdisabled: false,
        }
    }
    componentDidMount() {
        this.setState({
            isdisabled:true
        })
        const {form,dispatch,watchDetail:{saveCourseList = {},saveDetailList,courseArgumentsList:{PageIndex,PageSize,StartDate,EndDate,...last},conditionCourseList:{fixedTime}}} = this.props
        const list = Object.keys(saveCourseList).length === 0 ? saveDetailList : saveCourseList;
        const {gradeList=[],subjectList=[],versionList=[]} = list;
            const obj = {...last,fixedTime}
            dispatch({
                type: 'watchDetail/gradeCourseList',
                payload: gradeList
            })
            dispatch({
                type: 'watchDetail/subjectCourseList',
                payload: subjectList
            })
            dispatch({
                type: 'watchDetail/versionCourseList',
                payload: versionList
            })
            form.setFieldsValue({...obj})
    }
    refitTime = (val) => {
        if(typeof(val) === "string") return [moment().startOf(val).format('YYYY-MM-DD'), moment().endOf(val).format('YYYY-MM-DD')];
        if(val.length > 0) return [val[0].format('YYYY-MM-DD'),val[1].format('YYYY-MM-DD')];
            return [];
    }
    dispatchTime = (values,fixedTime,timeFrame) => {  
        const [first,last] = timeFrame
        this.props.dispatch({
            type: 'watchDetail/courseSave',
            payload: {...values,fixedTime,timeFrame,StartDate:first,EndDate:last}
        })
    }
    hintMessage = (obj) => {
        message.destroy();
        if(!('PhaseID' in obj)) {
            message.info('必须选择学段、年级、科目、时间！');
            return true
        }
        if(!('GradeID' in obj)) {
            message.info('必须选择年级、科目、时间！');
            return true
        }
        if(!('SubjectID' in obj)) {
            message.info('必须选择科目、时间！');
            return true
        }
        if(!('StartDate' in obj)) {
            message.info('必须选择时间！');
            return true
        }
        return false
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch,watchDetail:{conditionCourseList,gradeCourseList, subjectCourseList, versionCourseList,}} = this.props
        form.validateFields((err, values) => {
            let newValues = {}
            for (let [key, value] of Object.entries(values)) {
                if (value && key !== 'fixedTime' && key !== 'timeFrame') newValues = {...newValues,[key]:value};
            }
            const { StartDate = null, EndDate = null } = conditionCourseList
            const joinValues = StartDate && EndDate ? {PageIndex: 1,PageSize: 10,...newValues,StartDate,EndDate} : {PageIndex: 1,PageSize: 10,...newValues}
            if(this.hintMessage(joinValues)) return;
            dispatch({
                type: 'watchDetail/fetchCourseList',
                payload: {...joinValues}
            });
            const obj = 'Keyword' in values && values.Keyword ? {isRender:true,Keyword:values.Keyword} : {isRender:true,Keyword:undefined};
            dispatch({
                type: 'watchDetail/courseSave',
                payload:obj
            });
            dispatch({
                type: 'watchDetail/saveCourseList',
                payload: {
                    gradeList:gradeCourseList,
                    subjectList:subjectCourseList,
                    versionList:versionCourseList
                }
            })
        });
    }
    phaseIDChange = (v,opt) => {
        const {form} = this.props;
        const {children} = opt.props
        this.props.dispatch({
            type: 'watchDetail/fetchCourseGrade',
            payload: v 
        });
        this.props.dispatch({
            type: 'watchDetail/courseSave',
            payload: {phaseName:children,gradeName: undefined, subjectName: undefined, versionName: undefined,isRender:false} 
        });
        form.setFieldsValue({GradeID: undefined, SubjectID: undefined, VersionID: undefined});
    }
    gradeIDChange = (v,opt) => {
        const {form} = this.props;
        const {children} = opt.props
        const values = form.getFieldsValue();
        this.props.dispatch({
            type: 'watchDetail/fetchCourseSubject',
            payload: {
                gradeID: v,
                phaseID: values.PhaseID
            }
        });
        this.props.dispatch({
            type: 'watchDetail/courseSave',
            payload: {gradeName: children, subjectName: undefined, versionName: undefined,isRender:false} 
        });
        form.setFieldsValue({SubjectID: undefined, VersionID: undefined});
    }
    subjectIDChange = (v,opt) => {
        const {form} = this.props;
        const {children} = opt.props
        const values = form.getFieldsValue();
        this.props.dispatch({
            type: 'watchDetail/fetchCourseVersion',
            payload: {
                subjectID: v,
                gradeID: values.GradeID,
                phaseID: values.PhaseID
            }
        });
        this.props.dispatch({
            type: 'watchDetail/courseSave',
            payload: {subjectName: children, versionName: undefined,isRender:false} 
        });        
        form.setFieldsValue({VersionID: undefined});
    }

    versionIDChange = (v,opt) => {
        const {children} = opt.props
        this.props.dispatch({
            type: 'watchDetail/courseSave',
            payload: {versionName: children,isRender:false}
        });   
    }
    handleTime = (e) => {
        const {form} = this.props;
        const values = form.getFieldsValue();
        const fixedTime = e.target.value;
        const times = this.refitTime(fixedTime)
        this.dispatchTime(values,fixedTime,times)
        form.setFieldsValue({timeFrame:[moment(times[0]), moment(times[1])]})
    }
    handleTimeFrame = (v) => {
        const {form} = this.props;
        const values = form.getFieldsValue();
        const timeFrame = this.refitTime(v)
        this.dispatchTime(values,undefined,timeFrame)
        form.setFieldsValue({fixedTime: undefined})
    }
    handleDownload = () => {
        const {form,watchDetail:{conditionCourseList}} = this.props
        form.validateFields((err, values) => {
            let newValues = {};
            for (let [key, value] of Object.entries(values)) {
                if (value && key !== 'fixedTime' && key !== 'timeFrame') newValues = {...newValues,[key]:value};
            }
            const { StartDate, EndDate} = conditionCourseList
            const joinValues = {...newValues,StartDate,EndDate,ExportFileName:`微课观看详情-${StartDate}~${EndDate}.xlsx`};
            if(this.hintMessage(joinValues)) return;
            const token = sessionStorage.getItem('token')
            let newUrl = `/mcs/v3/StatisticWeb/ExportCoursePeroidPlayStatList?${stringify(joinValues)}&token=${token}` ;
            newUrl = basicConfig[`development_api`] + newUrl;
            window.location.href = newUrl;
        });

    }
    render() {
        const {watchDetail: {...watchDetail}, form} = this.props;
        const {gradeCourseList, subjectCourseList, versionCourseList,conditionCourseList} = watchDetail;
        const {phaseName,gradeName,subjectName,versionName,Keyword,fixedTime, timeFrame=[]} = conditionCourseList;
        const {isdisabled} = this.state;
        const [firstTime,lastTime] = timeFrame;
        const values = form.getFieldsValue();
        const {getFieldDecorator} = form;
        return (
            <PageHeaderLayout>   
                <Card bordered={false}>
                    <Form className={styles.watchOptions_form} layout="inline" onSubmit={this.handleSubmit}>
                         <div className={styles.watchOptions_Box}>
                            <FormItem>
                                {getFieldDecorator('fixedTime',{initialValue:fixedTime})(
                                    <Group className={styles.watchDate} size={'small'} onChange={this.handleTime}>
                                        <RadioButton value="today">今日</RadioButton>
                                        <RadioButton value="week">本周</RadioButton>
                                        <RadioButton value="month">本月</RadioButton>
                                        {/* <RadioButton value="year">全年</RadioButton> */}
                                    </Group>
                                )}
                            </FormItem>
                            <FormItem >
                                {getFieldDecorator('timeFrame',{
                                    initialValue: firstTime && lastTime && [moment(firstTime), moment(lastTime)],
                                    rules: [{
                                        required: true, message: '时间必选',
                                    }]
                                })(
                                    <RangePicker onChange={this.handleTimeFrame}/>
                                )}
                            </FormItem>
                        </div> 
                        <div className={styles.watchOptions_Box}>
                            <FormItem className={styles.watchOptions_option}>
                                {getFieldDecorator('PhaseID',{
                                    initialValue:phaseName,
                                    rules: [{
                                        required: true, message: '学段必选',
                                    }]
                                })(
                                    <Select className={styles.select} placeholder='学段' onChange={this.phaseIDChange}>
                                        <Option value='30020'>小学</Option>
                                        <Option value='30030'>初中</Option>
                                        <Option value='30040'>高中</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem className={styles.watchOptions_option}>
                                {getFieldDecorator('GradeID',{
                                    initialValue:gradeName,
                                    rules: [{
                                        required: true, message: '年级必选',
                                    }]
                                })(
                                    <Select className={styles.select} placeholder='年级' disabled={ isdisabled && !values.PhaseID }
                                            onChange={this.gradeIDChange}>
                                        {
                                            gradeCourseList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
                                        } 
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem className={styles.watchOptions_option}>
                                {getFieldDecorator('SubjectID',{
                                    initialValue:subjectName,
                                    rules: [{
                                        required: true, message: '科目必选',
                                    }]
                                })(
                                    <Select className={styles.select} placeholder='科目' disabled={isdisabled && !values.GradeID}
                                            onChange={this.subjectIDChange}>
                                        {
                                            subjectCourseList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
                                        } 
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem className={styles.watchOptions_option}>
                                {getFieldDecorator('VersionID',{initialValue:versionName})(
                                    <Select className={styles.select} placeholder='教材' disabled={isdisabled && !values.SubjectID}
                                            onChange={this.versionIDChange}>
                                        {
                                            versionCourseList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
                                        } 
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem className={styles.watchOptions_option}>
                                {getFieldDecorator('Keyword',{initialValue:Keyword})(
                                    <Search placeholder="输入课程包名字" onChange={this.packageNameChange}/>
                                )}
                            </FormItem> 
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button onClick={this.handleDownload}>下载表格</Button> 
                            </FormItem>
                        </div>
                    </Form>
                    <WatchCourseTab/>
                </Card>
            </PageHeaderLayout>
        );
    }
}
