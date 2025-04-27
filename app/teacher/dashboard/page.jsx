"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Table, Button, Modal, Form, Input, InputNumber, Select, Space,
    message, Card, Row, Col, Typography, Divider, Popconfirm
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Dashboard() {
    const [exams, setExams] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false); // Changed 'Visible' to 'Open'
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false); // Changed 'Visible' to 'Open'
    const [examForm] = Form.useForm();
    const [questionForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Fetch exams
    const fetchExams = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/exams');
            const data = await response.json();
            setExams(data);
        } catch (error) {
            message.error('Failed to fetch exams');
        } finally {
            setLoading(false);
        }
    };

    // Fetch questions for a specific exam
    const fetchQuestions = async (examId) => {
        if (!examId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/questions?examId=${examId}`);
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            message.error('Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        if (selectedExam) {
            fetchQuestions(selectedExam);
        }
    }, [selectedExam]);

    // Exam CRUD Operations
    const handleCreateExam = async (values) => {
        try {
            const response = await fetch('/api/exams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                message.success('Exam created successfully');
                fetchExams();
                setIsExamModalOpen(false); // Changed 'Visible' to 'Open'
                examForm.resetFields();
            } else {
                throw new Error('Failed to create exam');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleUpdateExam = async (values) => {
        try {
            const response = await fetch(`/api/exams?id=${selectedExam}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                message.success('Exam updated successfully');
                fetchExams();
                setIsExamModalOpen(false); // Changed 'Visible' to 'Open'
                examForm.resetFields();
            } else {
                throw new Error('Failed to update exam');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleDeleteExam = async (examId) => {
        try {
            const response = await fetch(`/api/exams?id=${examId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                message.success('Exam deleted successfully');
                fetchExams();
                if (selectedExam === examId) {
                    setSelectedExam(null);
                    setQuestions([]);
                }
            } else {
                throw new Error('Failed to delete exam');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    // Question CRUD Operations
    const handleCreateQuestion = async (values) => {
        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    examId: selectedExam,
                    options: values.options.split('\n').filter(opt => opt.trim()),
                }),
            });
            if (response.ok) {
                message.success('Question created successfully');
                fetchQuestions(selectedExam);
                setIsQuestionModalOpen(false); // Changed 'Visible' to 'Open'
                questionForm.resetFields();
            } else {
                throw new Error('Failed to create question');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            const response = await fetch(`/api/questions?id=${questionId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                message.success('Question deleted successfully');
                fetchQuestions(selectedExam);
            } else {
                throw new Error('Failed to delete question');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    // Modal handlers
    const showExamModal = (exam = null) => {
        if (exam) {
            examForm.setFieldsValue(exam);
        } else {
            examForm.resetFields();
        }
        setIsExamModalOpen(true); // Changed 'Visible' to 'Open'
    };

    const showQuestionModal = () => {
        questionForm.resetFields();
        setIsQuestionModalOpen(true); // Changed 'Visible' to 'Open'
    };

    // Table columns
    const examColumns = [
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            responsive: ['md'],
        },
        {
            title: 'Duration (mins)',
            dataIndex: 'duration',
            key: 'duration',
            responsive: ['sm'],
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedExam(record.id);
                            showExamModal(record);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this exam?"
                        onConfirm={() => handleDeleteExam(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const questionColumns = [
        {
            title: 'Question',
            dataIndex: 'text',
            key: 'text',
        },
        {
            title: 'Options',
            dataIndex: 'options',
            key: 'options',
            render: (options) => (
                <ol style={{ margin: 0, paddingLeft: 20 }}>
                    {options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                    ))}
                </ol>
            ),
            responsive: ['md'],
        },
        {
            title: 'Correct Answer',
            dataIndex: 'correctOption',
            key: 'correctOption',
            render: (index) => `Option ${index + 1}`,
            responsive: ['sm'],
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
            responsive: ['sm'],
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this question?"
                    onConfirm={() => handleDeleteQuestion(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Exam Management Dashboard</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card
                        title="Exams"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => showExamModal()}
                            >
                                New Exam
                            </Button>
                        }
                    >
                        <Table
                            columns={examColumns}
                            dataSource={exams}
                            rowKey="id"
                            loading={loading}
                            onRow={(record) => ({
                                onClick: () => setSelectedExam(record.id),
                                style: {
                                    cursor: 'pointer',
                                    background: selectedExam === record.id ? '#f0f0f0' : 'inherit',
                                },
                            })}
                            rowClassName={(record) => selectedExam === record.id ? 'selected-row' : ''}
                        />
                    </Card>
                    
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title={`Questions ${selectedExam ? `(Exam ID: ${selectedExam})` : ''}`}
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={showQuestionModal}
                                disabled={!selectedExam}
                            >
                                New Question
                            </Button>
                        }
                    >
                        {selectedExam ? (
                            <Table
                                columns={questionColumns}
                                dataSource={questions}
                                rowKey="id"
                                loading={loading}
                            />
                        ) : (
                            <Text type="secondary">Select an exam to view questions</Text>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Exam Modal */}
            <Modal
                title={selectedExam ? "Edit Exam" : "Create New Exam"}
                open={isExamModalOpen} // Changed 'visible' to 'open'
                onCancel={() => setIsExamModalOpen(false)} // Changed 'setVisible' to 'setOpen'
                footer={null}
            >
                <Form
                    form={examForm}
                    layout="vertical"
                    onFinish={selectedExam ? handleUpdateExam : handleCreateExam}
                >
                    <Form.Item
                        name="subject"
                        label="Subject"
                        rules={[{ required: true, message: 'Please input the subject!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="Duration (minutes)"
                        rules={[{ required: true, message: 'Please input the duration!' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {selectedExam ? "Update Exam" : "Create Exam"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Question Modal */}
            <Modal
                title="Add New Question"
                open={isQuestionModalOpen} // Changed 'visible' to 'open'
                onCancel={() => setIsQuestionModalOpen(false)} // Changed 'setVisible' to 'setOpen'
                footer={null}
            >
                <Form
                    form={questionForm}
                    layout="vertical"
                    onFinish={handleCreateQuestion}
                >
                    <Form.Item
                        name="text"
                        label="Question Text"
                        rules={[{ required: true, message: 'Please input the question!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="options"
                        label="Options (one per line)"
                        rules={[{ required: true, message: 'Please provide at least 2 options!' }]}
                    >
                        <Input.TextArea placeholder="Enter each option on a new line" rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="correctOption"
                        label="Correct Option Index"
                        rules={[{ required: true, message: 'Please select the correct option!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="difficulty"
                        label="Difficulty"
                        rules={[{ required: true, message: 'Please select difficulty!' }]}
                    >
                        <Select>
                            <Option value="easy">Easy</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="hard">Hard</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Question
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}