/* eslint-disable no-console */
import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
  hasLoadingError: boolean;
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
    hasLoadingError: false,
  };

  loadFilm = (nameFilm: Movie) => {
    console.log(this.state.movies);
    console.log(nameFilm);

    if (this.state.movies.includes(nameFilm)) {
      return 0;
    }

    return this.setState((state: State) => ({
      movies: [...state.movies, nameFilm],
    }));
  };

  loadErrorTrue = () => {
    this.setState((state: State) => ({
      ...state,
      hasLoadingError: true,
    }));
  };

  loadErrorFalse = () => {
    this.setState((state: State) => ({
      ...state,
      hasLoadingError: false,
    }));
  };

  render() {
    const { movies, hasLoadingError } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          {movies.length > 0 ? (
            <MoviesList movies={movies} />
          ) : (
            <>
            </>
          )}
        </div>
        <div className="sidebar">
          <FindMovie
            movies={movies}
            loadFilm={this.loadFilm}
            errorTrue={this.loadErrorTrue}
            errorFalse={this.loadErrorFalse}
            hasLoadingError={hasLoadingError}
          />
        </div>
      </div>
    );
  }
}
