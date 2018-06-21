import * as api from '../services/TextVersionManagement';


export default {
  namespace: 'textVersionManagement',
  state: {
    gid: null,
    gidName: null,
    list: [],
    phaseIDArray: [],
    activePhaseID: null,
    previewData:[]
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
    //获取资源包预览数据
    previewData(state,action){
      return {
        ...state,
        previewData:action.payload
      }
    },
    //清除资源包状态
    clear(state){
      return {
        ...state,
        previewData:[]
      }
    }
  },

  effects: {
    //请求
    * fetch({payload: {gid, phaseID}}, {call, put, select}) {
      const {Data: list} = yield call(api.GetBookConfigByGID, {gid, phaseID})
      yield put({type: 'save', payload: {list},})
    },

    //储存条件
    * saveCondition({payload}, {call, put, select}) {
      yield put({type: 'save', payload})
      const {gid, activePhaseID: phaseID} = yield select(state => state.textVersionManagement)
      yield put({type: 'fetch', payload: {gid, phaseID}})
    },


    // *create({ payload: { values } }, { call, put, select }) {
    //     yield call(resSetting_create, values);
    //     const { pageIndex, gid, pageSize } = yield select(state => state.resSetting);
    //     yield put({ type: 'fetch', payload: { pageIndex, gid, pageSize } });
    // },

    //修改
    * modify({payload}, {call, put, select}) {
      yield call(api.AddBookConfig, payload)
      const {gid, activePhaseID: phaseID} = yield select(state => state.textVersionManagement);
      yield put({type: 'fetch', payload: {gid, phaseID}})
    },

    //删除
    * delete({payload}, {call, put, select}) {
      yield call(api.DeleteBookConfig, payload)
      const {gid, activePhaseID: phaseID} = yield select(state => state.textVersionManagement);
      yield put({type: 'fetch', payload: {gid, phaseID}})
    },
    //获取资源包 预览
    * getPreview({payload}, {call, put}) {
      const response = yield call(api.getPreview, payload);
      yield put({type: 'previewData', payload: response.Data});
    },

    // *watch({ payload: { configType = 1, gid } }, { call, put, select }) {
    //   yield call(resSetting_watch, id);
    // },


    // *remove({ payload: id }, { call, put, select }) {
    //   yield call(usersService.remove, id);
    //   const page = yield select(state => state.users.page);
    //   yield put({ type: 'fetch', payload: { page } });
    // },
    // *patch({ payload: { id, values } }, { call, put, select }) {
    //   yield call(usersService.patch, id, values);
    //   const page = yield select(state => state.users.page);
    //   yield put({ type: 'fetch', payload: { page } });
    // },

  },
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     return history.listen(({ pathname, query }) => {
  //       if (pathname === '/users') {
  //         dispatch({ type: 'fetch', payload: query });
  //       }
  //     });
  //   },
  // },
};