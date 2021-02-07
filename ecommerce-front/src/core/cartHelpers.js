export const addItem = (item, next) => {
  let cart = [];
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
    cart.push({
      ...item,
      count: 1,
    });

    cart = Array.from(new Set(cart.map((p) => p.id))).map((id) => {
      return cart.find((p) => p._id === id);
    });

    localStorage.setItem('cart', JSON.stringify(cart));

    next();
  }
};

export const itemTotal = () => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      return localStorage.getItem('cart').length;
    }
  }
};

export const getCart = () => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      return localStorage.getItem('cart').length;
    }
  }
  return [];
};

export const updateItem = (productId, count) => {
  let cart = [];
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      return localStorage.getItem('cart').length;
    }

    cart.map((product, i) => {
      if ((product._id = productId)) {
        cart[i].count = count;
      }
    });
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  return cart;
};

export const removeItem = (productId) => {
  let cart = [];
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      cart = localStorage.getItem('cart');
    }

    cart.map((product, i) => {
      if (product._id === productId) {
        cart.splice(cart[i], 1);
      }
    });

    localStorage.setItem('cart', JSON.stringify(cart));
  }
  return cart;
};


export const emptyCart = next => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      localStorage.removeItem('cart');
      next();
    }
}