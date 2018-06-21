import { routerRedux } from 'dva/router';
import {
    get_Grade,
    get_Subject,
    get_Publish,
} from '../services/supply_api';
import {
    getCoursePackagePlayList,
    getCoursePeroidPlayStatList
} from '../services/dataStc';
import {messageFetch} from '../components/Message';
//test
import {GetCoursePackage,GetSubjectPackage} from '../../mock/testApi'

/**
 * @param    {object}  list                             科目观看详情table数据
 * @param    {object}  courseList                       微课观看详情table数据                                                   
 * @param    {array}   gradeList/gradeCourseList        年级
 * @param    {array}   subjectList/subjectCourseList    科目
 * @param    {array}   versionList/versionCourseList    版本
 * @param    {object}  argumentsList                    科目观看详情/查询  类别ID
 * @param    {object}  courseArgumentsList              微课观看详情/查询  类别ID
 * @param    {object}  inquireList                      科目观看详情/查询  {年级，科目，版本}保存
 * @param    {object}  saveDetailList                   科目观看详情/查看详情  saveDetailList = {...inquireList} 查询数据可持续
 * @param    {object}  saveCourseList                   微课观看详情/查询  {年级，科目，版本}保存
 * @param    {object}  saveDetailID                     科目观看详情/页面动态类别ID  初始化使用
 * @param    {object}  conditionList                    科目观看详情/查询 conditionList={...conditionDetailList,其他类别Name} 查询Name可持续
 * @param    {object}  conditionDetailList              科目观看详情/页面动态类别|查询   类别Name  初始化使用
 * @param    {object}  conditionCourseList              科目观看详情/查看详情  conditionCourseList={...conditionList} 查看详情Name中转 | 微课观看详情/页面动态类别|查询  初始化使用
 * 
 * @date     2017/05/04
 * @author   Lin
 */

export default {
    namespace: 'watchDetail',

    state: {
        list: {},
        courseList: {},
        gradeList: [],
        subjectList: [],
        versionList: [],
        gradeCourseList: [],
        subjectCourseList: [],
        versionCourseList: [],
        argumentsList: {},
        courseArgumentsList:{},
        inquireList:{},
        saveDetailList:{},
        saveCourseList:{},
        saveDetailID:{},
        conditionList: {},
        conditionDetailList:{},
        conditionCourseList:{},

    },
    effects: {
        * fetchList({payload}, {call, put}) {
            let obj = {};
            let argumentObj = {};
            // SortFieldList === null去除 argumentsList不需要保存排序
            if (payload.hasOwnProperty('SortFieldList')){
                const {SortFieldList,...last} = payload;
                argumentObj = {...last}
                obj =  SortFieldList === null ? {...last} : {...payload}

            }else{
                argumentObj = {...payload}
                obj = payload
            }
            const response = yield call(getCoursePackagePlayList, obj);
            yield put({
                type: 'queryList',
                payload: response.Data !== null ? response.Data : {},
                // payload: GetSubjectPackage.Data,
            });
            yield messageFetch({...response},false,'ViewModelList');
            yield put({type: 'queryArguments',payload: argumentObj,});
        },
        *fetchCourseList({payload}, {call, put, select}){
            let obj = {}
            let argumentObj = {};
            if (payload.hasOwnProperty('SortFieldList')){
                const {SortFieldList,...last} = payload;
                argumentObj = {...last}
                obj =  SortFieldList === null ? {...last} : {...payload}
            }else{
                argumentObj = {...payload}
                obj = payload
            }
            const response = yield call(getCoursePeroidPlayStatList, obj);
            yield put({
                type: 'queryCourseList',
                payload: response.Data !== null ? response.Data : {},
                // payload: GetCoursePackage.Data,
            });
            yield messageFetch({...response},false,'ViewModelList');
            yield put({type: 'queryCourseArguments',payload: argumentObj,});
            
        },
        * fetchGrade({payload}, {call, put}) {
            const response = yield call(get_Grade, payload);
            yield put({
                type: 'gradeList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchSubject({payload}, {call, put}) {
            const response = yield call(get_Subject, {phaseID: payload.phaseID, gradeID: payload.gradeID});
            yield put({
                type: 'subjectList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchVersion({payload}, {call, put}) {
            const response = yield call(get_Publish, {
                phaseID: payload.phaseID,
                gradeID: payload.gradeID,
                subjectID: payload.subjectID
            });
            yield put({
                type: 'versionList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },

        * fetchCourseGrade({payload}, {call, put}) {
            const response = yield call(get_Grade, payload);
            yield put({
                type: 'gradeCourseList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchCourseSubject({payload}, {call, put}) {
            const response = yield call(get_Subject, {phaseID: payload.phaseID, gradeID: payload.gradeID});
            yield put({
                type: 'subjectCourseList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchCourseVersion({payload}, {call, put}) {
            const response = yield call(get_Publish, {
                phaseID: payload.phaseID,
                gradeID: payload.gradeID,
                subjectID: payload.subjectID
            });
            yield put({
                type: 'versionCourseList',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
            

            
        },

    reducers: {
        save(state, {payload}) {
            const {conditionList} = state
            const condition = {...conditionList,...payload};
            return {...state, conditionList:condition };
        },
        detailSave(state, {payload}) {
            const {conditionDetailList} = state
            const condition = {...conditionDetailList,...payload};
            return {...state, conditionDetailList:condition };
        },
        courseSave(state, {payload}) {
            const {conditionCourseList} = state
            const condition = {...conditionCourseList,...payload};
            return {...state, conditionCourseList:condition };
        },
        inquireList(state, action) {
            return {
                ...state,
                inquireList: action.payload,
            };
        },
        saveDetailID(state, {payload}) {
            const {saveDetailID} = state
            const id = {...saveDetailID,...payload};
            return {...state, saveDetailID:id };
        },
        queryList(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        queryCourseList(state, action) {
            return {
                ...state,
                courseList: action.payload,
            };
        },
        queryArguments(state, action) {
            return {
                ...state,
                argumentsList: action.payload,
            };
        },
        queryCourseArguments(state, action) {
            return {
                ...state,
                courseArgumentsList: action.payload,
            };
        },
        gradeList(state, action) {
            return {
                ...state,
                gradeList: action.payload
            }
        },
        subjectList(state, action) {
            return {
                ...state,
                subjectList: action.payload
            }
        },
        versionList(state, action) {
            return {
                ...state,
                versionList: action.payload
            }
        },
        gradeCourseList(state, action) {
            return {
                ...state,
                gradeCourseList: action.payload
            }
        },
        subjectCourseList(state, action) {
            return {
                ...state,
                subjectCourseList: action.payload
            }
        },
        versionCourseList(state, action) {
            return {
                ...state,
                versionCourseList: action.payload
            }
        },
        saveDetailList(state, action) {
            return {
                ...state,
                saveDetailList: action.payload
            }
        },
        saveCourseList(state, action) {
            return {
                ...state,
                saveCourseList: action.payload
            }
        },
        detailInit(state){
            return {
                ...state,
                gradeList: [],
                subjectList: [],
                versionList: [],
                conditionList: {},
            }
        },
        clearSaveCourseList(state){
            return {
                ...state,
                saveCourseList: {},
            }
        },
   
    },
};
