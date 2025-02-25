import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Row, Col, message, Typography, Input, Spin, Modal } from 'antd';
import { UploadOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';
import http from '../utils/http';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ImageItem {
  id: string;
  url: string;
  filename: string;
  uploadTime: string;
}

// OSS upload policy response interface
interface OSSUploadPolicy {
  key: string;
  host: string;
  policy: string;
  securityToken: string;
  signature: string;
  xOssCredential: string;
  xOssDate: string;
  xOssSignatureVersion: string;
}

const ImageHosting: React.FC = () => {
  // Modify the fileList state to store both UploadFile and original File objects
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileObjects, setFileObjects] = useState<Map<string, File>>(new Map());
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // Mock function to simulate loading images
  useEffect(() => {
    // In a real app, you would fetch from your backend
    setTimeout(() => {
      const mockImages = [
        // {
        //   id: '1',
        //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   filename: 'example-image-1.png',
        //   uploadTime: '2023-06-15 14:22:33'
        // },
        // {
        //   id: '2',
        //   url: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
        //   filename: 'example-image-2.jpg',
        //   uploadTime: '2023-06-10 09:15:45'
        // }
      ];
      setImages(mockImages);
      setLoading(false);
    }, 1000);
  }, []);

  // Get OSS upload policy from backend
  const getUploadPolicy = async (fileName: string): Promise<OSSUploadPolicy> => {
    try {
      const response = await http.post('/file/upload', {
        file_name: fileName
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get upload policy:', error);
      throw error;
    }
  };

  // Upload file directly to OSS
  const uploadToOSS = async (file: File, policy: OSSUploadPolicy): Promise<string> => {
    if (!file) {
      throw new Error('File is undefined');
    }
    const formData = new FormData();
    formData.append('key', policy.key);
    formData.append('policy', policy.policy);
    formData.append('x-oss-signature', policy.signature);
    formData.append('x-oss-signature-version', policy.xOssSignatureVersion);
    formData.append('x-oss-credential', policy.xOssCredential);
    formData.append('x-oss-date', policy.xOssDate);
    formData.append('success_action_status', '200'); // Added from OSSUpload example
    formData.append('x-oss-security-token', policy.securityToken);
    formData.append('file', file);

    await axios.post(policy.host, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Return the full URL of the uploaded file
    return `${policy.host}/${policy.key}`;
  };

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    
    setUploading(true);
    
    const newImages: ImageItem[] = [];
    const failedUploads: string[] = [];
    
    try {
      // Process each file in sequence to avoid race conditions
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fileName = file.name;
        
        try {
          // Get OSS upload policy from backend
          const policy = await getUploadPolicy(fileName);
          
          // Get the actual File object from our Map
          const actualFile = fileObjects.get(file.uid);
          
          // Check if we have the actual File object
          if (!actualFile) {
            console.error(`File object is missing for ${fileName}`);
            failedUploads.push(fileName);
            continue;
          }
          
          // Upload directly to OSS using our stored File object
          const fileUrl = await uploadToOSS(actualFile, policy);
          
          // Add successfully uploaded image to the list
          newImages.push({
            id: `new-${Date.now()}-${i}`,
            url: fileUrl,
            filename: fileName,
            uploadTime: new Date().toLocaleString()
          });
          
        } catch (error) {
          console.error(`Failed to upload ${fileName}:`, error);
          failedUploads.push(fileName);
        }
      }
      
      if (newImages.length > 0) {
        setImages(prev => [...newImages, ...prev]);
        message.success(`成功上传 ${newImages.length} 个文件`);
      }
      
      if (failedUploads.length > 0) {
        message.error(`${failedUploads.length} 个文件上传失败: ${failedUploads.join(', ')}`);
      }
      
    } catch (error) {
      message.error('上传过程中发生错误');
      console.error('Upload error:', error);
    } finally {
      setFileList([]);
      setFileObjects(new Map()); // Clear file objects as well
      setUploading(false);
    }
  };

  const handlePreview = (image: ImageItem) => {
    setPreviewImage(image.url);
    setPreviewTitle(image.filename);
    setPreviewOpen(true);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => message.success('链接已复制到剪贴板'))
      .catch(() => message.error('复制失败，请手动复制'));
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定要删除这张图片吗?',
      content: '删除后将无法恢复',
      onOk() {
        // In a real app, you'd delete from your server here
        setImages(images.filter(img => img.id !== id));
        message.success('删除成功');
      }
    });
  };

  const uploadProps: UploadProps = {
    onRemove: file => {
      setFileList(fileList.filter(f => f.uid !== file.uid));
      // Also remove from our file objects map
      setFileObjects(prevMap => {
        const newMap = new Map(prevMap);
        newMap.delete(file.uid);
        return newMap;
      });
    },
    beforeUpload: file => {
      // Store the UploadFile in fileList
      setFileList(prev => [...prev, file as UploadFile]);
      
      // Store the actual File object in our Map using the UID as key
      setFileObjects(prevMap => {
        const newMap = new Map(prevMap);
        newMap.set(file.uid, file);
        return newMap;
      });
      
      return false;
    },
    fileList,
    multiple: true,
    accept: 'image/*'
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2}>个人图床</Title>
      <Text type="secondary">上传、管理和分享您的图片</Text>
      
      <Card style={{ marginTop: 24 }}>
        <Upload {...uploadProps} listType="picture">
          <Button icon={<UploadOutlined />}>选择图片</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? '上传中' : '开始上传'}
        </Button>
      </Card>
      
      <Title level={4} style={{ marginTop: 24 }}>我的图片</Title>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {images.map(image => (
            <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
              <Card
                hoverable
                cover={
                  <img 
                    alt={image.filename}
                    src={image.url}
                    style={{ height: 180, objectFit: 'cover' }}
                    onClick={() => handlePreview(image)}
                  />
                }
                actions={[
                  <CopyOutlined key="copy" onClick={() => handleCopyUrl(image.url)} />,
                  <DeleteOutlined key="delete" onClick={() => handleDelete(image.id)} />
                ]}
              >
                <Card.Meta
                  title={image.filename}
                  description={image.uploadTime}
                />
                <TextArea
                  value={image.url}
                  size="small"
                  style={{ marginTop: 8, fontSize: 12 }}
                  autoSize={{ minRows: 1, maxRows: 2 }}
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  readOnly
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ImageHosting;
