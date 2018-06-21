import {query as queryUsers, queryCurrent, ChoiceUser} from '../services/user';

export default {
    namespace: 'user',

    state: {
        list: [],
        currentUser: {},
    },

    effects: {
        // * fetch(_, {call, put}) {
        //     const response = yield call(queryUsers);
        //     yield put({
        //         type: 'save',
        //         payload: response,
        //     });
        // },
        *fetchCurrent(_, {call, put}) {
            // const {Data: {UName: name, Pic: avatar}} = yield call(queryCurrent);
            const {Data} = yield call(queryCurrent);
            yield put({
                type: 'saveCurrentUser',
                payload: Data,
            });

        },
        *fetchset({payload:{level,orgID}}, {call, put}) {
        const response = yield call(ChoiceUser,{level,orgID});
        // yield put({
        //     type: 'save',
        //     payload:response,
        // });

        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        saveCurrentUser(state, action) {  
            return {
                ...state,
                currentUser: action.payload,
            };
        },
        changeNotifyCount(state, action) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload,
                },
            };
        },
    },
};
