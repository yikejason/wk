import request from '../utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
    return request('/mcs/v3/ConfigWeb/GetSimplerUserInfo');
}

//选中身份
export async function ChoiceUser(params) {
  return request(`/mcs/v3/ConfigWeb/ChoiceUser?${stringify(params)}`);
}

