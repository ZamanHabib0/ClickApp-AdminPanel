import { lazy } from 'react';

// project-imports
import ErrorBoundary from './ErrorBoundary';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

const AppCustomerList = Loadable(lazy(() => import('pages/apps/customer/list')));
const AppCategoryList = Loadable(lazy(() => import('pages/apps/customer/category.list')));
const AppMemberShipNumber = Loadable(lazy(() => import('pages/apps/customer/membershipNumber')));

const AppSupport = Loadable(lazy(() => import('pages/apps/customer/supportuser')));

const AppAdvertismentList = Loadable(lazy(() => import('pages/apps/customer/AppAdvertisment.list')));
const AppCustomerCard = Loadable(lazy(() => import('pages/apps/customer/card')));
const ReactTableBasic = Loadable(lazy(() => import('pages/tables/react-table/basic')));

const UserProfile = Loadable(lazy(() => import('pages/apps/profiles/user')));
const UserTabPersonal = Loadable(lazy(() => import('sections/apps/profiles/user/TabPersonal')));
const UserTabPayment = Loadable(lazy(() => import('sections/apps/profiles/user/TabPayment')));
const UserTabPassword = Loadable(lazy(() => import('sections/apps/profiles/user/TabPassword')));
const UserTabSettings = Loadable(lazy(() => import('sections/apps/profiles/user/TabSettings')));

const AccountProfile = Loadable(lazy(() => import('pages/apps/profiles/account')));
const AccountTabProfile = Loadable(lazy(() => import('sections/apps/profiles/account/TabProfile')));
const AccountTabPersonal = Loadable(lazy(() => import('sections/apps/profiles/account/TabPersonal')));
const AccountTabAccount = Loadable(lazy(() => import('sections/apps/profiles/account/TabAccount')));
const AccountTabPassword = Loadable(lazy(() => import('sections/apps/profiles/account/TabPassword')));
const AccountTabRole = Loadable(lazy(() => import('sections/apps/profiles/account/TabRole')));
const AccountTabSettings = Loadable(lazy(() => import('sections/apps/profiles/account/TabSettings')));

const AppECommProductList = Loadable(lazy(() => import('pages/apps/e-commerce/products-list')));


const ReactDenseTable = Loadable(lazy(() => import('pages/tables/react-table/dense')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));

// ==============================|| MAIN ROUTES ||============================== //




const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            },

          ]
        },
        {
          path: 'category',
          children: [
            {
              path: 'category-list',
              element: <AppCategoryList />
            },
          ]
        },
        {
          path: 'memberShip',
          children: [
            {
              path: 'Membership-Number',
              element: <AppMemberShipNumber />
            },
          ]
        },
        // {
        //   path: 'support',
        //   children: [
        //     {
        //       path: 'support-list',
        //       element: <AppSupport />
        //     },
        //   ]
        // },
        {
          path: 'advertisment',
          element: <AppAdvertismentList />

        },
        {
          path: 'Report',
          element: <ReactDenseTable />

        },
        {
          path: 'user-list',
          element: <AppECommProductList />,
          // loader: productsLoader,
          errorElement: <ErrorBoundary />
        },
        {
          path: 'vendor-list',
          element: <AppCustomerList />
        },
        {
          path: '/apps/customer/offer',
          element: <AppCustomerCard />
        },
     
        {
          path: 'profiles',
          children: [
            {
              path: 'account',
              element: <AccountProfile />,
              children: [
                {
                  path: 'settings',
                  element: <AccountTabSettings />
                },
                {
                  path: 'support-list',
                  element: <AppSupport />
                },
              ]
            },
            {
              path: 'user',
              element: <UserProfile />,
              children: [
                {
                  path: 'personal',
                  element: <UserTabPersonal />
                },
                {
                  path: 'payment',
                  element: <UserTabPayment />
                },
                {
                  path: 'password',
                  element: <UserTabPassword />
                },
                {
                  path: 'settings',
                  element: <UserTabSettings />
                }
              ]
            }
          ]
        },
      ]
    },
    {
      path: '*',
      element: <MaintenanceError />
    }
  ]
};

export default MainRoutes;
