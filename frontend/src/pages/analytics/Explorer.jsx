import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Select, 
  DatePicker, 
  Input, 
  Button, 
  Space, 
  Row, 
  Col, 
  Statistic,
  Typography,
  Slider,
  Tag,
  Alert,
  Modal,
  Spin
} from 'antd';
import {
  SearchOutlined, 
  DownloadOutlined, 
  FilterOutlined,
  BarChartOutlined,
  DotChartOutlined,
  TableOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import {
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import { 
  FARM_CODES, 
  DATA_SCHEMAS,
  calculateCorrelation,
  exportToCSV 
} from '../../utils/dataProcessor';
import { 
  loadIntegratedData, 
  isUsingRealData 
} from '../../utils/realDataProcessor';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const DataExplorer = () => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [correlationData, setCorrelationData] = useState([]);
  const [filters, setFilters] = useState({
    dataType: 'environment',
    farms: [],
    dateRange: [dayjs().subtract(30, 'days'), dayjs()],
    searchText: '',
    numericFilters: {}
  });
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    xAxis: 'date',
    yAxis: 'temperature',
    chartType: 'line'
  });

  // 데이터 검색 실행
  useEffect(() => {
    if (filters.dataType) {
      executeSearch();
    }
  }, [filters.dataType, filters.farms, filters.dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const executeSearch = async () => {
    setLoading(true);
    try {
      const startDate = filters.dateRange[0].format('YYYY-MM-DD');
      const endDate = filters.dateRange[1].format('YYYY-MM-DD');
      
      const data = await loadIntegratedData({
        farmCodes: filters.farms.length > 0 ? filters.farms : Object.keys(FARM_CODES),
        startDate,
        endDate,
        dataTypes: [filters.dataType],
        interpolationMethod: 'linear',
        handleOutliers: true
      });
      
      console.log('탐색기 데이터 로딩 완료:', data);
      console.log('실제 데이터 사용 여부:', isUsingRealData());
      
      // 데이터 플래튼화 및 필터링
      const flattenedData = [];
      Object.keys(data).forEach(farmCode => {
        const farmData = data[farmCode][filters.dataType];
        if (farmData) {
          farmData.forEach(item => {
            flattenedData.push({
              ...item,
              farmName: FARM_CODES[farmCode].name,
              region: FARM_CODES[farmCode].region
            });
          });
        }
      });
      
      // 텍스트 검색 필터 적용
      let filteredData = flattenedData;
      if (filters.searchText) {
        filteredData = flattenedData.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(filters.searchText.toLowerCase())
          )
        );
      }
      
      // 수치 필터 적용
      Object.keys(filters.numericFilters).forEach(field => {
        const range = filters.numericFilters[field];
        if (range && range.length === 2) {
          filteredData = filteredData.filter(item =>
            item[field] >= range[0] && item[field] <= range[1]
          );
        }
      });
      
      setSearchResults(filteredData);
      calculateCorrelations(filteredData);
    } catch (error) {
      console.error('데이터 검색 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 상관관계 계산
  const calculateCorrelations = (data) => {
    if (data.length === 0) return;
    
    const numericFields = getNumericFields(filters.dataType);
    const correlations = [];
    
    for (let i = 0; i < numericFields.length; i++) {
      for (let j = i + 1; j < numericFields.length; j++) {
        const fieldX = numericFields[i];
        const fieldY = numericFields[j];
        const correlation = calculateCorrelation(data, fieldX, fieldY);
        
        correlations.push({
          fieldX,
          fieldY,
          correlation: Math.round(correlation * 1000) / 1000,
          strength: getCorrelationStrength(Math.abs(correlation))
        });
      }
    }
    
    setCorrelationData(correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)));
  };

  // 컬럼 정의 생성
  const generateColumns = () => {
    const baseColumns = [
      {
        title: '농장명',
        dataIndex: 'farmName',
        key: 'farmName',
        fixed: 'left',
        width: 120,
        filters: [...new Set(searchResults.map(item => item.farmName))].map(name => ({
          text: name,
          value: name
        })),
        onFilter: (value, record) => record.farmName === value
      },
      {
        title: '지역',
        dataIndex: 'region',
        key: 'region',
        width: 80,
        filters: [...new Set(searchResults.map(item => item.region))].map(region => ({
          text: region,
          value: region
        })),
        onFilter: (value, record) => record.region === value
      },
      {
        title: '날짜',
        dataIndex: filters.dataType === 'environment' || filters.dataType === 'control' ? 'datetime' : 'date',
        key: 'date',
        width: 150,
        sorter: (a, b) => new Date(a.date || a.datetime) - new Date(b.date || b.datetime),
        render: (text) => {
          const date = new Date(text);
          return filters.dataType === 'environment' || filters.dataType === 'control' 
            ? date.toLocaleString('ko-KR')
            : date.toLocaleDateString('ko-KR');
        }
      }
    ];

    // 데이터 타입별 컬럼 추가
    const schema = DATA_SCHEMAS[filters.dataType];
    if (schema) {
      Object.keys(schema).forEach(field => {
        const fieldSchema = schema[field];
        baseColumns.push({
          title: `${getFieldDisplayName(field)} (${fieldSchema.unit})`,
          dataIndex: field,
          key: field,
          width: 120,
          sorter: (a, b) => (a[field] || 0) - (b[field] || 0),
          render: (value) => {
            if (fieldSchema.unit === 'boolean') {
              return value ? <Tag color="success">ON</Tag> : <Tag color="default">OFF</Tag>;
            }
            return typeof value === 'number' ? value.toFixed(1) : value;
          }
        });
      });
    }

    return baseColumns;
  };

  // 수치형 필드 목록 가져오기
  const getNumericFields = (dataType) => {
    const schema = DATA_SCHEMAS[dataType];
    if (!schema) return [];
    
    return Object.keys(schema).filter(field => {
      const fieldSchema = schema[field];
      return fieldSchema.unit !== 'boolean' && fieldSchema.range;
    });
  };

  // 필드 표시명 가져오기
  const getFieldDisplayName = (field) => {
    const fieldNames = {
      temperature: '온도',
      humidity: '습도',
      co2: 'CO2',
      lightIntensity: '조도',
      soilMoisture: '토양수분',
      ph: 'pH',
      plantHeight: '초장',
      leafLength: '엽장',
      leafWidth: '엽폭',
      stemDiameter: '경경',
      fruitCount: '과실수',
      fruitWeight: '과중',
      healthScore: '건강도',
      yieldAmount: '수확량',
      revenue: '매출',
      cost: '비용',
      profit: '수익',
      efficiency: '효율성',
      heatingStatus: '난방',
      ventilationStatus: '환기',
      irrigationStatus: '관수',
      lightingStatus: '조명',
      heatingSetpoint: '난방설정',
      ventilationRate: '환기율'
    };
    return fieldNames[field] || field;
  };

  // 상관관계 강도 판정
  const getCorrelationStrength = (correlation) => {
    if (correlation >= 0.7) return { text: '강한 상관관계', color: '#ff4d4f' };
    if (correlation >= 0.5) return { text: '중간 상관관계', color: '#fa8c16' };
    if (correlation >= 0.3) return { text: '약한 상관관계', color: '#fadb14' };
    return { text: '상관관계 없음', color: '#d9d9d9' };
  };

  // 차트 데이터 준비
  const prepareChartData = () => {
    if (selectedData.length === 0) return searchResults.slice(0, 100); // 최대 100개 데이터포인트
    return selectedData;
  };

  // 테이블 뷰
  const TableView = () => (
    <Table
      columns={generateColumns()}
      dataSource={searchResults}
      rowKey={(record, index) => `${record.farmCode}_${record.date || record.datetime}_${index}`}
      rowSelection={{
        onChange: (selectedRowKeys, selectedRows) => {
          setSelectedData(selectedRows);
        },
        getCheckboxProps: (record) => ({
          disabled: false,
        }),
      }}
      pagination={{
        pageSize: 50,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}개`,
        pageSizeOptions: ['20', '50', '100', '200']
      }}
      scroll={{ x: 1200, y: 500 }}
      size="small"
    />
  );

  // 차트 뷰
  const ChartView = () => {
    const chartData = prepareChartData();
    
    if (chartData.length === 0) {
      return (
        <Alert 
          message="차트를 표시할 데이터가 없습니다" 
          description="검색 결과에서 데이터를 선택하거나 필터를 조정해주세요."
          type="info" 
          showIcon 
        />
      );
    }

    const ChartComponent = chartConfig.chartType === 'bar' ? BarChart : 
                          chartConfig.chartType === 'scatter' ? ScatterChart : LineChart;

    return (
      <div>
        {/* 차트 설정 */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Row gutter={16} align="middle">
            <Col span={6}>
              <Space direction="vertical" size="small">
                <Text strong>차트 유형</Text>
                <Select
                  value={chartConfig.chartType}
                  onChange={(value) => setChartConfig({...chartConfig, chartType: value})}
                  style={{ width: '100%' }}
                >
                  <Option value="line">선 차트</Option>
                  <Option value="bar">막대 차트</Option>
                  <Option value="scatter">산점도</Option>
                </Select>
              </Space>
            </Col>
            <Col span={6}>
              <Space direction="vertical" size="small">
                <Text strong>X축</Text>
                <Select
                  value={chartConfig.xAxis}
                  onChange={(value) => setChartConfig({...chartConfig, xAxis: value})}
                  style={{ width: '100%' }}
                >
                  <Option value="date">날짜</Option>
                  <Option value="farmName">농장명</Option>
                  {getNumericFields(filters.dataType).map(field => (
                    <Option key={field} value={field}>
                      {getFieldDisplayName(field)}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col span={6}>
              <Space direction="vertical" size="small">
                <Text strong>Y축</Text>
                <Select
                  value={chartConfig.yAxis}
                  onChange={(value) => setChartConfig({...chartConfig, yAxis: value})}
                  style={{ width: '100%' }}
                >
                  {getNumericFields(filters.dataType).map(field => (
                    <Option key={field} value={field}>
                      {getFieldDisplayName(field)}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col span={6}>
              <Statistic
                title="데이터 포인트"
                value={chartData.length}
                suffix="개"
              />
            </Col>
          </Row>
        </Card>

        {/* 차트 */}
        <Card>
          <ResponsiveContainer width="100%" height={400}>
            <ChartComponent data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={chartConfig.xAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip />
              <Legend />
              {chartConfig.chartType === 'scatter' ? (
                <Scatter dataKey={chartConfig.yAxis} fill="#8884d8" />
              ) : chartConfig.chartType === 'bar' ? (
                <Bar dataKey={chartConfig.yAxis} fill="#8884d8" />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey={chartConfig.yAxis} 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </Card>
      </div>
    );
  };

  // 상관관계 뷰
  const CorrelationView = () => (
    <div>
      <Alert
        message="상관관계 분석"
        description="선택된 데이터의 수치형 필드 간 상관관계를 분석합니다. 상관계수는 -1(완전 음의 상관)에서 1(완전 양의 상관) 사이의 값을 가집니다."
        type="info"
        style={{ marginBottom: '16px' }}
      />
      
      <Row gutter={[16, 16]}>
        {correlationData.slice(0, 12).map((corr, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card size="small">
              <Statistic
                title={`${getFieldDisplayName(corr.fieldX)} ↔ ${getFieldDisplayName(corr.fieldY)}`}
                value={corr.correlation}
                precision={3}
                valueStyle={{ 
                  color: corr.correlation > 0 ? '#52c41a' : '#ff4d4f',
                  fontSize: '18px'
                }}
              />
              <div style={{ marginTop: '8px' }}>
                <Tag color={corr.strength.color}>{corr.strength.text}</Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      {correlationData.length > 12 && (
        <Card style={{ marginTop: '16px' }}>
          <Table
            dataSource={correlationData}
            columns={[
              {
                title: '필드 X',
                dataIndex: 'fieldX',
                render: (field) => getFieldDisplayName(field)
              },
              {
                title: '필드 Y',
                dataIndex: 'fieldY',
                render: (field) => getFieldDisplayName(field)
              },
              {
                title: '상관계수',
                dataIndex: 'correlation',
                sorter: (a, b) => Math.abs(b.correlation) - Math.abs(a.correlation),
                render: (correlation) => (
                  <Text style={{ color: correlation > 0 ? '#52c41a' : '#ff4d4f' }}>
                    {correlation.toFixed(3)}
                  </Text>
                )
              },
              {
                title: '강도',
                dataIndex: 'strength',
                render: (strength) => <Tag color={strength.color}>{strength.text}</Tag>
              }
            ]}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </Card>
      )}
    </div>
  );

  // 고급 필터 모달
  const AdvancedFiltersModal = () => {
    const numericFields = getNumericFields(filters.dataType);
    
    return (
      <Modal
        title="고급 필터"
        open={advancedFiltersVisible}
        onCancel={() => setAdvancedFiltersVisible(false)}
        onOk={() => {
          setAdvancedFiltersVisible(false);
          executeSearch();
        }}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {numericFields.map(field => {
            const schema = DATA_SCHEMAS[filters.dataType][field];
            const currentRange = filters.numericFilters[field] || schema.range;
            
            return (
              <div key={field}>
                <Text strong>{getFieldDisplayName(field)} ({schema.unit})</Text>
                <Slider
                  range
                  min={schema.range[0]}
                  max={schema.range[1]}
                  value={currentRange}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      numericFilters: {
                        ...filters.numericFilters,
                        [field]: value
                      }
                    });
                  }}
                  marks={{
                    [schema.range[0]]: schema.range[0],
                    [schema.range[1]]: schema.range[1]
                  }}
                />
                <Text type="secondary">
                  범위: {currentRange[0]} ~ {currentRange[1]} {schema.unit}
                </Text>
              </div>
            );
          })}
        </Space>
      </Modal>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <SearchOutlined /> 데이터 탐색기
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Text type="secondary">상세한 데이터 검색, 분석 및 시각화</Text>
          <div style={{ 
            padding: '4px 8px', 
            borderRadius: '4px', 
            backgroundColor: isUsingRealData() ? '#f6ffed' : '#fff7e6',
            border: `1px solid ${isUsingRealData() ? '#b7eb8f' : '#ffd591'}`
          }}>
            <Text style={{ 
              color: isUsingRealData() ? '#52c41a' : '#fa8c16',
              fontSize: '12px'
            }}>
              {isUsingRealData() ? '📊 실제 엑셀 데이터 + 보간' : '🔬 시뮬레이션 데이터'}
            </Text>
          </div>
        </div>
      </div>

      {/* 검색 필터 */}
      <Card title="🔍 검색 조건" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>데이터 유형</Text>
              <Select
                value={filters.dataType}
                onChange={(value) => setFilters({...filters, dataType: value, numericFilters: {}})}
                style={{ width: '100%' }}
              >
                <Option value="environment">환경 정보</Option>
                <Option value="growth">생육 정보</Option>
                <Option value="management">경영 정보</Option>
                <Option value="control">제어 정보</Option>
              </Select>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>농장 선택</Text>
              <Select
                mode="multiple"
                placeholder="전체 농장"
                value={filters.farms}
                onChange={(value) => setFilters({...filters, farms: value})}
                style={{ width: '100%' }}
              >
                {Object.keys(FARM_CODES).map(farmCode => (
                  <Option key={farmCode} value={farmCode}>
                    {FARM_CODES[farmCode].name}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>기간</Text>
              <RangePicker
                value={filters.dateRange}
                onChange={(dates) => setFilters({...filters, dateRange: dates})}
                style={{ width: '100%' }}
              />
            </Space>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>텍스트 검색</Text>
              <Search
                placeholder="검색어 입력"
                value={filters.searchText}
                onChange={(e) => setFilters({...filters, searchText: e.target.value})}
                onSearch={executeSearch}
                enterButton
              />
            </Space>
          </Col>
        </Row>

        <Row style={{ marginTop: '16px' }}>
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                loading={loading}
                onClick={executeSearch}
              >
                검색 실행
              </Button>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => setAdvancedFiltersVisible(true)}
              >
                고급 필터
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => {
                  setFilters({
                    ...filters,
                    searchText: '',
                    numericFilters: {}
                  });
                  executeSearch();
                }}
              >
                필터 초기화
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 검색 결과 */}
      <Card 
        title={`검색 결과 (${searchResults.length.toLocaleString()}건)`}
        extra={
          <Space>
            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: 120 }}
            >
              <Option value="table"><TableOutlined /> 테이블</Option>
              <Option value="chart"><BarChartOutlined /> 차트</Option>
              <Option value="correlation"><DotChartOutlined /> 상관관계</Option>
            </Select>
            <Button 
              icon={<DownloadOutlined />}
              onClick={() => {
                const exportData = selectedData.length > 0 ? selectedData : searchResults;
                exportToCSV(exportData, `data_explorer_${dayjs().format('YYYY-MM-DD_HH-mm')}.csv`);
              }}
            >
              내보내기
            </Button>
          </Space>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text>데이터를 검색하고 있습니다...</Text>
            </div>
          </div>
        ) : (
          <>
            {searchResults.length === 0 ? (
              <Alert 
                message="검색 결과가 없습니다" 
                description="검색 조건을 확인하고 다시 시도해주세요."
                type="info" 
                showIcon 
              />
            ) : (
              <>
                {viewMode === 'table' && <TableView />}
                {viewMode === 'chart' && <ChartView />}
                {viewMode === 'correlation' && <CorrelationView />}
              </>
            )}
          </>
        )}
      </Card>

      <AdvancedFiltersModal />
    </div>
  );
};

export default DataExplorer;
