import React from 'react';
import { Card, Alert } from 'antd';

const TestPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Alert
        message="테스트 페이지"
        description="이 페이지가 보인다면 라우팅이 정상적으로 작동하고 있습니다."
        type="success"
        showIcon
        style={{ marginBottom: '24px' }}
      />
      
      <Card title="간단한 테스트">
        <p>이 페이지가 정상적으로 표시되는지 확인하는 테스트 페이지입니다.</p>
        <p>현재 시간: {new Date().toLocaleString('ko-KR')}</p>
      </Card>
    </div>
  );
};

export default TestPage;
