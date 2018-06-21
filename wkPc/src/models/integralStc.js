import { routerRedux } from 'dva/router';
import {
    getPartnerByKeyword,
    getPartnerGroupsByKeyword,
    getSchPopularGrade,
    getSchClassesByKeyword,
    getMemberByKeyword,
    getUserPointStatList,
    getUserPointDetlList,

} from '../services/dataStc';
import {messageFetch} from '../components/Message';
//test
import {GetUserPoint,PointDetlList} from '../../mock/testApi'

export default {
    namespace: 'integralStc',

    state: {
        list: {},
        detailList:{},
        argumentsList:{},
        detailArgumentsList:{},
        initialList:{},
        initialNameList:{},
        initialDetailList:{},
        initialSaveDetailList:{},
        partnerList:[],
        schoolList:[],
        gradeList: [],
        classesList:[],
        studentList:[],
        gradeDetailList:[],
        partnerDetailList:[],
        schoolDetailList:[],
        studentDetailList:[],
        classesDetailList:[],
        conditionList:{},
        conditionIntegralList:{},
        conditionDetailList:{},
        conditionInquireDetailList:{},
        inquireList:{},
        saveDetailList:{}

    },
    effects: {
        * fetchList({payload}, {call, put}){

            const response = yield call(getUserPointStatList,payload);
            yield put({
                type:'queryList',
                payload:response.Data !== null ? response.Data : {},
                // payload: GetUserPoint.Data
            })
            yield put({type:'saveArguments',payload: payload});
            yield messageFetch({...response},false,'ViewModelList');
        },
        * fetchDetailList({payload}, {call, put, select}){
            const response = yield call(getUserPointDetlList,payload);
            yield put({
                type:'queryDetailList',
                payload: response.Data !== null ? response.Data : {},
                // payload: PointDetlList.Data
            })
            yield put({type:'saveDetailArguments',payload: payload});
            yield messageFetch({...response},false,'ViewModelList');
        },
        * fetchPartner({payload}, {call, put}){
            const response = yield call(getPartnerByKeyword,payload);
            yield put({
                type:'queryPartner',
                payload: Array.isArray(response.Data) ? response.Data : []
            });
        },
        * fetchSchool({payload}, {call, put}){
            const response = yield call(getPartnerGroupsByKeyword,payload);
            yield put({
                type:'querySchool',
                payload: Array.isArray(response.Data) ? response.Data : []
            });
        },
        * fetchGrade({payload}, {call, put}) {
            const response = yield call(getSchPopularGrade, payload);
            yield put({
                type: 'queryGrade',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchClasses({payload}, {call, put}) {
            const response = yield call(getSchClassesByKeyword, payload);
            yield put({
                type: 'queryClasses',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchStudent({payload}, {call, put}) {
            const response = yield call(getMemberByKeyword, payload);
            yield put({
                type: 'queryStudent',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        
        * fetchDetailPartner({payload}, {call, put}){
            const response = yield call(getPartnerByKeyword,payload);
            yield put({
                type:'queryDetailPartner',
                payload: Array.isArray(response.Data) ? response.Data : []
            });
        },
        * fetchDetailSchool({payload}, {call, put}){
            const response = yield call(getPartnerGroupsByKeyword,payload);
            yield put({
                type:'queryDetailSchool',
                payload: Array.isArray(response.Data) ? response.Data : []
            });
        },
        * fetchDetailGrade({payload}, {call, put}) {
            const response = yield call(getSchPopularGrade, payload);
            yield put({
                type: 'queryDetailGrade',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchDetailClasses({payload}, {call, put}) {
            const response = yield call(getSchClassesByKeyword, payload);
            yield put({
                type: 'queryDetailClasses',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        * fetchDetailStudent({payload}, {call, put}) {
            const response = yield call(getMemberByKeyword, payload);
            yield put({
                type: 'queryDetailStudent',
                payload: Array.isArray(response.Data) ? response.Data : [],
            });
        },
        
    },

    reducers: {
        save(state, { payload }) {
            const {conditionList} = state
            const condition = {...conditionList,...payload};
            return {...state, conditionList:condition };
        },
        inquireDetailSave(state, action) {
            return {
                ...state,
                conditionInquireDetailList: action.payload,
            };
        },
        integralSave(state, { payload }) {
            const {conditionIntegralList} = state
            const condition = {...conditionIntegralList,...payload};
            return {...state, conditionIntegralList:condition };
        },
        detailSave(state, { payload }) {
            const {conditionDetailList} = state
            const condition = {...conditionDetailList,...payload};
            return {...state, conditionDetailList:condition };
        },
        initialValue(state, { payload }) {
            const {initialList} = state
            const initial = {...initialList,...payload};
            return {...state, initialList:initial };
        },
        detailValue(state, { payload }) {
            const {initialDetailList} = state
            const initial = {...initialDetailList,...payload};
            return {...state, initialDetailList:initial };
        },
        saveDetailValue(state, action) {
            return {
                ...state,
                initialSaveDetailList: action.payload,
            };
        },
        initialNameList(state, action) {
            return {
                ...state,
                initialNameList: action.payload,
            };
        },
        inquireList(state, action) {
            return {
                ...state,
                inquireList: action.payload,
            };
        },
        saveDetailList(state, action) {
            return {
                ...state,
                saveDetailList: action.payload
            }
        },
        saveArguments(state,action){
            return{
                ...state,
                argumentsList:action.payload
            }
        },
        saveDetailArguments(state,action){
            return{
                ...state,
                detailArgumentsList:action.payload
            }
        },
        queryList(state,action){
            return{
                ...state,
                list:action.payload
            }
        },
        queryDetailList(state,action){
            return{
                ...state,
                detailList:action.payload
            }
        },
        queryPartner(state,action){
            return{
                ...state,
                partnerList:action.payload
            }
        },
        querySchool(state,action){
            return{
                ...state,
                schoolList:action.payload
            }
        },
        queryGrade(state,action){
            return{
                ...state,
                gradeList:action.payload
            }
        },
        queryClasses(state,action){
            return{
                ...state,
                classesList:action.payload
            }
        },
        queryStudent(state,action){
            return{
                ...state,
                studentList:action.payload
            }
        },

        queryDetailPartner(state,action){
            return{
                ...state,
                partnerDetailList:action.payload
            }
        },
        queryDetailSchool(state,action){
            return{
                ...state,
                schoolDetailList:action.payload
            }
        },
        queryDetailGrade(state,action){
            return{
                ...state,
                gradeDetailList:action.payload
            }
        },
        queryDetailClasses(state,action){
            return{
                ...state,
                classesDetailList:action.payload
            }
        },
        queryDetailStudent(state,action){
            return{
                ...state,
                studentDetailList:action.payload
            }
        },
        clear(state){
            return{
                ...state,
                schoolList:[],
                gradeList: [],
                classesList:[],
                studentList:[],
            }
        },
        clearSchool(state){
            return{
                ...state,
                gradeList: [],
                classesList:[],
                studentList:[],
            }
        },
        clearGrade(state){
            return{
                ...state,
                classesList:[]
            }
        },
        clearDetail(state){
            return{
                ...state,
                schoolDetailList:[],
                gradeDetailList:[],
                classesDetailList:[],
                studentDetailList:[],
        
            }
        },
        clearDetailSchool(state){
            return{
                ...state,
                gradeDetailList:[],
                classesDetailList:[],
                studentDetailList:[],
            }
        },
        clearDetailGrade(state){
            return{
                ...state,
                classesDetailList:[]
            }
        },
        clearSaveDetailList(state){
            return {
                ...state,
                saveDetailList: {},
            }
        },
   
    },
};
