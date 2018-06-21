import React from 'react'
import {Tabs, Toast} from 'antd-mobile';
import api from "../../api";
import {CourseItem, GetMore, GoToStudy} from '../../components'

export default class CollectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [{
        title: '全部', ID: '0'
      }],
      SubjectID: '0',
      HasNext:false,
      firstLoading:false,
      loading:true,
    }
  }

  componentDidMount() {
    Toast.loading("加载中",1);
    api.GetSubjectList().then(res => {
      if (res.Ret === 0) {
        this.setState({tabs: this.formatTabs([{Name: '全部', ID: '0'}, ...res.Data])})
      }
    });
    this.GetFavList();
  }

  //格式话tab数据
  formatTabs = (data) => {
    const newData = [];
    if (!(data && data.length)) return newData;
    return data.map(({ID, Name: title}) => {
      return {title, ID}
    })
  };

  //tabs 触发改变
  handleChange = ({ID: SubjectID}) => {
    Toast.loading("加载中",1);
    this.setState({SubjectID,loading:true}, () => {
      let CursorID = '0';
      setTimeout(()=>this.GetFavList(this.state.SubjectID, CursorID),500)
    })
  };

  //列表数据
  GetFavList = (SubjectID, CursorID) => {
    api.GetFavList({SubjectID, CursorID}).then(res => {
      if (res.Ret === 0) {
        this.setState({ViewModelList: res.Data.ViewModelList,loading:false})
      }
    })
  };

  //点击加载更多
  handleGetMore = () => {
    this.GetFavList(this.conditionChange(this.props.SubjectID, '0'))
  };

  //点击取消收藏
  handleClose = (CoursePeriodID) => {
    api.SetFavarite({body: {CoursePeriodID, isFav: false}}).then(res => {
      if (res.Ret === 0) {
        this.setState({ViewModelList: [...this.state.ViewModelList].filter(item => item.CoursePeriodID !== CoursePeriodID)}, () => {
          Toast.info('已取消收藏', 1)
        })
      }
    })
  };
  render() {
    let {tabs,ViewModelList,HasNext,firstLoading} = this.state;
    return <div>
      <Tabs
        tabs={tabs}
        animated={true}
        renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3}/>}
        onChange={this.handleChange}>
        <div>
          {this.state.loading ? '' : ViewModelList && ViewModelList.length > 0 ? ViewModelList.map((item, index) =>
            <CourseItem
              key={index}
              {...item}
              modal={'collectList'}
              onClose={this.handleClose}
            />
          ) : Array.isArray(ViewModelList) && ViewModelList.length===0 ? <GoToStudy firstLoading={firstLoading}/> : null}
          {HasNext && <GetMore onClick={() => this.handleGetMore()}/>}
        </div>
      </Tabs>
    </div>
  }
}













