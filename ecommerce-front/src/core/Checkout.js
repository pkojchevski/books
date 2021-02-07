import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { generateToken } from '../../../ecommerce/controllers/braintree';
import {
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from './apiCore';
import DropIn from 'braintree-web-drop-in-react';
import { emptyCart } from './cartHelpers';

const Checkout = ({ products }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: '',
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;
  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div className="">{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  const buy = () => {
    setData({ loading: true });
    // send the nonce to your server
    // nonce - data.instance.requestPaymentMethid()
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        // once you habve nonce(card type, card number) send nonce as 'paymentMethodNonce'
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        };
        processPayment(userId, token, paymentData)
          .then((response) => {
            const createOrderData = {
              produvts: products,
              transaction_id: response.transaction._id,
              amount: response.transaction.amount,
              address: data.address,
            };
            createOrder(userId, token, createOrderData);
            setData({ ...data, success: response.success });
            emptyCart(() => {
              console.log('payment finished');
              setData({ loading: false });
            });
          })
          .catch((error) => {
            console.log(error);
            setData({ loading: false });
          });
      })
      .catch((error) => {
        console.log('drop in error:', error);
        setData({ ...data, error: error.message });
      });
  };

  const handleAddress = (event) => {
    setData({ ...data, address: event.tartet.value });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: '' })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="form-group mb-3">
            <label htmlFor="" className="text-muted">
              Delivery address:
            </label>
            <textarea
              className="form-control"
              onChange={handleAddress}
              value={data.address}
              placeholder="Type your delivery address here..."
            />
          </div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: 'vault',
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = (error) => {
    <div
      className="alert alert-danger"
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>;
  };

  const showSuccess = (success) => {
    <div
      className="alert alert-info"
      style={{ display: success ? '' : 'none' }}
    >
      Thanks! Your payment was successfull.
    </div>;
  };

  const showLoading = (loading) => loading && <h2>Loading...</h2>;
  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
