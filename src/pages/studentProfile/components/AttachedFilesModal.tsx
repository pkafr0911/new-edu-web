import React from 'react';
import { Modal, Radio, Space, Button, Upload, Typography, message, Popconfirm } from 'antd';
import { InboxOutlined, FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Dragger } = Upload;

interface AttachedFilesModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (file: string) => void;
}

const AttachedFilesModal: React.FC<AttachedFilesModalProps> = ({ open, onCancel, onSubmit }) => {
  const [selectedFile, setSelectedFile] = React.useState<string>();
  const [fileList, setFileList] = React.useState([
    { name: 'CV Hà Ngọc Tú 2025.pdf', uploadedAt: '09/09/2020' },
    { name: 'CV Hà Ngọc Tú.pdf', uploadedAt: '12/03/2024' },
  ]);

  const handleUpload = (info: any) => {
    const file = info.file;
    if (file.size > 5 * 1024 * 1024) {
      message.error('Dung lượng tối đa là 5MB');
      return;
    }
    const newFile = { name: file.name, uploadedAt: new Date().toLocaleDateString() };
    setFileList((prev) => [...prev, newFile]);
    message.success('Tải lên thành công');
  };

  // 🗑️ Delete a file from fileList
  const handleDelete = (fileName: string) => {
    setFileList((prev) => prev.filter((file) => file.name !== fileName));
    if (selectedFile === fileName) {
      setSelectedFile(undefined); // clear selection if deleted
    }
    message.success('Đã xóa hồ sơ');
  };

  return (
    <Modal
      title="Hồ sơ đính kèm"
      open={open}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
      onOk={() => {
        if (!selectedFile) {
          message.warning('Vui lòng chọn một hồ sơ');
          return;
        }
        onSubmit(selectedFile);
      }}
    >
      {/* 📁 Dragger Upload */}
      <Dragger
        beforeUpload={() => false}
        showUploadList={false}
        onChange={handleUpload}
        style={{ padding: '20px 0' }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ color: '#1677ff' }} />
        </p>
        <p className="ant-upload-text">Chọn hồ sơ từ máy của bạn</p>
        <p className="ant-upload-hint">Dung lượng tối đa 5MB</p>
      </Dragger>

      {/* 📄 File List */}
      <Radio.Group
        style={{ width: '100%', marginTop: 20 }}
        onChange={(e) => setSelectedFile(e.target.value)}
        value={selectedFile}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {fileList.map((file, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              <Radio value={file.name} style={{ flex: 1 }}>
                <Space align="start">
                  <FilePdfOutlined style={{ fontSize: 20, color: '#d32f2f' }} />
                  <div>
                    <Text strong>{file.name}</Text>
                    <div>
                      <Text type="secondary">Tải lên: {file.uploadedAt}</Text>
                    </div>
                  </div>
                </Space>
              </Radio>

              <Space>
                <Button type="link">Xem</Button>
                <Popconfirm
                  title="Xóa hồ sơ này?"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => handleDelete(file.name)}
                >
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </div>
          ))}
        </Space>
      </Radio.Group>
    </Modal>
  );
};

export default AttachedFilesModal;
