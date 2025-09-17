/**
 * @name Umi Router Configuration
 * @description The configuration only supports path, component, routes, redirect, wrappers, name, and icon.
 * @param path - Only supports two types of placeholders: dynamic parameters in the form of :id, and wildcard '*' which can only appear at the end of the route string.
 * @param component - The React component path to be rendered when the location and path match. It can be an absolute path or a relative path starting from `src/pages`.
 * @param routes - Configure sub-routes, usually used when adding a layout component to multiple paths.
 * @param redirect - Configure route redirection.
 * @param wrappers - Configure the wrapper components for the route, which can add additional functionality such as route-level permission checks.
 * @param name - Configure the route's title, defaults to reading from the `menu.ts` internationalization file, e.g., `menu.login` for the title when `name` is set to `login`.
 * @param icon - Configure the route's icon, the value is referenced from Ant Design's icon list (e.g., 'stepBackward' or 'user'). Avoid style suffixes and case variations.
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  // User-related routes, such as login
  {
    path: '/user',
    layout: false, // No layout for the user-related routes
    routes: [
      {
        name: 'login', // Title for the login page
        path: '/user/login',
        component: './Login', // Component for the login page
      },
      {
        name: 'register', // Title for the register page
        path: '/user/register',
        component: './Register', // Component for the login page
      },
    ],
  },

  // home page
  {
    path: '/home',
    name: 'home', // Title for the home page
    icon: 'smile', // Icon for the home page
    component: './Home', // Component for the home page
    // hideInMenu: true,
  },

  {
    path: '/company-profile',
    name: 'companyProfile', // Title for the company-profile page
    component: './companyProfile', // Component for the company-profile page
  },

  {
    path: '/student-profile',
    name: 'studentProfile', // Title for the student-profile page
    component: './studentProfile', // Component for the student-profile page
  },

  // Events page
  {
    path: '/events',
    name: 'events', // Title for the events page
    icon: 'calendar', // Icon for the events page
    component: './Events/List', // Component for the events page
    routes: [],
  },
  {
    path: '/events/:id',
    name: 'eventDetail', // Title for the events page
    component: './Events/Detail', // Component for the events page
    hideInMenu: true,
  },

  // Admin panel with sub-pages
  {
    path: '/admin',
    name: 'admin', // Title for the admin panel
    icon: 'crown', // Icon for the admin panel
    access: 'admin', // Access control for the admin route
    routes: [
      {
        path: '/admin',
        redirect: '/admin/users', // Redirect to sub-page when accessing the admin path
      },
      {
        path: '/admin/users',
        name: 'users', // Title for the sub-page

        component: './Admin/Users/List', // Component for the sub-page
      },
    ],
  },
  // Public

  {
    path: '/public',
    name: 'public', // Title for the public page
    layout: false,
    routes: [
      {
        name: 'registerIframe', // Title for the register
        path: '/public/register/iframe/:summitId/:guestTypeId',
        component: './Public/RegisterIframe', // Component for the register
      },
      {
        name: 'register', // Title for the register
        path: '/public/register/:summitId/:guestTypeId',
        component: './Public/Register', // Component for the register
      },
      {
        name: 'confirmCheckIn', // Title for the confirmCheckIn
        path: '/public/confirm-check-in/:summitId',
        component: './Public/ConfirmCheckInEvent', // Component for the confirmCheckIn
      },
    ],
  },

  // Default redirect to the home page
  {
    path: '/',
    redirect: '/home', // Redirect root path to home page
  },

  // Catch-all route for undefined paths, displaying a 404 page
  {
    path: '*',
    layout: false, // No layout for the 404 page
    component: './404', // Component for the 404 page
  },
];
