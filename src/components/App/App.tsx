import { ChangeEvent } from "react"
import create from "zustand"
import { mountStoreDevtool } from "simple-zustand-devtools"

import "./App.css"

type State = {
  filter: string
  pokemon: []

  setFilter: (filter: string) => void
  setPokemon: (pokemon: []) => void
}

const POKEMON_URL =
  "https://gist.githubusercontent.com/jherr/23ae3f96cf5ac341c98cd9aa164d2fe3/raw/f8d792f5b2cf97eaaf9f0c2119918f333e348823/pokemon.json"

const useStore = create<State>((set) => ({
  filter: "",
  pokemon: [],
  setFilter: (filter: string) =>
    set((state) => ({
      ...state,
      filter,
    })),
  setPokemon: (pokemon: []) =>
    set((state) => ({
      ...state,
      pokemon,
    })),
}))

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore as any)
}

const FilterInput = () => {
  const filter = useStore((state) => state.filter)
  const setFilter = useStore((state) => state.setFilter)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }

  return (
    <>
      <h2>INPUT: {Math.random()}</h2>
      <input value={filter} onChange={handleChange} />
    </>
  )
}

const PokemonTable = () => {
  const pokemon = useStore((state) => state.pokemon)
  const filter = useStore((state) => state.filter)

  return (
    <table width="100%">
      <h2>TABLE: {Math.random()}</h2>
      <tbody>
        {pokemon
          .filter(({ name: { english } }) =>
            (english as string)
              .toLowerCase()
              .includes(filter.toLocaleLowerCase()),
          )
          .map(({ id, name: { english }, type }) => (
            <tr key={id}>
              <td>{english}</td>
              <td>{(type as []).join(", ")}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
fetch(POKEMON_URL)
  .then((res) => res.json())
  .then((pokemon) =>
    useStore.setState((state) => ({
      ...state,
      pokemon,
    })),
  )

export const App = () => {
  // const setPokemon = useStore((state) => state.setPokemon)

  // useEffect(() => {
  //   fetch(POKEMON_URL)
  //     .then((res) => res.json())
  //     .then((pkmn) => setPokemon(pkmn))
  // }, [setPokemon])

  return (
    <div style={{ width: "800px", margin: "0 auto" }}>
      <h2>APP: {Math.random()}</h2>
      <FilterInput />
      <br />
      <PokemonTable />
    </div>
  )
}
