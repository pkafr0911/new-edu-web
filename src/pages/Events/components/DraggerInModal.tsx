import React, { useEffect, useState } from 'react';
import { Modal, Upload, Image, message, Button, Space, Typography, Badge, Popconfirm } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import TextArea from 'antd/es/input/TextArea';
import { DeleteOutlined, InboxOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { createContent, fetchContent, removeContent, updateContent } from '../service';

const { Dragger } = Upload;

const { Text } = Typography;

const getBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

type Props = {
  data: EventsModule.Response;
  listKey: string[];
  label: string;
  desc?: string;
  imageKey: string;
  callback: (data: { action: string; data: any }) => void;
};

const DraggerInModal: React.FC<Props> = ({ listKey, data, label, desc, imageKey, callback }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (listKey.includes(imageKey)) {
      fetchContent(data.id, imageKey).then(({ data }) => {
        if (data) {
          setImageUrl(data.value);
          setIsSaved(true);
        }
      });
    } else {
      setImageUrl(undefined);
      setIsSaved(false);
    }
  }, [listKey, imageKey]);

  const handleUpload: UploadProps['beforeUpload'] = async (file: RcFile) => {
    if (!file.type.startsWith('image/')) {
      message.warning('Only image files are allowed');
      return Upload.LIST_IGNORE;
    }
    const base64 = await getBase64(file);
    setImageUrl(base64);
    setModalVisible(false);
    return false; // Prevent default upload
  };

  const handleSave = () => {
    if (data && imageUrl) {
      const reqData = { key: imageKey, description: desc, value: imageUrl };
      setLoading(true);
      (listKey.includes(imageKey)
        ? updateContent(data.id, imageKey, reqData)
        : createContent(data.id, reqData)
      )
        .then(() => {
          message.success('Image saved');
          setIsSaved(true);
          setLoading(false);
          callback({ action: 'add', data: imageKey });
        })
        .catch(() => {
          setLoading(false);
          setIsSaved(false);
        });
    }
  };

  const handleDelete = () => {
    if (data) {
      if (isSaved) {
        setLoading(true);
        removeContent(data.id, imageKey)
          .then(() => {
            message.success('Image removed');
            setImageUrl(undefined);
            setIsSaved(false);
            setLoading(false);
            callback({ action: 'remove', data: imageKey });
          })
          .catch(() => setLoading(false));
      } else {
        setImageUrl(undefined);
        callback({ action: 'remove', data: imageKey });
      }
    }
  };

  return (
    <Space direction="vertical">
      <Text strong>{label + ':'}</Text>
      {!imageUrl ? (
        <Button onClick={() => setModalVisible(true)}>
          Upload <UploadOutlined />{' '}
        </Button>
      ) : null}

      <Modal
        title="Upload Image"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
        maskClosable={false}
      >
        <Dragger
          beforeUpload={handleUpload}
          multiple={false}
          showUploadList={false}
          accept="image/*"
          style={{
            padding: 16,
            borderRadius: 8,
          }}
        >
          <p className="ant-upload-drag-icon">
            {' '}
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag image to this area to upload</p>
        </Dragger>
      </Modal>

      {imageUrl && (
        <>
          <Space direction="horizontal" size={'small'}>
            <Badge.Ribbon text={isSaved ? 'Saved' : 'Not saved'} color={isSaved ? 'green' : 'red'}>
              <Image src={imageUrl} width={200} />
            </Badge.Ribbon>

            <Space direction="vertical">
              <Button
                type="primary"
                onClick={handleSave}
                size="small"
                loading={loading}
                disabled={loading}
              >
                <SaveOutlined />
              </Button>
              {isSaved ? (
                <Popconfirm
                  onConfirm={handleDelete}
                  title={'Are you sure want to remove this image?'}
                >
                  <Button danger size="small">
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              ) : null}
              {!isSaved ? (
                <Button danger size="small" onClick={handleDelete}>
                  <DeleteOutlined />
                </Button>
              ) : null}
            </Space>
            {/* <TextArea
            readOnly
            value={imageUrl}
            style={{ width: '100%', height: 200, marginTop: 16 }}
          /> */}
          </Space>
        </>
      )}
    </Space>
  );
};

export default DraggerInModal;
