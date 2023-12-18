import { useEffect, useState } from "react";
import { useHttpClient } from "./http-hook";

const useLogoImage = () => {
  const { sendRequest } = useHttpClient();
  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    const fetchLogoImage = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/joshua/details"
        );
        const fetchedLogoImage = responseData.details[0].image;
        setLogoImage(fetchedLogoImage);
      } catch (err) {
        // Handle error
        console.error("Error fetching logo image:", err);
      }
    };

    fetchLogoImage();
  }, [sendRequest]);

  return logoImage;
};

export default useLogoImage;
