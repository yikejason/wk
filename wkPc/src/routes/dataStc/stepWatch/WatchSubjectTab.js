import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Table, Pagination,Divider,Alert} from 'antd';
import {changeTime} from '../../../components/Tool';
// import styles from '../WatchDetail.less';


@connect(({watchDetail, loading}) => ({
    watchDetail,
    loading: loading.effects['integralStc/fetchCourseList'],
}))
export default class WatchSubject extends Component {

    handeleCoursePackage = val => () => {
        const {dispatch,watchDetail:{argumentsList,conditionList,inquireList}} = this.props
        const {CoursePackageName} = val
        const value = CoursePackageName ? {...argumentsList,Keyword:CoursePackageName} : {...argumentsList};
        dispatch({
            type: 'watchDetail/fetchCourseList',
            payload: value
        }).then(()=>{
            dispatch({type: 'watchDetail/clearSaveCourseList'})
            dispatch({
                type: 'watchDetail/courseSave',
                payload:conditionList
            });
            dispatch({
                type: 'watchDetail/saveDetailList',
                payload: {...inquireList}
            })
            dispatch(routerRedux.push(`/dataStc/watch-course`)); 
        });
        
    }
    handleTableChange = (pagination, filters, sorter) => {
        const {dispatch,watchDetail:{argumentsList}} =  this.props;
        if(Object.keys(sorter).length === 0){
            dispatch({
                type: 'watchDetail/fetchList',
                payload: {...argumentsList,SortFieldList:null}
            });
            return
        }
        const {columnKey,order} = sorter
        const IsAsc = order === 'ascend' && true || order === 'descend' && false
        const SortFieldList = [{IsAsc,SortField:columnKey}]
        dispatch({
            type: 'watchDetail/fetchList',
            payload: {...argumentsList,SortFieldList}
        });
    }
    handlePageChange = (PageIndex,PageSize) => {
        const {dispatch,watchDetail:{argumentsList}} =  this.props;
        dispatch({
            type: 'watchDetail/fetchList',
            payload: {...argumentsList,PageIndex,PageSize}
        });
    }
    handleSizeChange = (PageIndex,PageSize) => {
        const {dispatch,watchDetail:{argumentsList}} =  this.props;
        dispatch({
            type: 'watchDetail/fetchList',
            payload: {...argumentsList,PageIndex,PageSize}
        });
    }
    render() {
        const {watchDetail:{list:{ViewModelList,TotalRecords,PageIndex,PageSize,Pages},argumentsList:{SubjectID,StartDate}}, loading} = this.props;
        const columns = [
            {
                title: '课程包名称',
                dataIndex: 'CoursePackageName',
                key:'CoursePackageName',
                render: (text, record) => <a onClick={this.handeleCoursePackage(record)}>{text}</a>,
            },
            {
                title: '所属科目',
                dataIndex: 'SubjectName',
                key:'SubjectName'
            },
            {
                title: '所属版本',
                dataIndex: 'VersionName',
                key:'VersionName'
            },
            {
                title: '微课数量',
                dataIndex: 'CoursePeroidCnt',
                key:'CoursePeroidCnt',
                render: text => <span>{text}个</span>,
            },
            {
                title: '观看总人数',
                dataIndex: 'PlayUserCnt',
                key:'PlayUserCnt',
                sorter: true,
                render: text => <span>{text}人</span>,
                
            },
            {
                title: '观看总次数',
                dataIndex: 'PlayCnt',
                key:'PlayCnt',
                sorter: true,
                render: text => <span>{text}次</span>,
                
            },
            {
                title: '观看总时长',
                dataIndex: 'LearnSeconds',
                key:'LearnSeconds',
                sorter: true,
                render: text => {
                    const times = changeTime(text);
                    return <span>{times}</span>;
                },
                
            },
            {
                title: '评价总次数',
                dataIndex: 'EvaluateCnt',
                key:'EvaluateCnt',
                render: text => <span>{text}次</span>,
            },
            {
                title: '分享总次数',
                dataIndex: 'FawardCnt',
                key:'FawardCnt',
                render: text => <span>{text}次</span>,
            },
            {
                title: '操作',
                dataIndex: 'IsEnable',
                key:'IsEnable',
                render: (text, record) => <a onClick={this.handeleCoursePackage(record)}>查看详情</a>,
            },

        ];

        return (
              
            <div>
                {ViewModelList && ViewModelList.length > 0 ? 
                    <Table
                        loading={loading}
                        columns={columns}
                        rowKey={record => record.CoursePackageID}
                        dataSource={ViewModelList}
                        onChange={this.handleTableChange}
                        pagination={false}
                    />:
                    <div>
                        <Divider />
                        { SubjectID && StartDate ?
                            <Alert message="暂无相关数据" style={{textAlign:'center'}} type="error" />:
                            <Alert message="请选择学段、年级、科目、时间（必填筛选项）进行数据查询" style={{textAlign:'center'}} type="success" />
                        }
                    </div>
                }
                 {ViewModelList && TotalRecords !== 0 && Pages !== 0 && PageIndex && PageSize &&
                    <Pagination
                            className="ant-table-pagination"
                            showTotal={(total) => `共 ${total} 条记录 第 ${PageIndex} / ${Pages} 页`}
                            total={TotalRecords}
                            current={PageIndex}
                            pageSize={PageSize}
                            onChange={this.handlePageChange}
                            onShowSizeChange={this.handleSizeChange}
                            showSizeChanger
                            showQuickJumper
                        />
                    }
            </div>
        );
    }
}
