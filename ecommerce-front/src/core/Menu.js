import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth/index';
import { itemTotal } from '../core/cartHelpers';
const isActive = (history, path) => {
  console.log('path:', history.location.pathname);
  if (history.location.pathname === path) {
    return {
      color: '#ff9900',
    };
  } else {
    return {
      color: '#ffffff',
    };
  }
};

const Menu = ({ history }) => {
  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link className="nav-link" style={isActive(history, '/')} to="/">
            {' '}
            Home{' '}
          </Link>{' '}
        </li>{' '}
        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, '/cart')}
            to="/cart"
          >
            Cart
            <sup>
              <small className="cart-badge">{itemTotal()}</small>
            </sup>
          </Link>
        </li>
        {isAuthenticated() && isAuthenticated().user.role === 0 && (
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, '/user/dashboard')}
              to="/user/dashboard"
            >
              User Dashboard
            </Link>
          </li>
        )}
        {isAuthenticated() && isAuthenticated().user.role === 1 && (
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, '/admin/dashboard')}
              to="/admin/dashboard"
            >
              Admin Dashboard
            </Link>
          </li>
        )}
        {!isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, '/signin')}
                to="/signin"
              >
                Signin
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, '/signup')}
                to="/signup"
              >
                Signup
              </Link>
            </li>
          </>
        )}
        {isAuthenticated() && (
          <li className="nav-item">
            <span
              className="nav-link"
              style={{
                cursor: 'pointer',
                color: '#ffffff',
              }}
              onClick={() =>
                signout(() => {
                  history.push('/');
                })
              }
            ></span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
