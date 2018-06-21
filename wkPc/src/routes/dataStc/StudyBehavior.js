import React, {Component} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import { stringify } from 'qs';
import basicConfig from './../../utils/basicConfig';
import {DatePicker, Radio, Select, Button, Form, Card,AutoComplete, Input, Icon,message} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StudyTab from './setSchool/studyTab'
import styles from './TeachersInteraction.less';

 
const Option = Select.Option;
const FormItem = Form.Item;
const Search = Input.Search;
const RadioButton = Radio.Button;
const { Group } = Radio;
const { RangePicker } = DatePicker;

@connect(({teachersDetail, loading}) => ({
    teachersDetail,
    loading: loading.models.StudyBehavior,
}))
@Form.create()
export default class StudyBehavior extends Component {

    componentDidMount() {
        const {form,teachersDetail:{argumentsList,timeIntervalList}} = this.props;
        const {fixedTime} = timeIntervalList;
        const {PageIndex,PageSize,SDate,EDate,Grade,Phase,...last} = argumentsList;
        const obj = {...last,fixedTime};
        this.props.dispatch({
            type: 'teachersDetail/idSave',
            payload: {...last}
        })
        form.setFieldsValue({...obj})
    }

    isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`;
    updateValue = (str,values,name) => {
        const type = this.isType('Object')(values);
        let newValues = {};
        if(type){
            for (let [key, value] of Object.entries(values)) {
                newValues =  {...newValues,[key]:value};
            }
        }else{
            newValues = {[values]:name};
        }
        this.props.dispatch({type: str, payload:newValues});
    }
        
    dataChange = (arr, id , str) => {
        if(str == 'UMID'){
             return arr.some(item => {
                 if(item.MName === id && item.UMID !== id){
                     let obj = {[str] : item.UMID};
                     this.props.form.setFieldsValue(obj);
                 }
                 return item.MName === id && item.UMID !== id
            })
        }else{
            return arr.some(item => {
                 if(item.Name === id && item.ID !== id){
                     let obj = {[str] : item.ID};
                     this.props.form.setFieldsValue(obj);
                 }
                 return item.Name === id && item.ID !== id
            })
        }
     }
    isSuccess = (arr, id) => arr.some(item => item.ID === id );
    optionList = (list,isumid=false) => list.map( item => <Option key={isumid ? item.UMID : item.ID}>{isumid ? item.MName : item.Name}</Option>);
    gradeConvert = (arr,name) => {
        let val = null;
        arr.map(item => item.Name === name && (val = [item.Grade,item.Phase]));
        return val
    }
    refitTime = (val) => {
        if(typeof(val) === "string") return [moment().startOf(val).format('YYYY-MM-DD'), moment().endOf(val).format('YYYY-MM-DD')];
        if(val.length > 0) return [val[0].format('YYYY-MM-DD'),val[1].format('YYYY-MM-DD')];
            return [];
    }
    dispatchTime = (values,fixedTime,timeFrame) => {
        const [first,last] = timeFrame
        this.props.dispatch({
            type: 'teachersDetail/timeInterval',
            payload: {...values,fixedTime,timeFrame,SDate:first,EDate:last}
        })
    }
    hintMessage = (obj) => {
        message.destroy();
        if(!obj){
            message.info('请输入正确参数！');
            return true
        }
        if(!('PartnerID' in obj)) {
            message.info('请输入合作伙伴、学校、时间！');
            return true
        }
        if(!('GID' in obj)) {
            message.info('请输入学校、时间！');
            return true
        }
        if(!('SDate' in obj)) {
            message.info('请输入时间！');
            return true
        }
        return false
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch,teachersDetail:{timeIntervalList,gradeList,conditionList,conditionIDList}} = this.props;
        const values = form.getFieldsValue();
        let newValues = {};
        for (let [key, value] of Object.entries(conditionIDList)) {
            if(key !== 'fixedTime' && key !== 'timeFrame' && values[key] && values[key] !== value){
                if(this.hintMessage(false)) return;
            } 
            if (value && key !== 'fixedTime' && key !== 'timeFrame') newValues = {...newValues,[key]:value};
        }
        if('Grade' in newValues){
            gradeList.map(item => {
                if(item.Name === newValues.Grade){
                    newValues = {...newValues,Grade:item.Grade,Phase:item.Phase}
                }
            })
        }
        const {timeFrame} = timeIntervalList;
        const joinValues = timeFrame && timeFrame.length > 0 ? {PageIndex: 1,PageSize: 10,...newValues,SDate:timeFrame[0],EDate:timeFrame[1]} : {PageIndex: 1,PageSize: 10,...newValues};
        if(this.hintMessage(joinValues)) return;   
        dispatch({
            type: 'teachersDetail/fetchStudentList',
            payload: {...joinValues}
        });
        dispatch({
            type: 'teachersDetail/tabTitle',
            payload: {...conditionList}
        });
    }
    
    handlePartnerSearch = (text) => {
        const name = text.trim();
        const {dispatch, form} = this.props;
        if(name.length !== 0){
            dispatch({
                type: 'teachersDetail/fetchPartner',
                payload:{keyword:name}
            }).then(()=>{
                const {teachersDetail:{partnerList}} = this.props;
                const isPartnerID = this.dataChange(partnerList,name,'PartnerID')
                if(isPartnerID){
                    const {PartnerID} = form.getFieldsValue();
                    this.updateValue('teachersDetail/idSave',{PartnerID,GID: undefined,Grade:undefined,ClassID:undefined,UMID: undefined})
                }else{
                    this.updateValue('teachersDetail/idSave',{PartnerID:undefined,GID: undefined,Grade:undefined,ClassID:undefined,UMID: undefined})
                }
            })
        }else{
            this.updateValue('teachersDetail/idSave',{PartnerID:undefined,GID: undefined,Grade:undefined,ClassID:undefined,UMID: undefined}) 
        }
        this.updateValue('teachersDetail/save',{partnerName:name,GName:undefined,GradeName:undefined,ClassName:undefined})
        form.setFieldsValue({PartnerID:undefined,GID: undefined,Grade:undefined,ClassID:undefined,UMID: undefined});
        dispatch({type: 'teachersDetail/clear'})
    }
    handlePartnerOnSelect = (name,opt) =>{
        const {dispatch, form} = this.props;
        const {props:{children}} = opt;
        this.updateValue('teachersDetail/idSave',{PartnerID:name,GID: undefined,Grade:undefined,ClassID:undefined,UMID: undefined}) 
        this.updateValue('teachersDetail/save',{partnerName:children,GName:undefined,GradeName:undefined,ClassName:undefined})
        form.setFieldsValue({GID: undefined,Grade:undefined,ClassID:undefined,UMID: undefined});
        dispatch({type: 'teachersDetail/clear'})
    }
    handleSchoolSearch = (text) => {
        const name = text.trim();
        const {dispatch,form} = this.props;
        const {PartnerID} = form.getFieldsValue();
        if(name.length !== 0){
            dispatch({
                type: 'teachersDetail/fetchSchool',
                payload:{
                    keyword:name,
                    partnerID:PartnerID
                }
            }).then(()=>{
                const {teachersDetail:{schoolList}} = this.props;
                const isName = this.dataChange(schoolList,name,'GID')
                if(isName){
                    const {GID} = this.props.form.getFieldsValue()
                    dispatch({
                        type: 'teachersDetail/fetchGrade',
                        payload:{gID:GID}
                    })
                    this.updateValue('teachersDetail/idSave',{GID,Grade:undefined,ClassID:undefined,UMID: undefined})
                }else{
                    this.updateValue('teachersDetail/idSave',{GID: undefined,Grade:undefined,ClassID:undefined,UMID: undefined})
                }
            })
        }else{
            this.updateValue('teachersDetail/idSave',{GID: undefined,Grade:undefined,ClassID:undefined,UMID: undefined}) 
        }
        this.updateValue('teachersDetail/save',{GName:name,GradeName:undefined,ClassName:undefined})
        form.setFieldsValue({Grade:undefined,ClassID:undefined,UMID: undefined});
        dispatch({type: 'teachersDetail/clearSchool'}) 
    }
    handleSchoolOnSelect = (val,opt) =>{
        const {dispatch,form} = this.props
        const {props:{children}} = opt;
        this.updateValue('teachersDetail/idSave',{GID:val,Grade:undefined,ClassID:undefined,UMID: undefined}) 
        this.updateValue('teachersDetail/save',{GName:children,GradeName:undefined,ClassName:undefined})
        form.setFieldsValue({Grade:undefined,ClassID:undefined,UMID: undefined});   
        dispatch({type: 'teachersDetail/clearSchool'})       
        dispatch({
            type: 'teachersDetail/fetchGrade',
            payload:{gID:val}
        })        
    }
    gradeChange = (name) => {
        const {dispatch,form,teachersDetail:{gradeList}} = this.props;
        // const {GID} = form.getFieldsValue();
        // const [grade,phase] = this.gradeConvert(gradeList,name) 
        this.updateValue('teachersDetail/idSave',{Grade:name}) 
        this.updateValue('teachersDetail/save',{GradeName:name,ClassName:undefined})        
        form.setFieldsValue({ClassID: undefined});
        dispatch({type: 'teachersDetail/clearGrade'})
        // dispatch({
        //     type: 'teachersDetail/fetchClasses',
        //     payload: {
        //         gid: GID,
        //         grade,
        //         phase
        //     }
        // });
    }
    handleClassesSearch = (text) => {
        const name = text.trim();
        const {dispatch,form,teachersDetail:{gradeList}} = this.props;
        const {GID,Grade} = form.getFieldsValue();
        const val = this.gradeConvert(gradeList,Grade)
        const obj = val == null ? {keyword: name,gid: GID} : {keyword: name,gid: GID, grade:val[0],phase:val[1]}
        if(name.length !== 0){
            dispatch({
                type: 'teachersDetail/fetchClasses',
                payload: obj 
            }).then(()=>{
                const {teachersDetail:{classesList}} = this.props;
                const isClassID =  this.dataChange(classesList,name,'ClassID')
                if(isClassID){
                    const {ClassID} = this.props.form.getFieldsValue()
                    this.updateValue('teachersDetail/idSave',{ClassID})
                }else{
                    this.updateValue('teachersDetail/idSave',{ClassID:undefined})
                }
            })
        }else{
            this.updateValue('teachersDetail/idSave',{ClassID:undefined}) 
        }
        this.updateValue('teachersDetail/save',{ClassName:name})    
    }
    handleClassesOnSelect = (name,opt) =>{
        const {props:{children}} = opt;
        this.updateValue('teachersDetail/idSave',{ClassID:name})
        this.updateValue('teachersDetail/save',{ClassName:children}) 
    }
    handleStudentSearch = (text) => {
        const name = text.trim();
        const {dispatch,form} = this.props;
        const {GID} = form.getFieldsValue();     
        if(name.length !== 0){
            dispatch({
                type: 'teachersDetail/fetchStudent',
                payload: {
                    gID:GID,
                    mTypeID: '13',
                    keyword: name
                }
            }).then(()=>{
                const {teachersDetail:{studentList}} = this.props;
                const isUMID = this.dataChange(studentList,name,'UMID')
                if(isUMID){
                    const {UMID} = this.props.form.getFieldsValue()
                    this.updateValue('teachersDetail/idSave',{UMID})
                }else{
                    this.updateValue('teachersDetail/idSave',{UMID:undefined})
                }
            })
        }else{
            this.updateValue('teachersDetail/idSave',{UMID:undefined}) 
        }
    }
    handleStudentOnSelect = (name,opt) =>{
        this.updateValue('teachersDetail/idSave',{UMID:name}) 
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
        this.dispatchTime(values,'',timeFrame)
        form.setFieldsValue({fixedTime: ''})
    }  
    handleDownload = () => {
        const {form,teachersDetail:{timeIntervalList,gradeList,conditionIDList,conditionList:{GName,GradeName,ClassName}}} = this.props;
        const values = form.getFieldsValue();
        let newValues = {};
        for (let [key, value] of Object.entries(conditionIDList)) {
            if(key !== 'fixedTime' && key !== 'timeFrame' && values[key] && values[key] !== value){
                if(this.hintMessage(false)) return;
            } 
            if (value && key !== 'fixedTime' && key !== 'timeFrame') newValues = {...newValues,[key]:value};
        }
        if('Grade' in newValues){
            gradeList.map(item => {
                if(item.Name === newValues.Grade){
                    newValues = {...newValues,Grade:item.Grade,Phase:item.Phase}
                }
            })
        }          
        const {timeFrame} = timeIntervalList;
        const joinValues = timeFrame && timeFrame.length > 0 ? {...newValues,SDate:timeFrame[0],EDate:timeFrame[1],tableName:`${GName ? GName : ''}${GradeName ? GradeName : ''}${ClassName ? ClassName : ''}——学习报告-${timeFrame[0] ? timeFrame[0] : ''}~${timeFrame[1] ? timeFrame[1] : ''}.xlsx`} : {...newValues,tableName:`${GName ? GName : ''}${GradeName ? GradeName : ''}${ClassName ? ClassName : ''}——学习报告.xlsx`};
        if(this.hintMessage(joinValues)) return; 
        const token = sessionStorage.getItem('token')
        let newUrl = `/mcs/v3/StatisticWeb/ExportSchStudentStatList?${stringify(joinValues)}&token=${token}` ;
        newUrl = basicConfig[`development_api`] + newUrl;
        window.location.href = newUrl;
    }
    render() {

        const {teachersDetail, form} = this.props;
        const {partnerList,schoolList,gradeList,classesList,studentList,timeIntervalList,conditionList} = teachersDetail;
        const {partnerName,GName,GradeName} = conditionList;
        const {PartnerID,GID} = form.getFieldsValue();
        const {getFieldDecorator} = form;
        const { fixedTime = '', timeFrame = []} = timeIntervalList;
        const [firstTime,lastTime] = timeFrame;
        const partnerChildren = this.optionList(partnerList)
        const schoolChildren = this.optionList(schoolList)
        const classesChildren = this.optionList(classesList)
        const studentChildren = this.optionList(studentList,true)
        return (
            <PageHeaderLayout>   
                <Card bordered={false}>
                    <Form className={styles.teacherOptions_form} layout="inline" onSubmit={this.handleSubmit}>
                        <div className={styles.teacherOptions_Box}>
                            <FormItem>
                                {getFieldDecorator('PartnerID',{
                                    initialValue:partnerName,
                                    rules: [{
                                        required: true, message: '合作伙伴必选',
                                    }]
                                })(
                                    <AutoComplete
                                        style={{width: 200}}
                                        onSearch={this.handlePartnerSearch}
                                        placeholder="合作伙伴"
                                        onSelect={this.handlePartnerOnSelect}
                                    >
                                    {partnerChildren}
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('GID',{
                                    initialValue:GName,
                                    rules: [{
                                        required: true, message: '学校必选',
                                    }]
                                })(
                                    <AutoComplete
                                        style={{width: 200}}
                                        onSearch={this.handleSchoolSearch}
                                        placeholder="学校"
                                        onSelect={this.handleSchoolOnSelect}
                                        disabled={!this.isSuccess(partnerList,PartnerID)}
                                    >
                                    {schoolChildren}
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('Grade',{initialValue:GradeName})(
                                    <Select className={styles.select} 
                                            style={{width: 100}}
                                            placeholder='年级' 
                                            disabled={!this.isSuccess(schoolList,GID)}
                                            onChange={this.gradeChange}>
                                        {
                                            gradeList.map(e => <Option key={e.Name} value={e.Name}>{e.Name}</Option>)
                                        } 
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('ClassID')(
                                    <AutoComplete
                                        style={{width: 100}}
                                        onSearch={this.handleClassesSearch}
                                        placeholder="班级"
                                        onSelect={this.handleClassesOnSelect}
                                        disabled={!this.isSuccess(schoolList,GID)}
                                    >
                                    {classesChildren}
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('UMID')(
                                    <AutoComplete
                                        style={{width: 260}}
                                        onSearch={this.handleStudentSearch}
                                        placeholder="请输入学生姓名或账号进行查询"
                                        onSelect={this.handleStudentOnSelect}
                                        disabled={!this.isSuccess(schoolList,GID)}
                                        dataSource={studentChildren}
                                    >
                                    <Input suffix={<Icon type="search" className="certain-category-icon" />}/>
                                    </AutoComplete>
                                )}
                            </FormItem>
                        </div>
                        <div className={styles.teacherOptions_Box}>
                            <FormItem>
                                {getFieldDecorator('fixedTime',{initialValue:fixedTime})(
                                    <Group className={styles.watchDate} size={'small'} onChange={this.handleTime}>
                                        <RadioButton value="day">今日</RadioButton>
                                        <RadioButton value="week">本周</RadioButton>
                                        <RadioButton value="month">本月</RadioButton>
                                        {/* <RadioButton value="year">全年</RadioButton> */}
                                    </Group>
                                )}
                            </FormItem>
                            <FormItem >
                                {getFieldDecorator('timeFrame',{
                                    initialValue: firstTime && lastTime && [moment(firstTime), moment(lastTime)]
                                })(
                                    <RangePicker onChange={this.handleTimeFrame}/>
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
                    <StudyTab/>  
                </Card>
            </PageHeaderLayout>
        );
    }
}


 
 