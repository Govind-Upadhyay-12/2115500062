const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const app = express();
const PORT = 8080;

const ECOMMERCE_APIS = [
  'http://20.244.56.144/test/companies/AMZ/categories/',
  'http://20.244.56.144/test/companies/FLP/categories/',
  'http://20.244.56.144/test/companies/SNP/categories/',
  'http://20.244.56.144/test/companies/MYN/categories/',
  'http://20.244.56.144/test/companies/AZO/categories/',
];

const fetchProducts = async (category, minPrice, maxPrice) => {
  const requests = ECOMMERCE_APIS.map(api => 
    axios.get(`${api}${category}/products?minPrice=${minPrice}&maxPrice=${maxPrice}`)
  );
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
    let { n = 10, page = 1, sortBy = 'price', order = 'asc', minPrice = 0, maxPrice = Number.MAX_VALUE } = req.query;

    n = parseInt(n);
    page = parseInt(page);
    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);

    if (isNaN(n) || n <= 0) n = 10;
    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(minPrice) || minPrice < 0) minPrice = 0;
    if (isNaN(maxPrice) || maxPrice <= 0) maxPrice = Number.MAX_VALUE;

    const products = await fetchProducts(categoryname, minPrice, maxPrice);

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
