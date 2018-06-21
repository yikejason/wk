import {
    getPartnerByKeyword,
    getPartnerGroupsByKeyword,
    getSchTeacherStatList,
    getSchClassesByKeyword,
    getMemberByKeyword,
    getSchPopularGrade,
    getSchStudentStatList,

} from '../services/dataStc';
import {messageFetch} from '../components/Message';
//test
import {GetSchTeacher,GetSchStudent} from '../../mock/testApi'

export default {
    namespace: 'teachersDetail',

    state: {
        list: {},
        partnerList:[],
        schoolList:[],
        teachersList:[],
        argumentsList: {},
        gradeList: [],
        classesList: [],
        studentList: [],
        timeIntervalList:{},
        conditionList: {},
        conditionIDList:{},
        conditionTitleList:{},
    },
    effects: {
        * fetchList({payload}, {call, put, select}) {
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
            const response = yield call(getSchTeacherStatList, obj);
            yield put({
                type: 'queryList',
                payload: response.Data !== null ? response.Data : {},
                // payload: GetSchTeacher.Data,
            });
            yield put({type: 'queryArguments',payload:argumentObj});
            yield messageFetch({...response},false,'ViewModelList');
        },
        *fetchStudentList({payload}, {call, put, select}){
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
            const response = yield call(getSchStudentStatList, obj);
            const stc = response.Data !== null ? response.Data : {};
            const {ViewModelList = []} = stc;
            const ViewModel = ViewModelList.length > 0 && ViewModelList.map((val) => {
                const {HabitHours} = val;
                if(HabitHours == null || Object.keys(HabitHours).length === 0){
                    return {...val}
                }
                const {XAxials,YAxials} = HabitHours;
                let res = [];
                XAxials.map((item,idx) => {
                    YAxials.map((value,i) => {
                        if(i === idx) res = [...res,{x:item,y:value}]
                    })
                })
                const ViewModel = {...val,HabitHours:res}
                return ViewModel
            })
            const result = {...stc,ViewModelList:ViewModel}
            yield put({
                type: 'queryList',
                payload: result,
            });
            yield put({type: 'queryArguments',payload: argumentObj});
            yield messageFetch({...response},false,'ViewModelList');
        },
        * fetchPartner({payload}, {call, put}){
            const response = yield call(getPartnerByKeyword,payload);
            yield put({type:'clear'});
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
        * fetchTeacher({payload}, {call, put}) {
            const response = yield call(getMemberByKeyword, payload);
            yield put({
                type: 'queryTeacher',
                payload: Array.isArray(response.Data) ? response.Data : [],
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
        
    },

    reducers: {
        save(state, {payload}) {
            const {conditionList} = state
            const condition = {...conditionList,...payload};
            return {...state, conditionList:condition };
        },
        idSave(state, { payload }) {
            const {conditionIDList} = state
            const condition = {...conditionIDList,...payload};
            return {...state, conditionIDList:condition };
        },
        tabTitle(state, action) {
            return {
                ...state,
                conditionTitleList: action.payload,
            };
        },
        timeInterval(state, action) {
            return {
                ...state,
                timeIntervalList: action.payload,
            };
        },
        queryList(state, action) {
            return {
                ...state,
                list: action.payload,
            };
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
        queryTeacher(state,action){
            return{
                ...state,
                teachersList:action.payload
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
        clear(state){
            return{
                ...state,
                schoolList:[],
                teachersList:[],
                gradeList: [],
                classesList: [],
                studentList: [],
            }
        },
        clearSchool(state){
            return{
                ...state,
                teachersList:[],
                gradeList: [],
                classesList: [],
                studentList: [],
            }
        },
        queryArguments(state, action) {
            return {
                ...state,
                argumentsList: action.payload,
            };
        },
        clearState(state){
            return{
                ...state,
                list: {},
                partnerList:[],
                schoolList:[],
                teachersList:[],
                argumentsList: {},
                gradeList: [],
                classesList: [],
                studentList: [],
                timeIntervalList:{},
                conditionList: {},
                conditionIDList:{},
                conditionTitleList:{},
            }
        },
        studyListUpdate(state,{payload}){
            const {partnterData=[],schoolData=[],schoolGradeData=[]} = payload;
            return {
                ...state,
                partnerList:partnterData,
                schoolList:schoolData,
                gradeList:schoolGradeData,
            };
        },
        studyNameUpdate(state,{payload}){
            const {timeIntervalList} = state;
            const {fixedTime,timeFrame} = payload;
            const timeInterval = {...timeIntervalList,fixedTime,timeFrame};
            return {
                ...state,
                timeIntervalList:timeInterval, 
                conditionList:payload,
                conditionTitleList:payload
            };
        }
    },
};
