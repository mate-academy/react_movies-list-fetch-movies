import React, { useReducer } from 'react';
import { Movie } from '../types/Movie';

type State = {
  moviesList: Movie[],
};

type Action = { type: 'addToList', payload: Movie };
type Props = {
  children: React.ReactNode;
};

export const initialState: State = {
  moviesList: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'addToList':
      return {
        ...state,
        moviesList: [...state.moviesList, action.payload],
      };
    default:
      return state;
  }
}

export const StateConstext = React.createContext(initialState);
export const DispatchContext
  = React.createContext((() => {}) as React.Dispatch<Action>);

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateConstext.Provider value={state}>
        {children}
      </StateConstext.Provider>
    </DispatchContext.Provider>
  );
};
