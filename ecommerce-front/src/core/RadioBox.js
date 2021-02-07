import React, { useState, Fragment } from 'react';

const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event) => {
    handleFilters(event.target.value);
    setValue(event.target.value);
  };

  return (
    <Fragment>
      {' '}
      {prices.map((p, i) => (
        <div key={i}>
          <input
            onChange={handleChange}
            value={`${p._id}`}
            type="radio"
            name={p}
            className="mr-2 ml-4"
          />
          <label htmlFor="" className="form-check-label">
            {' '}
            {p.name}{' '}
          </label>{' '}
        </div>
      ))}{' '}
    </Fragment>
  );
};

export default RadioBox;
