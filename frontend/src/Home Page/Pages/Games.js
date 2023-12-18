import { Avatar, Button, Card } from "antd";
import React from "react";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import "./Games.css";
import MathGame from "../Components/images/MathGame.jpeg"
import QuizGame from "../Components/images/QuizGame.jpeg"
import { useNavigate } from "react-router-dom";
const Games = () => {
    const navigate=useNavigate()
  return (
    <div className="Games">
    <div className="card-container">
      <Card
        className="card"
        cover={<img alt="example" src={MathGame} />}
        actions={[
            <Button danger type="primary"  onClick={()=>{navigate("/MathGame")}}>Play</Button>

        ]}
      >
        <Meta
          
          title="Math Game"
          description="Are you ready to put your math skills to the ultimate test? "
          className="card-meta"
        />
      </Card>
      <Card
        className="card"
        cover={<img alt="example" src={QuizGame} />}
        actions={[
          <Button danger type="primary" onClick={()=>{navigate("/QuizHome")}}>Play</Button>
        ]}
      >
        <Meta
         
          title="Card title"
          description="This Quiz is an engaging and educational quiz game designed to challenge your knowledge on a wide range of topics."
          className="card-meta"
        />
      </Card>
    </div>
    </div>
  );
};

export default Games;
