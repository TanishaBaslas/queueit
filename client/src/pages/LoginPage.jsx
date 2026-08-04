function LoginPage() {
  const handleLogin = () => {
    window.location.href = 'https://queueit-backend-oaib.onrender.com/auth/google';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      fontFamily: 'sans-serif'
    }}>
      <h1>QueueIt Admin</h1>
      <p>Please login to manage your queues</p>
      <button
        onClick={handleLogin}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Login with Google
      </button>
    </div>
  );
}

export default LoginPage;