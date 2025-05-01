"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  Table,
  Tag,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Progress,
  Form,
  Radio,
  Divider,
  Statistic,
  message,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Calculator from "@/app/component/calculator";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const { Title, Text } = Typography;
const { Option } = Select;
const { Countdown } = Statistic;

export default function AllExams() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState(0);
  const certificateRef = useRef(null);

  // Fetch exams with questions
  const fetchExams = async () => {
    setLoading(true);
    try {
      const examsResponse = await fetch("/api/exams");
      const examsData = await examsResponse.json();

      const examsWithQuestions = await Promise.all(
        examsData.map(async (exam) => {
          const questionsResponse = await fetch(
            `/api/questions?examId=${exam.id}`
          );
          const questionsData = await questionsResponse.json();
          return { ...exam, questions: questionsData };
        })
      );

      setExams(examsWithQuestions);
      setFilteredExams(examsWithQuestions);
    } catch (error) {
      message.error("Failed to load exams");
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Filter exams
  useEffect(() => {
    let result = exams;

    if (searchText) {
      result = result.filter(
        (exam) =>
          exam.subject.toLowerCase().includes(searchText.toLowerCase()) ||
          exam.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (difficultyFilter !== "all") {
      result = result.filter((exam) =>
        exam.questions?.some((q) => q.difficulty === difficultyFilter)
      );
    }

    setFilteredExams(result);
  }, [searchText, difficultyFilter, exams]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && examStarted) {
      finishExam();
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const startExam = (exam) => {
    if (!exam.questions || exam.questions.length === 0) {
      message.warning("This exam has no questions yet");
      return;
    }

    setSelectedExam(exam);
    setTimeLeft(exam.duration * 60);
    setAnswers(new Array(exam.questions.length).fill(null));
    setCurrentQuestion(0);
    setExamStarted(true);
    setExamFinished(false);
    setScore(0);
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedExam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishExam = () => {
    let correct = 0;
    selectedExam.questions.forEach((question, index) => {
      if (answers[index] === question.correctOption) {
        correct++;
      }
    });
    setScore(correct);
    setExamFinished(true);
    setExamStarted(false);
  };

  const resetExam = () => {
    setSelectedExam(null);
    setExamStarted(false);
    setExamFinished(false);
  };

  // In your certificate generation code, modify the styles:
const downloadCertificate = async () => {
  try {
    message.loading({ content: 'Generating certificate...', key: 'cert', duration: 0 });
    
    // Create a clone of the certificate element with simplified colors
    const input = certificateRef.current;
    const clone = input.cloneNode(true);
    
    // Replace oklch colors with hex/rgb
    clone.querySelectorAll('*').forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.background.includes('oklch')) {
        el.style.background = '#f8f9fa'; // Replace with your fallback color
      }
      if (styles.color.includes('oklch')) {
        el.style.color = '#212529'; // Replace with your fallback color
      }
    });

    document.body.appendChild(clone);
    const canvas = await html2canvas(clone, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: null,
    });
    document.body.removeChild(clone);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Certificate_${selectedExam.subject}_${new Date().toISOString().slice(0, 10)}.pdf`);
    
    message.success({ content: 'Certificate downloaded!', key: 'cert', duration: 2 });
  } catch (error) {
    message.error({ content: 'Failed to generate certificate', key: 'cert', duration: 2 });
    console.error('Certificate generation error:', error);
  }
};

  const columns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "—",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => `${duration} minutes`,
    },
    {
      title: "Questions",
      key: "questions",
      render: (_, exam) => exam.questions?.length || 0,
    },
    {
      title: "Action",
      key: "action",
      render: (_, exam) => (
        <Button
          type="primary"
          onClick={() => startExam(exam)}
          disabled={!exam.questions || exam.questions.length === 0}
        >
          Start Exam
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50" style={{ padding: "24px", minHeight: "100vh" }}>
      {!selectedExam ? (
        <>
          <Title level={2}>Available Exams</Title>

          <Space style={{ marginBottom: 24, width: "100%" }} direction="vertical">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:items-center sm:justify-between">
              <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                <Input
                  placeholder="Search exams..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  className="w-full rounded-lg py-2 h-auto"
                />
              </div>

              <div className="w-full sm:w-auto">
                <Select
                  placeholder="Filter by difficulty"
                  value={difficultyFilter}
                  onChange={setDifficultyFilter}
                  allowClear
                  onClear={() => setDifficultyFilter("all")}
                  className="w-full sm:w-[250px] rounded-lg h-auto py-1"
                >
                  <Option value="all">All Difficulties</Option>
                  <Option value="easy">Easy</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="hard">Hard</Option>
                </Select>
              </div>
            </div>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredExams}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: "No exams available" }}
          />
        </>
      ) : examFinished ? (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <Card
            className="w-full border-0 shadow-lg rounded-xl overflow-hidden"
            title={
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Exam Results</h2>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={resetExam}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border-0"
                >
                  Back to Exams
                </Button>
              </div>
            }
          >
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <CheckCircleOutlined className="text-5xl text-green-500 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  You scored {score} out of {selectedExam.questions.length}
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  That's {Math.round((score / selectedExam.questions.length) * 100)}%
                </p>
                
                <div className="w-full bg-gray-100 rounded-full h-4 max-w-md mx-auto mb-6">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full" 
                    style={{ width: `${Math.round((score / selectedExam.questions.length) * 100)}%` }}
                  ></div>
                </div>
                
          
              </div>

              {/* Hidden certificate template */}
              <div className="hidden">
                <div ref={certificateRef} className="w-[1056px] h-[816px] bg-white p-12 relative">
                  
                  <div className="text-center h-full flex flex-col items-center justify-center">
                    <div className="mb-8">
                      <h1 className="text-5xl font-bold text-blue-800 mb-2">Certificate of Achievement</h1>
                      <p className="text-xl text-gray-600">This is to certify that</p>
                    </div>
                    
                    <div className="my-8">
                      <h2 className="text-6xl font-bold text-blue-600 mb-2">John Doe</h2>
                      <div className="w-1/2 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto"></div>
                    </div>
                    
                    <div className="mb-8">
                      <p className="text-xl text-gray-700 mb-4">
                        has successfully completed the <span className="font-bold">{selectedExam.subject}</span> examination
                        with a score of <span className="font-bold">{score}/{selectedExam.questions.length}</span>
                        ({Math.round((score / selectedExam.questions.length) * 100)}%)
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="flex flex-col items-center">
                          <p className="text-gray-600">Subject</p>
                          <p className="font-medium">{selectedExam.subject}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-gray-600">Score</p>
                          <p className="font-medium">{score}/{selectedExam.questions.length}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-gray-600">Date</p>
                          <p className="font-medium">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-12 w-full flex justify-between">
                      <div className="text-center">
                        <div className="h-1 w-32 bg-gray-400 mx-auto mb-2"></div>
                        <p className="text-gray-600">Exam Administrator</p>
                      </div>
                      <div className="text-center">
                        <div className="h-1 w-32 bg-gray-400 mx-auto mb-2"></div>
                        <p className="text-gray-600">ExamDesk Team</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 text-sm text-gray-500">
                      <p>Certificate ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                      <p>Verified at examdesk.com/verify</p>
                    </div>
                  </div>
                </div>
              </div>

              <Divider className="text-gray-400 font-medium">Detailed Results</Divider>
              
              <div className="space-y-6">
                {selectedExam.questions.map((question, index) => (
                  <div 
                    key={question.id} 
                    className={`p-4 rounded-lg ${answers[index] === question.correctOption ? 'bg-green-50' : 'bg-red-50'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${answers[index] === question.correctOption ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-3">{question.text}</h4>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex} 
                              className={`p-3 rounded-md border ${optIndex === question.correctOption ? 'border-green-300 bg-green-50' : answers[index] === optIndex ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                            >
                              <Radio
                                checked={answers[index] === optIndex}
                                className={`${optIndex === question.correctOption ? 'text-green-600' : answers[index] === optIndex ? 'text-red-600' : 'text-gray-600'}`}
                              >
                                <span className={optIndex === question.correctOption ? 'font-medium' : ''}>
                                  {option}
                                </span>
                              </Radio>
                            </div>
                          ))}
                        </div>
                        
                        <div className={`mt-3 p-3 rounded-md ${answers[index] === question.correctOption ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {answers[index] === question.correctOption ? (
                            <span className="flex items-center gap-2">
                              <CheckCircleOutlined />
                              Correct answer
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <CloseCircleOutlined />
                              {answers[index] !== null ? (
                                <>
                                  Your answer was incorrect (You selected: <span className="font-medium">{question.options[answers[index]]}</span>)
                                </>
                              ) : (
                                "You didn't answer this question"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={resetExam}
                  className="bg-blue-600 hover:bg-blue-700 px-8 h-12 rounded-lg text-lg"
                >
                  Return to Exam List
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card
          title={
            <Space>
              <span>{selectedExam.subject}</span>
              <Tag color="#2db7f5">
                {selectedExam.questions.length} Questions
              </Tag>
            </Space>
          }
          extra={
            <Countdown
              title="Time Remaining"
              value={Date.now() + timeLeft * 1000}
              format="mm:ss"
              valueStyle={{
                color: timeLeft < 60 ? "#ff4d4f" : "inherit",
                fontWeight: "bold",
              }}
            />
          }
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          <Progress
            percent={((currentQuestion + 1) / selectedExam.questions.length) * 100}
            showInfo={false}
            strokeColor="#1890ff"
          />
          <Text style={{ display: "block", marginBottom: 16 }}>
            Question {currentQuestion + 1} of {selectedExam.questions.length}
          </Text>

          <div style={{ margin: "24px 0" }}>
            <Text strong style={{ fontSize: 16, display: "block", marginBottom: 16 }}>
              {selectedExam.questions[currentQuestion].text}
            </Text>

            <Form>
              <Form.Item>
                <Radio.Group
                  onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
                  value={answers[currentQuestion]}
                >
                  <Space direction="vertical">
                    {selectedExam.questions[currentQuestion].options.map(
                      (option, index) => (
                        <Radio
                          key={index}
                          value={index}
                          style={{ fontSize: 15, padding: "8px 0" }}
                        >
                          {option}
                        </Radio>
                      )
                    )}
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Form>
            <Calculator/>
          </div>

          <Space style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={prevQuestion} disabled={currentQuestion === 0}>
              Previous
            </Button>

            {currentQuestion < selectedExam.questions.length - 1 ? (
              <Button type="primary" onClick={nextQuestion}>
                Next Question
              </Button>
            ) : (
              <Popconfirm
                title="Are you sure you want to submit your exam?"
                onConfirm={finishExam}
                okText="Submit"
                cancelText="Cancel"
              >
                <Button type="primary" danger>
                  Submit Exam
                </Button>
              </Popconfirm>
            )}
          </Space>
        </Card>
      )}
    </div>
  );
}