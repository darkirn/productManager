const fs = require('fs').promises;

class ProductManager {
  constructor(dataFilePath) {
    this.path = dataFilePath;
    this.products = [];
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, se creará un archivo vacío
      if (error.code === 'ENOENT') {
        await this.saveProducts();
      } else {
        console.error('Error al inicializar el administrador de productos:', error.message);
      }
    }
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    // Validar que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error('Todos los campos son obligatorios');
      return null;
    }

    // Generar automáticamente el siguiente ID
    const nextId = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;

    // Crear un nuevo producto con el ID generado
    const newProduct = {
      id: nextId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    // Agregar el producto al arreglo de productos
    this.products.push(newProduct);

    // Guardar los productos en el archivo
    await this.saveProducts();

    console.log('Producto agregado con éxito:', newProduct);
    return newProduct;
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  async updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      console.error('Producto no encontrado');
      return null;
    }

    // Actualizar el producto existente con los datos proporcionados
    this.products[productIndex] = {
      ...this.products[productIndex], // Mantener los datos originales
      ...updatedProduct, // Actualizar con los nuevos datos
      id, // Mantener el ID original
    };

    // Guardar los productos en el archivo
    await this.saveProducts();

    console.log('Producto actualizado con éxito:', this.products[productIndex]);
    return this.products[productIndex];
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      console.error('Producto no encontrado');
      return null;
    }

    // Eliminar el producto
    const deletedProduct = this.products.splice(productIndex, 1)[0];

    // Guardar los productos en el archivo
    await this.saveProducts();

    console.log('Producto eliminado con éxito:', deletedProduct);
    return deletedProduct;
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error al guardar los productos en el archivo:', error.message);
    }
  }
}

module.exports = ProductManager;