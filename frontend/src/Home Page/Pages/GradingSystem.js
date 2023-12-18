import { message } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Shared/Context/Auth-context";
import { useForm } from "../../Shared/Hooks/form-hook";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import "./GradingSystem.css";

const GradingSystem = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [maxMarks, setMaxMarks] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { classNumber } = useParams();
  const navigate = useNavigate();

  const attendanceDate = new Date();
  const formattedDate = moment(attendanceDate).format("DD-MM-YYYY");
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/students/get/class/${classNumber}`
        );
        const sortedStudents = responseData.students.sort((a, b) =>
          a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })
        );

        setStudents(sortedStudents);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStudents();
  }, [classNumber, sendRequest]);

  const handleAddSubject = () => {
    const newSubject = "";
    setSubjects([...subjects, newSubject]);
    setMaxMarks({ ...maxMarks, [newSubject]: 100 });
  };

  const handleDeleteSubject = (subject) => {
    const updatedSubjects = subjects.filter((item) => item !== subject);
    setSubjects(updatedSubjects);

    const updatedMaxMarks = { ...maxMarks };
    delete updatedMaxMarks[subject];
    setMaxMarks(updatedMaxMarks);
  };

  const handleSubjectChange = (index, event) => {
    const { value } = event.target;
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = value;
    setSubjects(updatedSubjects);
  };

  const handleMaxMarksChange = (subject, event) => {
    const { value } = event.target;
    const updatedMaxMarks = { ...maxMarks };
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      updatedMaxMarks[subject] = parsedValue;
    }
    setMaxMarks(updatedMaxMarks);
  };

  const calculateTotalMarks = (student) => {
    let total = 0;
    subjects.forEach((subject) => {
      const mark = parseInt(student[subject]) || 0;
      total += mark;
    });
    return total;
  };

  const calculatePercentage = (student) => {
    let totalMarks = calculateTotalMarks(student);
    let totalMaxMarks = 0;

    subjects.forEach((subject) => {
      totalMaxMarks += maxMarks[subject] || 0;
    });

    let percentage = 0;
    if (totalMaxMarks !== 0) {
      percentage = (totalMarks / totalMaxMarks) * 100;
    }

    return percentage.toFixed(2);
  };
  const [examName, setExamName] = useState("");

  const consolee = (event) => {
    setExamName(event.target.value);
  };
  const auth = useContext(AuthContext);

  const gradingSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs.examName.value);
    const formattedExamName = `${classNumber}-${examName}-${formattedDate}`;
    try {
      if (!examName) {
        message.error("Enter the exam name");
        return;
      }

      const gradingData = students.map((student) => ({
        student: student._id,
        studentName: student.studentName,
        rollNumber: student.rollNumber,
        examName: formattedExamName,
        classNumber: classNumber,
        subjects: subjects.map((subject) => ({
          subjectName: subject,
          maxMarks: maxMarks[subject] || 0,
          marksObtained: parseInt(student[subject]) || 0,
        })),
        totalMarks: calculateTotalMarks(student),
        percentage: calculatePercentage(student),
      }));

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/grading/add/multiple",
        "POST",
        JSON.stringify({ gradingData }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      message.success("Marks are successfully uploaded");
    } catch (err) {
      console.log(err);
    }
  };

  const [formState, inputHandler] = useForm(
    {
      examName: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  return (
    <div className="GradingSystem">
      <h2>Grading System</h2>
      <center>
        <h3>Date:{formattedDate}</h3>
      </center>
      <form onSubmit={gradingSubmitHandler}>
        <center>
          {" "}
          <div>
            <label htmlFor="examName">Exam Name:</label> &nbsp;
            <input
              type="text"
              id="examName"
              name="examName"
              onChange={inputHandler}
              onInput={consolee}
            />
            <br />
            <br />
          </div>
        </center>
        <button className="button" onClick={handleAddSubject}>
          Add Subject
        </button>
        {subjects.length > 0 && (
          <div>
            <p>Subjects:</p>
            {subjects.map((subject, index) => (
              <div key={index}>
                <input
                  type="text"
                  className="input-text"
                  placeholder="Subject Name"
                  value={subject}
                  onChange={(event) => handleSubjectChange(index, event)}
                />
                <input
                  type="number"
                  className="input-number"
                  placeholder="Max Marks"
                  min={0}
                  value={maxMarks[subject] || 0}
                  onChange={(event) => handleMaxMarksChange(subject, event)}
                />
                <button onClick={() => handleDeleteSubject(subject)}>
                  Delete
                </button>
                <br />
                <br />
              </div>
            ))}
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll No</th>
              {subjects.map((subject, subjectIndex) => (
                <th key={subjectIndex}>{subject}</th>
              ))}
              <th>Total Marks</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, studentIndex) => (
              <tr key={studentIndex}>
                <td>{student.studentName}</td>
                <td>{student.rollNumber}</td>
                {subjects.map((subject, subjectIndex) => (
                  <td key={subjectIndex}>
                    <input
                      type="number"
                      className="input-number"
                      placeholder={`Max: ${maxMarks[subject]}`}
                      min={0}
                      max={maxMarks[subject] || 0}
                      value={student[subject] || ""}
                      onChange={(event) => {
                        const enteredMarks = event.target.value;
                        if (
                          enteredMarks === "" ||
                          (Number(enteredMarks) >= 0 &&
                            Number(enteredMarks) <= maxMarks[subject])
                        ) {
                          const updatedStudents = [...students];
                          updatedStudents[studentIndex][subject] = enteredMarks;
                          setStudents(updatedStudents);
                        } else {
                          message.error(
                            `Marks should be between 0 and ${maxMarks[subject]}`
                          );
                        }
                      }}
                    />
                  </td>
                ))}
                <td>{calculateTotalMarks(student)}</td>
                <td>{calculatePercentage(student)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <br />
        <center>
          {" "}
          <button type="submit" className="submit">
            Submit
          </button>
        </center>
      </form>
    </div>
  );
};

export default GradingSystem;
