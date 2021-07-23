import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import logo from '../../img/logo.png';
import { Row, Col, Divider, Button, Card } from 'antd';
import './Landing.css';
import bg from '../../img/bg.svg';
import svglogo from '../../img/feedback.svg';

// const style = { background: '#0092ff', padding: '8px 0' };

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="main">
      <div className="main-build">
        <div style={{ borderRight: '1px solid #fff' }}>
          <img src={logo} alt="" />
        </div>
        <div style={{ paddingRight: '100px', paddingLeft: '20px' }}>
          <p
            style={{
              color: '#fff',
              width: 'auto',
              textAlign: 'justify'
            }}
          >
            Sign Up and get your cryptocurrency wallets, make receving and
            sending of cryto currencies easy, fast and secure
          </p>

          <Link to="/register">
            <Button type="primary" style={{ marginRight: '10px' }}>
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    </div>
    // <div style={{ margin: '0px', height: '100%' }}>
    //   <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
    //     <Col className="gutter-row" span={12}>
    //       <div>
    //         <img src={logo} alt="early baze wallet" />
    //         <div>
    //           <h1>Early Baze Wallet</h1>
    //         </div>
    //       </div>
    //     </Col>
    //     <Col className="gutter-row" span={12}>
    //       <div>
    //         <div>
    //           <p>
    //             Sign Up and get your cryptocurrency wallets, make receving and
    //             sending of cryto currencies easy, fast and secure
    //           </p>
    //         </div>
    //         <Link to="/register">
    //           <Button type="primary">Sign Up</Button>
    //         </Link>
    //         <Link to="/login">
    //           <Button type="primary">Log In</Button>
    //         </Link>
    //       </div>
    //     </Col>
    //   </Row>
    // </div>

    // <section className="landing">
    //   <div className="dark-overlay">
    //     <div className="landing-inner">
    //       <img className="logo-sz" src={logo} alt="early baze wallet" />
    //       <h1 className="x-large">Early Baze Wallet</h1>
    //       <p className="lead">
    //         Create a cryptocurrency wallets fast and reliable and make your
    //         transactions with ease
    //       </p>
    //       <div className="buttons">
    //         <Link to="/register" className="btn btn-primary">
    //           Sign Up
    //         </Link>
    //         <Link to="/login" className="btn btn-light">
    //           Login
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
