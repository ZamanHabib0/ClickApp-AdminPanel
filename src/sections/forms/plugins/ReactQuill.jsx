import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ReactQuillDemo = ({ termsandCondition, setTermsandCondition }) => {
  const handleChange = (value) => {
    setTermsandCondition(value);
  };

  return <ReactQuill value={termsandCondition} onChange={handleChange} />;
};

export default ReactQuillDemo;
