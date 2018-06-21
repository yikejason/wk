import request from '../utils/request';
import { stringify } from 'qs';


//分页获取课程包观看统计列表
export async function getCoursePackagePlayList(params) {
    return request(`/mcs/v3/StatisticWeb/GetCoursePackagePlayList?${stringify(params)}`)
}

//分页获取微课观看统计列表
export async function getCoursePeroidPlayStatList(params) {
    return request(`/mcs/v3/StatisticWeb/GetCoursePeroidPlayStatList?${stringify(params)}`)
}

//根据关键字获取合作伙伴列表
export async function getPartnerByKeyword(params) {
    return request(`/sns/v3/Web/GetPartnerByKeyword?${stringify(params)}`)
}

//根据关键字获取学校列表
export async function getPartnerGroupsByKeyword(params) {
    return request(`/sns/v3/Web/GetPartnerGroupsByKeyword?${stringify(params)}`)
}

//根据关键字获取学校年级列表
export async function getSchPopularGrade(params) {
    return request(`/sns/v3/Web/GetSchPopularGrade?${stringify(params)}`)
}

//根据关键字获取班级列表
export async function getSchClassesByKeyword(params) {
    return request(`/sns/v3/Web/GetSchClassesByKeyword?${stringify(params)}`)
}

//根据成员名称或手机号获取学生、老师信息 
//老师  mTypeID传11
//学生 mTypeID传13
export async function getMemberByKeyword(params) {
    return request(`/sns/v3/Web/GetMemberByKeyword?${stringify(params)}`)
}

//积分统计—查询
export async function getUserPointStatList(params) {
    return request(`/mcs/v3/StatisticWeb/GetUserPointStatList?${stringify(params)}`)
}

//积分明细-查询
export async function getUserPointDetlList(params) {
    return request(`/mcs/v3/StatisticWeb/GetUserPointDetlList?${stringify(params)}`)
}

//教师互动详情统计-查询
export async function getSchTeacherStatList(params) {
    return request(`/mcs/v3/StatisticWeb/GetSchTeacherStatList?${stringify(params)}`)
}

//学习行为详情统计-查询
export async function getSchStudentStatList(params) {
    return request(`/mcs/v3/StatisticWeb/GetSchStudentStatList?${stringify(params)}`)
}
