const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const app = express();
const PORT = 8080;

const ECOMMERCE_APIS = [
  'http://ecommerce-api1.com/products',
  'http://ecommerce-api2.com/products',
  'http://ecommerce-api3.com/products',
  'http://ecommerce-api4.com/products',
  'http://ecommerce-api5.com/products',
];


const fetchProducts = async (category) => {
  const requests = ECOMMERCE_APIS.map(api => axios.get(`${api}?category=${category}`));
  const responses = await Promise.all(requests);
  const products = responses.flatMap(response => response.data.products);
  return products;
};

const sortProducts = (products, sortBy, order) => {
  return _.orderBy(products, [sortBy], [order]);
};

const paginateProducts = (products, page, n) => {
  const start = (page - 1) * n;
  return products.slice(start, start + n);
};

app.get('/categories/:categoryname/products', async (req, res) => {
  try {
    const { categoryname } = req.params;
    const { n = 10, page = 1, sortBy = 'price', order = 'asc' } = req.query;

    const products = await fetchProducts(categoryname);
    
    products.forEach(product => {
      product.id = uuidv4();
    });

    const sortedProducts = sortProducts(products, sortBy, order);
    const paginatedProducts = paginateProducts(sortedProducts, parseInt(page), parseInt(n));

    res.json({ products: paginatedProducts });
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/categories/:categoryname/products', async (req, res) => {
    try {
      const { categoryname } = req.params;
      let { n = 10, page = 1, sortBy = 'price', order = 'asc' } = req.query;
      n = parseInt(n);
      page = parseInt(page);
      if (isNaN(n) || n <= 0) n = 10;
      if (isNaN(page) || page <= 0) page = 1;
  
      const products = await fetchProducts(categoryname);
      
      products.forEach(product => {
        product.id = uuidv4();
      });
  
      const sortedProducts = sortProducts(products, sortBy, order);
      const paginatedProducts = paginateProducts(sortedProducts, page, n);
  
      res.json({ products: paginatedProducts });
    } catch (error) {
      console.error(`Error fetching products: ${error.message}`);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
