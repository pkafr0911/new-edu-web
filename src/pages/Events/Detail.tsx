import React, { CSSProperties, useEffect, useState } from 'react';
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { useIntl, useParams } from '@umijs/max';
import {
  fetchItem,
  fetchRangeTotalValues,
  fetchTotalCheckIn,
  fetchTotalCheckOut,
  fetchTotalMailSent,
  fetchTotalRegistered,
  fetchTotalRegisteredByGuestGroup,
  TotalRegisteredByGuestGroup,
} from './service';
import { PageContainer } from '@ant-design/pro-components';
import {
  Breadcrumb,
  Card,
  Col,
  DatePicker,
  Row,
  Skeleton,
  Space,
  TimeRangePickerProps,
  Typography,
} from 'antd';
import {
  FormatInputTime,
  getTimeNowStartOfDay,
  getTimeOneMonthLaterStartOfDay,
  transformToLineChartSeries,
  transformTimestampToDayjs,
} from '@/helpers';
import { RangeValueType } from 'rc-picker/lib/PickerInput/RangePicker';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Detail: React.FC = () => {
  //#region init
  const { formatMessage } = useIntl();
  const { id } = useParams();

  const [data, setData] = useState<EventsModule.Response>();
  const [loading, setLoading] = useState(false);

  //req
  const DEFAULT_START_TIME = getTimeNowStartOfDay();
  const DEFAULT_END_TIME = getTimeOneMonthLaterStartOfDay();
  const MAX_RANGE_DAYS = 100;
  const [rangeValue, setRangeValue] = useState<RangeValueType<dayjs.Dayjs>>([
    DEFAULT_START_TIME,
    DEFAULT_END_TIME,
  ]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchItem(id)
        .then((res) => {
          setData(res);
          setRangeValue([
            transformTimestampToDayjs(res.start_time),
            transformTimestampToDayjs(res.end_time),
          ]);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);
  //#endregion

  // Summary statistics
  //#region total registered
  const [totalRegistered, setTotalRegistered] = useState<number>(0);
  const [totalRegisteredLoading, setTotalRegisteredLoading] = useState<boolean>(false);

  useEffect(() => {
    const req = getReqBody(rangeValue);
    if (data && req) {
      setTotalRegisteredLoading(true);
      fetchTotalRegistered(data.id, req.start_time, req.end_time)
        .then((data) => {
          setTotalRegistered(data);
          setTotalRegisteredLoading(false);
        })
        .catch(() => setTotalRegisteredLoading(false));
    }
  }, [data, rangeValue]);
  //#endregion

  //#region total mail sent
  const [totalMailSent, setTotalMailSent] = useState<number>(0);
  const [totalMailSentLoading, setTotalMailSentLoading] = useState<boolean>(false);

  useEffect(() => {
    const req = getReqBody(rangeValue);
    if (data && req) {
      setTotalMailSentLoading(true);
      fetchTotalMailSent(data.id, req.start_time, req.end_time)
        .then((data) => {
          setTotalMailSent(data);
          setTotalMailSentLoading(false);
        })
        .catch(() => setTotalMailSentLoading(false));
    }
  }, [data, rangeValue]);
  //#endregion
  //#region total check in
  const [totalCheckIn, setTotalCheckIn] = useState<number>(0);
  const [totalCheckInLoading, setTotalCheckInLoading] = useState<boolean>(false);

  useEffect(() => {
    const req = getReqBody(rangeValue);
    if (data && req) {
      setTotalCheckInLoading(true);
      fetchTotalCheckIn(data.id, req.start_time, req.end_time)
        .then((data) => {
          setTotalCheckIn(data);
          setTotalCheckInLoading(false);
        })
        .catch(() => setTotalCheckInLoading(false));
    }
  }, [data, rangeValue]);
  //#endregion
  //#region total check out
  const [totalCheckOut, setTotalCheckOut] = useState<number>(0);
  const [totalCheckOutLoading, setTotalCheckOutLoading] = useState<boolean>(false);

  useEffect(() => {
    const req = getReqBody(rangeValue);
    if (data && req) {
      setTotalCheckOutLoading(true);
      fetchTotalCheckOut(data.id, req.start_time, req.end_time)
        .then((data) => {
          setTotalCheckOut(data);
          setTotalCheckOutLoading(false);
        })
        .catch(() => setTotalCheckOutLoading(false));
    }
  }, [data, rangeValue]);
  //#endregion

  //#region range total values
  const [rangeTotalValues, setRangeTotalValues] = useState<Highcharts.Options['series']>([]);
  const [rangeTotalValuesLoading, setRangeTotalValuesLoading] = useState<boolean>(false);

  useEffect(() => {
    const req = getReqBody(rangeValue);
    if (data && req) {
      setRangeTotalValuesLoading(true);
      fetchRangeTotalValues(data.id, req.start_time, req.end_time)
        .then((data) => {
          if (data) {
            setRangeTotalValues(transformToLineChartSeries(data, 1));
          }
          setRangeTotalValuesLoading(false);
        })
        .catch(() => setRangeTotalValuesLoading(false));
    }
  }, [data, rangeValue]);

  //#endregion

  //#region range total values
  const [totalRegisteredByGuestGroup, setTotalRegisteredByGuestGroup] = useState<
    Highcharts.Options['series']
  >([]);
  const [totalRegisteredByGuestGroupLoading, setTotalRegisteredByGuestGroupLoading] =
    useState<boolean>(false);

  useEffect(() => {
    const req = getReqBody(rangeValue);
    if (data && req) {
      setTotalRegisteredByGuestGroupLoading(true);
      fetchTotalRegisteredByGuestGroup(data.id, req.start_time, req.end_time)
        .then((data) => {
          if (data) {
            setTotalRegisteredByGuestGroup(transformResTotalRegisteredByGuestGroupData(data));
          }
          setTotalRegisteredByGuestGroupLoading(false);
        })
        .catch(() => setTotalRegisteredByGuestGroupLoading(false));
    }
  }, [data, rangeValue]);

  const transformResTotalRegisteredByGuestGroupData = (data: TotalRegisteredByGuestGroup[]) => {
    let pointData: [string, number][] = [];
    data.forEach((item) => {
      pointData.push([item.name, item.total_guest_registered]);
    });
    let series: Highcharts.Options['series'] = [
      {
        type: 'column',
        name: 'Registrations',
        data: pointData,
        colorByPoint: true,
      },
    ];

    return series;
  };

  //#endregion

  const getReqBody = (rangeValue) => {
    if (!rangeValue) return false;
    if (!rangeValue[0]) return false;
    if (!rangeValue[1]) return false;
    return {
      start_time: FormatInputTime(dayjs(rangeValue[0]).startOf('day')) as number,
      end_time: FormatInputTime(dayjs(rangeValue[1]).add(1, 'day').startOf('day')) as number,
    };
  };

  //#region chart option
  // Line Chart Configuration
  const lineChartOptions = {
    chart: { type: 'line', zoomType: 'x', panning: true, panKey: 'shift' },
    title: { text: 'Email Sent & Guest Registrations Over Time' },
    xAxis: { type: 'datetime', title: { text: 'Time' } },
    yAxis: { title: { text: 'Count' } },
    series: rangeTotalValues,
    tooltip: {
      shared: true,
      crosshairs: true,
    },
    time: {
      useUTC: false,
    },
  };

  // Pie Chart (Check-in % vs Registered Guest %)
  const checkInPieOptions: Highcharts.Options = {
    chart: { type: 'pie' },
    title: { text: 'Check-in % of Registered Guest' },
    colors: ['#3498db', '#e74c3c'],
    series: [
      {
        name: 'Guest',
        type: 'pie',
        data: [
          { name: 'Checked-in', y: totalCheckIn },
          { name: 'Not Checked-in', y: totalRegistered - totalCheckIn },
        ],
      },
    ],
  };

  // Pie Chart (Check-out % of Checked-in Guest)
  const checkOutPieOptions: Highcharts.Options = {
    chart: { type: 'pie' },
    title: { text: 'Check-out % of Checked-in Guest' },
    colors: ['#f39c12', '#2ecc71'], // Orange for Checked-out, Green for Still Checked-in
    series: [
      {
        name: 'Users',
        type: 'pie',
        data: [
          { name: 'Checked-out', y: totalCheckOut },
          { name: 'Still Checked-in', y: totalCheckIn - totalCheckOut },
        ],
      },
    ],
  };

  // Column Chart (Guest Registrations by Source)
  const columnChartOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Guest Registrations by Group' },
    xAxis: { type: 'category' },
    yAxis: { title: { text: 'Number of Guests' } },
    series: totalRegisteredByGuestGroup,
    legend: { enabled: false },
  };

  //#endregion

  //#region range setting
  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last Day', value: [dayjs().startOf('day').add(-1, 'd'), dayjs().startOf('day')] },
    { label: 'Last 7 Days', value: [dayjs().startOf('day').add(-7, 'd'), dayjs().startOf('day')] },
    {
      label: 'Last 14 Days',
      value: [
        dayjs().startOf('day').startOf('day').add(-14, 'd'),
        dayjs().startOf('day').startOf('day'),
      ],
    },
    {
      label: 'Last 30 Days',
      value: [
        dayjs().startOf('day').startOf('day').add(-30, 'd'),
        dayjs().startOf('day').startOf('day'),
      ],
    },
    {
      label: 'Last 90 Days',
      value: [
        dayjs().startOf('day').startOf('day').add(-90, 'd'),
        dayjs().startOf('day').startOf('day'),
      ],
    },
  ];

  const disabledDate = (current: Dayjs) => {
    if (!rangeValue) return false;
    if (!rangeValue[0]) return false;

    // Prevent selecting the same start and end date
    // if (rangeValue[0].isSame(current, 'day')) return true;

    // Prevent selecting a date beyond the max range (100 days)
    const maxEndDate = rangeValue[0].add(MAX_RANGE_DAYS, 'day');
    return current.isAfter(maxEndDate, 'day');
  };
  //#endregion

  const CardStyle: CSSProperties = {
    maxHeight: 146,
  };

  //#region breadcrumb
  const CustomBreadcrumb = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item href="/events">{formatMessage({ id: 'menu.events' })}</Breadcrumb.Item>
        <Breadcrumb.Item>{data?.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };
  //#endregion

  //#region finnal render
  return (
    <PageContainer
      title={
        <Space direction="horizontal" size={'large'}>
          <Title level={4}>{data?.name}</Title>
          <RangePicker
            style={{ marginTop: -10, display: 'flex' }}
            value={rangeValue}
            onChange={(value) => setRangeValue(value as RangeValueType<dayjs.Dayjs>)}
            disabledDate={disabledDate}
            presets={rangePresets}
          />
        </Space>
      }
      breadcrumbRender={() => <CustomBreadcrumb />}
      loading={loading}
    >
      <div style={{ padding: '20px' }}>
        {/* Stats Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={6}>
            <Card
              title="Registered Users"
              bordered={false}
              loading={totalRegisteredLoading}
              style={CardStyle}
            >
              <h2>{totalRegistered}</h2>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card
              title="Emails Sent"
              bordered={false}
              loading={totalMailSentLoading}
              style={CardStyle}
            >
              <h2>{totalMailSent}</h2>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card
              title="Check-ins"
              bordered={false}
              loading={totalCheckInLoading}
              style={CardStyle}
            >
              <h2>{totalCheckIn}</h2>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card
              title="Check-outs"
              bordered={false}
              loading={totalCheckOutLoading}
              style={CardStyle}
            >
              <h2>{totalCheckOut}</h2>
            </Card>
          </Col>
        </Row>

        {/* Top Charts: Line & Pie */}
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col xs={24} lg={16}>
            {rangeTotalValuesLoading ? <Skeleton /> : null}
            {!rangeTotalValuesLoading ? (
              <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
            ) : null}
          </Col>
          <Col xs={24} lg={8}>
            {totalCheckInLoading || totalRegisteredLoading ? <Skeleton /> : null}
            {!totalCheckInLoading && !totalRegisteredLoading ? (
              <HighchartsReact highcharts={Highcharts} options={checkInPieOptions} />
            ) : null}
          </Col>
        </Row>

        {/* Bottom Charts: Pie & Column */}
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col xs={24} lg={12}>
            {totalCheckInLoading || totalCheckOutLoading ? <Skeleton /> : null}
            {!totalCheckInLoading && !totalCheckOutLoading ? (
              <HighchartsReact highcharts={Highcharts} options={checkOutPieOptions} />
            ) : null}
          </Col>
          <Col xs={24} lg={12}>
            {totalRegisteredByGuestGroupLoading ? <Skeleton /> : null}
            {!totalRegisteredByGuestGroupLoading ? (
              <HighchartsReact highcharts={Highcharts} options={columnChartOptions} />
            ) : null}
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default Detail;
