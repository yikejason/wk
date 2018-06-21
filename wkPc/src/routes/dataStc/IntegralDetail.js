import React, {Component} from 'react';
import {connect} from 'dva';
import {Select, Button, Form, Card, AutoComplete, Input, Icon,message} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import IntegralDetailTab from './stepIntegral/IntegralDetailTab'
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
        const {form,dispatch,integralStc:{saveDetailList,conditionInquireDetailList,studentDetailList,initialSaveDetailList}} = this.props;
        const {gradeList,partnerList,schoolList,classesList,studentList,isStudent} = saveDetailList;
        dispatch({
            type: 'integralStc/detailSave',
            payload: conditionInquireDetailList
        })
        if(isStudent){
            dispatch({ 
                type: 'integralStc/queryDetailGrade',
                payload: gradeList
            })
            dispatch({
                type: 'integralStc/queryDetailPartner',
                payload: partnerList
            })
            dispatch({
                type: 'integralStc/queryDetailSchool',
                payload: schoolList
            })
            dispatch({
                type: 'integralStc/queryDetailClasses',
                payload: classesList
            })
            dispatch({
                type: 'integralStc/queryDetailStudent',
                payload: studentList
            })
        }
        form.setFieldsValue({...conditionInquireDetailList})
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
        const {form, dispatch,integralStc:{gradeDetailList,partnerDetailList,schoolDetailList,studentDetailList,classesDetailList,initialDetailList,conditionDetailList}} = this.props;
        const values = form.getFieldsValue();
        let newValues = {}
        for (let [key, value] of Object.entries(conditionDetailList)) {
            if(values[key] && values[key] !== value){
                if(this.hintMessage(false)) return;
            } 
            if (value) newValues[key] = value
        }
        if('Grade' in newValues){
            gradeDetailList.map(item => {
                const {Name,Grade,Phase} = item
                if(Name=== newValues.Grade){
                    newValues = {...newValues,Grade:Grade,Phase:Phase}
                }
            })
        }
        if(this.hintMessage(newValues)) return;  
        const joinValues = {PageIndex: 1,PageSize: 10,...newValues}        
        dispatch({
            type: 'integralStc/fetchDetailList',
            payload: {...joinValues}
        });
        dispatch({
            type: 'integralStc/saveDetailValue',
            payload:{...initialDetailList}
        });
        dispatch({
            type: 'integralStc/inquireDetailSave',
            payload:{...conditionDetailList}
        });
        dispatch({
            type: 'integralStc/saveDetailList',
            payload: {
                gradeList:gradeDetailList,
                partnerList:partnerDetailList,
                schoolList:schoolDetailList,
                studentList:studentDetailList,
                classesList:classesDetailList,
                isStudent:false
            }
        })
    }
    
    handlePartnerSearch = (name) => {
        const text = name.trim();
        const {dispatch, form} = this.props;
        this.updateValue('integralStc/detailValue',{'PartnerName':text,'GName':undefined,GradeName:undefined,ClassName:undefined,UMName:undefined})
        dispatch({type: 'integralStc/clearDetail'})
        if(text.length !== 0){
            dispatch({
                type: 'integralStc/fetchDetailPartner',
                payload:{keyword:text}
            }).then(()=>{
                const {integralStc:{partnerDetailList}} = this.props;
                const isPartnerID = this.dataChange(partnerDetailList,text,'PartnerID')
                if(isPartnerID){
                    const {PartnerID} = form.getFieldsValue();
                    this.updateValue('integralStc/detailSave',{PartnerID,GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
                }else{
                    this.updateValue('integralStc/detailSave',{PartnerID:undefined,GID:undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
                }
            })
            form.setFieldsValue({GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined});
            return 
        }
        this.updateValue('integralStc/detailSave',{PartnerID:undefined,GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
        form.setFieldsValue({PartnerID:undefined,GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined});
    }
    handlePartnerOnSelect = (name,opt) =>{
        const {dispatch, form} = this.props;
        const {props:{children}} = opt
        this.updateValue('integralStc/detailValue',{'PartnerName':children,'GName':undefined,GradeName:undefined,ClassName:undefined,UMName:undefined})
        this.updateValue('integralStc/detailSave',{PartnerID:name,GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
        form.setFieldsValue({GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined});
        dispatch({type: 'integralStc/clearDetail'})
    }
    handleSchoolSearch = (name) => {
        const text = name.trim();
        const {dispatch,form} = this.props;
        const {PartnerID} = form.getFieldsValue();
        this.updateValue('integralStc/detailValue',{GName:text,GradeName:undefined,ClassName:undefined,UMName:undefined})
        dispatch({type: 'integralStc/clearDetailSchool'})
        if(text.length !== 0){
            dispatch({
                type: 'integralStc/fetchDetailSchool',
                payload:{
                    keyword:text,
                    partnerID:PartnerID
                }
            }).then(()=>{
                const {integralStc:{schoolDetailList}} = this.props;
                const isName = this.dataChange(schoolDetailList,text,'GID')
                if(isName){
                    const {GID} = form.getFieldsValue()
                    dispatch({
                        type: 'integralStc/fetchDetailGrade',
                        payload:{gID:GID}
                    })
                    this.updateValue('integralStc/detailSave',{GID,Grade: undefined,UMID: undefined,ClassID: undefined})
                }else{
                    this.updateValue('integralStc/detailSave',{GID:undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
                }
            })
            form.setFieldsValue({Grade: undefined,UMID: undefined,ClassID: undefined});
            return
        }
        this.updateValue('integralStc/detailSave',{GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined})
        form.setFieldsValue({GID: undefined,Grade: undefined,UMID: undefined,ClassID: undefined});
    }
    handleSchoolOnSelect = (name,opt) =>{
        const {dispatch,form} = this.props
        const {props:{children}} = opt
        form.setFieldsValue({Grade: undefined,UMID: undefined,ClassID: undefined});
        this.updateValue('integralStc/detailValue',{GName:children,GradeName:undefined,ClassName:undefined,UMName:undefined})
        this.updateValue('integralStc/detailSave',{GID:name,Grade: undefined,UMID: undefined,ClassID: undefined})  
        dispatch({type: 'integralStc/clearDetailSchool'})       
        dispatch({
            type: 'integralStc/fetchDetailGrade',
            payload:{gID:name}
        })      
    }
    gradeChange = (name) => {
        const {dispatch,form,integralStc:{gradeDetailList}} = this.props;
        // const {GID} = form.getFieldsValue();
        // const [grade,phase] = this.gradeConvert(gradeDetailList,name)
        this.updateValue('integralStc/detailValue','GradeName',name)
        this.updateValue('integralStc/detailSave',{Grade: name})          
        form.setFieldsValue({ClassID: undefined});
        dispatch({type: 'integralStc/clearDetailGrade'})
        // dispatch({
        //     type: 'integralStc/fetchDetailClasses',
        //     payload: {
        //         gid: GID,
        //         grade,
        //         phase
        //     }
        // });
    }
    handleClassesSearch = (name) => {
        const text = name.trim();
        const {dispatch,form,integralStc:{gradeDetailList}} = this.props;
        const {GID,Grade} = form.getFieldsValue();
        const val = this.gradeConvert(gradeDetailList,Grade)
        const obj = val == null ? {keyword: text,gid: GID} : {keyword: text,gid: GID, grade:val[0],phase:val[1]}
        this.updateValue('integralStc/detailValue','ClassName',text)
        if(text.length !== 0){
            dispatch({
                type: 'integralStc/fetchDetailClasses',
                payload: obj 
            }).then(()=>{
                const {integralStc:{classesDetailList}} = this.props;
                const isClassID = this.dataChange(classesDetailList,text,'ClassID');
                if(isClassID){
                    const {ClassID} = form.getFieldsValue();
                    this.updateValue('integralStc/detailSave',{ClassID})
                }else{
                    this.updateValue('integralStc/detailSave',{ClassID: undefined})
                }
            });
            return
        }
        this.updateValue('integralStc/detailSave',{ClassID: undefined})
        form.setFieldsValue({ClassID: undefined});
    }
    handleClassesOnSelect = (name,opt) =>{
        const {props:{children}} = opt
        this.updateValue('integralStc/detailValue','ClassName',children) 
        this.updateValue('integralStc/detailSave',{ClassID:name})  
    }
    handleStudentSearch = (name) => {
        const text = name.trim();
        const {dispatch,form} = this.props;
        const {GID} = form.getFieldsValue();
        this.updateValue('integralStc/detailValue','UMName',text)     
        if(text.length !== 0){
            dispatch({
                type: 'integralStc/fetchDetailStudent',
                payload: {
                    gID:GID,
                    mTypeID: '13',
                    keyword: text
                }
            }).then(()=>{
                const {integralStc:{studentDetailList}} = this.props;
                const isUMID = this.dataChange(studentDetailList,text,'UMID')
                if(isUMID){
                    const {UMID} = form.getFieldsValue();
                    this.updateValue('integralStc/detailSave',{UMID})
                }else{
                    this.updateValue('integralStc/detailSave',{UMID: undefined})
                }
            });
            return
        };
        this.updateValue('integralStc/detailSave',{UMID: undefined})
        form.setFieldsValue({UMID: undefined});
    }
    handleStudentOnSelect = (name,opt) =>{
        const {props:{children}} = opt
        this.updateValue('integralStc/detailValue','UMName',children) 
        this.updateValue('integralStc/detailSave',{UMID:name})            
    }  
    

    render() {
        const {integralStc, form} = this.props;
        const {initialSaveDetailList,gradeDetailList=[],partnerDetailList=[],schoolDetailList=[],studentDetailList=[],classesDetailList=[]} = integralStc;
        const {ClassName,GName,GradeName,PartnerName,UMName} = initialSaveDetailList;  
        const values = form.getFieldsValue();
        const {PartnerID,GID} = values
        const {getFieldDecorator} = form;
        const partnerChildren = this.optionList(partnerDetailList)
        const schoolChildren = this.optionList(schoolDetailList)
        const classesChildren = this.optionList(classesDetailList)
        const studentChildren = this.optionList(studentDetailList,true)
        return (
            <PageHeaderLayout>   
                <Card bordered={false}>
                    <Form className={styles.integralOptions_form} layout="inline" onSubmit={this.handleSubmit}>
                            <FormItem>
                                {getFieldDecorator('PartnerID',{
                                    initialValue:PartnerName,
                                    rules: [{
                                        required: true, message: '合作伙伴必选'   
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
                                        required: true, message: '学校必选'
                                    }]
                                })(
                                    <AutoComplete
                                        style={{width: 200}}
                                        onSearch={this.handleSchoolSearch}
                                        placeholder="学校"
                                        onSelect={this.handleSchoolOnSelect}
                                        disabled={!this.isSuccess(partnerDetailList,PartnerID)}
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
                                            disabled={!this.isSuccess(schoolDetailList,GID)}
                                            onChange={this.gradeChange}>
                                        {
                                            gradeDetailList.map(e => <Option key={e.Name} value={e.Name}>{e.Name}</Option>)
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
                                        disabled={!this.isSuccess(schoolDetailList,GID)}
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
                                        disabled={!this.isSuccess(schoolDetailList,GID)}
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
                    </Form>
                    <IntegralDetailTab/>  
                </Card>
            </PageHeaderLayout>
        );
    }
}
