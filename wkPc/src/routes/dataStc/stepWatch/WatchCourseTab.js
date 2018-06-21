import React, {Component} from 'react';
import {connect} from 'dva';
import {Table, Pagination,Divider,Alert} from 'antd';
import {changeTime} from '../../../components/Tool'
import styles from '../WatchDetail.less';


@connect(({watchDetail, loading}) => ({
    watchDetail,
    loading: loading.effects['integralStc/fetchCourseList'],
}))
export default class WatchCourse extends Component {
    
    handleTableChange = (pagination, filters, sorter) => {
        const {dispatch,watchDetail:{courseArgumentsList}} =  this.props;
        if(Object.keys(sorter).length === 0){
            dispatch({
                type: 'watchDetail/fetchCourseList',
                payload: {...courseArgumentsList,SortFieldList:null}
            });
            return
        }
        const {columnKey,order} = sorter
        const IsAsc = order === 'ascend' && true || order === 'descend' && false
        const SortFieldList = [{IsAsc,SortField:columnKey}]
        dispatch({
            type: 'watchDetail/fetchCourseList',
            payload: {...courseArgumentsList,SortFieldList}
        });
    }
    handlePageChange = (PageIndex,PageSize) => {
        const {dispatch,watchDetail:{courseArgumentsList}} =  this.props;
        dispatch({
            type: 'watchDetail/fetchCourseList',
            payload: {...courseArgumentsList,PageIndex,PageSize}
        });
    }
    handleSizeChange = (PageIndex,PageSize) => {
        const {dispatch,watchDetail:{courseArgumentsList}} =  this.props;
        dispatch({
            type: 'watchDetail/fetchCourseList',
            payload: {...courseArgumentsList,PageIndex,PageSize}
        });
    }
    render() {
        const {watchDetail:{courseList:{ViewModelList,TotalRecords,PageIndex,PageSize,Pages},courseArgumentsList:{SubjectID,StartDate}}, loading} = this.props;
        const columns = [
            {
                title: '微课名称',
                dataIndex: 'CoursePeroidName',
                key:'CoursePeroidName',
                render: text =>  <span className={styles.courseColor}>{text}</span>,
            },
            {
                title: '所属课程包',
                dataIndex: 'CoursePackageName',
                key:'CoursePackageName'
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
                title: '收藏总次数',
                dataIndex: 'FavoriteCnt',
                key:'FavoriteCnt',
                render: text => <span>{text}次</span>,
            },

        ];

        return (
              
            <div>
                {ViewModelList && ViewModelList.length > 0 ?
                    <Table
                        loading={loading}
                        rowKey={record => record.CoursePackageID}
                        columns={columns}
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
