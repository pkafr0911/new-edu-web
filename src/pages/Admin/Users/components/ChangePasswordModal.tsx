import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { changePassword } from '../service';
import { useIntl } from '@umijs/max';
import { omit } from 'lodash';

type Props = {
  visible: boolean;
  mode: 'reset' | 'change';
  onCancel: () => void;
  onSave: () => void;
  id?: string; // Optional: If provided and data is undefined => fetch item data base on id
};

const ChangePasswordModal: React.FC<Props> = ({ visible, mode, onCancel, onSave, id }) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  const onPasswordEmty = () => {
    const data = form.getFieldsValue();
    data.confirm_password = '';
    form.setFieldsValue(data);
  };

  const handleSubmit = (values: any) => {
    const formattedData: UserModule.ChangePasswordReq = {
      ...(omit(values, ['confirm_password']) as any),
    };
    if (id) {
      changePassword(id, formattedData).then(() => {
        message.success(`User update password successfully!`);
        onSave();
      });
    }
  };

  return (
    <Modal
      open={visible}
      title={`${mode === 'change' ? 'Change' : 'Reset'} password`}
      onCancel={onCancel}
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
        {mode === 'change' && (
          <Form.Item
            label="Current password"
            name="current_password"
            rules={[
              {
                required: true,
                message: 'Password is required',
              },
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
            <Input.Password
              placeholder="Enter current password"
              onClick={(event) => {
                event.currentTarget.select();
              }}
            />
          </Form.Item>
        )}

        <Form.Item
          label="New password"
          name="new_password"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'component.user.loginMethodPassword.inputPassword',
              }),
            },
            {
              pattern: new RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&&*()-_<>?)(])[A-Za-z\d!@#$%^&&*()-_<>?)(]{8,30}$/,
                'g',
              ),
              message:
                'Password needs to be between 8 - 30 characters with at least 1 special character, 1 number, 1 lowercase letter and 1 uppercase letter. Please try again',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (mode === 'reset') {
                  return Promise.resolve();
                }
                if (value && getFieldValue('current_password') !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('New password cannot same with current password'));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Enter new password"
            onChange={(event) => {
              if (event.currentTarget.value == '') {
                onPasswordEmty();
              }
            }}
            onClick={(event) => {
              visible;
              event.currentTarget.select();
            }}
          />
        </Form.Item>

        {mode === 'change' && (
          <Form.Item
            label="Confirm new password"
            name="confirm_password"
            rules={[
              {
                required: true,
                message: 'Confirm new password is required',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Your two entered passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Enter confirm new password"
              onClick={(event) => {
                event.currentTarget.select();
              }}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
