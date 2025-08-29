import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import dayjs from 'dayjs';
import { create, fetchItem, update } from '../service';
import { FormatInputTime } from '@/helpers';
import { useModel } from '@umijs/max';
import { SYSTEM_ROLE } from '@/consants';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: (data: UserModule.Response) => void;
  data?: UserModule.Response; // Optional: If provided, edit mode; else, create mode
  id?: string; // Optional: If provided and data is undefined => fetch item data base on id
};

const UserModal: React.FC<Props> = ({ visible, onCancel, onSave, data, id }) => {
  const { initialState } = useModel('@@initialState');
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
  }, [data]);

  const transformResData = (data: UserModule.Response) => {
    return {
      ...data,
      created_at: dayjs(data.created_at),
      locked_to: data.locked_to ? dayjs(data.locked_to) : undefined,
    };
  };

  const handleSubmit = (values: any) => {
    const formattedData: UserModule.Request = {
      ...values,
      role_id: initialState?.currentUser?.role_id === 1 ? values.role_id : 3,
      locked_to: FormatInputTime(values.locked_to?.valueOf()) || undefined,
    };
    const currId: string | undefined = data?.id || (id as string);

    setLoading(true);
    (currId ? update(currId, formattedData) : create(formattedData))
      .then(({ data }) => {
        message.success(`User ${currId ? 'updated' : 'created'} successfully!`);
        setLoading(false);
        onSave(data);
      })
      .catch(() => setLoading(false));
  };

  return (
    <Modal
      open={visible}
      title={`${data ? `Edit user - ${data.username}` : 'Create user'}`}
      onCancel={onCancel}
      loading={loading}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" disabled={loading} onClick={() => form.submit()}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Full Name"
          name="full_name"
          rules={[
            { required: true, message: 'Full Name is required' },
            {
              type: 'string',
              max: 60,
              min: 1,
            },
          ]}
        >
          <Input />
        </Form.Item>

        {!(id || data) && (
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Username is required' },
              {
                type: 'string',
                max: 33,
                min: 3,
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[
            { required: true, message: 'Phone Number is required' },
            { pattern: /^[0-9]{10,11}$/, message: 'Enter a valid phone number (10-11 digits)' },
          ]}
        >
          <Input />
        </Form.Item>

        {
          //no update password in edit user
        }
        {!(id || data) && (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              {
                pattern: new RegExp(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&&*()-_<>?)(])[A-Za-z\d!@#$%^&&*()-_<>?)(]{8,30}$/,
                  'g',
                ),
                message:
                  'Password needs to be between 8 - 30 characters with at least 1 special character, 1 number, 1 lowercase letter and 1 uppercase letter. Please try again',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}

        {
          //only super admin can edit role
          initialState?.currentUser?.role_id === 1 && (
            <Form.Item
              label="Role"
              name="role_id"
              rules={[{ required: true, message: 'Role is required' }]}
            >
              <Select>
                <Select.Option value={1}>{SYSTEM_ROLE[1]}</Select.Option>
                <Select.Option value={2}>{SYSTEM_ROLE[2]}</Select.Option>
                <Select.Option value={3}>{SYSTEM_ROLE[3]}</Select.Option>
              </Select>
            </Form.Item>
          )
        }

        {/* <Form.Item label="Locked To" name="locked_to">
          <DatePicker showTime disabledDate={disabledDate} disabledTime={disabledTime} />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default UserModal;
