import React, { Component } from 'react';

import './App.scss';

import data from './api/movies.json';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export class App extends Component {
  state = {
    movies: data,
  };

  addMovie = (newMovie) => {
    if (!newMovie) {
      return;
    }

    if (!newMovie.imdbId) {
      return;
    }

    if (this.state.movies.some(({ imdbId }) => imdbId === newMovie.imdbId)) {
      return;
    }

    this.setState(state => ({
      movies: [...state.movies, newMovie],
    }));
  }

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie onAddMovie={this.addMovie} />
        </div>
      </div>
    );
  }
}
