import { API } from '../config';
import React from 'react';

const ShowImage = ({ item, url }) => (
  <div className="product-img">
    <div
      // src={`${API}/${url}/photo/${item._id}`}
      alt={item.name}
      className="mb-3 card-image"
      style={{
        backgroundImage: 'url(' + `${API}/${url}/photo/${item._id}` + ')',
      }}
    ></div>
  </div>
);

export default ShowImage;
