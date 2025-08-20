import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch,
  Typography,
  Row,
  Col,
  Statistic,
  Tabs,
  List,
  Avatar,
  Tooltip,
  Popconfirm,
  Upload,
  message
} from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  BulbOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const Knowledge = () => {
  const [activeTab, setActiveTab] = useState('record');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // 기록 지식 데이터
  const recordKnowledge = [
    {
      id: 1,
      title: '토마토 재배 기본 가이드',
      category: '토마토',
      type: '기본',
      author: '시스템 관리자',
      status: 'published',
      views: 1250,
      downloads: 89,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      title: '딸기 병해 예방 매뉴얼',
      category: '딸기',
      type: '병해',
      author: '농업 전문가',
      status: 'published',
      views: 980,
      downloads: 67,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12'
    },
    {
      id: 3,
      title: '스마트팜 환경 제어 표준',
      category: '시스템',
      type: '제어',
      author: '기술팀',
      status: 'draft',
      views: 450,
      downloads: 23,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-14'
    }
  ];

  // 경험 지식 데이터
  const experienceKnowledge = [
    {
      id: 1,
      title: '토마토 수확량 30% 증대 비결',
      author: '김영희',
      experience: '15년',
      category: '토마토',
      status: 'verified',
      likes: 45,
      views: 320,
      createdAt: '2024-01-08',
      verifiedBy: '전문가 검토'
    },
    {
      id: 2,
      title: '딸기 품질 향상 관리법',
      author: '이철수',
      experience: '12년',
      category: '딸기',
      status: 'pending',
      likes: 28,
      views: 180,
      createdAt: '2024-01-12',
      verifiedBy: '검토 대기'
    },
    {
      id: 3,
      title: '에너지 효율 최적화 경험담',
      author: '박민수',
      experience: '8년',
      category: '시스템',
      status: 'verified',
      likes: 32,
      views: 210,
      createdAt: '2024-01-06',
      verifiedBy: '전문가 검토'
    }
  ];

  // 추천 관리 데이터
  const recommendations = [
    {
      id: 1,
      title: '토마토 최적 재배 조건 추천',
      category: '토마토',
      type: '환경',
      accuracy: 95,
      usage: 156,
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      title: '딸기 수확 시기 예측 모델',
      category: '딸기',
      type: '예측',
      accuracy: 88,
      usage: 89,
      status: 'active',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-10'
    },
    {
      id: 3,
      title: '비료 공급 최적화 알고리즘',
      category: '시스템',
      type: '제어',
      accuracy: 92,
      usage: 234,
      status: 'testing',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-14'
    }
  ];

  const handleAddItem = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    form.setFieldsValue({
      title: item.title,
      category: item.category,
      type: item.type,
      author: item.author,
      status: item.status === 'published' || item.status === 'verified' || item.status === 'active'
    });
    setIsModalVisible(true);
  };

  const handleDeleteItem = (id) => {
    message.success('삭제되었습니다.');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      message.success(editingItem ? '수정되었습니다.' : '추가되었습니다.');
      setIsModalVisible(false);
    });
  };

  const recordColumns = [
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={category === '토마토' ? '#52c41a' : category === '딸기' ? '#1890ff' : '#722ed1'}>
          {category}
        </Tag>
      )
    },
    {
      title: '유형',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '작성자',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'success' : 'default'}>
          {status === 'published' ? '발행됨' : '임시저장'}
        </Tag>
      )
    },
    {
      title: '조회수',
      dataIndex: 'views',
      key: 'views'
    },
    {
      title: '작업',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="보기">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="수정">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEditItem(record)} />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title="삭제하시겠습니까?"
              onConfirm={() => handleDeleteItem(record.id)}
              okText="삭제"
              cancelText="취소"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const experienceColumns = [
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <ExperimentOutlined style={{ color: '#fa8c16' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: '작성자',
      dataIndex: 'author',
      key: 'author',
      render: (author, record) => (
        <Space>
          <Avatar size="small">{author[0]}</Avatar>
          <div>
            <div>{author}</div>
            <Text type="secondary">{record.experience} 경력</Text>
          </div>
        </Space>
      )
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={category === '토마토' ? '#52c41a' : category === '딸기' ? '#1890ff' : '#722ed1'}>
          {category}
        </Tag>
      )
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'verified' ? 'success' : status === 'pending' ? 'warning' : 'default'}>
          {status === 'verified' ? '검증됨' : status === 'pending' ? '검토 대기' : '검토 중'}
        </Tag>
      )
    },
    {
      title: '조회수',
      dataIndex: 'views',
      key: 'views'
    },
    {
      title: '작업',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="보기">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="검증">
            <Button type="text" icon={<CheckCircleOutlined />} />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title="삭제하시겠습니까?"
              onConfirm={() => handleDeleteItem(record.id)}
              okText="삭제"
              cancelText="취소"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const recommendationColumns = [
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <BulbOutlined style={{ color: '#722ed1' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={category === '토마토' ? '#52c41a' : category === '딸기' ? '#1890ff' : '#722ed1'}>
          {category}
        </Tag>
      )
    },
    {
      title: '유형',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '정확도',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy) => (
        <Tag color={accuracy >= 90 ? 'success' : accuracy >= 80 ? 'warning' : 'error'}>
          {accuracy}%
        </Tag>
      )
    },
    {
      title: '사용 횟수',
      dataIndex: 'usage',
      key: 'usage'
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : status === 'testing' ? 'warning' : 'default'}>
          {status === 'active' ? '활성' : status === 'testing' ? '테스트 중' : '비활성'}
        </Tag>
      )
    },
    {
      title: '작업',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="보기">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="수정">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEditItem(record)} />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title="삭제하시겠습니까?"
              onConfirm={() => handleDeleteItem(record.id)}
              okText="삭제"
              cancelText="취소"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const stats = {
    record: recordKnowledge.length,
    experience: experienceKnowledge.length,
    recommendation: recommendations.length,
    totalViews: recordKnowledge.reduce((sum, item) => sum + item.views, 0) + 
                experienceKnowledge.reduce((sum, item) => sum + item.views, 0),
    totalDownloads: recordKnowledge.reduce((sum, item) => sum + item.downloads, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>지식 관리</Title>
        <Text type="secondary">시스템의 모든 지식을 관리합니다.</Text>
      </div>

      {/* 통계 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="기록 지식"
              value={stats.record}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="경험 지식"
              value={stats.experience}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="추천 모델"
              value={stats.recommendation}
              prefix={<BulbOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="총 조회수"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 탭 메뉴 */}
      <Card
        title="지식 관리"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddItem}
          >
            지식 추가
          </Button>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="기록 지식" key="record">
            <Table
              columns={recordColumns}
              dataSource={recordKnowledge}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>
          
          <TabPane tab="경험 지식" key="experience">
            <Table
              columns={experienceColumns}
              dataSource={experienceKnowledge}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>
          
          <TabPane tab="추천 관리" key="recommendation">
            <Table
              columns={recommendationColumns}
              dataSource={recommendations}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 지식 추가/수정 모달 */}
      <Modal
        title={editingItem ? '지식 수정' : '지식 추가'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingItem ? '수정' : '추가'}
        cancelText="취소"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: true
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="제목"
                rules={[
                  { required: true, message: '제목을 입력하세요' }
                ]}
              >
                <Input placeholder="지식 제목" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="카테고리"
                rules={[
                  { required: true, message: '카테고리를 선택하세요' }
                ]}
              >
                <Select placeholder="카테고리 선택">
                  <Option value="토마토">토마토</Option>
                  <Option value="딸기">딸기</Option>
                  <Option value="시스템">시스템</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="유형"
                rules={[
                  { required: true, message: '유형을 선택하세요' }
                ]}
              >
                <Select placeholder="유형 선택">
                  <Option value="기본">기본</Option>
                  <Option value="병해">병해</Option>
                  <Option value="제어">제어</Option>
                  <Option value="환경">환경</Option>
                  <Option value="예측">예측</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="author"
                label="작성자"
                rules={[
                  { required: true, message: '작성자를 입력하세요' }
                ]}
              >
                <Input placeholder="작성자" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label="내용"
            rules={[
              { required: true, message: '내용을 입력하세요' }
            ]}
          >
            <TextArea rows={6} placeholder="지식 내용을 입력하세요" />
          </Form.Item>

          <Form.Item
            name="status"
            label="상태"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="활성" 
              unCheckedChildren="비활성" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Knowledge; 