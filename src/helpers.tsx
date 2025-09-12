import { MenuDataItem } from '@ant-design/pro-components';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import querystring from 'query-string';
import { logout } from '@/pages/Login/service';
import { history } from '@umijs/max';
import { stringify } from 'querystring';
import { DefaultOptionType } from 'antd/es/select';
import { IGNORE_AUTHORIZATION_PAGE } from './consants';

/**
 * All functions that will be used throughout the project will be here.
 */

//#region logout
// Logout function to handle user log out and redirect
export const loginOut = async (callLogout?: boolean) => {
  // if (callLogout) {
  //   await logout();
  // }
  // //remove token
  // localStorage.removeItem('token');
  // //set up redirect
  // const { search, pathname } = window.location;
  // const urlParams = new URL(window.location.href).searchParams;
  // const redirect = urlParams.get('redirect');
  // if (window.location.pathname !== '/user/login' && !redirect) {
  //   history.replace({
  //     pathname: '/user/login',
  //     search: stringify({
  //       redirect: pathname + search,
  //     }),
  //   });
  //   window.location.reload();
  // }
};

//#endregion

//#region time
export const timestampToLocaleString = (timestamp?: number) => {
  if (!timestamp) {
    // TODO: i18n
    return 'None';
  }

  return moment.unix(timestamp).format('DD/MM/YYYY HH:mm A');
};

export const transformDayToUnix = (value: Dayjs) => {
  return dayjs(value).unix();
};

export const transformTimestampToDayjs = (timestamp: number) => {
  return dayjs(timestamp);
};

export const transformUnixSecondsToMiniseconds = (value: number) => {
  return value * 1000;
};

export const FormatInputTime = (value?: Dayjs) => {
  if (!value) {
    return undefined;
  }
  return transformUnixSecondsToMiniseconds(transformDayToUnix(value));
};

export const RenderTime = (value?: number) => {
  if (!value) {
    return 'None';
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm');
};

export const RenderDuration = (startTime: number, endTime: number, isRound?: boolean) => {
  // Convert to Day.js objects
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  // Calculate differences
  const units = [
    { value: end.diff(start, 'years'), label: 'years' },
    { value: end.diff(start, 'months') % 12, label: 'months' },
    { value: end.diff(start, 'weeks') % 4, label: 'weeks' },
    { value: end.diff(start, 'days') % 7, label: 'days' },
    { value: end.diff(start, 'hours') % 24, label: 'hours' },
    { value: end.diff(start, 'minutes') % 60, label: 'minutes' },
    { value: end.diff(start, 'seconds') % 60, label: 'seconds' },
  ];

  const formattedDuration =
    units
      .filter((u) => u.value > 0)
      .map((u) => `${u.value} ${u.label}`)
      .join(':') || '0s';

  return isRound ? formattedDuration.split(':').at(0) : formattedDuration;
};

// disable past times from the current moment
export const disabledDate = (current: dayjs.Dayjs) => {
  return current && current.isBefore(dayjs(), 'day'); // Disable past dates
};

export const disabledTime = (current: dayjs.Dayjs | null) => {
  if (!current) return {};

  const now = dayjs();
  if (current.isSame(now, 'day')) {
    return {
      disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i), // Disable past hours
      disabledMinutes: (hour: number) =>
        hour === now.hour() ? Array.from({ length: now.minute() }, (_, i) => i) : [], // Disable past minutes
      disabledSeconds: (hour: number, minute: number) =>
        hour === now.hour() && minute === now.minute()
          ? Array.from({ length: now.second() }, (_, i) => i) // Disable past seconds
          : [],
    };
  }
  return {};
};

//get time
export const getTimeNow = () => {
  const time = dayjs();
  return time;
};
export const getTimeNowUnix = () => {
  const time = dayjs().unix();
  return time;
};
export const getTimeNowStartOfDay = () => {
  const time = dayjs().startOf('day');
  return time;
};
export const getTimeOneMonthLater = () => {
  const time = dayjs().add(1, 'month');
  return time;
};
export const getTimeOneMonthLaterStartOfDay = () => {
  const time = dayjs().startOf('day').add(1, 'month');
  return time;
};

//#endregion

//#region url
//get curent params in url
export const getPrams = (ignore: string[] = []) => {
  const { ...res } = querystring.parse(location.search);
  const filtered = Object.keys(res)
    .filter((key) => !ignore.includes(key))
    .reduce((obj, key) => {
      obj[key] = res[key];
      return obj;
    }, {});

  return generateParams(filtered);
};

//obj ->> parmas
export const generateParams = (obj: any) => {
  if (Object.keys(obj).length > 0) {
    let result = '';
    Object.keys(obj).forEach((item) => {
      result += `&${item}=${obj[item]}`;
    });
    return result;
  }
  return '';
};
//#endregion

//#region select option
export const transformOptions = (data: OptionResponse[]): DefaultOptionType[] => {
  return data.map((item) => ({
    id: item.id,
    label: item.name,
    value: item.id,
  }));
};

//#endregion

//#region ignore page
export const isInIgnoreAuthPage = (filter?: string[]): boolean => {
  const filteredPages = filter
    ? IGNORE_AUTHORIZATION_PAGE.filter((page) => !filter.includes(page))
    : IGNORE_AUTHORIZATION_PAGE;

  return filteredPages.some((sub) => window.location.pathname.includes(sub));
};
//#endregion

//#region download QR code
export const doDownload = (url: string, fileName: string) => {
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadCanvasQRCode = () => {
  const canvas = document.getElementById('QRCode')?.querySelector<HTMLCanvasElement>('canvas');
  if (canvas) {
    const url = canvas.toDataURL();
    doDownload(url, 'QRCode.png');
  }
};

export const downloadSvgQRCode = () => {
  const svg = document.getElementById('QRCode')?.querySelector<SVGElement>('svg');
  const svgData = new XMLSerializer().serializeToString(svg!);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  doDownload(url, 'QRCode.svg');
};

//#endregion

//#region export file
export const downloadFile = (response: any, file_name) => {
  const blob = new Blob([response], { type: response.type });
  const url = URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = file_name; // Set a default filename
  document.body.appendChild(a);
  a.click(); // Simulate a click to start the download
  document.body.removeChild(a); // Clean up the element

  // Revoke the URL after a short delay to free memory
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

//#endregion

//#region table reload after delete
export const handlePageAfterDelete = (
  tableRef: any,
  savePageList: { (page?: number, pageSize?: number) },
  index: number,
) => {
  const pageInfo = tableRef.current?.pageInfo;
  const Index = index + 1 + (pageInfo?.current - 1) * pageInfo?.pageSize;

  //if current index equal with total item and it's the 1st item in table -> last item of data
  if (Index === pageInfo?.total && index === 0 && pageInfo?.current !== 1) {
    savePageList(pageInfo?.current - 1);
  } else {
    tableRef.current?.reload();
  }
};

//#endregion

//#region report

export const transformToLineChartSeries = (data: ResRangeData, removeNLastIndex: number = 0) => {
  let series: Highcharts.Options['series'] = [];
  data.forEach((item) => {
    let pointData: [number, number][] = [];
    item.data.forEach((item) => {
      pointData.push([item.timestamp, item.value]);
    });

    series.push({
      type: 'line', // Ensure the correct type (adjust as needed)
      name: item.name, // Assuming item has a name property
      data: pointData.slice(0, -removeNLastIndex),
      marker: {
        radius: 1,
      },
    });
  });
  return series;
};

//#endregion
