import React from 'react';

import { State } from '../../types/State';
import { Action } from '../../types/Action';

const initState: State = {
  movies: [],
  query: '',
  error: '',
};

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case 'ADD_MOVIE':
      return {
        ...state,
        movies: [...state.movies, payload],
      };

    case 'SET_QUERY':
      return {
        ...state,
        query: payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: payload,
      };

    default:
      return state;
  }
};

type Props = {
  children: React.ReactNode;
};

const MovieStateContext = React.createContext(initState);
// eslint-disable-next-line
const MovieDispatchContext = React.createContext((_action: Action) => {});

export const MovieProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initState);

  return (
    <MovieStateContext.Provider value={state}>
      <MovieDispatchContext.Provider value={dispatch}>
        {children}
      </MovieDispatchContext.Provider>
    </MovieStateContext.Provider>
  );
};

export const useMovieState = () => React.useContext(MovieStateContext);
export const useMovieDispatch = () => React.useContext(MovieDispatchContext);
