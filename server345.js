const fs = require('fs');
const express = require('express');
const app = express();
const port = 3001;


app.listen(port, (err) => {
  if (err) {
    console.error('Unable to start server');
  } else {
    console.log('Server started...');
  }
});

app.get('/', (req, res) => {
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const products = JSON.parse(data);
      res.json(products);
    }
  });
});

app.get('/', (req, res) => {
    const category = req.query.category;
  
    if (!category) {
      res.status(400).send('Category parameter is missing');
      return;
    }
  
    fs.readFile('products.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        const products = JSON.parse(data);
        const filteredProducts = products.filter((product) => product.Category === category);
        res.json(filteredProducts);
      }
    });
  });
  


