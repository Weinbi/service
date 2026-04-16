import { lazy } from 'react';

//Pages
const Starter = lazy(() => import('@/app/starter'));
const Settings = lazy(() => import('@/app/settings'));
const Role = lazy(() => import('@/app/role'));
const User = lazy(() => import('@/app/user'));
const Campus = lazy(() => import('@/app/campus'));
const Student = lazy(() => import('@/app/student'));
const Textbook = lazy(() => import('@/app/textbook'));
const Course = lazy(() => import('@/app/course'));
const Class = lazy(() => import('@/app/class'));
const Contract = lazy(() => import('@/app/contract'));
const FinancialRecord = lazy(() => import('@/app/financial-record'));

//auth
const BasicLogin = lazy(() => import('@/app/basic-login'));
const BasicRegister = lazy(() => import('@/app/basic-register'));
//Other
const Error404 = lazy(() => import('@/app/404'));

export const layoutsRoutes = [{
  path: '/',
  element: <Starter />
}, {
  path: '/starter',
  element: <Starter />
}, {
  path: '/settings',
  element: <Settings />
}, {
  path: '/role',
  element: <Role />
}, {
  path: '/user',
  element: <User />
}, {
  path: '/campus',
  element: <Campus />
}, {
  path: '/student',
  element: <Student />
}, {
  path: '/textbook',
  element: <Textbook />
}, {
  path: '/course',
  element: <Course />
}, {
  path: '/class',
  element: <Class />
}, {
  path: '/contract',
  element: <Contract />
}, {
  path: '/financial-record',
  name: 'FinancialRecord',
  element: <FinancialRecord />
}];

export const singlePageRoutes = [{
  path: '/basic-login',
  element: <BasicLogin />
}, {
  path: '/basic-register',
  element: <BasicRegister />
}, {
  path: '/404',
  element: <Error404 />
}];