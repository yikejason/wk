import React, {Component} from 'react';
import {connect} from 'dva';
import {Table, Pagination, Divider, Alert} from 'antd';
import styles from '../TeachersInteraction.less';


@connect(({teachersDetail, loading}) => ({
    teachersDetail,
    loading: loading.effects['teachersDetail/fetchList'],
}))
export default class TeacherTab extends Component {

    handleTableChange = (pagination, filters, sorter) => {
        const {dispatch,teachersDetail:{argumentsList}} = this.props;
        if(Object.keys(sorter).length === 0){
            dispatch({
                type: 'teachersDetail/fetchList',
                payload: {...argumentsList,SortFieldList:null}
            });
            return
        }
        const {columnKey,order} = sorter
        const IsAsc = order === 'ascend' && true || order === 'descend' && false
        const SortFieldList = [{IsAsc,SortField:columnKey}]
        dispatch({
            type: 'teachersDetail/fetchList',
            payload: {...argumentsList,SortFieldList}
        });
    }
    handlePageChange = (PageIndex,PageSize) => {
        const {dispatch,teachersDetail:{argumentsList}} = this.props;
        dispatch({
            type: 'teachersDetail/fetchList',
            payload: {...argumentsList,PageIndex,PageSize}
        });
    }
    handleSizeChange = (PageIndex,PageSize) => {
        const {dispatch,teachersDetail:{argumentsList}} = this.props;
        dispatch({
            type: 'teachersDetail/fetchList',
            payload: {...argumentsList,PageIndex,PageSize}
        });
    } 
    tabTitle = () =>{
        const {teachersDetail:{conditionTitleList}} = this.props;
        const {GradeName,GName,ClassName} = conditionTitleList;
        return `${GName !== undefined ? GName : ''} ${GradeName !== undefined ? GradeName : ''}${ClassName !== undefined ? ClassName : ''}——教师互动详情报告`
    }
    render() {
        const {teachersDetail:{list,argumentsList:{GID}}, loading} = this.props;
        const {ViewModelList,TotalRecords,PageIndex,PageSize,Pages} = list;
        const columns = [
            {
                title: '教师姓名',
                dataIndex: 'Name',
                key:'Name',
            },
            {
                title: '所管理班级',
                dataIndex: 'ClassName',
                key:'ClassName'
            },
            {
                title: '累计提醒次数',
                dataIndex: 'RemindCnt',
                key:'RemindCnt',
                sorter: true,
                render: text => <span>{text}次</span>,
            },
            {
                title: '累计表扬次数',
                dataIndex: 'PraiseCnt',
                key:'PraiseCnt',
                sorter: true,
                render: text => <span>{text}次</span>,
            },
            {
                title: '累计推荐次数',
                dataIndex: 'RecommendCnt',
                key:'RecommendCnt',
                sorter: true,
                render: text => <span>{text}次</span>,
            },
            {
                title: '累计分享次数',
                dataIndex: 'ShareCnt',
                key:'ShareCnt',
                sorter: true,
                render: text => <span>{text}次</span>,
            },
            {
                title: '最近互动时间',
                dataIndex: 'DetlDate',
                key:'DetlDate'
            },

        ];

        return (
            <div>
                {ViewModelList && ViewModelList.length > 0 ?
                    <Table
                        className={styles.study_tab}
                        loading={loading}
                        rowKey={record => record.ID}
                        columns={columns}
                        dataSource={ViewModelList}
                        onChange={this.handleTableChange}
                        pagination={false}
                        title={this.tabTitle}
                    />:
                    <div>
                        <Divider />
                        { GID ?
                            <Alert message="暂无相关数据" style={{textAlign:'center'}} type="error" />:
                            <Alert message="请选择合作伙伴、学校（必填筛选项）进行数据查询" style={{textAlign:'center'}} type="success" />
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
