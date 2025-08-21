const fs = require('fs/promises');

async function getAllProducts() {
  console.log('--- Recuperando todos los productos ---');
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    console.log('Todos los productos obtenidos.');
    return products;
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    return null;
  }
}

async function getLimitedProducts(limit) {
  console.log(`\n--- Recuperando ${limit} productos ---`);
  try {
    const response = await fetch(`https://fakestoreapi.com/products?limit=${limit}`);
    const products = await response.json();
    console.log(`${products.length} productos obtenidos.`);
    return products;
  } catch (error) {
    console.error(`Error al obtener ${limit} productos:`, error);
    return null;
  }
}

async function addNewProduct() {
  console.log('\n--- Agregando un nuevo producto (POST) ---');
  const newProduct = {
    title: 'Producto de Prueba API',
    price: 13.5,
    description: 'Descripción del producto para el ejercicio de API.',
    image: 'https://i.pravatar.cc',
    category: 'electronic'
  };

  try {
    const response = await fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: { 'Content-Type': 'application/json' }
    });
    const addedProduct = await response.json();
    console.log('Nuevo producto agregado. ID:', addedProduct.id);
    console.log(addedProduct);
    return addedProduct;
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    return null;
  }
}

async function getProductById(id) {
  console.log(`\n--- Buscando producto con ID ${id} ---`);
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await response.json();
    console.log(`Producto con ID ${id} encontrado.`);
    console.log(product);
    return product;
  } catch (error) {
    console.error(`Error al buscar el producto con ID ${id}:`, error);
    return null;
  }
}

async function updateProduct(id) {
  console.log(`\n--- Modificando producto con ID ${id} (PUT) ---`);
  const updatedData = {
    title: 'Título MODIFICADO',
    price: 25.5
  };

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: { 'Content-Type': 'application/json' }
    });
    const updatedProduct = await response.json();
    console.log(`Producto con ID ${id} modificado.`);
    console.log(updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error(`Error al modificar el producto con ID ${id}:`, error);
    return null;
  }
}

async function deleteProduct(id) {
  console.log(`\n--- Eliminando producto con ID ${id} (DELETE) ---`);
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: 'DELETE'
    });
    const deletedProduct = await response.json();
    console.log(`Producto con ID ${id} eliminado.`);
    console.log(deletedProduct);
    return deletedProduct;
  } catch (error) {
    console.error(`Error al eliminar el producto con ID ${id}:`, error);
    return null;
  }
}

async function saveProductsToFile(products, filename = 'productos.json') {
  console.log(`\n--- Persistiendo datos en ${filename} ---`);
  try {
    await fs.writeFile(filename, JSON.stringify(products, null, 2), 'utf8');
    console.log(`Archivo '${filename}' guardado exitosamente.`);
  } catch (error) {
    console.error(`Error al guardar el archivo '${filename}':`, error);
  }
}

async function addProductToLocalFile() {
  console.log('\n--- Agregando un producto al archivo local ---');
  try {
    const fileContent = await fs.readFile('productos.json', 'utf8');
    const products = JSON.parse(fileContent);

    const newLocalProduct = {
      id: products.length + 1,
      title: 'Producto Local Agregado',
      price: 99.99,
      description: 'Este producto se añadió directamente al archivo JSON.',
      category: 'local'
    };
    products.push(newLocalProduct);

    await fs.writeFile('productos.json', JSON.stringify(products, null, 2), 'utf8');
    console.log('Nuevo producto agregado localmente.');
    console.log(newLocalProduct);
  } catch (error) {
    console.error('Error al agregar el producto al archivo:', error);
  }
}

async function deleteProductsByPrice(price) {
  console.log(`\n--- Eliminando productos con precio > $${price} del archivo local ---`);
  try {
    const fileContent = await fs.readFile('productos.json', 'utf8');
    let products = JSON.parse(fileContent);

    const filteredProducts = products.filter(p => p.price <= price);
    const productsDeletedCount = products.length - filteredProducts.length;

    await fs.writeFile('productos.json', JSON.stringify(filteredProducts, null, 2), 'utf8');
    console.log(`Se eliminaron ${productsDeletedCount} producto(s) del archivo local.`);
  } catch (error) {
    console.error('Error al eliminar productos del archivo:', error);
  }
}

async function main() {
  console.log('Iniciando todas las operaciones...');
  
  await getAllProducts();
  console.log("\n--------------------------------------------------\n");

  const limitedProducts = await getLimitedProducts(5);
  console.log("\n--------------------------------------------------\n");

  await addNewProduct();
  console.log("\n--------------------------------------------------\n");

  await getProductById(3);
  console.log("\n--------------------------------------------------\n");

  await updateProduct(7);
  console.log("\n--------------------------------------------------\n");

  await deleteProduct(10);
  console.log("\n--------------------------------------------------\n");

  if (limitedProducts) {
    await saveProductsToFile(limitedProducts);
    await addProductToLocalFile();
    await deleteProductsByPrice(20);
  } else {
    console.log('\nNo se pudieron guardar los productos porque la consulta limitada falló.');
  }
  
  console.log('\nTodas las operaciones han finalizado.');
}

main();