/**
 * Created by Yu Tian Xiong on 2017/05/04.
 * fileName:观看统计model.js
 */
import {getWatchData, getBarChart, getWatchRank, getAccounte, getWatchNumber} from '../services/watchSrc';

export default {
  //命名的model状态空间
  namespace: 'watchStc',
  //初始状态
  state: {
    loading: false,
    watchData: [],//观看数据
    barChartData: [],//柱状图数据
    rankData: [],//排名数据
    accounteData: [],//占比数据
    watchNumberData:[],//各时段用户观看数
  },
  //异步操作
  effects: {
    //获取观看统计数据
    * getWatchData({payload}, {call, put}) {
      const response = yield call(getWatchData, payload);
      yield put({type: 'watchData', payload: response.Data});
    },
    //获取观看次数柱形图数据
    * getBarChart({payload}, {call, put}) {
      let Char = [];
      const response = yield call(getBarChart, payload);
      //重新组装后台返回的柱形图数据与pro的匹配
      response.Data && response.Data.XAxials.map((item, i) => {
        response.Data.YAxials.map((data, key) => {
          let Y;
          if (key === i) {
            Y = {x: item, y: data};
            Char.push(Y)
          }
        });
      });
      if (Char.length !== 0) yield put({type: 'barChartData', payload: Char});
    },
    //获取观看数据排名数据
    * getWatchRank({payload}, {call, put}) {
      const response = yield call(getWatchRank, payload);
      yield put({type: 'rankData', payload: response.Data});
    },
    //获取观看次数占比
    * getAccounte({payload}, {call, put}) {
      let newData = {};
      let PhasePlayRateList = [];
      let SubjectPlayRateList = [];
      const response = yield call(getAccounte, payload);
      //重组数据结构
      (Object.keys(response.Data) && response.Data.PhasePlayRateList.length !== 0) && response.Data.PhasePlayRateList.map((item) => {
        PhasePlayRateList.push({x: item.Name, y: item.PlayCnt})
      });
      (Object.keys(response.Data) && response.Data.SubjectPlayRateList.length !== 0) && response.Data.SubjectPlayRateList.map((item) => {
        SubjectPlayRateList.push({x: item.Name, y: item.PlayCnt})
      });
      newData.PhasePlayRateList = PhasePlayRateList;
      newData.SubjectPlayRateList = SubjectPlayRateList;
      newData.ZPlayCnt = response.Data.ZPlayCnt;
      yield put({type: 'accounteData', payload: newData});
    },
    //获取各时间段用户观看数
    * getWatchNumber({payload}, {call, put}) {
      let Watch = [];
      let WatchData = {};
      const response = yield call(getWatchNumber, payload);
      // console.log(response);
      //重组数据结构
      Object.keys(response.Data) && response.Data.LineChart.XAxials.map((item,i)=>{
        response.Data.LineChart.YAxials.map((data,key)=>{
          if(key === i){
            Watch.push({time:item,number:data})
          }
        })
      });
      WatchData.LineChart = Watch;
      WatchData.Conclusion = response.Data.Conclusion;
      yield put({type: 'watchNumberData', payload: WatchData});
    },
  },
  //把状态抛入store
  reducers: {
    //观看数据设置在状态中
    watchData(state, action) {
      return {
        ...state,
        watchData: action.payload
      }
    },
    //观看次数柱形图数据状态
    barChartData(state, action) {
      return {
        ...state,
        barChartData: action.payload
      }
    },
    //观看次数排名数据状态
    rankData(state, action) {
      return {
        ...state,
        rankData: action.payload
      }
    },
    //观看占比数据状态
    accounteData(state, action) {
      return {
        ...state,
        accounteData: action.payload
      }
    },
    //各时段用户观看数
    watchNumberData(state, action) {
      return {
        ...state,
        watchNumberData: action.payload
      }
    },
  },
};
