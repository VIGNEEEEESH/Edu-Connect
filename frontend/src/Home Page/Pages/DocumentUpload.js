import React, { useState, useEffect, useContext } from "react";
import { Upload, Button, List, Typography, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./DocumentUpload.css";
import { DownloadOutlined, FileAddOutlined } from "@ant-design/icons";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { AuthContext } from "../../Shared/Context/Auth-context";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const DocumentUpload = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [documents, setDocuments] = useState([]);
  const { classNumber } = useParams();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/joshua/document/studymaterial/files/classNumber/${classNumber}`,
          "GET"
        );
        setDocuments(responseData.files);
      } catch (err) {
        // Handle error
        message.error("Failed to fetch documents");
      }
    };

    fetchDocuments();
  }, [sendRequest, classNumber]);

  const handleUpload = async (file) => {
    // Create a new FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name); // Include the file name in the form data

    try {
      // Send the file and file name to the backend
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/joshua/document/studymaterial/add/${classNumber}`,
        "POST",
        formData
      );

      setDocuments([...documents, responseData.file]);
      message.success("File uploaded successfully");
    } catch (err) {
      // Handle error
      message.error("File upload failed");
    }
  };

  const handleDelete = async (file) => {
    // Remove deleted file from the documents list
    const updatedDocuments = documents.filter((doc) => doc._id !== file._id);
    setDocuments(updatedDocuments);

    try {
      // Delete the file from the backend
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/joshua/document/studymaterial/files/${file._id}`,
        "DELETE"
      );
      message.success("File deleted successfully");
    } catch (err) {
      message.error("File deletion failed");
    }
  };

  const handleDownload = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = "file"; // Set the desired filename here
    link.click();
  };

  const renderUploadList = () => {
    return (
      <List
        dataSource={documents}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        renderItem={(file) => (
          <List.Item>
            <div className="document-box">
              <div className="document-heading">{file.fileName}</div>
              <div className="document-actions">
                {auth.isLoggedIn && (
                  <Button
                    type="primary"
                    icon={<DeleteOutlined />}
                    shape="circle"
                    onClick={() => handleDelete(file)}
                  />
                )}
                &nbsp;
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  shape="circle"
                  onClick={() =>
                    handleDownload(`${process.env.REACT_APP_ASSET_URL}/${file.file}`)
                  }
                />
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };
  return (
    <div className="aa">
      {auth.isLoggedIn && (
        <Upload.Dragger
          beforeUpload={() => false}
          fileList={[]}
          onChange={({ file }) => handleUpload(file)}
        >
          <p className="ant-upload-drag-icon">
            <FileAddOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag files to this area to upload
          </p>
        </Upload.Dragger>
      )}

      <div className="upload-list">{renderUploadList()}</div>
    </div>
  );
};

export default DocumentUpload;
