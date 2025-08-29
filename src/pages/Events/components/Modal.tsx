import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, message, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { disabledDate, FormatInputTime } from '@/helpers';
import { create, fetchItem, update } from '../service';
import { EditOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: (data: EventsModule.Response) => void;
  data?: EventsModule.Response; // Optional: If provided, edit mode; else, create mode
  id?: string; // Optional: If provided and data is undefined => fetch item data base on id
};

const { RangePicker } = DatePicker;

const removeBtnStyle = {
  marginLeft: 20,
  display: 'flex',
  alignItems: 'center',
};

const EventModal: React.FC<Props> = ({ visible, onCancel, onSave, data, id }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(transformResData(data));
    } else if (id) {
      setLoading(true);
      fetchItem(id)
        .then((res) => {
          form.setFieldsValue(transformResData(res));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      form.resetFields();
    }
  }, [data, id]);

  const transformResData = (data: EventsModule.Response) => {
    return {
      ...data,
      time_range:
        data?.start_time && data?.end_time ? [dayjs(data.start_time), dayjs(data.end_time)] : null,
    };
  };

  const handleSubmit = (values: any) => {
    const [start, end] = values.time_range || [];

    const formattedData: EventsModule.Request = {
      ...values,
      start_time: FormatInputTime(start?.valueOf()) || undefined,
      end_time: FormatInputTime(end?.valueOf()) || undefined,
    };

    setLoading(true);
    const currId: string | undefined = data?.id || (id as string);
    (currId ? update(currId, formattedData) : create(formattedData))
      .then(({ data }) => {
        message.success(`Event ${id ? 'updated' : 'created'} successfully!`);
        setLoading(false);
        onSave(data);
      })
      .catch(() => setLoading(false));
  };

  return (
    <Modal
      open={visible}
      title={data ? 'Edit Event' : 'Create Event'}
      onCancel={onCancel}
      loading={loading}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              pattern: /^[a-zA-ZÀ-ỹ0-9\[\]()\-_][ a-zA-ZÀ-ỹ0-9\[\]()\-_]{0,255}$/,
              message: 'Please enter valid name',
            },
          ]}
        >
          <Input placeholder="Enter event name" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          label="Start & End Time"
          name="time_range"
          rules={[{ required: true, message: 'Select start and end time' }]}
        >
          <RangePicker
            showTime
            style={{ width: '100%' }}
            disabledDate={(current) => {
              const isEdit = Boolean(id || data);
              let disableTime = dayjs();
              if (isEdit) {
                disableTime =
                  form.getFieldValue('time_range')[0] > dayjs()
                    ? dayjs()
                    : form.getFieldValue('time_range')[0];
              }
              return current && current.isBefore(disableTime, 'day');
            }}
          />
        </Form.Item>
        {
          //no update rooms in edit event
        }
        {!(id || data) && (
          <Form.List name="rooms" initialValue={[]}>
            {(fields, { add, remove }) => {
              return (
                <div>
                  <Form.Item
                    label={
                      <>
                        {`Room`}{' '}
                        <Button
                          type="link"
                          ghost
                          onClick={() => {
                            add();
                          }}
                        >
                          <PlusCircleOutlined />
                        </Button>
                      </>
                    }
                    style={{ marginBottom: 0 }}
                  >
                    {fields.length === 0 && (
                      <span
                        style={{ ...removeBtnStyle, marginLeft: 0, opacity: 0.5 }}
                      >{`No room added`}</span>
                    )}

                    {fields.map((field, index) => (
                      <Row style={{ marginBottom: 10 }} gutter={16} key={index}>
                        <Col span={10}>
                          <Form.Item
                            name={[field.name, 'name']}
                            validateTrigger={['onChange', 'onBlur', 'onClick']}
                            noStyle
                            rules={[{ required: true, message: 'Name is required' }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col style={{ ...removeBtnStyle, marginLeft: -10 }}>
                          {fields.length > 0 && (
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          )}
                        </Col>
                      </Row>
                    ))}
                  </Form.Item>
                  <Form.Item></Form.Item>
                </div>
              );
            }}
          </Form.List>
        )}

        {
          // show in edit
        }
        {(id || data) && (
          <Button
            type="link"
            onClick={() => history.push(`/rooms?summit_id=${data?.id || (id as string)}`)}
          >
            {`Edit rooms`}
            <EditOutlined />
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default EventModal;
