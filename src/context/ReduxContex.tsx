/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useReducer } from 'react';
import { getMovie } from '../api';
import { MovieData } from '../types/MovieData';
import { ResponseError } from '../types/ReponseError';
import { Movie } from '../types/Movie';
type Action =
  | { type: 'setQuery'; value: string }
  | { type: 'onSubmit' }
  | { type: 'setNewMovie'; movie: MovieData }
  | { type: 'setError'; error: ResponseError }
  | { type: 'resetSubmit' }
  | { type: 'addMovie' };

interface State {
  saveMovies: Movie[];
  movie: Movie | null;
  query: string;
  submit: boolean;
  error: string;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setQuery':
      return {
        ...state,
        query: action.value,
        error: '',
      };

    case 'onSubmit':
      return {
        ...state,
        submit: true,
        error: '',
      };

    case 'resetSubmit':
      return {
        ...state,
        submit: false,
        query: '',
      };

    case 'setError':
      return {
        ...state,
        movie: null,
        error: action.error.Error,
      };

    case 'setNewMovie':
      const newMovie: Movie = {
        title: action.movie.Title,
        description: action.movie.Plot,
        imgUrl:
          action.movie.Poster !== 'N/A'
            ? action.movie.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${action.movie.imdbID}`,
        imdbId: action.movie.imdbID,
      };

      return {
        ...state,
        movie: newMovie,
      };

    case 'addMovie':
      if (
        state.movie &&
        !state.saveMovies.some(mov => mov.imdbId === state.movie?.imdbId)
      ) {
        return {
          ...state,
          movie: null,
          saveMovies: [...state.saveMovies, state.movie],
        };
      }

      return { ...state, movie: null };

    default:
      return state;
  }
};

const initialState: State = {
  saveMovies: [],
  query: '',
  submit: false,
  movie: null,
  error: '',
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext((_action: Action) => {});

interface Props {
  children: React.ReactNode;
}

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.submit) {
      getMovie(state.query).then(result => {
        if ((result as ResponseError).Response === 'False') {
          dispatch({ type: 'setError', error: result as ResponseError });
        } else {
          dispatch({ type: 'setNewMovie', movie: result as MovieData });
        }

        dispatch({ type: 'resetSubmit' });
      });
    }
  }, [state.submit]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
