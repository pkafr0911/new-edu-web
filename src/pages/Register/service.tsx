import { GLOBAL_PREFIX } from '@/consants';
import { request } from '@umijs/max';

const prefix = GLOBAL_PREFIX + '/auth';

export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>(prefix + '/user', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<Res<API.LoginResult>>(prefix + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function logout(options?: { [key: string]: any }) {
  return request<Record<string, any>>(prefix + '/logout', {
    method: 'DELETE',
    ...(options || {}),
  });
}
