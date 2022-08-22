import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iznfbqrevlorsxyoaueo.supabase.co";
const supabase = createClient(
  SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASEANON
);

export default function Favourite() {
  const [searchState, setSearchState] = useState(null);
  let pageContent;

  async function myFav() {
    setSearchState("loading");
    const user = supabase.auth.user();
    const userId = user.id;
    let { data: fav, error } = await supabase
      .from("fav")
      .select("*")
      .eq("user_id", userId);
    setSearchState(fav);
  }

  useEffect(function () {
    myFav();
  }, []);

  if (searchState !== null && searchState !== "loading") {
    pageContent = searchState.map(function (e) {
      return (
        <div key={e.recipe_id} className="result-item col-40">
          <button>
            <Link href={`/fav-recipe/${e.recipe_id}`}>
              <h5>{e.recipe_name}</h5>
            </Link>
          </button>
        </div>
      );
    });
  }

  return <div className="general-container">{pageContent}</div>;
}
