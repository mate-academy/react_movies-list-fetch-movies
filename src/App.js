import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addMovie = (addedMovie) => {
    if (!this.state.movies.find(movie => movie.imdbId === addedMovie.imdbId)) {
      this.setState(
        state => ({ movies: [...state.movies, addedMovie] }),
      );
    }
  }

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
