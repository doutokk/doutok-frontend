import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'link', 'image'
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const [editorValue, setEditorValue] = useState(value || '');

  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <ReactQuill 
      theme="snow" 
      value={editorValue}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder || "请输入内容..."}
      style={{ height: '200px', marginBottom: '40px' }}
    />
  );
};

export default RichTextEditor;
