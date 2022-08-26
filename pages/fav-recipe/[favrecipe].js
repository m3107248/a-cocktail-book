import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iznfbqrevlorsxyoaueo.supabase.co";
const supabase = createClient(
  SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASEANON
);

export default function FavRecipe() {
  const [recipeID, setRecipeID] = useState(undefined);
  const [searchState, setSearchState] = useState(null);
  const [favState, setFavState] = useState(null);
  const [note, setNote] = useState(null);
  const router = useRouter();
  const { favrecipe } = router.query;
  let pageContent;

  function fetchRecipe() {
    setSearchState("loading");
    const endpoint =
      "https://thecocktaildb.com/api/json/v1/1/lookup.php?i=" + recipeID;
    fetch(endpoint)
      .then((res) => {
        return res.json();
      })
      .then((info) => {
        setSearchState(info);
        favConfirm();
      });
  }

  async function favConfirm() {
    const user = supabase.auth.user();
    const userId = user.id;
    let { data: fav, error } = await supabase
      .from("fav")
      .select("*")
      .eq("recipe_id", recipeID)
      .eq("user_id", userId);
    if (fav.length >= 1) {
      setFavState("is-fav");
      setNote(fav[0].note);
    }
  }

  async function handleAddFav(e) {
    e.preventDefault();
    if (favState === null) {
      setFavState("is-fav");
      const user = supabase.auth.user();
      const userId = user.id;
      let { data: fav, error } = await supabase
        .from("fav")
        .select("*")
        .eq("recipe_id", recipeID)
        .eq("user_id", userId);
      if (fav.length >= 1) {
        console.log("Already in the Favorite List.");
      } else {
        const { data, error } = await supabase.from("fav").insert([
          {
            recipe_id: recipeID,
            user_id: userId,
            note: "",
            recipe_name: searchState.drinks[0].strDrink,
          },
        ]);
      }
    }
  }

  async function handleNote(e) {
    e.preventDefault();
    setNote(e.target.value);
    const user = supabase.auth.user();
    const userId = user.id;
    let { data, error } = await supabase
      .from("fav")
      .update({ note: `${note}` })
      .eq("recipe_id", recipeID)
      .eq("user_id", userId);
  }

  // Get Ingredient out of the list into an Array
  function getIngredient(ingredData) {
    let ingredient = [];
    let i = 1,
      y,
      z;
    do {
      y = "strIngredient" + i;
      z = "strMeasure" + i;
      const ingredientObj = { name: "", amount: "" };
      ingredientObj.name = ingredData.drinks[0][y];
      ingredientObj.amount = ingredData.drinks[0][z];
      ingredientObj.name === null || ingredientObj.name === undefined
        ? true
        : ingredient.push(ingredientObj);
      i++;
    } while (
      ingredData.drinks[0][y] !== undefined &&
      ingredData.drinks[0][y] !== null
    );
    return ingredient;
  }

  useEffect(
    function () {
      favrecipe !== undefined ? setRecipeID(favrecipe) : false;
    },
    [favrecipe]
  );
  useEffect(
    function () {
      recipeID !== undefined ? fetchRecipe() : false;
    },
    [recipeID]
  );

  if (searchState !== null && searchState !== "loading") {
    const cRecipe = searchState.drinks[0];
    const ingredient = getIngredient(searchState).map((e) => {
      return (
        <h5 key={e.name} className="ingredient">
          <span className="ingredient-name col-60">{e.name}</span>
          <span className="ingredient-amount col-40">{e.amount}</span>
        </h5>
      );
    });
    pageContent = (
      <>
        <div className="col-100 mt-75">
          <button
            onClick={handleAddFav}
            className={`fav-btn ${
              favState === "is-fav" ? "is-fav" : "light-grey"
            }`}
          >
            Favourite
          </button>
          <h1>{cRecipe.strDrink}</h1>
          <div className="col-100 general-container">
            <div className="col-60 pr-75 col-s-100">
              <div className="ingredient mt-75">{ingredient}</div>
              <h5 className="method mt-50">
                [Method] {cRecipe.strInstructions}
              </h5>
              <h5 className="drinkware mt-25">
                [Drinkware] {cRecipe.strGlass}
              </h5>
            </div>
            <div className="col-40 note-container pl-50 col-s-100">
              <h5 className="mt-75">Note:</h5>
              <textarea
                className=""
                onChange={handleNote}
                value={note}
              ></textarea>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container-v-top recipe-detail-container mt-100">
      {pageContent}
    </div>
  );
}
