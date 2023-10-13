const express = require('express');
const ProductManager = require('./productManager'); // Importa la clase ProductManager
const app = express();
const port = 3000;

const dataFilePath = 'productos.json';
const productManager = new ProductManager(dataFilePath); // Inicializa ProductManager

app.use(express.json());

// Inicializa el administrador de productos (cargar o crear el archivo JSON)
productManager.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor Express en ejecución en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al inicializar el administrador de productos:', error.message);
  });

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();

    if (!isNaN(limit) && limit > 0) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// app.listen(port, () => {
//   console.log(`Servidor Express en ejecución en http://localhost:${port}`);
// });