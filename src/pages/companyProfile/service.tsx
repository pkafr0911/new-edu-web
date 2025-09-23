import { GLOBAL_PREFIX } from '@/consants';
import { request } from '@umijs/max';
import moment from 'moment';

const target = '/companies';
const prefix = GLOBAL_PREFIX + target;

//#region GET
// export const fetchList = ({ current = 1, pageSize = 10, ...res }) => {
//   if (res.created_at) {
//     res.created_at = moment(res.created_at).unix();
//   }
//   return request<Res<ResListData<ResModal>>>(prefix, {
//     method: 'GET',
//     params: {
//       page: current,
//       page_size: pageSize,
//       ...res,
//     },
//   }).then(({ data }) => ({
//     data: data.rows,
//     total: data.total_size,
//   }));
// };

// export const fetchItem = (id: string) =>
//   request<Res<CompanyModule.Banner>>(prefix + `/${id}`, {
//     method: 'GET',
//   }).then(({ data }) => data);

export const fetchCompanyIntroduction = (id: string) =>
  request<Res<CompanyModule.Introduction>>(prefix + `/${id}/introduction`, {
    method: 'GET',
  }).then(({ data }) => data);

export const fetchCompanyDescription = (id: string) =>
  request<Res<CompanyModule.Description>>(prefix + `/${id}/description`, {
    method: 'GET',
  }).then(({ data }) => data);

export const fetchCompanyBanner = (id: string) =>
  request<Res<CompanyModule.Banner>>(prefix + `/${id}/banner`, {
    method: 'GET',
  }).then(({ data }) => data);
