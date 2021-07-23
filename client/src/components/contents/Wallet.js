import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

import { Row, Col, Divider } from 'antd';
import './Wallet.css';
import { Card, Avatar, Modal, Button } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined
} from '@ant-design/icons';
import bitcoin from '../../img/bitcoin.png';
import { ConsoleWriter } from 'istanbul-lib-report';
import QRCode from 'qrcode.react';

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
                    <p>0.00BTH</p>
                  </Col>
                </div>
                <div>
                  <div className="function">
                    <Col className="gutter-row" span={8}>
                      <div className="receive">
                        <i style={{ display: 'inline' }} class="fab fa-gg"></i>
                        <p onClick={showModal}>ReceiveETH</p>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <div>
                        <i
                          style={{ display: 'inline' }}
                          class="fas fa-angle-double-right"
                        ></i>
                        <p onClick={sellShowModal}>Sell</p>
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
          <Col className="gutter-row" span={6}>
            <div style={style}>col-6</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>col-6</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>col-6</div>
          </Col>
        </Row>
      </div>

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
            value={user && user.bitcoinAddress.address}
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
            <QRCode
              id="qrCodeEl"
              size={150}
              value={user && user.bitcoinAddress.address}
            />
          </div>
        </div>
      </Modal>

      {/* Modal for Send BTC */}

      <Modal
        style={{ textAlign: 'center' }}
        visible={sellShow}
        title="Sell"
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
          <h3 style={{ paddingBottom: '10px' }}>Sell BTC</h3>

          <p>Copy Wallet address below or scan barcode to receive bitcoin</p>
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
