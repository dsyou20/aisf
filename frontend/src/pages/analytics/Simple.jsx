import React from 'react';

const SimplePage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>간단한 테스트 페이지</h1>
      <p>이 페이지가 보인다면 라우팅이 작동합니다!</p>
      <p>현재 시간: {new Date().toLocaleString()}</p>
      
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
        <h2>데이터 분석 대시보드 테스트</h2>
        <p>여기에 간단한 차트를 추가해보겠습니다.</p>
        
        <div style={{ 
          width: '100%', 
          height: '200px', 
          backgroundColor: '#fff', 
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '16px'
        }}>
          <p>차트가 여기에 표시됩니다</p>
        </div>
      </div>
    </div>
  );
};

export default SimplePage;
