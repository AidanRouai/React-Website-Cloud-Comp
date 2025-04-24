import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

type Product = {
  id: number
	name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [sortOption, setSortOption] = useState<string>('AtoZ'); // Default sorting
  const [inStockOnly, setInStockOnly] = useState<boolean>(false); // Default: show all

  // ===== Hooks =====
  useEffect(() => updateSearchedProducts(), [searchTerm, sortOption, inStockOnly]);

  // ===== Basket management =====
  function showBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'block';
    }
  }

  function hideBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'none';
    }
  }

  // ===== Search, Sort, and Filter =====
  function updateSearchedProducts() {
    let holderList: Product[] = itemList;

    // Filter by search term
    holderList = holderList.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by in-stock status
    if (inStockOnly) {
      holderList = holderList.filter((product: Product) => product.quantity > 0);
    }

    // Sort based on selected option
    switch (sortOption) {
      case 'AtoZ':
        holderList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'ZtoA':
        holderList.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case '£LtoH':
        holderList.sort((a, b) => a.price - b.price);
        break;
      case '£HtoL':
        holderList.sort((a, b) => b.price - a.price);
        break;
      case '*LtoH':
        holderList.sort((a, b) => a.rating - b.rating);
        break;
      case '*HtoL':
        holderList.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setSearchedProducts(holderList);
  }

  return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png"></img>
        </div>
        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="./src/assets/shopping-basket.png"></img>
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>
          <p>Your basket is empty</p>
        </div>
      </div>
      <div id="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={(changeEventObject) =>
            setSearchTerm(changeEventObject.target.value)
          }
        ></input>

        <div id="control-area">
          <select onChange={(e) => setSortOption(e.target.value)}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input
            id="inStock"
            type="checkbox"
            onChange={(e) => setInStockOnly(e.target.checked)}
          ></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator">
        {searchTerm === ''
          ? searchedProducts.length === 1
            ? '1 Product'
            : `${searchedProducts.length} Products`
          : searchedProducts.length === 0
          ? 'No search results found'
          : searchedProducts.length === 1
          ? '1 Result'
          : `${searchedProducts.length} Results`}
      </p>
      <ProductList itemList={searchedProducts} />
    </div>
  );
}

export default App;
