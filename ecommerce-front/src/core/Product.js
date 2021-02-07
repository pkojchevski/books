import React, { useState, useEffect } from 'react';
import { read, listRelated } from './apiCore';
import Layout from '../core/Layout';
import Card from '../core/Card';

const Product = ({ props }) => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
        // fetch related products
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setRelatedProduct(data);
          }
        });
      }
    });
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      title={product.name}
      description={
        product && product.decription && product.description.substring(0, 100)
      }
      className="container-fluid"
    >
      <h2 className="mb-4">Single Product</h2>
      <div className="row">
        <div className="col-8">
          {product && product.description && (
            <Card product={product} showViewProductButton={false} />
          )}
        </div>

        <div className="col-4">
          <h4>Related Products</h4>
          {relatedProduct.map((p, i) => (
            <div className="mb-3">
              <Card key={i} product={p} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
