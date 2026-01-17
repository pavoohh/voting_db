import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

export default function App() {
  const [showSplash1, setShowSplash1] = useState(true);
  const [showSplash2, setShowSplash2] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // ERROR MESSAGE STATES
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [otpError, setOtpError] = useState("");
  
  // SUCCESS MESSAGE STATES
  const [loginSuccess, setLoginSuccess] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // LOGIN STATES
  const [loginVoterId, setLoginVoterId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  
  // FORGOT PASSWORD STATES
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  // REGISTER STATES
  const [registerName, setRegisterName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerGender, setRegisterGender] = useState("");
  const [registerAge, setRegisterAge] = useState("");
  const [registerDob, setRegisterDob] = useState("");
  const [registerVoterId, setRegisterVoterId] = useState("");
  const [registerAadhar, setRegisterAadhar] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerOtp, setRegisterOtp] = useState("");

  /* ===== SPLASH FLOW ===== */
  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowSplash1(false);
      setShowSplash2(true);
    }, 2500);
    return () => clearTimeout(t1);
  }, []);

  /* ===== OTP TIMER ===== */
  useEffect(() => {
    if (otpTimer > 0) {
      const t = setInterval(() => setOtpTimer(v => v - 1), 1000);
      return () => clearInterval(t);
    }
  }, [otpTimer]);

  /* ===== SEND OTP ===== */
  const handleSendOtp = async (email) => {
    // Validate all required fields before sending OTP
    if (!email) {
      setOtpError("Please enter email before sending OTP");
      return;
    }
    if (!registerName) {
      setOtpError("Please enter your first name");
      return;
    }
    if (!registerLastName) {
      setOtpError("Please enter your last name");
      return;
    }
    if (!registerAddress) {
      setOtpError("Please enter your address");
      return;
    }
    if (!registerGender) {
      setOtpError("Please select your gender");
      return;
    }
    if (!registerAge || parseInt(registerAge) < 18) {
      setOtpError("Please enter a valid age (18+)");
      return;
    }
    if (!registerDob) {
      setOtpError("Please enter your date of birth");
      return;
    }
    if (!registerVoterId) {
      setOtpError("Please enter your Voter ID");
      return;
    }
    if (!registerAadhar) {
      setOtpError("Please enter your Aadhar number");
      return;
    }
    if (!registerPassword) {
      setOtpError("Please enter a password");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: `${email}@gmail.com` })
      });

      const data = await res.json();
      if (res.ok) {
        setOtpError(data.message);
        setOtpTimer(35);
      } else {
        setOtpError(data.message);
      }
    } catch {
      setOtpError("Server error while sending OTP");
    }
  };

  /* ===== LOGIN ===== */
  const handleLogin = async () => {
    setLoginError("");
    if (!loginVoterId) {
      setLoginError("Please enter Voter ID");
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter Password");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voter_id: loginVoterId,
          password: loginPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        // Store user details from the response
        // Handle different possible response structures
        let userData = data;
        if (data.user) {
          userData = data.user;
        } else if (data.data) {
          userData = data.data;
        }

        // Try multiple possible property names for the user's name
        const firstName = userData.first_name || userData.name || userData.firstName || userData.firstname || "User";
        const lastName = userData.last_name || userData.lastName || userData.lastname || "";
        setUserName(lastName ? `${firstName} ${lastName}` : firstName);
        setUserGender(userData.gender || "male");
        setLoginSuccess("Login successful!");
        setTimeout(() => {
          setShowDashboard(true);
          setLoginSuccess("");
        }, 1500);
      } else {
        setLoginError(data.message);
      }
    } catch {
      setLoginError("Login failed");
    }
  };

  /* ===== REGISTER ===== */
  const handleRegister = async () => {
    setRegisterError("");
    if (!registerName) {
      setRegisterError("Please fill username");
      return;
    }
    if (!registerEmail) {
      setRegisterError("Please enter email");
      return;
    }
    if (!registerOtp) {
      setRegisterError("Please enter OTP");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: registerName,
          last_name: registerLastName,
          email: `${registerEmail}@gmail.com`,
          voter_id: registerVoterId,
          aadhar_number: registerAadhar,
          age: registerAge,
          dob: registerDob,
          address: registerAddress,
          gender: registerGender,
          password: registerPassword,
          otp: registerOtp
        })
      });

      const data = await res.json();
      if (res.ok) {
        setUserName(registerName);
        setRegisterSuccess("Registration successful!");
        setTimeout(() => {
          setShowDashboard(true);
          setRegisterSuccess("");
        }, 1500);
      } else {
        setRegisterError(data.message);
      }
    } catch {
      setRegisterError("Signup failed");
    }
  };

  /* ===== SPLASH SCREEN 1 ===== */
  if (showSplash1) {
    return (
      <div className="splash-wrapper">
        <div className="splash-card">
          <h1>E-Vote</h1>
          <div className="dots">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
    );
  }

  /* ===== SPLASH SCREEN 2 ===== */
  if (showSplash2) {
    return (
      <div className="splash2-wrapper">
        <div className="splash2-card">
          <h3 className="welcome-text">Welcome To</h3>

          <img
            src="/images/vote-icon.jpeg"
            alt="E-Voting"
            className="splash2-logo rotate"
          />

          <p>Vote anytime, anywhere</p>
          <p className="college-text">JSS Polytechnic For Women</p>

          <button
            className="continue-btn move-btn"
            onClick={() => setShowSplash2(false)}
          >
            Let's Continue
          </button>

          <div className="dots dots-bottom">
            <span></span><span></span><span></span><span></span>
          </div>

          <p className="team-title">Team Members</p>
          <p className="team-names">
            Thanushree, Pavana, Upanvitha, Sneha
          </p>
        </div>
      </div>
    );
  }

  /* ===== DASHBOARD ===== */
  if (showDashboard) {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-left">
              <div className="menu-lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <h1 className="e-vote-title">E-Vote</h1>
            </div>
            <div className="header-right">
              <div className="search-bar">
                <input type="text" placeholder="Search..." />
                <span className="search-icon">🔍</span>
              </div>
              <div className="notification-icon">
                <span className="bell-icon">🔔</span>
                <span className="notification-badge">3</span>
              </div>
              <div className="account-icon">
                {userGender === "female" ? (
                  <img 
                    src="https://img.freepik.com/free-vector/young-woman-avatar-cartoon-character-portrait_18591-61131.jpg?w=200" 
                    alt="Profile"
                    className="bitmoji-avatar"
                  />
                ) : (
                  <img 
                    src="https://img.freepik.com/free-vector/young-man-avatar-cartoon-character-portrait_18591-61135.jpg?w=200" 
                    alt="Profile"
                    className="bitmoji-avatar"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            {/* Left Sidebar */}
            <div className="sidebar">
              <div className="user-profile">
                {userGender === "female" ? (
                  <img 
                    src="https://img.freepik.com/free-vector/young-woman-avatar-cartoon-character-portrait_18591-61131.jpg?w=200" 
                    alt="Profile"
                    className="bitmoji-avatar-large"
                  />
                ) : (
                  <img 
                    src="https://img.freepik.com/free-vector/young-man-avatar-cartoon-character-portrait_18591-61135.jpg?w=200" 
                    alt="Profile"
                    className="bitmoji-avatar-large"
                  />
                )}
                <h3>{userName}</h3>
                <p>Registered Voter</p>
              </div>

              <div className="sidebar-menu">
                <div className="menu-item active">
                  <span>🗳️</span>
                  <span>Vote</span>
                </div>
                <div className="menu-item">
                  <span>📋</span>
                  <span>Voter Guidance</span>
                </div>
                <div className="menu-item">
                  <span>⚙️</span>
                  <span>Settings</span>
                </div>
                <div className="menu-item logout">
                  <span>🚪</span>
                  <span>Logout</span>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
              {/* Top Row */}
              <div className="content-row">
                {/* Ongoing Elections */}
                <div className="card ongoing-elections">
                  <h2>Ongoing Elections</h2>
                  <div className="election-item">
                    <img 
                      src="https://img.freepik.com/free-vector/election-concept-illustration_114360-8276.jpg?w=300" 
                      alt="Election"
                      className="election-image"
                    />
                    <div className="election-details">
                      <h3>General Election 2024</h3>
                      <p>Vote for your preferred candidate</p>
                      <button className="vote-btn">Vote Now</button>
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div className="card calendar-card">
                  <h2>Calendar</h2>
                  <div className="calendar-content">
                    <div className="current-date">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="current-time">
                      {new Date().toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="content-row">
                {/* Voting Results */}
                <div className="card voting-results">
                  <h2>Voting Results</h2>
                  <div className="results-container">
                    <div className="result-item">
                      <div className="candidate-info">
                        <div className="candidate-avatar">
                          {userGender === "female" ? (
                            <img 
                              src="https://img.freepik.com/free-vector/young-woman-avatar-cartoon-character-portrait_18591-61131.jpg?w=200" 
                              alt="Candidate 1"
                            />
                          ) : (
                            <img 
                              src="https://img.freepik.com/free-vector/young-man-avatar-cartoon-character-portrait_18591-61135.jpg?w=200" 
                              alt="Candidate 1"
                            />
                          )}
                        </div>
                        <div className="candidate-details">
                          <h4>Candidate 1</h4>
                          <p>40 votes</p>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '40%' }}></div>
                      </div>
                    </div>

                    <div className="result-item">
                      <div className="candidate-info">
                        <div className="candidate-avatar">
                          <img 
                            src="https://img.freepik.com/free-vector/young-man-avatar-cartoon-character-portrait_18591-61135.jpg?w=200" 
                            alt="Candidate 2"
                          />
                        </div>
                        <div className="candidate-details">
                          <h4>Candidate 2</h4>
                          <p>35 votes</p>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '35%' }}></div>
                      </div>
                    </div>

                    <div className="result-item">
                      <div className="candidate-info">
                        <div className="candidate-avatar">
                          <img 
                            src="https://img.freepik.com/free-vector/young-man-avatar-cartoon-character-portrait_18591-61135.jpg?w=200" 
                            alt="Candidate 3"
                          />
                        </div>
                        <div className="candidate-details">
                          <h4>Candidate 3</h4>
                          <p>25 votes</p>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voter Statistics */}
                <div className="card voter-stats">
                  <h2>Voter Statistics</h2>
                  <div className="stats-wrapper">
                    <div className="circles-container">
                      <div className="stat-circle">
                        <span className="stat-number">5</span>
                      </div>
                      <span className="stat-label">Total Number ofCandidates</span>
                      <div className="stat-circle">
                        <span className="stat-number">500</span>
                      </div>
                      <span className="stat-label"> Total Number of Registered Voters</span>
                      <div className="stat-circle">
                        <span className="stat-number">200</span>
                      </div>
                      <span className="stat-label">Total Numbers Voted</span>
                    </div>
                    <div className="stats-table-container">
                      <table className="stats-table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Value</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Candidates</td>
                            <td>5</td>
                            <td>100%</td>
                          </tr>
                          <tr>
                            <td>Registered Voters</td>
                            <td>500</td>
                            <td>100%</td>
                          </tr>
                          <tr>
                            <td>Total Voted</td>
                            <td>200</td>
                            <td>40%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Election Activities */}
              <div className="card election-activities">
                <h2>Election Activities</h2>
                <div className="activities-grid">
                  <div className="activity-item pending">
                    <div className="activity-icon">⏳</div>
                    <div className="activity-content">
                      <h4>Pending Elections</h4>
                      <p>3 elections pending</p>
                    </div>
                  </div>
                  <div className="activity-item upcoming">
                    <div className="activity-icon">📅</div>
                    <div className="activity-content">
                      <h4>Upcoming Elections</h4>
                      <p>Next in 15 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===== AUTH SCREENS ===== */
  return (
    <div className="auth-wrapper">
      <div className={`auth-box ${isSignup ? "signup-active" : ""}`}>

        <div className="form-panel">
          <div className="form-header">
            {!isSignup ? (
              <h2>Login</h2>
            ) : (
              <h2>Register</h2>
            )}
          </div>
          {!isSignup ? (
            <>
              <input placeholder="Voter ID" value={loginVoterId} onChange={e => setLoginVoterId(e.target.value)} />
              <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />

              <div className="forgot-password-link">
                <span onClick={() => setShowForgotPassword(true)}>Forgot Password?</span>
              </div>

              {loginError && <div className="error-message">{loginError}</div>}
              {loginSuccess && <div className="success-message">{loginSuccess}</div>}

              <button className="main-btn" onClick={handleLogin}>Log in</button>
            </>
          ) : (
            <>
              <div className="row">
                <input placeholder="Firstname" value={registerName} onChange={e => setRegisterName(e.target.value)} />
                <input placeholder="Lastname" value={registerLastName} onChange={e => setRegisterLastName(e.target.value)} />
              </div>

              <div className="email-input-wrapper">
                <input 
                  placeholder="Email" 
                  value={registerEmail} 
                  onChange={e => setRegisterEmail(e.target.value)} 
                  className="email-input"
                />
                <span className="email-suffix">@gmail.com</span>
              </div>
              <div className="row">
                <input placeholder="Address" value={registerAddress} onChange={e => setRegisterAddress(e.target.value)} />
                <select value={registerGender} onChange={e => setRegisterGender(e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="row">
                <input 
                  type="number" 
                  placeholder="Age" 
                  value={registerAge} 
                  onChange={e => {
                    const age = parseInt(e.target.value);
                    if (!isNaN(age) && age >= 18) {
                      setRegisterAge(age.toString());
                      // Auto-calculate DOB based on age
                      const currentYear = new Date().getFullYear();
                      const birthYear = currentYear - age;
                      setRegisterDob(`${birthYear}-01-01`);
                    } else if (e.target.value === '') {
                      setRegisterAge('');
                      setRegisterDob('');
                    }
                  }}
                  min="18"
                  max="120"
                />
                <input 
                  type="date" 
                  placeholder="Date of Birth" 
                  value={registerDob} 
                  onChange={e => {
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();
                    let age = today.getFullYear() - selectedDate.getFullYear();
                    const m = today.getMonth() - selectedDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
                      age--;
                    }
                    if (age >= 18) {
                      setRegisterDob(e.target.value);
                      setRegisterAge(age.toString());
                    } else if (e.target.value === '') {
                      setRegisterDob('');
                      setRegisterAge('');
                    } else {
                      setRegisterError("You must be at least 18 years old to register");
                    }
                  }}
                  max={new Date().toISOString().split("T")[0]}
                  min={new Date(new Date().getFullYear() - 120, 0, 1).toISOString().split("T")[0]}
                />
              </div>

              <div className="row">
                <input placeholder="Voter ID" value={registerVoterId} onChange={e => setRegisterVoterId(e.target.value)} />
                <input placeholder="Aadhar ID" value={registerAadhar} onChange={e => setRegisterAadhar(e.target.value)} />
              </div>

              <div className="row">
                <input type="password" placeholder="Password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" />
              </div>

              <div className="otp-row">
                <input placeholder="Email OTP" value={registerOtp} onChange={e => setRegisterOtp(e.target.value)} />
                <button className="otp-btn" disabled={otpTimer > 0} onClick={() => handleSendOtp(registerEmail)}>
                  {otpTimer > 0 ? `${otpTimer}s` : "Send"}
                </button>
              </div>

              {otpError && <div className="error-message otp-error">{otpError}</div>}
              {registerError && <div className="error-message">{registerError}</div>}
              {registerSuccess && <div className="success-message">{registerSuccess}</div>}

              <button className="main-btn" onClick={handleRegister}>Register</button>
            </>
          )}
        </div>

        <div className="side-panel">
          <img
            src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT-zY-3duw8AeoOvT_hzYLKa_MO9HdtHiwvMlxn9IkjrXROpQrb"
            alt="Side Panel Image"
            className="side-panel-image"
          />
          {!isSignup ? (
            <>
              <h2>Welcome Back!</h2>
              <p>Access your account to vote and participate in elections. Your voice matters in shaping the future.</p>
              <button className="side-btn" onClick={() => setIsSignup(true)}>Create Account</button>
            </>
          ) : (
            <>
              <h2>Join Us Today!</h2>
              <p>Register now to become a part of our voting community. Make your vote count and help build a better tomorrow.</p>
              <button className="side-btn" onClick={() => setIsSignup(false)}>Sign In</button>
            </>
          )}
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="forgot-password-modal">
            <button className="close-modal" onClick={() => {
              setShowForgotPassword(false);
              setForgotPasswordStep(1);
              setForgotEmail("");
              setForgotOtp("");
              setNewPassword("");
              setConfirmPassword("");
              setForgotPasswordError("");
              setForgotPasswordSuccess("");
            }}>&times;</button>
            
            <h2>Reset Password</h2>
            
            {forgotPasswordStep === 1 && (
              <>
                <p>Enter your email address to receive a verification code</p>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                />
                {forgotPasswordError && <div className="error-message">{forgotPasswordError}</div>}
                <button className="main-btn" onClick={() => {
                  if (!forgotEmail) {
                    setForgotPasswordError("Please enter your email address");
                    return;
                  }
                  // Here you would typically send OTP to the email
                  setForgotPasswordStep(2);
                  setForgotPasswordError("");
                }}>Send OTP</button>
              </>
            )}

            {forgotPasswordStep === 2 && (
              <>
                <p>Enter the verification code sent to your email</p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={forgotOtp}
                  onChange={e => setForgotOtp(e.target.value)}
                />
                {forgotPasswordError && <div className="error-message">{forgotPasswordError}</div>}
                <button className="main-btn" onClick={() => {
                  if (!forgotOtp) {
                    setForgotPasswordError("Please enter the OTP");
                    return;
                  }
                  // Here you would typically verify the OTP
                  setForgotPasswordStep(3);
                  setForgotPasswordError("");
                }}>Verify OTP</button>
              </>
            )}

            {forgotPasswordStep === 3 && (
              <>
                <p>Enter your new password</p>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {forgotPasswordError && <div className="error-message">{forgotPasswordError}</div>}
                {forgotPasswordSuccess && <div className="success-message">{forgotPasswordSuccess}</div>}
                <button className="main-btn" onClick={() => {
                  if (!newPassword || !confirmPassword) {
                    setForgotPasswordError("Please fill in all fields");
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setForgotPasswordError("Passwords do not match");
                    return;
                  }
                  if (newPassword.length < 6) {
                    setForgotPasswordError("Password must be at least 6 characters long");
                    return;
                  }
                  // Here you would typically update the password in the backend
                  setForgotPasswordSuccess("Password updated successfully!");
                  setTimeout(() => {
                    setShowForgotPassword(false);
                    setForgotPasswordStep(1);
                    setForgotEmail("");
                    setForgotOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setForgotPasswordSuccess("");
                  }, 2000);
                }}>Update Password</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
