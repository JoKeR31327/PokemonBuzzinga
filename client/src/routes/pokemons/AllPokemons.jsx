

import axios from "../../utils/AxiosSetup";
import React, { useEffect, useState } from "react";
import PokemonEntry from "./PokemonEntry";
import { Link } from "react-router-dom"; 

function AllPokemons() {
  const [pokemons, setPokemons] = useState([]);

  const getAllPokemons = async () => {
    try {
      const req = await axios.get("/pokemons");
      const data = req.data;
      setPokemons(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPokemons();
  }, []);

  return (
    <>
      <h1 className="text-h1">All Pokemons</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {!!pokemons &&
          pokemons.map((pokemonData) => (
            <Link key={pokemonData.pokemon_id} to={`/pokemonsdets/${pokemonData.pokemon_id}`}>
              <PokemonEntry {...pokemonData} buy={true} />
            </Link>
          ))}
      </div>
    </>
  );
}

export default AllPokemons;





