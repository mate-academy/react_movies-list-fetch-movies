import { createContext, useReducer } from 'react';
import React from 'react';
import { Movie } from './Movie';

// TYPES:
export type State = {
  movies: Movie[];
};

export type Action = { type: 'addMovie'; payload: Movie };

const initialState: State = {
  movies: [],
};

const reducer = (state: State, action: Action): State => {
  let newState: State = state;

  switch (action.type) {
    case 'addMovie':
      const id = action.payload.imdbId;
      const findKey = state.movies.find(item => item.imdbId === id);

      if (findKey) {
        newState = {
          ...state,
          movies: [...state.movies],
        };
        break;
      }

      newState = {
        ...state,
        movies: [...state.movies, action.payload],
      };
      break;
    default:
      newState = state;
  }

  return newState;
};

type InitialDispatch = (action: Action) => void;

export const StateContext = createContext(initialState);
export const DispatchContext = createContext<InitialDispatch>(() => {});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
