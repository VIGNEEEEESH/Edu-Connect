import React, { useContext, useEffect, useState,useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { NavLink } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Modal } from "antd";
import { AuthContext } from "../../Shared/Context/Auth-context";
import image from "../Components/images/White Wifi Icon Computer Logo.png";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";

function Navbar() {
  const [click, setClick] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Add dropdown visibility state
  const auth = useContext(AuthContext);
  const[admins,setAdmins]=useState([])
  const [loadedDetails, setLoadedDetails] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleLogoutConfirmed = () => {
    setLogoutModalVisible(false);
    auth.logout();
  };

  const handleLogoutCanceled = () => {
    setLogoutModalVisible(false);
  };
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/joshua/authentication/admin/get/adminIds"
        );
        setAdmins(responseData.admins);
 

      } catch (err) {}
    };
    fetchAdmins();

  }, [sendRequest]);

  const dropdownRef = useRef(null); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const menu = (
    <Menu>
      
      <Menu.Item key="study-material">
        <Link to="/StudyMaterialsClass">Study Material</Link>
      </Menu.Item>
      <Menu.Item key="discussion-forum">
        <Link to="/DiscussionForumClass">Discussion Forum</Link>
      </Menu.Item>
      {/* <Menu.ItemGroup key="games" title="Games">
      <Menu.Item key="simple-math">
        <Link to="/MathGame">Simple Math</Link>
      </Menu.Item>
      <Menu.Item key="quiz">
        <Link to="/QuizHome">Quiz</Link>
      </Menu.Item>
    </Menu.ItemGroup> */}
      <Menu.Item key="games" title="Games">
      
        <Link to="/Games">Games</Link>
      
      
    </Menu.Item>
    {admins.some(admin => admin._id === auth.userId) 
 && <Menu.Item key="admin">
            <Link to="/admin">Admin</Link>
          </Menu.Item>}
        

      {auth.isLoggedIn && (
        <>
          <Menu.Item key="attendance">
            <Link to="/AttendanceClass">Attendance</Link>
          </Menu.Item>
          <Menu.Item key="attendanceReport">
            <Link to="/AttendanceReportClass">Attendance Report</Link>
          </Menu.Item>
          <Menu.Item key="grades">
            <Link to="/GradingClass">Grades</Link>
          </Menu.Item>
          <Menu.Item key="performance">
            <Link to="/PerformanceClass">Performance</Link>
          </Menu.Item>
        </>
      )}
      {!auth.isLoggedIn && (
        <>
          <Menu.Item key="admin-login">
            <Link to="/adminLogin">Admin Login</Link>
          </Menu.Item>
          <Menu.Item key="teacher-login">
            <Link to="/TeacherLogin">Teacher Login</Link>
          </Menu.Item>
          <Menu.Item key="signup">
            <Link to="/signupClass">Signup</Link>
          </Menu.Item>
        </>
      )}
      {/* {auth.isLoggedIn && (
        <>
          
          <Menu.Item key="logout" onClick={handleLogout}>
            Log-Out
          </Menu.Item>
        </>
      )} */}
    </Menu>
  );

 

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

  const { image,schoolName } = loadedDetails;

  return (
    <div>
      <IconContext.Provider value={{ color: "#fff" }}>
        <nav className="navbar">
          <div className="navbar-container container">
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
              <img
                src={`${process.env.REACT_APP_ASSET_URL}/${image}`}
                height="90%"
                alt="Logo"
              />&nbsp;&nbsp; <h5 style={{fontFamily:"courier,courier new"}}>{schoolName}</h5>
            </Link>
            
            <div className="menu-icon" onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </div>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/Admission"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Admission
                </NavLink>
              </li>
              <li className="nav-item">
                <div
                  className={`dropdown-trigger ${
                    dropdownVisible ? "active" : ""
                  }`}
                  onClick={() => setDropdownVisible(!dropdownVisible)} ref={dropdownRef}
                >
                  <span  className="nav-links more">
                    More
                    <DownOutlined />
                  </span>
                </div>
                {dropdownVisible && ( 
                  <div className="dropdown-menu">
                    <Dropdown overlay={menu} trigger={[]} visible>
                      <a
                        className="ant-dropdown-link"
                        onClick={(e) => e.preventDefault()}
                      />
                    </Dropdown>
                  </div>
                )}
              </li>
            {auth.isLoggedIn &&  <li className="nav-item">
                <NavLink
                  
                  className="nav-links"
                  onClick={handleLogout}
                >
                  Log&nbsp;Out
                </NavLink>
              </li>}
            </ul>
          </div>
        </nav>
      </IconContext.Provider>
      <Modal
        visible={logoutModalVisible}
        title="Confirmation"
        onCancel={handleLogoutCanceled}
        onOk={handleLogoutConfirmed}
        okText="Logout"
        cancelText="Cancel"
        className="logoutModel"
        width="90%"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
}

export default Navbar;