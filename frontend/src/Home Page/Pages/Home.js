import React from "react";
import Navbar from "../Components/Navbar.js";
import Missviss from "../Components/Missviss.js";
import Box from "../Components/Box.js";
import Footer from "../Components/Footer.js";
import Picture from "../Components/Picture.js";
import Admissionbar from "../Components/Admissionbar.js";
import EventGallery from "../Components/EventGallery.js";

const Home = () => {
  const homeStyles = {
    backgroundColor: "rgb(172,172,172,0.4)",
  };

  return (
    <div className="Home" style={homeStyles}>
      <Admissionbar />
      <Box />
      <Missviss />
      <Picture />
      <EventGallery />
      
    </div>
  );
};

export default Home;
