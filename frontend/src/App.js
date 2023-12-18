import React, { useCallback, useEffect, useState, Suspense } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./Home Page/Components/global.css";
import { AuthContext } from "./Shared/Context/Auth-context";
import { useAuth } from "./Shared/Hooks/auth-hook";
import axios from "axios";
import { FloatButton } from "antd";
import Home from "./Home Page/Pages/Home";
// import About from "./Home Page/Pages/About";
// import Service from "./Home Page/Pages/Service";
// import Contact from "./Home Page/Pages/Contact";
// import AddTeacher from "./Home Page/Pages/AddTeacher";
// import Attendance from "./Home Page/Pages/Attendance";
// import AddStudent from "./Home Page/Pages/AddStudent";
// import AddEvent from "./Home Page/Pages/AddEvent";
// import AddSchoolDetails from "./Home Page/Pages/AddSchoolDetails";
// import AddAdmission from "./Home Page/Pages/AddAdmission";
// import AddPicture from "./Home Page/Pages/AddPicture";
import Navbar from "./Home Page/Components/Navbar";
// import Login from "./Home Page/Pages/Login";
// import Signup from "./Home Page/Pages/Signup";
// import Admin from "./Home Page/Pages/Admin";
// import GETeachers from "./Home Page/Pages/GETeacher";
// import GEStudent from "./Home Page/Pages/GEStudent";
// import GEEvent from "./Home Page/Pages/GEEvent";
// import GEAdmission from "./Home Page/Pages/GEAdmission";
// import EditTeacher from "./Home Page/Pages/EditTeacher";
// import EditStudent from "./Home Page/Pages/EditStudent";
// import EditEvent from "./Home Page/Pages/EditEvent";
// import EditSchoolDetails from "./Home Page/Pages/EditSchoolDetails";
// import EditAdmission from "./Home Page/Pages/EditAdmission";
// import DeleteTeacher from "./Home Page/Pages/DeleteTeacher";
// import DeleteStudent from "./Home Page/Pages/DeleteStudent";
// import DeleteEvent from "./Home Page/Pages/DeleteEvent";
// import NewAdmission from "./Home Page/Pages/NewAdmission";
// import AttendMarks from "./Home Page/Pages/AttendMarks";
// import DocumentUpload from "./Home Page/Pages/DocumentUpload";
// import Student from "./Home Page/Pages/Student";
// import TeacherLogin from "./Home Page/Pages/TeacherLogin";
// import DeletePicture from "./Home Page/Pages/DeletePicture";
// import AttendanceClass from "./Home Page/Pages/AttendanceClass";
// import GradingSystem from "./Home Page/Pages/GradingSystem";
// import GradingClass from "./Home Page/Pages/GradingClass";
// import PerformancePage from "./Home Page/Pages/PerformancePage";
// import PerformanceClass from "./Home Page/Pages/PerformanceClass";
// import StudyMaterialsClass from "./Home Page/Pages/StudyMaterialsClass";
// import DiscussionForumClass from "./Home Page/Pages/DiscussionForumClass";
// import DiscussionForum from "./Home Page/Pages/DiscussionForum";
// import ViewTeacher from "./Home Page/Pages/ViewTeacher";
// import MathApp from "./Home Page/Math Game/MathApp";
// import Result from "./Home Page/Quiz/Pages/Result/Result";
// import QuizHome from "./Home Page/Quiz/Pages/Home/QuizHome"
// import Quiz from "./Home Page/Quiz/Pages/Quiz/Quiz"
// import ViewStudent from "./Home Page/Pages/ViewStudent";
// import ViewEvent from "./Home Page/Pages/ViewEvent";
// import ViewAdmission from "./Home Page/Pages/ViewAdmission";
// import ViewStudyMaterialsClass from "./Home Page/Pages/ViewStudyMaterialClass";
// import ViewStudyMaterial from "./Home Page/Pages/ViewStudyMaterial";
// import AttendanceReportClass from "./Home Page/Pages/AttendanceReportClass";
// import AttendanceReport from "./Home Page/Pages/AttendanceReport";
// import SignupClass from "./Home Page/Pages/SignupClass";
// import DeleteAdmission from "./Home Page/Pages/DeleteAdmission";
// import Games from "./Home Page/Pages/Games";
import Footer from "./Home Page/Components/Footer";
import LoadingSpinner from "./Shared/Components/UIElements/LoadingSpinner";

// const Home=React.lazy(()=>import("./Home Page/Pages/Home"))
const About = React.lazy(() => import("./Home Page/Pages/About"));
const Service = React.lazy(() => import("./Home Page/Pages/Service"));
const Contact = React.lazy(() => import("./Home Page/Pages/Contact"));
const AddTeacher = React.lazy(() => import("./Home Page/Pages/AddTeacher"));
const Attendance = React.lazy(() => import("./Home Page/Pages/Attendance"));
// const Navbar=React.lazy(()=>import("./Home Page/Components/Navbar"))
const Login = React.lazy(() => import("./Home Page/Pages/Login"));
const Signup = React.lazy(() => import("./Home Page/Pages/Signup"));
const Admin = React.lazy(() => import("./Home Page/Pages/Admin"));
const AddStudent = React.lazy(() => import("./Home Page/Pages/AddStudent"));
const AddEvent = React.lazy(() => import("./Home Page/Pages/AddEvent"));
const EditTeacher = React.lazy(() => import("./Home Page/Pages/EditTeacher"));
const GETeachers = React.lazy(() => import("./Home Page/Pages/GETeacher"));
const GEStudent = React.lazy(() => import("./Home Page/Pages/GEStudent"));
const GEEvent = React.lazy(() => import("./Home Page/Pages/GEEvent"));
const EditStudent = React.lazy(() => import("./Home Page/Pages/EditStudent"));
const EditEvent = React.lazy(() => import("./Home Page/Pages/EditEvent"));
const DeleteTeacher = React.lazy(() =>
  import("./Home Page/Pages/DeleteTeacher")
);
const DeleteStudent = React.lazy(() =>
  import("./Home Page/Pages/DeleteStudent")
);
const DeleteEvent = React.lazy(() => import("./Home Page/Pages/DeleteEvent"));
const AddSchoolDetails = React.lazy(() =>
  import("./Home Page/Pages/AddSchoolDetails")
);
const EditSchoolDetails = React.lazy(() =>
  import("./Home Page/Pages/EditSchoolDetails")
);
const AddAdmission = React.lazy(() => import("./Home Page/Pages/AddAdmission"));
const GEAdmission = React.lazy(() => import("./Home Page/Pages/GEAdmission"));
const EditAdmission = React.lazy(() =>
  import("./Home Page/Pages/EditAdmission")
);
const NewAdmission = React.lazy(() => import("./Home Page/Pages/NewAdmission"));
const AttendMarks = React.lazy(() => import("./Home Page/Pages/AttendMarks"));
const DocumentUpload = React.lazy(() =>
  import("./Home Page/Pages/DocumentUpload")
);
const Student = React.lazy(() => import("./Home Page/Pages/Student"));
const TeacherLogin = React.lazy(() => import("./Home Page/Pages/TeacherLogin"));
const AddPicture = React.lazy(() => import("./Home Page/Pages/AddPicture"));
const DeletePicture = React.lazy(() =>
  import("./Home Page/Pages/DeletePicture")
);
const AttendanceClass = React.lazy(() =>
  import("./Home Page/Pages/AttendanceClass")
);
const GradingSystem = React.lazy(() =>
  import("./Home Page/Pages/GradingSystem")
);
const GradingClass = React.lazy(() => import("./Home Page/Pages/GradingClass"));
const PerformancePage = React.lazy(() =>
  import("./Home Page/Pages/PerformancePage")
);
const PerformanceClass = React.lazy(() =>
  import("./Home Page/Pages/PerformanceClass")
);
const StudyMaterialsClass = React.lazy(() =>
  import("./Home Page/Pages/StudyMaterialsClass")
);
const DiscussionForumClass = React.lazy(() =>
  import("./Home Page/Pages/DiscussionForumClass")
);
const DiscussionForum = React.lazy(() =>
  import("./Home Page/Pages/DiscussionForum")
);
const ViewTeacher = React.lazy(() => import("./Home Page/Pages/ViewTeacher"));
const MathApp = React.lazy(() => import("./Home Page/Math Game/MathApp"));
const Result = React.lazy(() => import("./Home Page/Quiz/Pages/Result/Result"));
const QuizHome = React.lazy(() =>
  import("./Home Page/Quiz/Pages/Home/QuizHome")
);
const Quiz = React.lazy(() => import("./Home Page/Quiz/Pages/Quiz/Quiz"));
const ViewStudent = React.lazy(() => import("./Home Page/Pages/ViewStudent"));
const ViewEvent = React.lazy(() => import("./Home Page/Pages/ViewEvent"));
const ViewAdmission = React.lazy(() =>
  import("./Home Page/Pages/ViewAdmission")
);
const ViewStudyMaterialsClass = React.lazy(() =>
  import("./Home Page/Pages/ViewStudyMaterialClass")
);
const ViewStudyMaterial = React.lazy(() =>
  import("./Home Page/Pages/ViewStudyMaterial")
);
const AttendanceReportClass = React.lazy(() =>
  import("./Home Page/Pages/AttendanceReportClass")
);
const AttendanceReport = React.lazy(() =>
  import("./Home Page/Pages/AttendanceReport")
);
const SignupClass = React.lazy(() => import("./Home Page/Pages/SignupClass"));
const DeleteAdmission = React.lazy(() =>
  import("./Home Page/Pages/DeleteAdmission")
);
const Games = React.lazy(() => import("./Home Page/Pages/Games"));
// const Footer=React.lazy(()=>import("./Home Page/Components/Footer"))

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;
  const [questions, setQuestions] = useState();
  const [name, setName] = useState();
  const [score, setScore] = useState(0);
  const [passcodeVerified, setPasscodeVerified] = useState(false);

  const handlePasscodeVerified = () => {
    setPasscodeVerified(true);
  };

  const fetchQuestions = async (category = "", difficulty = "") => {
    const { data } = await axios.get(
      `https://opentdb.com/api.php?amount=10${
        category && `&category=${category}`
      }${difficulty && `&difficulty=${difficulty}`}&type=multiple`
    );

    setQuestions(data.results);
  };
  if (token) {
    routes = (
      <React.Fragment>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/about" element={<About />} exact />
          <Route path="/service" element={<Service />} exact />
          <Route path="/contact" element={<Contact />} exact />
          <Route path="/admin" element={<Admin />} exact />
          <Route path="/ViewTeacher" element={<ViewTeacher />} exact />
          <Route path="/ViewStudent" element={<ViewStudent />} exact />
          <Route path="/ViewEvent" element={<ViewEvent />} exact />
          <Route path="/ViewAdmission" element={<ViewAdmission />} exact />
          <Route
            path="/ViewStudyMaterialClass"
            element={<ViewStudyMaterialsClass />}
            exact
          />
          <Route
            path="/ViewStudyMaterial/:classNumber"
            element={<ViewStudyMaterial />}
            exact
          />
          <Route path="/AddTeacher" element={<AddTeacher />} exact />
          <Route path="/AddStudent" element={<AddStudent />} exact />
          <Route path="/AddEvent" element={<AddEvent />} exact />
          <Route
            path="/AddSchoolDetails"
            element={<AddSchoolDetails />}
            exact
          />
          <Route path="/AddAdmission" element={<AddAdmission />} exact />
          <Route path="/AddPicture" element={<AddPicture />} exact />
          <Route path="/GETeacher" element={<GETeachers />} exact />
          <Route path="/GEStudent" element={<GEStudent />} exact />
          <Route path="/GEEvent" element={<GEEvent />} exact />
          <Route path="/GEAdmission" element={<GEAdmission />} exact />
          <Route path="/EditTeacher/:email" element={<EditTeacher />} exact />
          <Route path="/EditStudent/:id" element={<EditStudent />} exact />
          <Route path="/EditEvent/:id" element={<EditEvent />} exact />
          <Route path="/EditAdmission/:id" element={<EditAdmission />} exact />
          <Route
            path="/EditSchoolDetails"
            element={<EditSchoolDetails />}
            exact
          />
          <Route path="/DeleteTeacher" element={<DeleteTeacher />} exact />
          <Route path="/DeleteStudent" element={<DeleteStudent />} exact />
          <Route path="/DeleteEvent" element={<DeleteEvent />} exact />
          <Route path="/DeleteAdmission" element={<DeleteAdmission />} exact />
          <Route path="/DeletePicture" element={<DeletePicture />} exact />
          <Route path="/Admission" element={<NewAdmission />} exact />
          <Route
            path="/AttendanceReportClass"
            element={<AttendanceReportClass />}
          />
          <Route
            path="/AttendanceReport/:classNumber/:startDate/:endDate"
            element={<AttendanceReport />}
          />
          <Route path="/Attendance/:classNumber" element={<Attendance />} />
          <Route path="/AttendanceClass" element={<AttendanceClass />} exact />
          <Route path="/attendanceMarks" element={<AttendMarks />} exact />
          <Route
            path="/DocumentUpload/:classNumber"
            element={<DocumentUpload />}
            exact
          />
          <Route
            path="/StudyMaterialsClass"
            element={<StudyMaterialsClass />}
            exact
          />
          <Route
            path="/Grades/:classNumber"
            element={<GradingSystem />}
            exact
          />
          <Route path="/GradingClass" element={<GradingClass />} exact />
          <Route
            path="/Performance/:classNumber/:examName"
            element={<PerformancePage />}
            exact
          />
          <Route
            path="/PerformanceClass"
            element={<PerformanceClass />}
            exact
          />
          <Route
            path="/DiscussionForumClass"
            element={<DiscussionForumClass />}
            exact
          />
          <Route
            path="/DiscussionForum/:classNumber"
            element={<DiscussionForum />}
            exact
          />
          <Route
            path="/QuizHome"
            element={
              <QuizHome
                name={name}
                setName={setName}
                fetchQuestions={fetchQuestions}
              />
            }
            exact
          />
          <Route
            path="/quiz"
            element={
              <Quiz
                name={name}
                questions={questions}
                score={score}
                setScore={setScore}
                setQuestions={setQuestions}
              />
            }
          />
          <Route
            path="/result"
            element={<Result name={name} score={score} />}
          />
          <Route path="/MathGame" element={<MathApp />} exact />

          <Route
            path="/QuizHome"
            element={
              <QuizHome
                name={name}
                setName={setName}
                fetchQuestions={fetchQuestions}
              />
            }
            exact
          />
          <Route
            path="/quiz"
            element={
              <Quiz
                name={name}
                questions={questions}
                score={score}
                setScore={setScore}
                setQuestions={setQuestions}
              />
            }
          />
          <Route
            path="/result"
            element={<Result name={name} score={score} />}
          />
          <Route path="/Games" element={<Games />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/about" element={<About />} exact />
          <Route path="/service" element={<Service />} exact />
          <Route path="/contact" element={<Contact />} exact />
          {passcodeVerified && (
            <Route path="/signupp" element={<Signup />} exact />
          )}

          <Route
            path="/signupClass"
            element={
              <SignupClass onPasscodeVerified={handlePasscodeVerified} />
            }
            exact
          />
          <Route path="/adminLogin" element={<Login />} exact />
          <Route path="/TeacherLogin" element={<TeacherLogin />} exact />
          <Route path="/Admission" element={<NewAdmission />} exact />
          <Route path="/Student" element={<Student />} exact />
          <Route
            path="/StudyMaterialsClass"
            element={<StudyMaterialsClass />}
            exact
          />
          <Route
            path="/DocumentUpload/:classNumber"
            element={<DocumentUpload />}
            exact
          />
          <Route
            path="/DiscussionForumClass"
            element={<DiscussionForumClass />}
            exact
          />
          <Route
            path="/DiscussionForum/:classNumber"
            element={<DiscussionForum />}
            exact
          />
          <Route path="/MathGame" element={<MathApp />} exact />

          <Route
            path="/QuizHome"
            element={
              <QuizHome
                name={name}
                setName={setName}
                fetchQuestions={fetchQuestions}
              />
            }
            exact
          />
          <Route
            path="/quiz"
            element={
              <Quiz
                name={name}
                questions={questions}
                score={score}
                setScore={setScore}
                setQuestions={setQuestions}
              />
            }
          />
          <Route
            path="/result"
            element={<Result name={name} score={score} />}
          />
          <Route path="/Games" element={<Games />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <main>
        <Suspense
          fallback={
            <div className="center">
              <LoadingSpinner />
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
      <FloatButton.BackTop />
    </AuthContext.Provider>
  );
};

export default App;
