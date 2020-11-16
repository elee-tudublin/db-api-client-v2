
// The set HTTP headers. These will be used by Fetch when making requests to the api
const HTTP_REQ_HEADERS = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json"
  });

// Requests will use the GET method and permit cross origin requests
const GET_INIT = { method: 'GET', credentials: 'include', headers: HTTP_REQ_HEADERS, mode: 'cors', cache: 'default' };

// API Base URL - the server address
const BASE_URL = `http://localhost:8080`;


// Asynchronous Function getDataAsync from a url and return
async function getDataAsync(url) {
    // Try catch 
    try {
      // Call fetch and await the respose
      // Initally returns a promise
      const response = await fetch(url, GET_INIT);
  
      // As Resonse is dependant on fetch, await must also be used here
      const json = await response.json();
  
      // Output result to console (for testing purposes) 
      console.log(json);
  
      // Call function( passing he json result) to display data in HTML page
      //displayData(json);
      return json;
  
      // catch and log any errors
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  
// Parse JSON
// Create product rows
// Display in web page
function displayProducts(products) {
    // Use the Array map method to iterate through the array of products (in json format)
    // Each products will be formated as HTML table rowsand added to the array
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    // Finally the output array is inserted as the content into the <tbody id="productRows"> element.
  
    const rows = products.map(product => {
      // returns a template string for each product, values are inserted using ${ }
      // <tr> is a table row and <td> a table division represents a column
  
        let row = `<tr>
                <td>${product.ProductId}</td>
                <td>${product.ProductName}</td>
                <td>${product.ProductDescription}</td>
                <td>${product.ProductStock}</td>
                <td class="price">&euro;${Number(product.ProductPrice).toFixed(2)}</td>
                </tr>`;

        return row;       
    });
    // Set the innerHTML of the productRows root element = rows
    // Why use join('') ???
    document.getElementById('productRows').innerHTML = rows.join('');
} // end function


// load and display categories in a bootstrap list group
function displayCategories(categories) {
  //console.log(categories);
  const items = categories.map(category => {
    return `<a href="#" class="list-group-item list-group-item-action" onclick="updateProductsView(${category.CategoryId})">${category.CategoryName}</a>`;
  });

  // Add an All categories link at the start
  items.unshift(`<a href="#" class="list-group-item list-group-item-action" onclick="loadProducts()">Show all</a>`);

  // Set the innerHTML of the productRows root element = rows
  document.getElementById('categoryList').innerHTML = items.join('');

  // Fill select list in product form
  let catSelect = document.getElementById("categoryId");

    // Add default option
    catSelect.options[catSelect.options.length] = new Option('Choose Category', '0');

  for (i=0; i< categories.length; i++) {
    catSelect.options[catSelect.options.length] = new Option(categories[i].CategoryName, categories[i].CategoryId);
  }


} // end function


// Load Products
// Get all categories and products then display
async function loadProducts() {
  try {
    
    const categories = await getDataAsync(`${BASE_URL}/category`);
    displayCategories(categories);

    const products = await getDataAsync(`${BASE_URL}/product`);
    displayProducts(products);

  } // catch and log any errors
      catch (err) {
      console.log(err);
  }
}

// update products list when category is selected to show only products from that category
async function updateProductsView(id) {
  try {
    const products = await getDataAsync(`${BASE_URL}/product/bycat/${id}`);
    displayProducts(products);

  } // catch and log any errors
  catch (err) {
    console.log(err);
  }
}
 
// Add a new product
async function addProduct() {
  // url for api call
  const url = `${BASE_URL}/product`

  
  // https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
  // Get form + data
  const productForm = document.getElementById("productForm");
  const formData = new FormData(productForm);

  // https://stackoverflow.com/questions/41431322/how-to-convert-formdatahtml5-object-to-json
  // Get form fields + values
  let newProduct = {};
  formData.forEach((value, key) => newProduct[key] = value);

  // create request object
  const request = {
      method: 'POST',
      headers: HTTP_REQ_HEADERS,
      // credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(newProduct)
    };

  // Try catch 
  try {
    // Call fetch and await the respose
    // Initally returns a promise
    const response = await fetch(url, request);

    // As Resonse is dependant on fetch, await must also be used here
    const json = await response.json();

    // Output result to console (for testing purposes) 
    console.log(json);

    // catch and log any errors
  } catch (err) {
    console.log(err);
    return err;
  }

  // Refresh products list
  loadProducts();
}

// When this script is loaded, call loadProducts() to add products to the page
loadProducts();



/* Get form fields and build json - alternative method

    // Get form fields
    const pId = Number(document.getElementById('productId').value);
    const catId = document.getElementById('categoryId').value;
    const pName = document.getElementById('productName').value;
    const pDesc = document.getElementById('productDescription').value;
    const pStock = document.getElementById('productStock').value;
    const pPrice = document.getElementById('productPrice').value;

    // build request body
    const reqBody = JSON.stringify({
    categoryId: catId,
    productName: pName,
    productDescription: pDesc,
    productStock: pStock,
    productPrice: pPrice
    });

*/