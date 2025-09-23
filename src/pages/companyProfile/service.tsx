import { GLOBAL_PREFIX } from '@/consants';
import { request } from '@umijs/max';

const target = '/companies';
const prefix = GLOBAL_PREFIX + target;

export const fetchListCompanyJobs = ({ current = 1, pageSize = 10, ...res }) => {
  return request<Res<ResListData<CompanyModule.Job>>>(prefix, {
    method: 'GET',
    params: {
      offset: current,
      limit: pageSize,
      ...res,
    },
  }).then(({ data }) => ({
    data: data.content,
    total: data.totalElements,
  }));
};

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
