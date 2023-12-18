import "./DiscussionForum.css";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Shared/Context/Auth-context";
import { useForm } from "../../Shared/Hooks/form-hook";
import { useNavigate } from "react-router-dom";

import { VALIDATOR_REQUIRE } from "../../Shared/util/validators";
import Input from "../../Shared/Components/FormElements/Input";
import { Button, Image, message, Modal, Timeline } from "antd";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import TextArea from "antd/es/input/TextArea";
import Paragraph from "antd/es/typography/Paragraph";

const DiscussionForum = () => {
  const [posts, setPosts] = useState([]);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { classNumber } = useParams();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      subject: {
        value: "",
        isValid: false,
      },
      content: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
      replies: {
        value: [],
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/posts/get/class/${classNumber}`
        );
        setPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, classNumber]);

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("subject", formState.inputs.subject.value);
      formData.append("content", formState.inputs.content.value);

      if (formState.inputs.image.value) {
        formData.append("image", formState.inputs.image.value);
      }

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/post/${classNumber}`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      message.success("Question posted successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };
  const openModal = (event, post) => {
    setPostToDelete(post);
    setIsDeleteModalVisible(true);
  };

  const closeModal = () => {
    setPostToDelete(null);
    setIsDeleteModalVisible(false);
  };

  const handleDelete = async (post) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/delete/${post._id}`,
        "DELETE",
        null
      );

      closeModal();
      message.success("Post deleted successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteConfirmation = () => {
    if (postToDelete) {
      handleDelete(postToDelete);
    }
  };

  const handleReplySubmit = async (event, index) => {
    event.preventDefault();

    const replyValue = formState.inputs.replies.value[index];

    const updatedPosts = [...posts];

    updatedPosts[index].replies.push(replyValue);

    setPosts(updatedPosts);

    const requestData = {
      replies: updatedPosts[index].replies,
    };

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/post/${posts[index]._id}`,
        "PATCH",
        JSON.stringify(requestData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      message.success("Reply posted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleReplyChange = (event, index) => {
    const replyValue = event.target.value;

    const updatedReplies = [...formState.inputs.replies.value];
    updatedReplies[index] = replyValue;
    inputHandler("replies", updatedReplies);
  };

  return (
    <React.Fragment>
      <div className="discussion-forum">
        <div className="discussion-forum-content">
          <center>
            {" "}
            <h1 className="forum-title">&nbsp;Discussion Forum&nbsp;</h1>
          </center>
          <div className="discussion-forum-forms">
            <form onSubmit={handlePostSubmit} className="post-form">
              <Input
                id="subject"
                element="input"
                type="text"
                label="Subject"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid name"
                onInput={inputHandler}
              />
              <br />
              <Input
                id="content"
                element="textarea"
                label="Content"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid description"
                onInput={inputHandler}
              />
              <br />
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Please provide an image"
              />
              <br />

              <button type="submit" className="post-button">
                Post
              </button>
            </form>
          </div>

          <div className="post-list">
            {posts.map((post, index) => (
              <div key={index} className="post-item">
                <div className="post-header">
                  <span className="post-subject">
                    <p>Subject: {post.subject}</p>
                  </span>
                </div>
                Question:
                <br />
                <br />
                <Paragraph
                  style={{ fontSize: "large", fontWeight: "bold" }}
                  copyable
                >
                  {post.content}
                </Paragraph>
                {post.image && (
                  <Image
                    className="post-image"
                    style={{ width: "100%" }}
                    src={`${process.env.REACT_APP_ASSET_URL}/${post.image}`}
                  />
                )}
                <br />
                <br />
                Replies:
                <div className="replies">
                  <Timeline>
                    {post.replies.map((reply, replyIndex) => (
                      <Timeline.Item key={replyIndex}>
                        <p className="reply-content">{reply}</p>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
                <form
                  onSubmit={(event) => handleReplySubmit(event, index)}
                  className="reply-form"
                >
                  <TextArea
                    className="reply-input"
                    value={formState.inputs.replies.value[index] || ""}
                    onChange={(event) => handleReplyChange(event, index)}
                    placeholder="Write a reply..."
                    id={`replies-${index}`}
                  ></TextArea>
                  <button type="submit" className="reply-button">
                    Reply
                  </button>
                </form>
                <br />
                {auth.isLoggedIn && (
                  <Button onClick={(event) => openModal(event, post)}>
                    Delete
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {auth.isLoggedIn && (
        <Modal
          visible={isDeleteModalVisible}
          onCancel={closeModal}
          onOk={handleDeleteConfirmation}
          okText="Yes"
          cancelText="No"
        >
          <p>Are you sure you want to delete this post?</p>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default DiscussionForum;
