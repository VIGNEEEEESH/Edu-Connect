import { Image } from "antd";
import React, { useEffect, useState } from "react";
import Avatar from "../../Shared/Components/UIElements/Avatar";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import "../Components/Picture.css";

function Picture() {
  const [pictures, setPictures] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/gallery/get"
        );
        setPictures(responseData.images);
      } catch (err) {}
    };
    fetchImages();
  }, [sendRequest]);

  return (
    <div className="photo-gallery">
      
      <div className="gallery">
        {pictures.map((image) => (
          <div className="photo" key={image.id}>
            <Image className="Image" src={`${process.env.REACT_APP_ASSET_URL}/${image.image}`} alt={image._id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Picture;
