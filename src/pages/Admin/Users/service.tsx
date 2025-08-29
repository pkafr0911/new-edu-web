import { GLOBAL_PREFIX } from '@/consants';
import { request } from '@umijs/max';
import moment from 'moment';

const prefix = GLOBAL_PREFIX + '/user';

type ResModal = UserModule.Response;
type ReqModal = UserModule.Request;

//#region GET
export const fetchList = ({ current = 1, pageSize = 10, ...res }) => {
  if (res.created_at) {
    res.created_at = moment(res.created_at).unix();
  }
  return request<Res<ResListData<ResModal>>>(prefix, {
    method: 'GET',
    params: {
      page: current,
      page_size: pageSize,
      ...res,
    },
  }).then(({ data }) => ({
    data: data.rows,
    total: data.total_size,
  }));
};
export const fetchItem = (id: string) =>
  request(prefix + `/${id}`, {
    method: 'GET',
  }).then(({ data }) => data);
//#endregion

//#region POST
export const create = (data: ReqModal) =>
  request(prefix, {
    method: 'POST',
    data,
  });
//#endregion
//#region PUT
export const update = (id: string, data: ReqModal) =>
  request(prefix + `/${id}`, {
    method: 'PUT',
    data,
  });
//#endregion

//#region DELETE
export const remove = (id: string) =>
  request(prefix + `/${id}`, {
    method: 'DELETE',
  });
//#endregion

//#region PATCH
export const updateStatus = (id: string, active: boolean) =>
  request(prefix + `/${id}`, {
    method: 'PATCH',
    data: { active },
  });

export const changePassword = (id: string, data: UserModule.ChangePasswordReq) =>
  request(prefix + `/${id}/password`, {
    method: 'PATCH',
    data,
  });
//#endregion
