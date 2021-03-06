import React, { useState, useEffect } from 'react';
import bitcore from 'bitcore-lib';
import axios from 'axios';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

import { Row, Col, Divider } from 'antd';
import './Wallet.css';
import { Card, Avatar, Modal, Button, Form, Input, Radio } from 'antd';

import QRCode from 'qrcode.react';

import sendBitcoin from './sendBitcoin';
import Reports from './Reports';
// const sendBitcoin = require('../contents/sendBitcoin');
// import bitcoin from 'bitcoinjs-libs';
// sendBitcoin('miT7R84ThNnF49QA3KbQoRAtULdTUC2JH4', '0.005');
// import $ from 'jquery';
// const axios = require('axios');
// const bitcore = require('bitcore-lib');
// const multicore = require('multicore-lib');

// const send = sendBitcoin;

const { Meta } = Card;

const style = { background: '#0092ff', padding: '8px 0' };

const Wallet = ({ getCurrentProfile, auth: { user } }) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sellShow, setSellShow] = useState(false);

  const sellShowModal = () => {
    setSellShow(true);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 3000);
  };

  const handleCancel = () => {
    setVisible(false);
    setSellShow(false);
  };

  // fetch Bitcoin Present Pricing
  const [coins, setCoins] = useState([]);

  function copy() {
    const copyText = document.getElementById('address');
    copyText.select();
    // copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Copied your Address: ' + copyText.value);
  }

  // user && user.bitcoinAddress.address;
  const [inputText, setInputText] = useState('');
  const [qrCodeText, setQRCodeText] = useState('');

  // geneerate QR code
  const generateQRCode = () => {
    setQRCodeText(inputText);
  };

  const bitadd = user.bitAdd;

  // console.log(user.bitcoinAddress.key);
  const [balance, setBalance] = useState('');

  useEffect(() => {
    axios
      .get(`https://api.blockcypher.com/v1/btc/main/addrs/${bitadd}/balance`)
      .then((response) => setBalance(response.data.balance / 100000000));
  }, []);

  // console.log(balance);

  // Send Bitcoin Function
  const [inputValues, setInputValues] = useState({
    recieverAddress: '',
    amountToSend: ''
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const { recieverAddress, amountToSend } = inputValues;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('input values from the form', inputValues);
    // send

    // 03453e14d839641ffa973ca48686751cd408d9627e4c5a7d561569af4a66819c1d
    sendBitcoin(user.bitKey, user.bitAdd, recieverAddress, amountToSend);
    // sendBitcoin('mwupF9imTBgK5kkgMQ6Pa8a8CHXmErzB4P', 0.0005);
  };

  // mh4AE4pMsc2M28rN7biuVJpXoLdUSK8A7t
  // 924AKcXdQWS6j9XLkd3Njq1c892Cwp2CMe6e5jdwNi9cXKPEWVc

  // send to account
  // miT7R84ThNnF49QA3KbQoRAtULdTUC2JH4
  // 92BH8HM5kHpGiWRHwJGwUg3aURzcZ8vPuKfHSQirjWRy8j4qmPW

  // Form function
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('vertical');

  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: {
            span: 4
          },
          wrapperCol: {
            span: 14
          }
        }
      : null;
  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: {
            span: 14,
            offset: 4
          }
        }
      : null;

  return (
    <div>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360 }}
      >
        <Row>
          <Col span={24}>
            <h1 style={{ fontSize: '24px', color: 'gray' }}>Wallet</h1>
          </Col>
        </Row>

        <Divider orientation="left">Wallets</Divider>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Row>
            <Col className="gutter-row" span={20}>
              <div className="wallets">
                <div>
                  <Col span={24} className="card-contain">
                    <i class="fab fa-bitcoin"></i>
                    <p>$0.00</p>
                    <p>BTC: {balance}</p>
                  </Col>
                </div>
                <div>
                  <div className="function">
                    <Col className="gutter-row" span={8}>
                      <div className="receive">
                        <i style={{ display: 'inline' }} class="fab fa-gg"></i>
                        <p onClick={showModal}>ReceiveBTC</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div>
                        <i
                          style={{ display: 'inline' }}
                          class="fas fa-angle-double-right"
                        ></i>
                        <p>Sell</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div>
                        <i
                          style={{ display: 'inline' }}
                          class="fas fa-share-square"
                        ></i>
                        <p onClick={sellShowModal}>Send</p>
                      </div>
                    </Col>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={20}>
              <div className="wallets">
                <div>
                  <Col span={24} className="card-contain">
                    <i class="fab fa-ethereum"></i>
                    <p>$0.00</p>
                    <p>ETH: 0.00</p>
                  </Col>
                </div>
                <div>
                  <div className="function">
                    <Col className="gutter-row" span={8}>
                      <div className="receive">
                        <i style={{ display: 'inline' }} class="fab fa-gg"></i>
                        <p>ReceiveETH</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div>
                        <i
                          style={{ display: 'inline' }}
                          class="fas fa-angle-double-right"
                        ></i>
                        <p>Sell</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div>
                        <i
                          style={{ display: 'inline' }}
                          class="fas fa-share-square"
                        ></i>
                        <p>Send</p>
                      </div>
                    </Col>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={20}>
              <div className="wallets">
                <div>
                  <Col span={24} className="card-contain">
                    <i class="fas fa-hand-holding-usd"></i>
                    <p>$0.00</p>
                    <p>USDT: 0.00</p>
                  </Col>
                </div>
                <div>
                  <div className="function">
                    <Col className="gutter-row" span={8}>
                      <div className="receive">
                        <i style={{ display: 'inline' }} class="fab fa-gg"></i>
                        <p>ReceiveUSDT</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div>
                        <i
                          style={{ display: 'inline' }}
                          class="fas fa-angle-double-right"
                        ></i>
                        <p>Sell</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div>
                        <i
                          style={{ display: 'inline' }}
                          class="fas fa-share-square"
                        ></i>
                        <p>Send</p>
                      </div>
                    </Col>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={20}>
              <div className="wallets">
                <div>
                  <Col span={24} className="card-contain">
                    <i class="fab fa-bitcoin"> cash</i>

                    <p>$0.00</p>
                    <p>BCH: 0.00</p>
                  </Col>
                </div>
                <div>
                  <div className="function">
                    <Col className="gutter-row" span={8}>
                      <div className="receive">
                        <i style={{ display: 'inline' }} class="fab fa-gg"></i>
                        <p>ReceiveBCH</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div>
                        <i
                          style={{ display: 'inline' }}
                          class="fas fa-angle-double-right"
                        ></i>
                        <p>Sell</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div>
                        <i
                          style={{ display: 'inline' }}
                          class="fas fa-share-square"
                        ></i>
                        <p>Send</p>
                      </div>
                    </Col>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Row>
      </div>
      <Reports />
      {/* Modal for Recieve BTC */}

      <Modal
        style={{ textAlign: 'center' }}
        visible={visible}
        title="Recieve"
        onOk={handleCancel}
        onCancel={handleCancel}
      >
        <div>
          <i
            style={{
              fontSize: '30px',
              color: 'gold',
              paddingBottom: '10px'
            }}
            class="fab fa-bitcoin"
          ></i>
          <h3 style={{ paddingBottom: '10px' }}>Recieve BTC</h3>
          <p>Copy Wallet address below or scan barcode to receive bitcoin</p>

          {/* <input
            type="text"
            placeholder="Enter input"
            value={user && user.bitcoinAddress.address}
            onChange={(e) => setInputText(e.target.value)}
          /> */}

          {/* <input type="button" value="Generate" onClick={generateQRCode} /> */}

          <input
            id="address"
            style={{
              width: '320px',
              // textAlign: 'center',
              paddingLeft: '10px',
              height: '40px',
              paddingRight: '50px'
            }}
            type="email"
            value={user && user.bitAdd}
            name="email"
          />
          <input
            type="submit"
            value="Copy"
            onClick={copy}
            style={{
              textAlign: 'center',
              marginLeft: '-50px',
              height: '25px',
              width: '50px',
              background: '#004100',
              color: 'white',
              border: '0',
              cursor: 'pointer'
            }}
          />

          <div style={{ paddingTop: '20px' }}>
            <QRCode id="qrCodeEl" size={150} value={user && user.bitAdd} />
          </div>
        </div>
      </Modal>

      {/* Modal for Send BTC */}

      <Modal
        style={{ textAlign: 'center' }}
        visible={sellShow}
        title="Send"
        onOk={handleCancel}
        onCancel={handleCancel}
      >
        <div>
          <i
            style={{
              fontSize: '30px',
              color: 'gold',
              paddingBottom: '10px'
            }}
            class="fab fa-bitcoin"
          ></i>
          <h3 style={{ paddingBottom: '10px' }}>Send BTC</h3>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter Receiver Address"
                name="recieverAddress"
                value={recieverAddress}
                id="receiver"
                onChange={(e) => handleOnChange(e)}
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
                type="text"
                placeholder="Enter Amount to Send"
                name="amountToSend"
                required
                value={amountToSend}
                id="amount"
                onChange={(e) => handleOnChange(e)}
                // minLength="6"
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
              value="Send"
              // onChange={sendBitcoin}
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
        </div>
      </Modal>
    </div>
  );
};

Wallet.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  deleteAccount
})(Wallet);
