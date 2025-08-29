import { useEffect, useState } from 'react';
import { Button, Card, Flex, Form, Input, Radio, Typography } from 'antd';

import { message } from 'antd/lib';
import { Helmet, useIntl, useParams } from '@umijs/max';
import querystring from 'query-string';
import Settings from '@/../config/defaultSettings';
import {
  confirmCheckIn,
  confirmCheckInRoom,
  fetchEventDetail,
  fetchEventListContent,
} from './service';
import { CheckCircleOutlined } from '@ant-design/icons';
import IconFont from '@/components/IconFont';
import CheckInSuccess from './Result/CheckInSuccess';
import CheckOutSuccess from './Result/CheckOutSuccess';
import FeedbackForm from './components/FeedbackForm';
import { AssetKey } from '@/consants';

const ConfirmCheckIn: React.FC = () => {
  const { formatMessage } = useIntl();
  //
  const [loading, setLoading] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showCheckOut, setShowCheckOut] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  //get init data
  const [checkInType, setCheckInType] = useState<'code' | 'email'>('code');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [errorMess, setErrorMess] = useState<string>();
  const { summitId } = useParams();
  const [eventData, setEventData] = useState<EventsModule.Response>();
  const [activeGuest, setActiveGuest] = useState<string>();

  //get room id and check-in code
  const { room_id, check_in_code } = querystring.parse(location.search);

  //asset
  const [listAssets, setListAssets] = useState<EventsModule.AccessResponse[]>();
  const listAssetsKey = [
    AssetKey.CheckInSuccessAgenda,
    AssetKey.CheckInSuccessMap,
    AssetKey.CheckInSuccessTopBanner,
    AssetKey.FeedbackTopBanner,
    AssetKey.SubmiteCodeTopBanner,
  ];
  //
  useEffect(() => {
    if (summitId) {
      // get summit data
      fetchEventDetail(summitId).then(({ data }) => {
        setEventData(data);
      });

      fetchEventListContent(summitId, listAssetsKey.join('|')).then(({ data }) =>
        setListAssets(data),
      );
    }

    // auto check in with provided code in params
    if (check_in_code) {
      const checkInReq: PublicModule.CheckInRequest = {
        check_in_code,
        summit_id: summitId || '',
      };

      onSubmit(checkInReq);
    } else {
      // Get the JSON string from localStorage
      const storedGuest = localStorage.getItem('activeGuest');

      // Parse it back into an object
      if (storedGuest) {
        //set guest data
        setActiveGuest(storedGuest);

        //check in room if there is a room id
        if (room_id) {
          switchComponent('feedback');
        } else {
          //skip to Result
          if (checkStoredGuest(storedGuest)) {
            checkInSuccess(storedGuest);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    //reset error messsage when check-in type change
    setErrorMess(undefined);
  }, [checkInType]);

  //#region switch component
  const switchComponent = (name: string) => {
    switch (name) {
      case 'submit_code':
        setShowResult(false);
        setShowCheckOut(false);
        setShowFeedback(false);
        return;
      case 'checkout_success':
        setShowResult(false);
        setShowCheckOut(true);
        setShowFeedback(false);
        return;
      case 'feedback':
        setShowResult(false);
        setShowCheckOut(false);
        setShowFeedback(true);
        return;
      case 'result':
        setShowResult(true);
        setShowCheckOut(false);
        setShowFeedback(false);
        return;

      default:
        return;
    }
  };
  //#endregion

  //#region callback
  const callback = (data: { action: string; data?: any }) => {
    if (data.action === 'back') {
      switchComponent('submit_code');
      return;
    }
    if (data.action === 'checkout') {
      setActiveGuest(undefined);
      switchComponent('checkout_success');
      return;
    }
    if (data.action === 'feedback') {
      switchComponent('result');
      return;
    }
  };
  //#endregion

  //#region handle input change
  //make only uppercase and no special characters  in the input
  const handleInputChange = (e) => {
    if (checkInType === 'code') {
      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setCode(value);
    } else if (checkInType === 'email') {
      const value = e.target.value;
      const regex = new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
      if (!regex.test(value) && value) {
        setErrorMess('Please enter vaild email');
      } else {
        setErrorMess(undefined);
      }
      setEmail(value);
    }
  };
  //#endregion

  //#region setup localstorage
  const setCheckedGuest = (check_in_code: string) => {
    // Get the JSON string from localStorage
    const storedGuest = localStorage.getItem('checkedInGuest');
    let newStoredGuest: string[] = [];
    if (storedGuest) {
      const parsedData: string[] = JSON.parse(storedGuest);
      newStoredGuest = [...new Set([...(parsedData || []), check_in_code])];
    } else {
      newStoredGuest = [check_in_code];
    }
    localStorage.setItem('checkedInGuest', JSON.stringify(newStoredGuest));
  };

  const checkStoredGuest = (check_in_code: string): boolean => {
    const storedGuest = localStorage.getItem('checkedInGuest');
    if (storedGuest) {
      // Convert the object to a JSON string and store it
      const parsedData: string[] = JSON.parse(storedGuest);
      return parsedData.includes(check_in_code);
    }

    return false;
  };
  //#endregion

  //#region result
  const checkInSuccess = (check_in_code: string) => {
    localStorage.setItem('activeGuest', check_in_code);
    setActiveGuest(check_in_code);
    message.success('Check-in successful!');

    //show feed back form if have room_id in params
    if (room_id) {
      switchComponent('feedback');
    } else {
      switchComponent('result');
    }
  };

  const checkResult = (data: PublicModule.CheckInRespone) => {
    if (data.is_first_time) {
      setCheckedGuest(data.check_in_code);
      checkInSuccess(data.check_in_code);
    } else if (checkStoredGuest(data.check_in_code)) {
      checkInSuccess(data.check_in_code);
    } else {
      message.error(`Check-in failed!`);
    }
  };
  //#endregion

  //#region call api
  // const checkInRoom = (checkInRoomReq: PublicModule.CheckInRequest) => {
  //   confirmCheckInRoom(checkInRoomReq)
  //     .then(({ data }) => {
  //       setLoading(false);
  //       checkResult(data, checkInRoomReq.check_in_code);
  //     })
  //     .catch(() => setLoading(false));
  // };

  const checkEvent = (checkInReq: PublicModule.CheckInRequest) => {
    confirmCheckIn(checkInReq)
      .then(({ data }) => {
        setLoading(false);
        checkResult(data);
      })
      .catch(() => setLoading(false));
  };
  //#endregion

  //#region submit

  const onSubmit = (checkInReq: PublicModule.CheckInRequest) => {
    setLoading(true);
    checkEvent(checkInReq);

    // if (!room_id) {
    //   checkEvent(checkInReq);
    // } else {
    //   const checkInRoomReq: PublicModule.CheckInRequest = {
    //     room_id: room_id as string,
    //     check_in_code: checkInReq.check_in_code,
    //   };
    //   checkInRoom(checkInRoomReq);
    // }
  };

  const handleSubmit = () => {
    if (code.trim() === '' && !email) {
      message.error('Please enter a valid check-in code or email.');
      return;
    }

    const checkInReq: PublicModule.CheckInRequest = {
      ...(checkInType === 'code' ? { check_in_code: code } : { email: email }),
      summit_id: summitId || '',
    };
    onSubmit(checkInReq);
  };
  //#endregion

  const Banner: React.FC = () => {
    const asset = listAssets?.find((item) => item.key === AssetKey.SubmiteCodeTopBanner);
    if (asset && asset.value) {
      return <img src={asset.value} alt="map" style={{ width: '100%', height: 'auto' }} />;
    }
    return <IconFont name="iconlocation" />;
  };

  return (
    <div>
      <Helmet>
        <title>
          Confirm Check-in
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>

      <Flex justify="center" align="center">
        <Card
          className="w-full max-w-lg p-6 shadow-lg border border-gray-300 text-center"
          title={
            <div className="flex items-center justify-center text-xl font-semibold">
              <CheckCircleOutlined className="text-green-500 mr-2" /> Confirm Check-In
            </div>
          }
          style={{ width: '100%', maxWidth: 500 }}
          loading={loading}
        >
          {(!showResult || !eventData || !activeGuest) &&
          !showResult &&
          !showFeedback &&
          !showCheckOut ? (
            <Flex justify="center" align="center" vertical={true} wrap gap="middle">
              <Flex justify="center" align="center" vertical={true} wrap gap="small">
                <Banner />
                <Typography.Title style={{ textAlign: 'center' }} level={4} className="mb-2">
                  {`Welcome to ${eventData?.name}`}
                </Typography.Title>

                <Typography.Paragraph
                  style={{ textAlign: 'center' }}
                  className="text-gray-600 mb-4"
                >
                  Please enter your check-in code or registered email to confirm your attendance.
                  Make sure to follow event policies and guidelines.
                </Typography.Paragraph>
              </Flex>

              <Radio.Group
                optionType="button"
                style={{ float: 'left' }}
                value={checkInType}
                onChange={(e) => setCheckInType(e.target.value)}
              >
                <Radio value={'code'}>{'Check-in code'}</Radio>
                <Radio value={'email'}>{'Email'}</Radio>
              </Radio.Group>
              {checkInType === 'code' ? (
                <Input
                  type="text"
                  size="large"
                  placeholder="Enter check-in code"
                  value={code}
                  onChange={handleInputChange}
                  className="mb-4"
                  status={Boolean(errorMess) ? 'error' : undefined}
                />
              ) : null}
              {checkInType === 'email' ? (
                <Input
                  type="text"
                  size="large"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleInputChange}
                  className="mb-4"
                  status={Boolean(errorMess) ? 'error' : undefined}
                />
              ) : null}
              <Button
                loading={loading}
                type="primary"
                size="large"
                onClick={handleSubmit}
                className="w-full text-lg font-semibold h-10"
                style={{ width: '100%' }}
                disabled={Boolean(errorMess) || (!email && !code)}
              >
                {formatMessage({ id: 'component.global.submit' })}
              </Button>
              {/* {Boolean(errorMess) ? (
                <span style={{ color: 'red', marginTop: -5 }}>{errorMess}</span>
              ) : null} */}
            </Flex>
          ) : null}
          {showResult && eventData && activeGuest ? (
            <CheckInSuccess
              event={eventData}
              check_in_code={activeGuest}
              callback={callback}
              type={room_id ? 'feedback' : 'check_in'}
              topBannerImageSrc={
                room_id
                  ? listAssets?.find((item) => item.key === AssetKey.FeedbackTopBanner)?.value
                  : listAssets?.find((item) => item.key === AssetKey.CheckInSuccessTopBanner)?.value
              }
              mapImageSrc={
                listAssets?.find((item) => item.key === AssetKey.CheckInSuccessMap)?.value
              }
              agendaImageSrc={
                listAssets?.find((item) => item.key === AssetKey.CheckInSuccessAgenda)?.value
              }
            />
          ) : null}
          {showCheckOut && eventData ? (
            <CheckOutSuccess event={eventData} callback={callback} />
          ) : null}
          {showFeedback && eventData && activeGuest ? (
            <FeedbackForm
              event={eventData}
              check_in_code={activeGuest}
              callback={callback}
              room_id={room_id as string}
            />
          ) : null}
        </Card>
      </Flex>
    </div>
  );
};

export default ConfirmCheckIn;
