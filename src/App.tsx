/* eslint-disable no-console */
import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
  };

  addMovie = (theMovie: Movie) => {
    this.setState((prev) => {
      if (prev.movies.some((movie) => movie.imdbID === theMovie.imdbID)) {
        return (
          { movies: [...prev.movies] }
        );
      }

      return (
        { movies: [...prev.movies, theMovie] }
      );
    });
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            onAdd={this.addMovie}
            ifMovieAdded={movies}
          />
        </div>
      </div>
    );
  }
}
