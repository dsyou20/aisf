import React from 'react';

const SimpleTest = () => {
  console.log('SimpleTest 컴포넌트가 렌더링되었습니다!');
  
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      backgroundColor: '#f0f2f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1890ff', fontSize: '32px' }}>
        🎉 테스트 페이지가 정상 작동합니다!
      </h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        현재 시간: {new Date().toLocaleString('ko-KR')}
      </p>
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2>라우팅 테스트 성공!</h2>
        <p>이 페이지가 보인다면 React Router가 정상 작동하고 있습니다.</p>
      </div>
    </div>
  );
};

export default SimpleTest;
