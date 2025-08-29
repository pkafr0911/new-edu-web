import { GLOBAL_PREFIX } from '@/consants';
import { request } from '@umijs/max';
import moment from 'moment';

const target = '/summit';
const prefix = GLOBAL_PREFIX + target;
const comboboxPrefix = GLOBAL_PREFIX + '/combobox' + target;
const reportPrefix = GLOBAL_PREFIX + '/report' + target;

type ResModal = EventsModule.Response;
type ReqModal = EventsModule.Request;

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

export const fetchOptionsList = (params?: { [key: string]: any }) =>
  request(comboboxPrefix, {
    params,
    method: 'GET',
  });

export const fetchItem = (id: string) =>
  request<Res<ResModal>>(prefix + `/${id}`, {
    method: 'GET',
  }).then(({ data }) => data);

//TODO: move this func to where it should be
export const fetchGuestTypeOptionsList = () =>
  request(GLOBAL_PREFIX + '/combobox/guest_type', {
    params: {
      active: true,
    },
    method: 'GET',
  });

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
//#endregion

//#region report
//calculate
export type TotalRegisteredByGuestGroup = {
  id: string;
  name: string;
  total_guest_registered: number;
};
export const fetchTotalRegisteredByGuestGroup = (
  id: string,
  start_time: number,
  end_time: number,
) =>
  request<Res<TotalRegisteredByGuestGroup[]>>(
    reportPrefix + `/${id}/calculate/total_guest_registered_by_guest_type`,
    {
      method: 'POST',
      data: {
        start_time,
        end_time,
      },
    },
  ).then(({ data }) => data);

//
export const fetchTotalRegistered = (id: string, start_time: number, end_time: number) =>
  request(reportPrefix + `/${id}/calculate/total_guest_registered`, {
    method: 'POST',
    data: {
      start_time,
      end_time,
    },
  }).then(({ data }) => data);
export const fetchTotalMailSent = (id: string, start_time: number, end_time: number) =>
  request(reportPrefix + `/${id}/calculate/total_mail_sent`, {
    method: 'POST',
    data: {
      start_time,
      end_time,
    },
  }).then(({ data }) => data);
export const fetchTotalCheckIn = (id: string, start_time: number, end_time: number) =>
  request(reportPrefix + `/${id}/calculate/total_guest_checked_in`, {
    method: 'POST',
    data: {
      start_time,
      end_time,
    },
  }).then(({ data }) => data);
export const fetchTotalCheckOut = (id: string, start_time: number, end_time: number) =>
  request(reportPrefix + `/${id}/calculate/total_guest_checked_out`, {
    method: 'POST',
    data: {
      start_time,
      end_time,
    },
  }).then(({ data }) => data);

//range
export const fetchRangeTotalValues = (id: string, start_time: number, end_time: number) =>
  request<Res<ResRangeData>>(reportPrefix + `/${id}/range/total_values`, {
    method: 'POST',
    data: {
      start_time,
      end_time,
    },
  }).then(({ data }) => data);
//#endregion

//#region assets

export const fetchListContent = (id: string, { current = 1, pageSize = 100 }) =>
  request<Res<ResListData<EventsModule.AccessResponse>>>(prefix + `/${id}/content`, {
    method: 'GET',
    params: {
      page: current,
      page_size: pageSize,
    },
  }).then(({ data }) => ({
    data: data.rows,
    total: data.total_size,
  }));

export const fetchContent = (id: string, key: string) =>
  request<Res<EventsModule.AccessResponse>>(prefix + `/${id}/content/` + key, {
    method: 'GET',
  });

export const createContent = (id: string, data: EventsModule.AccessRequest) =>
  request<Res<EventsModule.AccessResponse>>(prefix + `/${id}/content`, {
    method: 'POST',
    data,
  }).then(({ data }) => data);
export const updateContent = (id: string, key: string, data: EventsModule.AccessRequest) =>
  request<Res<EventsModule.AccessResponse>>(prefix + `/${id}/content/` + key, {
    method: 'PUT',
    data,
  }).then(({ data }) => data);

export const removeContent = (id: string, key: string) =>
  request(prefix + `/${id}/content/` + key, {
    method: 'DELETE',
  });
//#endregion
