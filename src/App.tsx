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

type BasketItem = {
  id: number
  name: string
  price: number
  quantity: number
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [sortOption, setSortOption] = useState<string>('AtoZ'); // Default sorting
  const [inStockOnly, setInStockOnly] = useState<boolean>(false); // Default: show all
  const [basket, setBasket] = useState<BasketItem[]>([]); // Default: empty basket

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

  function addToBasket(product: Product) {
    setBasket((prevBasket) => {
      //Check if the product already exists in the basket
      const existingItem = prevBasket.find((item) => item.id === product.id);
      if (existingItem) {
        // Update quantity if item already exists in the basket
        return prevBasket.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to the basket
        return [...prevBasket, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
      }
    });
  }

  function removeOneFromBasket(productId: number) {
    setBasket((prevBasket) => {
      const updatedBasket = prevBasket
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with quantity 0
      return updatedBasket;
    });
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
          {basket.length === 0 ? (
            <p>Your basket is empty</p>
          ) : (
            <>
              {basket.map((item) => (
                <div key={item.id} className="shopping-row">
                  <div className="shopping-information">
                    <p>
                      {item.name} (£{item.price.toFixed(2)}) - {item.quantity}
                    </p>
                  </div>
                  <button onClick={() => removeOneFromBasket(item.id)}>Remove</button>
                </div>
              ))}
              <p>
                Total: £
                {basket
                  .reduce((total, item) => total + item.price * item.quantity, 0)
                  .toFixed(2)}
              </p>
            </>
          )}
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
      <ProductList 
      itemList={searchedProducts}
      addToBasket={addToBasket} /> 
    </div>
  );
}

export default App;
