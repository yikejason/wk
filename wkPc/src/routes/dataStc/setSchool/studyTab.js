import React, {Component} from 'react';
import {connect} from 'dva';
import {Table, Pagination,Divider,Alert} from 'antd';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
import {changeTime} from '../../../components/Tool'
import styles from '../TeachersInteraction.less'

@connect(({teachersDetail, loading}) => ({
    teachersDetail,
    loading: loading.effects['teachersDetail/fetchStudentList'],
}))
export default class StudyTab extends Component {
    
    handleTableChange = (pagination, filters, sorter) => {
        const {dispatch,teachersDetail:{argumentsList}} = this.props;
        if(Object.keys(sorter).length === 0){
            dispatch({
                type: 'teachersDetail/fetchStudentList',
                payload: {...argumentsList,SortFieldList:null}
            });
            return
        }
        const {columnKey,order} = sorter
        const IsAsc = order === 'ascend' && true || order === 'descend' && false
        const SortFieldList = [{IsAsc,SortField:columnKey}]
        dispatch({
            type: 'teachersDetail/fetchStudentList',
            payload: {...argumentsList,SortFieldList}
        });
    }
    handlePageChange = (PageIndex,PageSize) => {
        const {dispatch,teachersDetail:{argumentsList}} = this.props;
        dispatch({
            type: 'teachersDetail/fetchStudentList',
            payload: {...argumentsList,PageIndex,PageSize}
        });
    }
    handleSizeChange = (PageIndex,PageSize) => {
        const {dispatch,teachersDetail:{argumentsList}} = this.props;
        dispatch({
            type: 'teachersDetail/fetchStudentList',
            payload: {...argumentsList,PageIndex,PageSize}
        });
    } 
    tabTitle = () =>{
        const {teachersDetail:{conditionTitleList}} = this.props;
        const {GradeName,GName,ClassName} = conditionTitleList;
        return `${GName !== undefined ? GName : ''} ${GradeName !== undefined ? GradeName : ''}${ClassName !== undefined ? ClassName : ''}——学习报告`
    }
    render() {
        const {teachersDetail:{list,argumentsList:{GID}}, loading} = this.props;
        const {ViewModelList,TotalRecords,PageIndex,PageSize,Pages} = list;
        const columns = [
            {
                title: '学生姓名',
                dataIndex: 'Name',
                className: 'column-center',
                key:'Name',
            },
            {
                title: '所属班级',
                dataIndex: 'ClassName',
                className: 'column-center',
                key:'ClassName',
            },
            {
                title: '开通服务',
                dataIndex: 'IsFuncBought',
                className: 'column-center',
                
                key:'IsFuncBought',
                render: text => <span>{text ? '已开通' : '未开通'}</span>,
            },
            {
                title: '累计学习微课',
                dataIndex: 'LearnCoursePeriodCnt',
                className: 'column-center',
                key:'LearnCoursePeriodCnt',
                sorter: true,
                render: text => <span>{text}次</span>,
            },
            {
                title: '累计学习天数',
                dataIndex: 'LearnDays',
                className: 'column-center',
                key:'LearnDays',
                sorter: true,
                render: text => <span>{text}天</span>,
            },
            {
                title: '累计学习时长',
                dataIndex: 'LearnSeconds',
                className: 'column-center',
                key:'LearnSeconds',
                sorter: true,
                render: text => {
                    const times = changeTime(text);
                    return <span>{times}</span>;
                },
            },
            {
                title: '好习惯天数',
                dataIndex: 'GoodHabitDays',
                className: 'column-center',
                key:'GoodHabitDays',
                sorter: true,
                render: text => <span>{text}天</span>,
            },
            {
                title: '学习时段分布',
                dataIndex: 'HabitHours',
                className: 'column-center',
                // align:'center',
                key:'HabitHours',
                render: (text) => {
                    
                    return (
                        <div style={{width:'300px',overflowY:'hidden',overflowX:'auto'}}>
                            <Chart
                                animate={false}
                                scale={{
                                    x: {type: 'cat',range: [0, 1],},
                                    y: {min: 0,}
                                }}
                                width={800}
                                height={120}
                                forceFit={false}
                                data={text}
                                padding={[6, 16, 36, 16]}
                            >
                                <Axis name='x'
                                    key="axis-x"
                                    line={false}
                                    label = {{
                                            offset: 10, 
                                            autoRotate: false,
                                            formatter(val, item, index) {
                                                return val
                                            },
                                    }}
                                />
                                <Axis
                                    key="axis-y"
                                    name="y"
                                    label={false}
                                    line={false}
                                    tickLine={false}
                                    grid={false}
                                />
                                <Tooltip showTitle={false} crosshairs={false} />
                                <Geom
                                    type="area"
                                    position="x*y"
                                    color={'rgba(24, 144, 255, 0.2)'}
                                    tooltip={[
                                        'x*y',
                                        (x, y) => ({
                                            name: x,
                                            value: y,
                                        }),
                                    ]}
                                    shape="smooth"
                                />
                                <Geom
                                    type="line"
                                    position="x*y"
                                    shape="smooth"
                                    color={'#1089ff'}
                                    size={2}
                                    tooltip={false}
                                    />
                            </Chart>
                        </div>
                    )
                },
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
