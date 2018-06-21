/**
 * Created by Lin on 2017/05/04.
 * fileName: 科目观看详情routes 页面view
 */

import React, {Component} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import { stringify } from 'qs';
import basicConfig from './../../utils/basicConfig';
import {DatePicker, Radio, Select, Button, Form, Card, Input, message} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import WatchSubjectTab from './stepWatch/WatchSubjectTab'
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
export default class WatchDetail extends Component {
    
    componentDidMount() {
        const {form,watchDetail:{saveDetailID,conditionDetailList:{fixedTime}}} = this.props
        const obj = {...saveDetailID,fixedTime}
        form.setFieldsValue({...obj})
    }
    refitTime = (val) => {
        if(typeof(val) === "string") return [moment().startOf(val).format('YYYY-MM-DD'), moment().endOf(val).format('YYYY-MM-DD')];
        if(val.length > 0) return [val[0].format('YYYY-MM-DD'),val[1].format('YYYY-MM-DD')];
            return [];
    }
    dispatchTime = (fixedTime,timeFrame) => {
        const [first,last] = timeFrame
        this.props.dispatch({
            type: 'watchDetail/detailSave',
            payload: {fixedTime,timeFrame,StartDate:first,EndDate:last}
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
        const {form, dispatch,watchDetail:{conditionDetailList,gradeList=[],subjectList=[],versionList=[]}} = this.props
        form.validateFields((err, values) => {
            let newValues = {};
            for (let [key, value] of Object.entries(values)) {
                if (value && key !== 'fixedTime' && key !== 'timeFrame') newValues = {...newValues,[key]:value};
            }
            const { StartDate, EndDate} = conditionDetailList
            const joinValues = StartDate && EndDate ? {PageIndex: 1,PageSize: 10,...newValues,StartDate,EndDate} : {PageIndex: 1,PageSize: 10,...newValues};
            if(this.hintMessage(joinValues)) return;
            dispatch({
                type: 'watchDetail/fetchList',
                payload: {...joinValues}
            });
            const obj = 'Keyword' in values && values.Keyword ? {Keyword:values.Keyword} : {Keyword:undefined};
            dispatch({
                type: 'watchDetail/detailSave',
                payload:obj
            });
            dispatch({
                type: 'watchDetail/save',
                payload:{...conditionDetailList,...obj}
            });
            dispatch({
                type: 'watchDetail/inquireList',
                payload:{gradeList,subjectList,versionList}
            });
        });
    }
    phaseIDChange = (v,opt) => {
        const {form,dispatch} = this.props;
        const {children} = opt.props
        dispatch({
            type: 'watchDetail/fetchGrade',
            payload: v 
        });
        dispatch({
            type: 'watchDetail/detailSave',
            payload:{phaseName:children,gradeName: undefined, subjectName: undefined, versionName: undefined}
        })
        dispatch({
            type: 'watchDetail/saveDetailID',
            payload:{PhaseID:v,GradeID: undefined, SubjectID: undefined, VersionID: undefined}
        })
        form.setFieldsValue({GradeID: undefined, SubjectID: undefined, VersionID: undefined});
    }
    gradeIDChange = (v,opt) => {
        const {form,dispatch} = this.props;
        const {children} = opt.props
        const values = form.getFieldsValue();
        dispatch({
            type: 'watchDetail/fetchSubject',
            payload: {
                gradeID: v,
                phaseID: values.PhaseID
            }
        });
        dispatch({
            type: 'watchDetail/detailSave',
            payload:{gradeName: children, subjectName: undefined, versionName: undefined}
        })
        dispatch({
            type: 'watchDetail/saveDetailID',
            payload:{GradeID: v, SubjectID: undefined, VersionID: undefined}
        })
        form.setFieldsValue({SubjectID: undefined, VersionID: undefined});
    }
    subjectIDChange = (v,opt) => {
        const {form,dispatch} = this.props;
        const {children} = opt.props
        const values = form.getFieldsValue();
        dispatch({
            type: 'watchDetail/fetchVersion',
            payload: {
                subjectID: v,
                gradeID: values.GradeID,
                phaseID: values.PhaseID
            }
        });
        dispatch({
            type: 'watchDetail/detailSave',
            payload:{subjectName: children, versionName: undefined}
        })
        dispatch({
            type: 'watchDetail/saveDetailID',
            payload:{SubjectID: v, VersionID: undefined}
        })        
        form.setFieldsValue({VersionID: undefined});
    }

    versionIDChange = (v,opt) => {
        const {dispatch} = this.props;
        const {children} = opt.props
        dispatch({
            type: 'watchDetail/detailSave',
            payload:{versionName: children}
        })
        dispatch({
            type: 'watchDetail/saveDetailID',
            payload:{VersionID: v}
        })     
    }
    packageNameChange = (e) =>{
        const {dispatch} = this.props;
        const val = e.target.value;
        dispatch({
            type: 'watchDetail/saveDetailID',
            payload:{Keyword: val}
        })  
    }
    handleTime = (e) => {
        const {form} = this.props;
        const fixedTime = e.target.value;
        const times = this.refitTime(fixedTime)
        this.dispatchTime(fixedTime,times)
        form.setFieldsValue({timeFrame:[moment(times[0]), moment(times[1])]})
    }
    handleTimeFrame = (v) => {
        const {form} = this.props;
        const timeFrame = this.refitTime(v)
        this.dispatchTime(undefined,timeFrame)
        form.setFieldsValue({fixedTime: undefined})
    }
    handleDownload = () => {
        const {form,watchDetail:{conditionDetailList}} = this.props
        form.validateFields((err, values) => {
            let newValues = {};
            for (let [key, value] of Object.entries(values)) {
                if (value && key !== 'fixedTime' && key !== 'timeFrame') newValues = {...newValues,[key]:value};
            }
            const { StartDate, EndDate} = conditionDetailList;
            const joinValues = {...newValues,StartDate,EndDate,ExportFileName:`科目观看详情-${StartDate}~${EndDate}.xlsx`};
            if(this.hintMessage(joinValues)) return;
            const token = sessionStorage.getItem('token')
            let newUrl = `/mcs/v3/StatisticWeb/ExportCoursePackagePlayStatList?${stringify(joinValues)}&token=${token}` ;
            newUrl = basicConfig[`development_api`] + newUrl;
            window.location.href = newUrl;
        });

    }
    render() {
        const {watchDetail: {...watchDetail}, form} = this.props;
        const {gradeList, subjectList, versionList,conditionDetailList,saveDetailID} = watchDetail;
        const {phaseName,gradeName,subjectName,versionName,Keyword,fixedTime, timeFrame=[]} = conditionDetailList
        const [firstTime,lastTime] = timeFrame;
        const values = Object.keys(saveDetailID).length > 0 ? {...saveDetailID} : form.getFieldsValue();
        const {getFieldDecorator} = form;
      
        return (
            <PageHeaderLayout>   
                <Card bordered={false}>
                    <Form className={styles.watchOptions_form} layout="inline" onSubmit={this.handleSubmit}>
                        <div className={styles.watchOptions_Box}>
                            <FormItem>
                                {getFieldDecorator('fixedTime',{
                                    initialValue:fixedTime
                                })(
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
                                    <Select className={styles.select} placeholder='年级' disabled={!values.PhaseID }
                                            onChange={this.gradeIDChange}>
                                        {
                                            gradeList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
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
                                    <Select className={styles.select} placeholder='科目' disabled={!values.GradeID}
                                            onChange={this.subjectIDChange}>
                                        {
                                            subjectList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
                                        } 
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem className={styles.watchOptions_option}>
                                {getFieldDecorator('VersionID',{initialValue:versionName})(
                                    <Select className={styles.select} placeholder='教材' disabled={!values.SubjectID}
                                            onChange={this.versionIDChange}>
                                        {
                                            versionList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
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
                    <WatchSubjectTab/>
                </Card>
            </PageHeaderLayout>
        );
    }
}
