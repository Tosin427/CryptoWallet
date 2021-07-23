import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import 'antd/dist/antd.css';
import { Form, Input, Button, Checkbox } from 'antd';
import './Login.css';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="main">
      <div className="contain">
        <div>
          <h1
            className="large text-primary"
            style={{ color: '#004100', fontSize: '28px' }}
          >
            Sign In
          </h1>
          <p className="lead" style={{ color: '#004100', fontSize: '16px' }}>
            <i className="fas fa-user" /> Sign Into Your Account
          </p>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
                required
                style={{
                  width: '100%',
                  borderRadius: '5px',
                  border: '2px solid #fff',
                  backgroundColor: '#004100',
                  color: '#fff',
                  padding: '8px 10px',
                  margin: '8px 0'
                }}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                minLength="6"
                style={{
                  width: '100%',
                  borderRadius: '5px',
                  border: '2px solid #fff',
                  backgroundColor: '#004100',
                  color: '#fff',
                  padding: '8px 10px',
                  margin: '8px 0'
                }}
              />
            </div>
            <input
              type="submit"
              className="btn btn-primary"
              value="Login"
              style={{
                backgroundColor: '#004100',
                border: 'none',
                color: '#fff',
                padding: '16px 32px',
                textDecoration: 'none',
                margin: '4px 2px',
                cursor: 'pointer'
              }}
            />
          </form>
          <p className="my-1" style={{ color: '#004100', paddingTop: '10px' }}>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
