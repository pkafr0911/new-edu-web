import { GLOBAL_PREFIX } from '@/consants';
import { request } from '@umijs/max';

const target = '/public';
const prefix = GLOBAL_PREFIX + target;
const comboboxPrefix = GLOBAL_PREFIX + target + '/combobox';

//#region register
//encrypt key
export const fetchEncryptKey = () =>
  request(prefix + '/auth/encrypt_key', {
    method: 'GET',
  });

//combobox
export const fetchJobTitlesOptions = (lang?: 'en' | 'vi') =>
  request(comboboxPrefix + '/job_title', {
    params: {
      active: true,
      lang,
    },
    method: 'GET',
  });
export const fetchMarketingSourcesOptions = (lang?: 'en' | 'vi') =>
  request(comboboxPrefix + '/marketing_source', {
    params: {
      active: true,
      lang,
    },
    method: 'GET',
  });
export const fetchRoomsOptions = (summitId: string, lang?: 'en' | 'vi') =>
  request(comboboxPrefix + `/room/${summitId}`, {
    params: {
      active: true,
      lang,
    },
    method: 'GET',
  });

export const register = (data: GuestModule.Request, token: string) =>
  request(prefix + '/register', {
    method: 'POST',
    data,
    headers: {
      Authorization: token,
    },
  });

//#endregion

//#region confirm check-in
export const fetchEventDetail = (id: string) =>
  request(prefix + `/summit/${id}`, {
    method: 'GET',
  });
export const fetchCheckInInfo = (code: string, summit_id: string) =>
  request(prefix + `/register/info`, {
    params: {
      code,
      summit_id,
    },
    method: 'GET',
  });
export const fetchEventListContent = (id: string, key: string) =>
  request(prefix + `/summit/${id}/content`, {
    method: 'GET',
    params: {
      key,
    },
  });
export const confirmCheckIn = (data: PublicModule.CheckInRequest) =>
  request<Res<PublicModule.CheckInRespone>>(prefix + '/checkin', {
    method: 'POST',
    data,
  });
export const confirmCheckInRoom = (data: PublicModule.CheckInRequest) =>
  request(prefix + '/checkin_room', {
    method: 'POST',
    data,
  });
export const confirmCheckOut = (data: PublicModule.CheckInRequest) =>
  request(prefix + '/checkout', {
    method: 'POST',
    data,
  });

//#endregion

//#region feedback
export const fetchRoomDetail = (id: string) =>
  request(prefix + `/room/${id}`, {
    method: 'GET',
  });

export const sendFeedback = (data: PublicModule.FeedbackRequest, token: string) =>
  request(prefix + '/feedback_room', {
    method: 'POST',
    data,
    headers: {
      Authorization: token,
    },
  });
//#endregion
