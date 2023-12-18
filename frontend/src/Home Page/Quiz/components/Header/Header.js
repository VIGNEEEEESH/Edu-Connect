import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="Quizheader">
      <Link to="/QuizHome" className="title">
        Quiz
      </Link>
      <hr className="divider" />
    </div>
  );
};

export default Header;
