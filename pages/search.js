import { useState } from "react";
import Link from "next/link";

export default function Search() {
  const [searchState, setSearchState] = useState(null);
  const [switchBtn, setSwitchBtn] = useState("left");
  const [inputVal, setInputVal] = useState("");
  let pageContent;

  function displayResult(data) {
    let searchResult = data.drinks.map(function (e) {
      return (
        <div key={e.idDrink} className="result-item col-40">
          <button>
            <Link href={`/recipe/${e.idDrink}`} recipeId={e.idDrink}>
              <h5>{e.strDrink}</h5>
            </Link>
          </button>
        </div>
      );
    });
    setSearchState(searchResult);
  }

  // HANDLE EVENTS
  function handleInput(e) {
    setInputVal(e.target.value);
  }
  function handleSwitchClick(e) {
    e.preventDefault();
    switchBtn === "left" ? setSwitchBtn("right") : setSwitchBtn("left");
  }
  function handleSearchClick(e) {
    e.preventDefault();
    setSearchState("loading");
    const apiURL = `https://thecocktaildb.com/api/json/v1/1/${
      switchBtn === "left" ? "search.php?s=" : "filter.php?i="
    }`;
    const params = inputVal;
    fetch(apiURL + params)
      .then((res) => {
        return res.json();
      })
      .then(displayResult);
  }
  function handleRandomSearch(e) {
    e.preventDefault();
    setSearchState("loading");
    fetch("https://thecocktaildb.com/api/json/v1/1/random.php")
      .then((res) => {
        return res.json();
      })
      .then(displayResult);
  }

  if (searchState === null) {
    pageContent = (
      <div className="col-75 container-v-center">
        <form className="general-container">
          <input
            onChange={handleInput}
            name="search input"
            className=""
            type="text"
            id="cocktail-search"
            placeholder="Find a Cocktail"
          />
          <div className="">
            <div className="">
              <div className="switch-container mt-25">
                <button
                  className={switchBtn === "left" ? "active" : ""}
                  onClick={handleSwitchClick}
                >
                  Name
                </button>
                <button
                  className={switchBtn === "right" ? "active" : ""}
                  onClick={handleSwitchClick}
                >
                  Ingredient
                </button>
                <div
                  className={
                    "switch-highlight " +
                    (switchBtn === "right" ? "right" : "left")
                  }
                ></div>
              </div>
              <button className="btn-s mt-10" onClick={handleSearchClick}>
                Search
              </button>
            </div>
            <div className="mt-50">
              <p className="m-0 light-grey">Can’t think of a name?</p>
              <button className="btn-s" onClick={handleRandomSearch}>
                Give Me One
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
  if (searchState !== null && searchState !== "loading") {
    pageContent = <div className="general-container mt-100">{searchState}</div>;
  }

  return <div className="general-container">{pageContent}</div>;
}
