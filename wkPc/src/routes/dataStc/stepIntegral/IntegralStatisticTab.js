import React, {Component} from 'react';
import { routerRedux} from 'dva/router';
import {connect} from 'dva';
import {Table, Pagination,Divider,Alert} from 'antd';
import styles from '../WatchDetail.less';


@connect(({integralStc, loading}) => ({
    integralStc,
    loading: loading.effects['integralStc/fetchList'],
}))
export default class IntegralStatisticTab extends Component {
 
    handelePackage = val => () => {
        const {dispatch,integralStc:{argumentsList,conditionList,inquireList,initialNameList}} = this.props
        const {UMID,Name} = val;
        const value = UMID ? {...argumentsList,UMID} : {...argumentsList};
        const name = Name ? {...initialNameList,UMName:Name} : {...initialNameList}
        const id = UMID ? {...conditionList,UMID} : {...conditionList}
        dispatch({
            type: 'integralStc/fetchDetailList',
            payload: value
        }).then(()=>{ 
            dispatch({type: 'integralStc/clearSaveDetailList'})
            dispatch({
                type: 'integralStc/fetchDetailStudent',
                payload: {
                    gID:conditionList.GID,
                    mTypeID: '13',
                    keyword: Name
                }
            }).then(() => {
                const {integralStc:{studentDetailList}} = this.props;
                // 保存查询ID conditionInquireDetailList
                dispatch({
                    type: 'integralStc/inquireDetailSave',
                    payload:{...id}
                });
                dispatch({
                    type: 'integralStc/detailSave',
                    payload:{...id}
                });
                // 保存查询列表 saveDetailList
                dispatch({
                    type: 'integralStc/saveDetailList',
                    payload: {...inquireList,studentList:studentDetailList,isStudent:true}
                })
                // 保存查询Name initialSaveDetailList
                dispatch({
                    type: 'integralStc/saveDetailValue',
                    payload: {...name}
                })
                dispatch(routerRedux.push(`/dataStc/integralDetail`)); 
            })
            
        });
        
    }

    handlePageChange = (PageIndex,PageSize) => {
        const {dispatch,integralStc:{argumentsList}} = this.props
        dispatch({
            type: 'integralStc/fetchList',
            payload: {...argumentsList, PageIndex,PageSize}
        });
    }
    handleSizeChange = (PageIndex,PageSize) => {
        const {dispatch,integralStc:{argumentsList}} = this.props
        dispatch({
            type: 'integralStc/fetchList',
            payload: {...argumentsList, PageIndex,PageSize}
        });
    }
    render() {
        const {integralStc,loading} = this.props;
        const {list:{ViewModelList,TotalRecords,PageIndex,PageSize,Pages},argumentsList:{GID}} = integralStc;
        const columns = [
            {
                title: '姓名',
                dataIndex: 'Name',
                key:'Name',
            },
            {
                title: '所属学校',
                dataIndex: 'GName',
                key:'GName'
            },
            {
                title: '可用积分',
                dataIndex: 'AvailPoint',
                key:'AvailPoint',
            },
            {
                title: '累积积分',
                dataIndex: 'TotalPoint',
                key:'TotalPoint',
            },
            {
                title: '查看明细',
                dataIndex: 'UMID',
                key:'UMID',
                render: (text, record) => <a onClick={this.handelePackage(record)}>查看详情</a>,
            },
        ];

        return (
              
            <div>
                {ViewModelList && ViewModelList.length > 0 ?
                    <Table
                        loading={loading}
                        rowKey={record => record.ID}
                        columns={columns}
                        dataSource={ViewModelList}
                        pagination={false}
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
