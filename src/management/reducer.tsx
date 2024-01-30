import { Movie } from '../types/Movie';
import { State } from '../types/State';

export type Action =
  | { type: 'getMovie', payload: Movie }
  | { type: 'searchText', payload: string }
  | { type: 'addMovie', payload: Movie }
  | { type: 'isMovie', payload: boolean }
  | { type: 'showError', payload: boolean }
  | { type: 'clearMovie' };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'searchText':
      return {
        ...state,
        query: action.payload,
      };

    case 'isMovie':
      return {
        ...state,
        isMovie: action.payload,
      };

    case 'showError':
      return {
        ...state,
        showError: action.payload,
      };

    case 'getMovie':
      return {
        ...state,
        movie: action.payload,
      };

    case 'addMovie':
      if (state.movie) {
        return {
          ...state,
          movies: [...state.movies, state.movie],
          movie: null,
          query: '',
          isMovie: false,
        };
      }

      return state;

    case 'clearMovie':
      return {
        ...state,
        movie: null,
      };

    default:
      return state;
  }
}
