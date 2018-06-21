
export default {
    hd: true,
    exportStatic: {
        htmlSuffix: true,
    },
    plugins:[
      "umi-plugin-polyfill",
    ],
    context: {
        title: '微课学堂', 
        document: './src/pages/document.ejs'
    },
    
    pages: {
         'catalog': { context: {title: '课程目录'}},
         'collectList': { context: {title: '收藏'}},
         'learnRecord': { context: {title: '学习记录'}},
         'searchList': { context: {title: '搜索'}},
         'learnCourse': { context: {title: '课程学习'}},
         'thisWeekRank': { context: {title: '本周排名'}},
         'conLearnList': { context: {title: '连续学习详情'}},
         'home': { context: {title: '微课学堂'}},
         '/': { context: {title: '微课学堂'}},
         'introduce': { context: {title: '微课学堂'}},
         'studentReport': { context: {title: '每周荣誉榜 '}},
         'subjectLearnDetail': { context: {title: '学科观看率详情'}},
         'learningReport': { context: {title: '学习报告'}},
         'pointsItem': { context: {title: '积分明细'}},
         'pointsRank': { context: {title: '积分排名'}},
         'pointsRuler': { context: {title: '积分规则'}},
         'studyDetails': { context: {title: '学习详情'}},
         'buyResult': { context: {title: '选择服务包'}},
         'timeFrame': { context: {title: '学习时段分布'}},
         'classReport': { context: {title: '班级学习报告'}},
         'teacherReport': { context: {title: '班级周报'}},
         'learnDaysList': { context: {title: '学习天数详情'}},
      },
      

};
