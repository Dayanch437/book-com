import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Button, 
  Card, 
  Row, 
  Col, 
  Spin, 
  Alert, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space,
  Tag,
  message
} from 'antd';
import { 
  BookOutlined, 
  LogoutOutlined, 
  UserOutlined, 
  TrophyOutlined, 
  FileTextOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleLogout = () => {
    logout();
  };

  // Fetch competitions from backend
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/competitions/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch competitions');
        }
        
        const data = await response.json();
        setCompetitions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const handleRegisterForCompetition = (competition) => {
    setSelectedCompetition(competition);
    setShowRegistrationForm(true);
  };

  const handleSubmitRegistration = async (values) => {
    try {
      const submissionData = {
        competition: selectedCompetition.id,
        book_title: values.book_title,
        author_name: values.author_name,
        genre: values.genre,
        description: values.description,
      };
      
      const response = await fetch('http://localhost:8000/api/submissions/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      if (response.ok) {
        message.success('Successfully registered for the competition!');
        setShowRegistrationForm(false);
        setSelectedCompetition(null);
        form.resetFields();
      } else {
        const errorData = await response.json();
        message.error('Registration failed: ' + (errorData.detail || 'Unknown error'));
      }
    } catch (err) {
      message.error('Registration failed: ' + err.message);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 50px',
        boxShadow: '0 2px 8px #f0f1f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BookOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            Book Competition Dashboard
          </Title>
        </div>
        <Space>
          <Text>Welcome, {user?.username || 'User'}!</Text>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '50px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text>Loading competitions...</Text>
            </div>
          </div>
        ) : error ? (
          <Alert
            message="Error Loading Competitions"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        ) : (
          <>
            <div style={{ marginBottom: '32px' }}>
              <Title level={2}>Available Book Competitions</Title>
              {competitions.length === 0 ? (
                <Alert
                  message="No competitions available"
                  description="There are no competitions available at the moment. Please check back later."
                  type="info"
                  showIcon
                />
              ) : (
                <Row gutter={[24, 24]}>
                  {competitions.map((competition) => (
                    <Col xs={24} sm={12} lg={8} key={competition.id}>
                      <Card
                        hoverable
                        style={{ height: '100%' }}
                        actions={[
                          <Button 
                            type="primary" 
                            icon={<BookOutlined />}
                            onClick={() => handleRegisterForCompetition(competition)}
                            block
                          >
                            Register for Competition
                          </Button>
                        ]}
                      >
                        <Card.Meta
                          avatar={<BookOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                          title={competition.title}
                          description={
                            <div>
                              <Text type="secondary">{competition.description}</Text>
                              <div style={{ marginTop: '12px' }}>
                                <Space direction="vertical" size="small">
                                  <div>
                                    <CalendarOutlined style={{ marginRight: '8px' }} />
                                    <Text strong>Start:</Text> {new Date(competition.start_date).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <CalendarOutlined style={{ marginRight: '8px' }} />
                                    <Text strong>End:</Text> {new Date(competition.end_date).toLocaleDateString()}
                                  </div>
                                </Space>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>

            {/* Quick Actions */}
            <Title level={3}>Quick Actions</Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  actions={[
                    <Button type="default" size="large" block>
                      View My Submissions
                    </Button>
                  ]}
                >
                  <Card.Meta
                    avatar={<FileTextOutlined style={{ fontSize: '32px', color: '#52c41a' }} />}
                    title="My Submissions"
                    description="View and manage your book competition entries"
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  actions={[
                    <Button type="default" size="large" block>
                      View Results
                    </Button>
                  ]}
                >
                  <Card.Meta
                    avatar={<TrophyOutlined style={{ fontSize: '32px', color: '#faad14' }} />}
                    title="Competition Results"
                    description="Check winners and rankings of completed competitions"
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Registration Modal */}
        <Modal
          title={
            <Space>
              <BookOutlined />
              Register for: {selectedCompetition?.title}
            </Space>
          }
          open={showRegistrationForm}
          onCancel={() => {
            setShowRegistrationForm(false);
            setSelectedCompetition(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          {selectedCompetition && (
            <>
              <Alert
                message="Competition Details"
                description={
                  <div>
                    <Text>{selectedCompetition.description}</Text>
                    <br />
                    <Text strong>Duration:</Text> {new Date(selectedCompetition.start_date).toLocaleDateString()} - {new Date(selectedCompetition.end_date).toLocaleDateString()}
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: '24px' }}
              />
              
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitRegistration}
              >
                <Form.Item
                  name="book_title"
                  label="Book Title"
                  rules={[{ required: true, message: 'Please enter your book title!' }]}
                >
                  <Input 
                    placeholder="Enter your book title"
                    prefix={<BookOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="author_name"
                  label="Author Name"
                  rules={[{ required: true, message: 'Please enter the author name!' }]}
                >
                  <Input 
                    placeholder="Enter author name"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="genre"
                  label="Genre"
                  rules={[{ required: true, message: 'Please select a genre!' }]}
                >
                  <Select placeholder="Select genre">
                    <Option value="fiction">Fiction</Option>
                    <Option value="non-fiction">Non-Fiction</Option>
                    <Option value="mystery">Mystery</Option>
                    <Option value="romance">Romance</Option>
                    <Option value="sci-fi">Science Fiction</Option>
                    <Option value="fantasy">Fantasy</Option>
                    <Option value="biography">Biography</Option>
                    <Option value="thriller">Thriller</Option>
                    <Option value="historical">Historical</Option>
                    <Option value="poetry">Poetry</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    { required: true, message: 'Please enter a description!' },
                    { max: 500, message: 'Description cannot exceed 500 characters!' }
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Brief description of your book (max 500 characters)"
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <Form.Item>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button 
                      onClick={() => {
                        setShowRegistrationForm(false);
                        setSelectedCompetition(null);
                        form.resetFields();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Submit Entry
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </>
          )}
        </Modal>
      </Content>
    </Layout>
  );
}
