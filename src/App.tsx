import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

interface AppState {
  movies: Movie[];
}

export class App extends Component<{}, AppState> {
  state = {
    movies: data,
  };

  addMovie = (newMovie: Movie | null) => {
    const { movies } = this.state;

    if (newMovie === null) {
      return;
    }

    if (movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      return;
    }

    this.setState(prevState => ({
      movies: [...prevState.movies, newMovie],
    }));
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={this.addMovie} />
        </div>
      </div>
    );
  }
}
