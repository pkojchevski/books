import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from './apiCore';
import Search from './Search';
import Card from '../core/Card';

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadProductsBySell = () => {
    getProducts('sold').then((data) => {
      if (data && data.error) {
        setError(error);
      } else {
        setProductsBySell(data);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadProductsByArrival = () => {
    getProducts('createdAt').then((data) => {
      if (data && data.error) {
        setError(error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  const noProductsAvailable = (products) => {
    return (
      products &&
      products.length === 0 && (
        <h4 className="text-warning">Products not available for this group</h4>
      )
    );
  };

  return (
    <Layout
      title="Home Page"
      description="E-commerce"
      className="container-fluid"
    >
      <Search />
      <h2 className="mb-4"> New Arrivals </h2>
      {noProductsAvailable(productsByArrival)}
      <div className="row">
        {productsByArrival &&
          productsByArrival.map((product, i) => (
            <div key={i} className="col-4 mb-3">
              <Card product={product} />
            </div>
          ))}
      </div>
      <hr />
      <h2 className="mb-4"> Best Sellers </h2>
      {noProductsAvailable(productsBySell)}
      <div className="row">
        {productsBySell &&
          productsBySell.map((product, i) => (
            <div key={i} className="col-4 mb-3">
              <Card product={product} />
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default Home;
