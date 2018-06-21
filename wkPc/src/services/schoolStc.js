/**
 * Created by Yu Tian Xiong on 2017/05/09.
 * fileName:学校统计请求api
 */
import { stringify } from 'qs';
import request from '../utils/request';

//获取合作伙伴
export async function getPartnter(params) {
  return request(`/sns/v3/Web/GetPartnerByKeyword?${stringify(params)}`);
}
//获取学校
export async function getSchool(params) {
  return request(`/sns/v3/Web/GetPartnerGroupsByKeyword?${stringify(params)}`);
}
//获取学校基础数据
export async function getBaseSchool(params) {
  return request(`/mcs/v3/StatisticWeb/GetSchoolBaseData?${stringify(params)}`);
}
//获取学校观看次数统计数据
export async function getWatchSchool(params) {
  return request(`/mcs/v3/StatisticWeb/GetSchoolPlayCntStat?${stringify(params)}`);
}
//获取学校的年级
export async function getSchoolGrade(params) {
  return request(`/sns/v3/Web/GetSchPopularGrade?${stringify(params)}`);
}
//获取各个科目观看率
export async function getSubjectWatch(params) {
  return request(`/mcs/v3/StatisticWeb/GetSchoolSubjectPlayRateList?${stringify(params)}`);
}
// 获取各时间段用户观看数
export async function getUserWatch(params) {
  return request(`/mcs/v3/StatisticWeb/GetIntervalPlayCntStat?${stringify(params)}`);
}
//获取教师与学生互动统计
export async function getTeacherStudent(params) {
  return request(`/mcs/v3/StatisticWeb/GetSchoolInteractStat?${stringify(params)}`);
}