import "./example-card.css";

export function ExampleCard() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">
          Please enter your credentials to continue
        </p>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="field-email">Email</label>
            <input
              id="field-email"
              placeholder="Enter your email"
              required
              type="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="field-password">Password</label>
            <input
              id="field-password"
              placeholder="Enter your password"
              required
              type="password"
            />
          </div>
          <div className="form-actions">
            <button className="login-button" type="submit">
              Sign In
            </button>
          </div>
          <div className="form-footer">
            <a className="forgot-password" href="#">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
