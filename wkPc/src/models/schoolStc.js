/**
 /**
 * Created by Yu Tian Xiong on 2017/05/04.
 * fileName:学校统计model.js
 */
import {getPartnter,getSchool,getBaseSchool,getWatchSchool,getSchoolGrade,getSubjectWatch,getUserWatch,getTeacherStudent} from '../services/schoolStc';

export default {
  //命名的model状态空间
  namespace: 'schoolStc',
  //初始状态
  state: {
    partnterData:[],//合作伙伴数据
    schoolData:[],//学校列表数据
    schoolBaseData:[],//学校基础数据
    watchSchoolData:[],//学校观看数据
    schoolGradeData:[],//获取年级
    subjectWatchData:[],//各个科目观看率数据
    userWatchData:[],//各时间段用户观看数据
    teacherStudentData:[],//教师与学生互动数据
  },
  //异步操作
  effects: {
    //获取合作伙伴列表
    * getPartnter({payload}, {call, put}) {
      const response = yield call(getPartnter, payload);
      yield put({type: 'partnterData', payload: response.Data});
    },
    //获取学校列表
    * getSchool({payload}, {call, put}) {
      const response = yield call(getSchool, payload);
      yield put({type: 'schoolData', payload: response.Data});
    },
    //获取基础学校数据
    * getBaseSchool({payload}, {call, put}) {
      const response = yield call(getBaseSchool, payload);
      yield put({type: 'schoolBaseData', payload: response.Data});
    },
    //获取学校观看次数柱形图统计数据
    * getWatchSchool({payload}, {call, put}) {
      let Char = [];
      const response = yield call(getWatchSchool, payload);
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
      if (Char.length !== 0) yield put({type: 'watchSchoolData', payload: Char});
    },
    //获取年级
    * getSchoolGrade({payload}, {call, put}) {
      const response = yield call(getSchoolGrade, payload);
      yield put({type: 'schoolGradeData', payload: response.Data});
    },
    //获取各个科目观看率
    * getSubjectWatch({payload}, {call, put}) {
      const response = yield call(getSubjectWatch, payload);
      yield put({type: 'subjectWatchData', payload: response.Data});
    },
    //获取各时间段用户观看数
    * getUserWatch({payload}, {call, put}) {
      let Watch = [];
      let WatchData = {};
      const response = yield call(getUserWatch, payload);
      // yield put({type: 'subjectWatchData', payload: response.Data});
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
      yield put({type: 'userWatchData', payload: WatchData});
    },
    //获取教师与学生互动统计
    * getTeacherStudent({payload}, {call, put}) {
      const response = yield call(getTeacherStudent, payload);
      yield put({type: 'teacherStudentData', payload: response.Data});
    },

  },
  //把状态抛入store
  reducers: {
    //合作伙伴数据设置在状态中
    partnterData(state, action) {
      return {
        ...state,
        partnterData: action.payload
      }
    },
    //学校数据设置在状态中
    schoolData(state, action) {
      return {
        ...state,
        schoolData: action.payload
      }
    },
    //学校基本数据设置在状态中
    schoolBaseData(state, action) {
      return {
        ...state,
        schoolBaseData: action.payload
      }
    },
    //学校观看次数统计数据设置状态中
    watchSchoolData(state, action) {
      return {
        ...state,
        watchSchoolData: action.payload
      }
    },
    //年级数据
    schoolGradeData(state, action) {
      return {
        ...state,
        schoolGradeData: action.payload
      }
    },
    //科目观看率
    subjectWatchData(state, action) {
      return {
        ...state,
        subjectWatchData: action.payload
      }
    },
    //各时间段用户观看数
    userWatchData(state, action) {
      return {
        ...state,
        userWatchData: action.payload
      }
    },
    //教师与学生互动统计
    teacherStudentData(state, action) {
      return {
        ...state,
        teacherStudentData: action.payload
      }
    },
    //清空状态
    clear() {
      return {
        partnterData:[],//合作伙伴数据
        schoolData:[],//学校列表数据
        schoolBaseData:[],//学校基础数据
        watchSchoolData:[],//学校观看数据
        schoolGradeData:[],//获取年级
        subjectWatchData:[],//各个科目观看率数据
        userWatchData:[],//各时间段用户观看数据
        teacherStudentData:[],//教师与学生互动数据
      }
    },
    //选择年级时清空观看次数数据
    clearWatchSchoolData(state){
      return{
        ...state,
        watchSchoolData:[]
      }
    }
  },
};