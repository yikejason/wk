import React, {Component} from 'react';
import {connect} from 'dva';
import { stringify } from 'qs';
import {currentDate} from '../../components/Tool';
import basicConfig from './../../utils/basicConfig';
import {Select, Button, Form, Card, AutoComplete, Input, Icon, message} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import IntegralStatisticTab from './stepIntegral/IntegralStatisticTab'
import styles from './IntegralStc.less';

 
const Option = Select.Option;
const FormItem = Form.Item;

@connect(({integralStc, loading}) => ({
    integralStc,
    loading: loading.models.integralStc,
}))
@Form.create()
export default class IntegralStc extends Component {

    componentDidMount() {
        const {form,integralStc:{conditionIntegralList}} = this.props;
        form.setFieldsValue({...conditionIntegralList});
    }

    isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`;
    updateValue = (str,values,name) => {
        const type = this.isType('Object')(values);
        let newValues = {};
        if(type){
            for (let [key, value] of Object.entries(values)) {
                newValues = {...newValues,[key]:value};
            }
        }else{
            newValues =  {[values]:name};
        }
        this.props.dispatch({type: str, payload:{...newValues}});
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
    hintMessage = (obj) => {
        message.destroy();
        if(!obj){
            message.info('请输入正确参数！');
            return true
        }
        if(!('PartnerID' in obj)) {
            message.info('请输入合作伙伴、学校！');
            return true
        }
        if(!('GID' in obj)) {
            message.info('请输入学校！');
            return true
        }
        return false
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch,integralStc:{gradeList,partnerList,schoolList,studentList,classesList,initialList,conditionIntegralList}} = this.props;
        const values = form.getFieldsValue();
        let newValues = {}
        for (let [key, value] of Object.entries(conditionIntegralList)) {
            if(values[key] && values[key] !== value){
                if(this.hintMessage(false)) return;
            } 
            if (value) newValues[key] = value
        }
        if('Grade' in newValues){
            gradeList.map(item => {
                const {Name,Grade,Phase} = item
                if(Name=== newValues.Grade){
                    newValues = {...newValues,Grade:Grade,Phase:Phase}
                }
            })
        }
        if(this.hintMessage(newValues)) return;    
        const joinValues = {PageIndex: 1,PageSize: 10,...newValues}
        dispatch({
            type: 'integralStc/fetchList',
            payload: {...joinValues}
        });
        dispatch({
            type: 'integralStc/save',
            payload: {...conditionIntegralList}
        })
        dispatch({
            type: 'integralStc/inquireList',
            payload:{gradeList,partnerList,schoolList,studentList,classesList}
        });
        dispatch({
            type: 'integralStc/initialNameList',
            payload: {...initialList}
        })
    }
    
    handlePartnerSearch = (name) => {
        const text = name.trim();
        const {dispatch, form} = this.props;
        this.updateValue('integralStc/initialValue',{'PartnerName':text,'GName':undefined,GradeName:undefined,ClassName:undefined,UMName:undefined})
        dispatch({type: 'integralStc/clear'})
        if(text.length !== 0){
            dispatch({
                type: 'integralStc/fetchPartner',
                payload:{keyword:text}
            }).then(()=>{
                const {integralStc:{partnerList}} = this.props;
                const isPartnerID = this.dataChange(partnerList,text,'PartnerID',{GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
                if(isPartnerID){
                    const {PartnerID} = form.getFieldsValue();
                    this.updateValue('integralStc/integralSave',{PartnerID,GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
                }else{
                    this.updateValue('integralStc/integralSave',{PartnerID:undefined,GID:undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
                }
            })
            form.setFieldsValue({GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined});
            return 
        }
        this.updateValue('integralStc/integralSave',{PartnerID:undefined,GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
        form.setFieldsValue({PartnerID:undefined,GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined});
    }
    handlePartnerOnSelect = (name,opt) =>{
        const {dispatch, form} = this.props;
        const {props:{children}} = opt
        this.updateValue('integralStc/initialValue',{'PartnerName':children,'GName':undefined,GradeName:undefined,ClassName:undefined,UMName:undefined})
        this.updateValue('integralStc/integralSave',{PartnerID:name,GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
        form.setFieldsValue({GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined});
        dispatch({type: 'integralStc/clear'})
    }
    handleSchoolSearch = (name) => {
        const text = name.trim()
        const {dispatch,form} = this.props;
        const {PartnerID} = form.getFieldsValue();
        this.updateValue('integralStc/initialValue',{GName:text,GradeName:undefined,ClassName:undefined,UMName:undefined})
        dispatch({type: 'integralStc/clearSchool'})
        if(text.length !== 0){
            dispatch({
                type: 'integralStc/fetchSchool',
                payload:{
                    keyword:text,
                    partnerID:PartnerID
                }
            }).then(()=>{
                const {integralStc:{schoolList}} = this.props;
                const isName = this.dataChange(schoolList,text,'GID')
                if(isName){
                    const {GID} = form.getFieldsValue()
                    dispatch({
                        type: 'integralStc/fetchGrade',
                        payload:{gID:GID}
                    })
                    this.updateValue('integralStc/integralSave',{GID,Grade: undefined,UMID: undefined,ClassID: undefined})
                }else{
                    this.updateValue('integralStc/integralSave',{GID:undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
                }
            })
            form.setFieldsValue({Grade: undefined,UMID: undefined,ClassID: undefined});
            return
        }
        this.updateValue('integralStc/integralSave',{GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
        form.setFieldsValue({GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined});
    }
    handleSchoolOnSelect = (name,opt) =>{
        const {dispatch,form} = this.props
        const {props:{children}} = opt
        form.setFieldsValue({Grade: undefined,UMID: undefined,ClassID: undefined});
        this.updateValue('integralStc/initialValue',{GName:children,GradeName:undefined,ClassName:undefined,UMName:undefined})
        this.updateValue('integralStc/integralSave',{GID:name,Grade: undefined,UMID: undefined,ClassID: undefined})  
        dispatch({type: 'integralStc/clearSchool'})       
        dispatch({
            type: 'integralStc/fetchGrade',
            payload:{gID:name}
        })      
    }
    gradeChange = (name) => {
        const {dispatch,form,integralStc:{gradeList}} = this.props;
        // const {GID} = form.getFieldsValue();
        // const [grade,phase] = this.gradeConvert(gradeList,name)
        this.updateValue('integralStc/initialValue','GradeName',name)
        this.updateValue('integralStc/integralSave','Grade', name)          
        form.setFieldsValue({ClassID: undefined});
        dispatch({type: 'integralStc/clearGrade'})
        // dispatch({
        //     type: 'integralStc/fetchClasses',
        //     payload: {
        //         gid: GID,
        //         grade,
        //         phase
        //     }
        // });
    }
    handleClassesSearch = (name) => {
        const text = name.trim()
        const {dispatch,form,integralStc:{gradeList}} = this.props;
        const {GID,Grade} = form.getFieldsValue();
        const val = this.gradeConvert(gradeList,Grade)
        const obj = val == null ? {keyword: text,gid: GID} : {keyword: text,gid: GID, grade:val[0],phase:val[1]}
        this.updateValue('integralStc/initialValue','ClassName',text)
        if(text.length !== 0){
            dispatch({
                type: 'integralStc/fetchClasses',
                payload: obj 
            }).then(()=>{
                const {integralStc:{classesList}} = this.props;
                const isClassID = this.dataChange(classesList,text,'ClassID');
                if(isClassID){
                    const {ClassID} = form.getFieldsValue();
                    this.updateValue('integralStc/integralSave',{ClassID})
                }else{
                    this.updateValue('integralStc/integralSave',{ClassID: undefined})
                }
            });
            return
        }
        this.updateValue('integralStc/integralSave',{ClassID: undefined})
        form.setFieldsValue({ClassID: undefined});
    }
    handleClassesOnSelect = (name,opt) =>{
        const {props:{children}} = opt
        this.updateValue('integralStc/initialValue','ClassName',children) 
        this.updateValue('integralStc/integralSave','ClassID', name)  
    }
    handleStudentSearch = (name) => {
        const text = name.trim()
        const {dispatch,form} = this.props;
        const {GID} = form.getFieldsValue();
        this.updateValue('integralStc/initialValue','UMName',text)       
        if(text.length !== 0){
            dispatch({
                type: 'integralStc/fetchStudent',
                payload: {
                    gID:GID,
                    mTypeID: '13',
                    keyword: text
                }
            }).then(()=>{
                const {integralStc:{studentList}} = this.props;
                const isUMID = this.dataChange(studentList,text,'UMID')
                if(isUMID){
                    const {UMID} = form.getFieldsValue();
                    this.updateValue('integralStc/integralSave',{UMID})
                }else{
                    this.updateValue('integralStc/integralSave',{UMID: undefined})
                }
            });
            return
        };
        this.updateValue('integralStc/integralSave',{UMID: undefined})
        form.setFieldsValue({UMID: undefined});
    }
    handleStudentOnSelect = (name,opt) =>{
        const {props:{children}} = opt
        this.updateValue('integralStc/initialValue','UMName',children) 
        this.updateValue('integralStc/integralSave','UMID', name)            
    }  
    handleDownload = () => {
        const {form,integralStc:{gradeList,conditionIntegralList}} = this.props;
        const values = form.getFieldsValue();
        let newValues = {}
        for (let [key, value] of Object.entries(conditionIntegralList)) {
            if(values[key] && values[key] !== value){
                if(this.hintMessage(false)) return;
            } 
            if (value) newValues[key] = value
        }
        if('Grade' in newValues){
            gradeList.map(item => {
                const {Name,Grade,Phase} = item
                if(Name=== newValues.Grade){
                    newValues = {...newValues,Grade:Grade,Phase:Phase}
                }
            })
        }
        if(this.hintMessage(newValues)) return;
        const date = currentDate('-');
        const joinValues = {...newValues,tableName:`积分统计-${date}.xlsx`};
        const token = sessionStorage.getItem('token')
        let newUrl = `/mcs/v3/StatisticWeb/ExportUserPointStatList?${stringify(joinValues)}&token=${token}` ;
        newUrl = basicConfig[`development_api`] + newUrl;
        window.location.href = newUrl;
    }
    render() {
        const {integralStc, form} = this.props;
        const {partnerList,schoolList,gradeList,classesList,studentList,initialList,conditionIntegralList } = integralStc;
        const {PartnerName,GName,GradeName,ClassName,UMName} = initialList;
        const {PartnerID,GID} = form.getFieldsValue();
        // const {PartnerID,GID} = conditionIntegralList;
        const {getFieldDecorator} = form;
        const partnerChildren = this.optionList(partnerList)
        const schoolChildren = this.optionList(schoolList)
        const classesChildren = this.optionList(classesList)
        const studentChildren = this.optionList(studentList,true)
        return (
            <PageHeaderLayout>   
                <Card bordered={false}>
                    <Form className={styles.integralOptions_form} layout="inline" onSubmit={this.handleSubmit}>
                    <FormItem>
                                {getFieldDecorator('PartnerID',{
                                    initialValue:PartnerName,
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
                                {getFieldDecorator('ClassID',{initialValue:ClassName})(
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
                                {getFieldDecorator('UMID',{initialValue:UMName})(
                                    <AutoComplete
                                        style={{width: 200}}
                                        onSearch={this.handleStudentSearch}
                                        placeholder="请输入学生姓名进行查询"
                                        onSelect={this.handleStudentOnSelect}
                                        disabled={!this.isSuccess(schoolList,GID)}
                                        dataSource={studentChildren}
                                    >
                                    <Input suffix={<Icon type="search" className="certain-category-icon" />}/>
                                    </AutoComplete>
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
                    </Form>
                    <IntegralStatisticTab/>  
                </Card>
            </PageHeaderLayout>
        );
    }
}
