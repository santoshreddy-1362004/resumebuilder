import React from 'react'

const TestApp = () => {
  return (
    <div style={{padding: '20px', fontSize: '24px', color: 'blue'}}>
      <h1>React is Working! 🎉</h1>
      <p>If you can see this, React is loading properly.</p>
      <button onClick={() => alert('Button works!')}>Test Button</button>
    </div>
  )
}

export default TestApp