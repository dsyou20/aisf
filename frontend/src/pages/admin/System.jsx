import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space,
  Statistic,
  Progress,
  Table,
  Tag,
  Button,
  Switch,
  Alert,
  List,
  Tabs,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip
} from 'antd';
import {
  DesktopOutlined,
  DatabaseOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminSystem = () => {
  const [loading, setLoading] = useState(false);
  const [systemData, setSystemData] = useState({
    serverStatus: {},
    databaseStatus: {},
    performanceMetrics: [],
    systemLogs: [],
    backupHistory: [],
    services: []
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadSystemData();
    // 실시간 업데이트를 위한 인터벌 설정
    const interval = setInterval(loadSystemData, 30000); // 30초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    try {
      setLoading(true);
      
      // 서버 상태
      const serverStatus = {
        cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
        memory: Math.floor(Math.random() * 40) + 30, // 30-70%
        disk: Math.floor(Math.random() * 20) + 15, // 15-35%
        network: Math.floor(Math.random() * 50) + 100, // 100-150 Mbps
        uptime: '15일 8시간 32분',
        status: 'healthy'
      };

      // 데이터베이스 상태
      const databaseStatus = {
        connections: Math.floor(Math.random() * 20) + 45, // 45-65
        queries: Math.floor(Math.random() * 1000) + 2000, // 2000-3000 QPS
        size: '2.4GB',
        lastBackup: dayjs().subtract(6, 'hour').format('YYYY-MM-DD HH:mm'),
        status: 'healthy'
      };

      // 성능 메트릭 (최근 24시간)
      const performanceMetrics = [];
      for (let i = 23; i >= 0; i--) {
        const hour = dayjs().subtract(i, 'hour');
        performanceMetrics.push({
          time: hour.format('HH:mm'),
          cpu: Math.floor(Math.random() * 30) + 20,
          memory: Math.floor(Math.random() * 40) + 30,
          disk: Math.floor(Math.random() * 20) + 15,
          network: Math.floor(Math.random() * 50) + 100
        });
      }

      // 시스템 로그
      const systemLogs = [
        { id: 1, level: 'info', message: '시스템 정상 작동 중', timestamp: dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss'), service: 'system' },
        { id: 2, level: 'warning', message: 'CPU 사용률이 일시적으로 증가했습니다', timestamp: dayjs().subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss'), service: 'monitor' },
        { id: 3, level: 'info', message: '데이터베이스 백업이 완료되었습니다', timestamp: dayjs().subtract(6, 'hour').format('YYYY-MM-DD HH:mm:ss'), service: 'database' },
        { id: 4, level: 'error', message: '4번 온실 센서 연결 오류 (복구됨)', timestamp: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss'), service: 'iot' },
        { id: 5, level: 'info', message: '새로운 사용자가 등록되었습니다', timestamp: dayjs().subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss'), service: 'auth' }
      ];

      // 백업 이력
      const backupHistory = [
        { id: 1, type: 'full', size: '2.4GB', status: 'completed', timestamp: dayjs().subtract(6, 'hour').format('YYYY-MM-DD HH:mm'), duration: '12분' },
        { id: 2, type: 'incremental', size: '156MB', status: 'completed', timestamp: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'), duration: '3분' },
        { id: 3, type: 'full', size: '2.3GB', status: 'completed', timestamp: dayjs().subtract(1, 'week').format('YYYY-MM-DD HH:mm'), duration: '11분' },
        { id: 4, type: 'incremental', size: '89MB', status: 'completed', timestamp: dayjs().subtract(1, 'week').subtract(1, 'day').format('YYYY-MM-DD HH:mm'), duration: '2분' }
      ];

      // 서비스 상태
      const services = [
        { name: 'Web Server', status: 'running', port: 3000, uptime: '15일 8시간', memory: '245MB' },
        { name: 'API Server', status: 'running', port: 8080, uptime: '15일 8시간', memory: '512MB' },
        { name: 'Database', status: 'running', port: 5432, uptime: '15일 8시간', memory: '1.2GB' },
        { name: 'Redis Cache', status: 'running', port: 6379, uptime: '15일 8시간', memory: '128MB' },
        { name: 'IoT Gateway', status: 'running', port: 1883, uptime: '15일 7시간', memory: '89MB' },
        { name: 'File Storage', status: 'running', port: 9000, uptime: '15일 8시간', memory: '64MB' }
      ];

      setSystemData({
        serverStatus,
        databaseStatus,
        performanceMetrics,
        systemLogs,
        backupHistory,
        services
      });
    } catch (error) {
      console.error('시스템 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAction = (serviceName, action) => {
    message.info(`${serviceName} 서비스를 ${action === 'restart' ? '재시작' : action === 'stop' ? '중지' : '시작'}합니다.`);
  };

  const handleBackup = async () => {
    try {
      const values = await form.validateFields();
      message.success(`${values.type === 'full' ? '전체' : '증분'} 백업이 시작되었습니다.`);
      setBackupModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('백업 실행 실패:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'completed': return 'green';
      case 'warning': return 'orange';
      case 'error':
      case 'stopped': return 'red';
      default: return 'default';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'info': return 'blue';
      case 'warning': return 'orange';
      case 'error': return 'red';
      default: return 'default';
    }
  };

  const serviceColumns = [
    {
      title: '서비스명',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'running' ? '실행 중' : '중지됨'}
        </Tag>
      )
    },
    {
      title: '포트',
      dataIndex: 'port',
      key: 'port'
    },
    {
      title: '가동 시간',
      dataIndex: 'uptime',
      key: 'uptime'
    },
    {
      title: '메모리 사용량',
      dataIndex: 'memory',
      key: 'memory'
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="재시작">
            <Button 
              size="small" 
              icon={<ReloadOutlined />}
              onClick={() => handleServiceAction(record.name, 'restart')}
            />
          </Tooltip>
          <Tooltip title={record.status === 'running' ? '중지' : '시작'}>
            <Button 
              size="small" 
              icon={record.status === 'running' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleServiceAction(record.name, record.status === 'running' ? 'stop' : 'start')}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const backupColumns = [
    {
      title: '유형',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'full' ? 'blue' : 'green'}>
          {type === 'full' ? '전체 백업' : '증분 백업'}
        </Tag>
      )
    },
    {
      title: '크기',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'completed' ? '완료' : status === 'running' ? '진행 중' : '실패'}
        </Tag>
      )
    },
    {
      title: '시작 시간',
      dataIndex: 'timestamp',
      key: 'timestamp'
    },
    {
      title: '소요 시간',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: '작업',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small" icon={<DownloadOutlined />}>
            다운로드
          </Button>
          <Button size="small" icon={<DeleteOutlined />} danger>
            삭제
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>🖥️ 시스템 관리</Title>
        <Text type="secondary">시스템 상태를 모니터링하고 관리하세요</Text>
      </div>

      {/* 시스템 상태 알림 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Alert
            message="시스템 정상 작동 중"
            description="모든 서비스가 정상적으로 실행되고 있습니다. 마지막 백업: 6시간 전"
            type="success"
            showIcon
            action={
              <Space>
                <Switch 
                  checked={maintenanceMode}
                  onChange={setMaintenanceMode}
                  checkedChildren="유지보수 모드"
                  unCheckedChildren="정상 모드"
                />
                <Button size="small" onClick={loadSystemData}>
                  새로고침
                </Button>
              </Space>
            }
          />
        </Col>
      </Row>

      {/* 시스템 리소스 현황 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="CPU 사용률"
              value={systemData.serverStatus.cpu}
              suffix="%"
              prefix={<DesktopOutlined />}
              valueStyle={{ color: systemData.serverStatus.cpu > 80 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress 
              percent={systemData.serverStatus.cpu} 
              showInfo={false}
              strokeColor={systemData.serverStatus.cpu > 80 ? '#ff4d4f' : '#52c41a'}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="메모리 사용률"
              value={systemData.serverStatus.memory}
              suffix="%"
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: systemData.serverStatus.memory > 80 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress 
              percent={systemData.serverStatus.memory} 
              showInfo={false}
              strokeColor={systemData.serverStatus.memory > 80 ? '#ff4d4f' : '#52c41a'}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="디스크 사용률"
              value={systemData.serverStatus.disk}
              suffix="%"
              prefix={<CloudOutlined />}
              valueStyle={{ color: systemData.serverStatus.disk > 80 ? '#ff4d4f' : '#52c41a' }}
            />
            <Progress 
              percent={systemData.serverStatus.disk} 
              showInfo={false}
              strokeColor={systemData.serverStatus.disk > 80 ? '#ff4d4f' : '#52c41a'}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="네트워크"
              value={systemData.serverStatus.network}
              suffix="Mbps"
              prefix={<SecurityScanOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">가동시간: {systemData.serverStatus.uptime}</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="performance">
        <Tabs.TabPane tab="성능 모니터링" key="performance">
          <Card title="📊 시스템 성능 추이 (24시간)" loading={loading}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={systemData.performanceMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#ff4d4f" name="CPU (%)" />
                <Line type="monotone" dataKey="memory" stroke="#1890ff" name="메모리 (%)" />
                <Line type="monotone" dataKey="disk" stroke="#52c41a" name="디스크 (%)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="서비스 관리" key="services">
          <Card 
            title="🔧 서비스 상태" 
            loading={loading}
            extra={
              <Button icon={<ReloadOutlined />} onClick={loadSystemData}>
                새로고침
              </Button>
            }
          >
            <Table
              columns={serviceColumns}
              dataSource={systemData.services}
              rowKey="name"
              pagination={false}
              size="small"
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="백업 관리" key="backup">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card 
                title="💾 백업 관리"
                extra={
                  <Button 
                    type="primary" 
                    icon={<UploadOutlined />}
                    onClick={() => setBackupModalVisible(true)}
                  >
                    새 백업 생성
                  </Button>
                }
              >
                <Table
                  columns={backupColumns}
                  dataSource={systemData.backupHistory}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="시스템 로그" key="logs">
          <Card title="📝 시스템 로그" loading={loading}>
            <List
              itemLayout="horizontal"
              dataSource={systemData.systemLogs}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Tag color={getLogLevelColor(item.level)}>
                        {item.level.toUpperCase()}
                      </Tag>
                    }
                    title={
                      <Space>
                        <span>{item.message}</span>
                        <Tag size="small">{item.service}</Tag>
                      </Space>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.timestamp}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      {/* 백업 생성 모달 */}
      <Modal
        title="새 백업 생성"
        open={backupModalVisible}
        onOk={handleBackup}
        onCancel={() => {
          setBackupModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'incremental'
          }}
        >
          <Form.Item
            label="백업 유형"
            name="type"
            rules={[{ required: true, message: '백업 유형을 선택해주세요' }]}
          >
            <Select>
              <Option value="full">전체 백업</Option>
              <Option value="incremental">증분 백업</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="설명" name="description">
            <Input.TextArea 
              rows={3} 
              placeholder="백업에 대한 설명을 입력하세요 (선택사항)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminSystem;
