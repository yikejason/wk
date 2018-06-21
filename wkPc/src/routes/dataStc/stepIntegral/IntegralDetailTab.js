import React, {Component} from 'react';
import {connect} from 'dva';
import {Table, Pagination,Divider,Alert} from 'antd';
import styles from '../WatchDetail.less';


@connect(({integralStc, loading}) => ({
    integralStc,
    loading: loading.effects['integralStc/fetchDetailList'],
}))
export default class IntegralDetailTab extends Component {

    handlePageChange = (PageIndex,PageSize) => {
        const {dispatch,integralStc:{detailArgumentsList}} = this.props
        dispatch({
            type: 'integralStc/fetchDetailList',
            payload: {...detailArgumentsList,PageIndex,PageSize}
        });
    }
    handleSizeChange = (PageIndex,PageSize) => {
        const {dispatch,integralStc:{detailArgumentsList}} = this.props
        dispatch({
            type: 'integralStc/fetchDetailList',
            payload: {...detailArgumentsList,PageIndex,PageSize}
        });
    }
    render() {
        const {integralStc,loading} = this.props;
        const {detailList:{ViewModelList,TotalRecords,PageIndex,PageSize,Pages},detailArgumentsList:{GID}} = integralStc;
        const columns = [
            {
                title: '姓名',
                dataIndex: 'Name',
                key:'Name',
            },
            {
                title: '内容',
                dataIndex: 'Title',
                key:'Title'
            },
            {
                title: '获得积分',
                dataIndex: 'GetPoint',
                key:'GetPoint',
            },
            {
                title: '累计积分',
                dataIndex: 'TotalPoint',
                key:'TotalPoint',
            },
            {
                title: '时间',
                dataIndex: 'DetlTime',
                key:'DetlTime',
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
