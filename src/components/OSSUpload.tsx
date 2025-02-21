import  { useEffect, useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Button, Form, message, Upload } from 'antd';
import axios from 'axios';

interface OSSDataType {
    dir: string;
    host: string;
    policy: string;
    security_token: string;
    signature: string;
    x_oss_credential: string;
    x_oss_date: string;
    x_oss_signature_version: string;
}

interface AliyunOSSUploadProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
}

export const AliyunOSSUpload = ({ value, onChange }: AliyunOSSUploadProps) => {
  const [OSSData, setOSSData] = useState<OSSDataType>();

  const mockGetOSSData =async () => {
    const r = await axios.get("http://127.0.0.1:8000/get_post_signature_for_oss_upload")
    console.log(r)
    return r.data
  };

  const init = async () => {
    try {
      const result = await mockGetOSSData();
      console.log(result);
      
      setOSSData(result);
    } catch (error) {
      message.error(error as string);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    console.log('Aliyun OSS:', fileList);
    onChange?.([...fileList]);
  };

  const onRemove = (file: UploadFile) => {
    const files = (value || []).filter((v) => v.url !== file.url);

    if (onChange) {
      onChange(files);
    }
  };

  const getExtraData: UploadProps['data'] = (file) => ({
    success_action_status: '200',
    policy: OSSData?.policy,
    "x-oss-signature": OSSData?.signature,
    "x-oss-signature-version": OSSData?.x_oss_signature_version,
    "x-oss-credential": OSSData?.x_oss_credential,
    "x-oss-date": OSSData?.x_oss_date,
    key: file.url,
    "x-oss-security-token": OSSData?.security_token,
    // OSSAccessKeyId: OSSData?.accessId,
    // Signature: OSSData?.signature,
  });

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!OSSData) return false;

    const expire = Number(OSSData.expire) * 1000;

    if (expire < Date.now()) {
      await init();
    }

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.url = OSSData.dir + filename;

    return file;
  };

  const uploadProps: UploadProps = {
    name: 'file',
    fileList: value,
    action: OSSData?.host,
    onChange: handleChange,
    onRemove,
    data: getExtraData,
    beforeUpload,
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};