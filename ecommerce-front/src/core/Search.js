import React, { useState, useEffect } from 'react';
import { getCategories, list } from './apiCore';
import Card from './Card';
const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false,
  });

  const { categories, category, search, results, searched } = data;

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data && data.error) {
      } else {
        setData({
          ...data,
          categories: data,
        });
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = () => {
    if (search) {
      list({
        search: search || undefined,
        category,
      }).then((res) => {
        if (res.error) {
          console.log(res.error);
        } else {
          setData({
            ...data,
            results: res.data,
            searched: true,
          });
        }
      });
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (ev) => {
    setData({
      ...data,
      [name]: ev.target.value,
      searched: false,
    });
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group-prepend">
          <select className="btn mr-2" onChange={handleChange('category')}>
            <option value="All"> All </option>{' '}
            {categories &&
              categories.map((c, i) => (
                <option key={i} value="c._id">
                  {' '}
                  {c.name}{' '}
                </option>
              ))}{' '}
          </select>{' '}
        </div>{' '}
        <div className="input-group input-group-lg">
          <input
            type="search"
            className="form-control"
            onChange={handleChange('search')}
            placeholder="Search by name"
          />
        </div>{' '}
        <div
          className="btn input-group-append"
          style={{
            border: 'none',
          }}
        >
          <button className="input-group-text">Search </button>{' '}
        </div>{' '}
      </span>
    </form>
  );

  const searchedMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Founded ${results.length} products`;
    }
    if (searched && results.length < 1) {
      return `No products found`;
    }
  };
  const searchedProducts = (results = []) => {
    return (
      <div>
        <h2 className="mt-4 mb-4"> {searchedMessage(searched, results)} </h2>{' '}
        <div className="row">
          {' '}
          {results.map((r, i) => (
            <Card key={i} product={r} />
          ))}{' '}
        </div>{' '}
      </div>
    );
  };

  return (
    <div className="row">
      <div className="container mb-3"> {searchForm()} </div>{' '}
      <div className="container-fluid mb-3"> {searchedProducts(results)} </div>{' '}
    </div>
  );
};

export default Search;
