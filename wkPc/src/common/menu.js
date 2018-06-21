import { isUrl } from '../utils/utils';

const menuData = [
    {
        name: '系统设置',
        icon: 'dashboard',
        path: 'setting',
        children: [
            {
                name: '资源设置',
                path: 'res-setting',
            },
            {
                name: '教材版本管理',
                path: 'textVersionManagement',
            },
        ],
    },
    {
        name: '资源管理',
        icon: 'form',
        path: 'management',
        children: [
            {
                name: '供应商管理',
                path: 'supply-management',
            },
            {
                name: '课程管理',
                path: 'course-management',
            },
            {
                name: '试看管理',
                path: 'watch-management',
            },
        ],
    },
    {
        name: '数据统计',
        icon: 'table',
        path: 'dataStc',
        children: [
            {
                name: '观看统计',
                path: 'watchStc',
            },
            {
                name: '积分统计',
                path: 'integralStc',
            },
            // {
            //     name: '行为统计',
            //     path: 'behaviorStc',
            // },
            // {
            //     name: '销售统计',
            //     path: 'sellStc',
            // },
            // {
            //     name: '评论统计',
            //     path: 'commentStc',
            // },
            {
                name: '学校统计',
                path: 'schoolStc',
            },
        ],
    },
];

const cakeData = [
    {
        name: '系统设置',
        icon: 'dashboard',
        path: 'setting',
        children: [
            {
                name: '教材版本管理',
                path: 'textVersionManagement',
            },
        ],
    },
];


function formatter(data, parentPath = '/', parentAuthority) {
    return data.map((item) => {
        let { path } = item;
        if (!isUrl(path)) {
            path = parentPath + item.path;
        }
        const result = {
            ...item,
            path,
            authority: item.authority || parentAuthority,
        };
        if (item.children) {
            result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
        }
        return result;
    });
}

export const getMenuData = () => formatter(menuData);

export const getCakeData = () => formatter(cakeData);


