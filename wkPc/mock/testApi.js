import mockjs from 'mockjs'
const Random = mockjs.Random
// const user = [
//   '付小小',
//   '曲丽丽',
//   '林东东',
//   '周星星',
//   '吴加好',
//   '朱偏右',
//   '鱼酱',
//   '乐哥',
//   '谭小仪',
//   '仲尼',
// ];
// const Random = mockjs.Random
// const data = mockjs.mock({
//        'data|1-100': [{
//          'id|+1': 1,
//          'name': () => {
//            return Random.cname();
//          },
//          'mobile': /1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\d{8}/,
//          'avatar': () => {
//            return Random.image('125x125');
//          },
//          'status|1-2': 1,
//          'email': () => {
//            return Random.email('visiondk.com');
//          },
//          'isadmin|0-1': 1,
//          'created_at': () => {
//            return Random.datetime('yyyy-MM-dd HH:mm:ss');
//          },
//          'updated_at': () => {
//            return Random.datetime('yyyy-MM-dd HH:mm:ss');
//          },
//        }],
//        page: {
//          total: 100,
//          current: 1,
//        },
//    });
   
export const GetSubjectPackage = mockjs.mock({
        "Data": {
            "ViewModelList|15": [
                {
                "CoursePackageID": () => {
                    return Random.string('number', 5);
                    },
                "CoursePackageName|+1": [
                        "小学一年级语文精讲",
                        "小学三年级数学精讲",
                        "小学二年级英语精讲",
                        "中学七年级物理精讲",
                        "中学八年级化学精讲",
                        "小学四年级思想品德精讲"
                    ],
                "SubjectName|+1": [
                        "语文",
                        "数学",
                        "英语",
                        "物理",
                        "化学",
                        "思想品德",
                    ],
                "VersionName|+1": [
                        "人教版",
                        "上海版",
                        "华东版"
                        ],
                "CoursePeroidCnt|1-100": 100,
                "PlayUserCnt|1-1000": 1000,
                "PlayCnt|1-1000": 1000,
                "LearnSeconds|1-1000": 1000,
                "EvaluateCnt|1-1000": 1000,
                "FawardCnt|1-1000": 1000
                }
            ],
            "PageSize": 15,
            "TotalRecords": 600,
            "PageIndex": 2,
            "Pages": 40
        },
        "Ret": 1,
        "ErrCode": 2,
        "Msg": "sample string 3",
        "SeqId": 4,
        "InfoMsg": "sample string 5"
    })
export const GetCoursePackage = mockjs.mock({
    "Data": {
        "ViewModelList|15": [
            {
            "CoursePeroidID": () => {
                return Random.string('number', 5);
                },
            "CoursePeroidName|+1": [
                    "汉字笔画",
                    "汉字结构",
                    "汉字名称",
                    "市值小妙招",
                    "法师打发",
                    "大大大大大"
                ],
            "CoursePackageName|+1": [
                    "小学三年级语文知识精讲",
                    "小学三年级语文知识精讲",
                    "小学三年级语文知识精讲",
                    "小学三年级语文知识精讲",
                    "小学三年级语文知识精讲",
                    "小学三年级语文知识精讲",
                ],
            
            "PlayUserCnt|1-1000": 1000,
            "PlayCnt|1-1000": 1000,
            "LearnSeconds|1-1000": 1000,
            "EvaluateCnt|1-1000": 1000,
            "FawardCnt|1-1000": 1000,
            "FavoriteCnt|1-1000": 1000,
            }
        ],
        "PageSize": 15,
        "TotalRecords": 300,
        "PageIndex": 1,
        "Pages": 20
    },
    "Ret": 1,
    "ErrCode": 2,
    "Msg": "sample string 3",
    "SeqId": 4,
    "InfoMsg": "sample string 5"
})

export const GetUserPoint = mockjs.mock({
    "Data": {
        "ViewModelList|15": [
            {
                "UMID|+1": 1,
                "Name": () => {
                    return Random.cname();
                },
                "GName": () => {
                    return Random.csentence(5,14);
                },
                "TotalPoint|1-100": 100,
                "AvailPoint|1-100": 100,
                "ExchangePoint|1-100": 100
            },
        ],
        "PageSize": 15,
        "TotalRecords": 450,
        "PageIndex": 3,
        "Pages": 30
    },
    "Ret": 1,
    "ErrCode": 2,
    "Msg": "sample string 3",
    "SeqId": 4,
    "InfoMsg": "sample string 5"
})

export const PointDetlList = mockjs.mock({
    "Data": {
        "ViewModelList|15": [
            {
                "UMID|+1": 1,
                "Name": () => {
                    return Random.cname();
                },
                "GName": () => {
                    return Random.csentence(5,14);
                },
                "TotalPoint|1-100": 100,
                "GetPoint|1-100": 100,
                "DetlTime":  () => {
                    return `${Random.now('yyyy-MM-dd')}T${Random.time()}.${Random.now('SS')}Z`;
                },
            },
        ],
        "PageSize": 15,
        "TotalRecords": 300,
        "PageIndex": 2,
        "Pages": 20
    },
    "Ret": 1,
    "ErrCode": 2,
    "Msg": "sample string 3",
    "SeqId": 4,
    "InfoMsg": "sample string 5"
})

export const GetSchTeacher = mockjs.mock({
    "Data": {
        "ViewModelList|15": [
            {
                "UMID|+1": 1,
                "Name": () => {
                    return Random.cname();
                },
                "GName": () => {
                    return Random.csentence(5,14);
                },
                "RemindCnt|1-100": 100,
                "PraiseCnt|1-100": 100,
                "RecommendCnt|1-100": 100,
                "ShareCnt|1-100": 100,
                "DetlDate":  () => {
                    return `${Random.now('yyyy-MM-dd')}T${Random.time()}.${Random.now('SS')}Z`;
                },
            },
        ],
        "PageSize": 15,
        "TotalRecords": 300,
        "PageIndex": 4,
        "Pages": 20
    },
    "Ret": 1,
    "ErrCode": 2,
    "Msg": "sample string 3",
    "SeqId": 4,
    "InfoMsg": "sample string 5"
})

function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

function getActiveData() {
    let XAxials = [],YAxials = [];
    for (let i = 1; i < 24; i += 1) {
        XAxials.push(`${i}-${i+1}`)
        // XAxials.push(`${fixedZero(i)}:00`)
        YAxials.push(Random.integer(200, 1000))
    //   activeData.push({
    //     XAxials: `${fixedZero(i)}:00`,
    //     YAxials: Math.floor(Math.random() * 200) + i * 50,
    //   });
    }
    return {XAxials,YAxials};
}
//  const {XAxials,YAxials}=  getActiveData()
export const GetSchStudent = mockjs.mock({
    "Data": {
        "ViewModelList|15": [
            {
                "UMID|+1": 1,
                "Name": () => {
                    return Random.cname();
                },
                "ClassName": () => {
                    return Random.csentence(3,8);
                },
                "IsFuncBought|1": true,
                "LearnCoursePeriodCnt|1-100": 100,
                "LearnDays|1-100": 100,
                "LearnSeconds|1-100": 100,
                "GoodHabitDays|1-100": 100,
                "HabitHours":  () => {
                    const {XAxials,YAxials}=  getActiveData()
                    return {
                        "XAxials": XAxials,
                        "YAxials": YAxials
                    }
                },
            },
        ],
        "PageSize": 15,
        "TotalRecords": 300,
        "PageIndex": 4,
        "Pages": 20
    },
    "Ret": 1,
    "ErrCode": 2,
    "Msg": "sample string 3",
    "SeqId": 4,
    "InfoMsg": "sample string 5"
})