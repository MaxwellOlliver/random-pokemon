import { useMemo, useState } from 'react';
import { getColorByType } from './utils/getColorByType';

import './App.css';
import logo from './assets/logo.png';
import pokeball from './assets/pokeball.png';
import noPicture from './assets/no-photo.webp';

function App() {
  const [loading, setLoading] = useState(false);
  const [randomPokemon, setRandomPokemon] = useState(null);

  const background = useMemo(() => {
    if (randomPokemon) {
      const { types } = randomPokemon;
      const color = getColorByType(types);

      if (types.length > 1) {
        return { background: `linear-gradient(${color[0]}, ${color[1]})` };
      } else {
        return { backgroundColor: color };
      }
    }
  }, [randomPokemon]);

  const getRandomPokemonRef = async () => {
    const randomLimit = Math.round(Math.random() * 1119);
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${randomLimit}`;
    const response = await fetch(url);
    const data = await response.json();

    return data.results[randomLimit - 1];
  };

  const getPokemonInfo = async (url) => {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  };

  const handleGetRandomPokemon = async () => {
    setLoading(true);
    const pokemonRef = await getRandomPokemonRef();
    const pokemon = await getPokemonInfo(pokemonRef.url);

    setRandomPokemon(pokemon);

    setLoading(false);
  };

  return (
    <div className="container" style={background}>
      <img src={logo} alt="logo" />
      <button onClick={handleGetRandomPokemon} disabled={loading}>
        Get a random pokémon
      </button>
      <div className="pokemon">
        {loading && (
          <div className="loader">
            <img src={pokeball} alt="pokeball" className="poke-loader" />
          </div>
        )}
        {!randomPokemon ? (
          <h3>Click on "Get a random pokémon"</h3>
        ) : (
          <>
            {randomPokemon.sprites.other['official-artwork']?.front_default ? (
              <img
                src={
                  randomPokemon.sprites.other['official-artwork']?.front_default
                }
                alt="pokemon"
              />
            ) : (
              <div className="no-profile">
                <img src={noPicture} alt="pokemon" />
              </div>
            )}
            <div className="info">
              <span>{randomPokemon.species.name}</span>
              <div className="types">
                {randomPokemon.types.map((type) => (
                  <span style={{ backgroundColor: getColorByType(type) }}>
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
