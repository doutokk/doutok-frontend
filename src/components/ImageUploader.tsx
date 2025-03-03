import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';
import http from '../utils/http';

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

interface ImageUploaderProps {
  onUploadSuccess: (imageUrl: string) => void;
  maxCount?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUploadSuccess, 
  maxCount = 1 
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileObjects, setFileObjects] = useState<Map<string, File>>(new Map());
  const [uploading, setUploading] = useState(false);

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
    formData.append('success_action_status', '200');
    formData.append('x-oss-security-token', policy.securityToken);
    formData.append('file', file);

    await axios.post(policy.host, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return `${policy.host}/${policy.key}`;
  };

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    
    setUploading(true);
    
    try {
      const file = fileList[0];
      const fileName = file.name;
      
      const policy = await getUploadPolicy(fileName);
      const actualFile = fileObjects.get(file.uid);
      
      if (!actualFile) {
        console.error(`File object is missing for ${fileName}`);
        message.error(`上传失败: ${fileName}`);
        setUploading(false);
        return;
      }
      
      const fileUrl = await uploadToOSS(actualFile, policy);
      onUploadSuccess(fileUrl);
      
      message.success(`图片上传成功`);
      
    } catch (error) {
      message.error('上传过程中发生错误');
      console.error('Upload error:', error);
    } finally {
      setFileList([]);
      setFileObjects(new Map());
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    onRemove: file => {
      setFileList(fileList.filter(f => f.uid !== file.uid));
      setFileObjects(prevMap => {
        const newMap = new Map(prevMap);
        newMap.delete(file.uid);
        return newMap;
      });
    },
    beforeUpload: file => {
      setFileList(prev => maxCount === 1 ? [file as UploadFile] : [...prev, file as UploadFile]);
      
      setFileObjects(prevMap => {
        const newMap = new Map(prevMap);
        newMap.set(file.uid, file);
        return newMap;
      });
      
      return false;
    },
    fileList,
    listType: "picture",
    maxCount,
    accept: 'image/*'
  };

  return (
    <div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>选择图片</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 8 }}
      >
        {uploading ? '上传中' : '上传图片'}
      </Button>
    </div>
  );
};

export default ImageUploader;
