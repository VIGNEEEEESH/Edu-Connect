import React, { useState, useEffect, useContext } from "react";
import { Upload, Button, List, Typography, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./DocumentUpload.css";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { AuthContext } from "../../Shared/Context/Auth-context";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const ViewStudyMaterial = () => {
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
        grid={{ gutter: 16, column: 4 }}
        renderItem={(file) => (
          <List.Item>
            <div className="document-box">
              <div className="document-heading">{file.fileName}</div>
              <div className="document-actions">
                &nbsp;
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
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
      <div className="upload-list">{renderUploadList()}</div>
    </div>
  );
};

export default ViewStudyMaterial;
