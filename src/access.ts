import Admin from './pages/Admin';

/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    super_admin: currentUser && currentUser.role_id <= 1,
    admin: currentUser && currentUser.role_id <= 2,
    user: currentUser && currentUser.role_id <= 3,
  };
}
