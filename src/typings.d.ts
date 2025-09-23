declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

type Res<T> = {
  errorCode: number;
  message: string;
  data: T;
};

//list
type Sort = {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
};

type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

type ResListData<T> = {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
};

// option
type OptionResponse = {
  id: string;
  name: string;
  active: boolean;
};

//report
////input
type ReportReqBody = {
  start_time: number;
  end_time: number;
};

////output
type PointData = {
  timestamp: number;
  value: number;
};

type RangePoint = {
  name: string;
  data: PointData[];
};

type ResRangeData = RangePoint[];
