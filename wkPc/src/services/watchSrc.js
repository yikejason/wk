/**
 * Created by Yu Tian Xiong on 2017/05/07.
 * fileName:观看统计请求api
 */
import { stringify } from 'qs';
import request from '../utils/request';

//观看统计
export async function getWatchData() {
  return request('/mcs/v3/StatisticWeb/GetPlayStat');
}
//观看次数统计
export async function getBarChart(params) {
  return request(`/mcs/v3/StatisticWeb/GetPlayCntBarChartData?${stringify(params)}`);
}
//观看次数排名
export async function getWatchRank(params) {
  return request(`/mcs/v3/StatisticWeb/GetPlayCntList?${stringify(params)}`);
}
//观看次数占比
export async function getAccounte(params) {
  return request(`/mcs/v3/StatisticWeb/GetPlayRate?${stringify(params)}`);
}
//各时间段用户观看数统计
export async function getWatchNumber(params) {
  return request(`/mcs/v3/StatisticWeb/GetIntervalPlayCntStat?${stringify(params)}`);
}