const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8080;

const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwNzczMjQyLCJpYXQiOjE3MjA3NzI5NDIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjhmZjY2Nzg3LTYwODctNDc2Ny05Yjg5LWY0MGY1ZDQzMGYyZCIsInN1YiI6ImdvdmluZHVwYWRoeWF5ODUyNzNAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkIE1lZGljYWwiLCJjbGllbnRJRCI6IjhmZjY2Nzg3LTYwODctNDc2Ny05Yjg5LWY0MGY1ZDQzMGYyZCIsImNsaWVudFNlY3JldCI6Ilpyd3N0aEZzYUxKZ1RldkUiLCJvd25lck5hbWUiOiJHb3ZpbmQgVXBhZGh5YXkiLCJvd25lckVtYWlsIjoiZ292aW5kdXBhZGh5YXk4NTI3M0BnbWFpbC5jb20iLCJyb2xsTm8iOiIyMTE1NTAwMDYyIn0.9Htf2SKkewNHWzknhjIp_W8bo783oTCWo_jvL93Vo4s'; 

app.get('/numbers', async (req, res) => {
  try {
    let { url } = req.query; 

    if (!Array.isArray(url)) {
      url = [
        "http://20.244.56.144/test/primes", 
        "http://20.244.56.144/test/fibo", 
        "http://20.244.56.144/test/odd", 
        "http://20.244.56.144/test/rand"
      ];
    }

    const numbers = [];

    const requests = url.map(async (url) => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`
          }
        });
        const { numbers: urlNumbers } = response.data;
        numbers.push(...urlNumbers);
      } catch (error) {
        console.error(`Error retrieving numbers from ${url}: ${error.message}`);
      }
    });

    await Promise.all(requests);
    const mergedNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);
    console.log(mergedNumbers);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
