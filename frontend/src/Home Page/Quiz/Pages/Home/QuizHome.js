import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Categories from "../../Data/Categories";
import "./QuizHome.css";
import quiz from "../../../Components/images/quiz.svg";
import ques from "../../../Components/images/ques.jpg";
import Header from "../../components/Header/Header";
import { Button, Input, Select } from "antd";

const { Option } = Select;

const QuizHome = ({ name, setName, fetchQuestions }) => {
  // const containerStyle = {
  //   backgroundImage: `url(${ques})`,
  //   backgroundSize: "cover",
  //   backgroundPosition: "center",
  //   backgroundRepeat: "no-repeat",
    
  // };

  const [category, setCategory] = useState();
  const [difficulty, setDifficulty] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!category || !difficulty || !name) {
      setError(true);
      return;
    } else {
      setError(false);
      fetchQuestions(category, difficulty);
      navigate("/quiz");
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  return (
    <React.Fragment>
      <Header  />
      <div className="content" >
        <div className="settings">
          <span style={{ fontSize: 30 }}>Quiz Settings</span>
          <div className="settings__select">
            {error && <ErrorMessage>Please Fill all the fields</ErrorMessage>}
          Name: <br/><br/> <Input
              size="large"
              style={{ marginBottom: 25 }}
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            Category:<br/><br/>
            <Select
            size="large"
              placeholder="Select Category"
              value={category}
              onChange={handleCategoryChange}
              style={{ marginBottom: 30 }}
            >
              {Categories.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  {cat.category}
                </Option>
              ))}
            </Select>
            Difficulty:<br/><br/>
            <Select
            size="large"
              placeholder="Select Difficulty"
              value={difficulty}
              onChange={setDifficulty}
              style={{ marginBottom: 30 }}
            >
              <Option key="easy" value="easy">
                Easy
              </Option>
              <Option key="medium" value="medium">
                Medium
              </Option>
              <Option key="hard" value="hard">
                Hard
              </Option>
            </Select>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              className="Button"
            >
              Start Quiz
            </Button>
          </div>
        </div>
        <img src={quiz} className="banner" alt="quiz app" />
      </div>
    </React.Fragment>
  );
};

export default QuizHome;
