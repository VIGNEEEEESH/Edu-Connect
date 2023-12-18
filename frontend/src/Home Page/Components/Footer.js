import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import "../Components/Footer.css";

const Footer = () => {
  const [loadedDetails, setLoadedDetails] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate=useNavigate()
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/joshua/details"
        );
        setLoadedDetails(responseData.details[0]);
      } catch (err) {
        
      }
    };

    fetchDetails();
  }, [sendRequest]);
  if (isLoading || !loadedDetails) {
    return (
      <div>
        <center>
          
        </center>
      </div>
    ); 
  }

  if (error) {
    return <div>Error: {error.message}</div>; 
  }
  const { schoolName,phoneNumber,mail,address } = loadedDetails;
  return (
    <div className="footer">
      <div className="sb_footer section_padding">
        <div className="sb_footer-links">
          <div className="sb_footer-links_div">
            <h1>{schoolName}</h1>
            <a href="/" style={{color:"white"}}><h3>Home</h3> </a>
            
          </div>
        </div>
        <hr></hr>
        <div className="sb_footer-below">
          <div className="sb_footer-copyright">
            <p> {address}</p>
          </div>
          <div className="sb_footer-below-links">
            <a href="/terms">
              <div>
                <p>{phoneNumber}</p>
              </div>
            </a>
            <a href="/terms">
              <div>
                <p>{mail}</p>
              </div>
            </a>
            <a href="/Admission">
              <div>
                <p >Admissions</p>
              </div>
            </a>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
