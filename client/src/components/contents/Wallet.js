import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bitcore from 'bitcore-lib';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

import { Row, Col, Divider } from 'antd';
import './Wallet.css';
import { Card, Avatar, Modal, Button, Form, Input, Radio } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined
} from '@ant-design/icons';
import bitcoin from '../../img/bitcoin.png';
import { ConsoleWriter } from 'istanbul-lib-report';
import QRCode from 'qrcode.react';

import { documentElement } from 'min-document';

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

  const bitadd = user && user.bitcoinAddress.address;
  const [balance, setBalance] = useState('');

  useEffect(() => {
    axios
      .get(
        `https://sochain.com/api/v2/get_tx_unspent/BTCTEST/mtTQNVSaKxqAmnvu86qpcnu276QX2mM6Uv`
      )
      .then((response) => setBalance(response.data.data.txs[0].value));
  }, []);

  // Send Bitcoin Function
  const [inputValues, setInputValues] = useState({
    recieverAddress: '',
    amountToSend: ''
  });

  const { recieverAddress, amountToSend } = inputValues;

  const onChange = (e) =>
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const sendBitcoin = async (recieverAddress, amountToSend) => {
    const sochain_network = 'BTCTEST';
    const privateKey = '93SaZACQTsjNk3TwwbqXE7C6yRjbJi3TBkYhAis22op3wWRXuUK';
    const sourceAddress = 'mtTQNVSaKxqAmnvu86qpcnu276QX2mM6Uv';
    const satoshiToSend = amountToSend * 100000000;
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2;
    const utxos = await axios.get(
      `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
    );
    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;

    let inputs = [];
    utxos.data.data.txs.forEach(async (element) => {
      let utxo = {};
      utxo.satoshis = Math.floor(Number(element.value) * 100000000);
      utxo.script = element.script_hex;
      utxo.address = utxos.data.data.address;
      utxo.txId = element.txid;
      utxo.outputIndex = element.output_no;
      totalAmountAvailable += utxo.satoshis;
      inputCount += 1;
      inputs.push(utxo);
    });

    const transactionSize =
      inputCount * 146 + outputCount * 34 + 10 - inputCount;
    // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte

    fee = transactionSize * 20;
    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error('Balance is too low for this transaction');
    }

    //Set transaction input
    transaction.from(inputs);

    // set the recieving address and the amount to send
    transaction.to(recieverAddress, satoshiToSend);

    // Set change address - Address to receive the left over funds after transfer
    transaction.change(sourceAddress);

    //manually set transaction fees: 20 satoshis per byte
    transaction.fee(fee * 20);

    // Sign transaction with your private key
    transaction.sign(privateKey);

    // serialize Transactions
    const serializedTransaction = transaction.serialize();
    // Send transaction
    const result = await axios({
      method: 'POST',
      url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
      data: {
        tx_hex: serializedTransaction
      }
    });
    return result.data.data;
  };

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
                        <p onClick={showModal}>ReceiveETH</p>
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
          <form className="form" onSubmit={sendBitcoin}>
            <div className="form-group">
              <input
                type="recieverAddress"
                placeholder="Enter Receiver Address"
                name="recieverAddress"
                value={recieverAddress}
                id="receiver"
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
                type="amountToSend"
                placeholder="Enter Amount to Send"
                name="amountToSend"
                required
                value={amountToSend}
                id="amount"
                // onChange={(e) => setAmountToSend(e.target.value)}
                onChange={onChange}
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
