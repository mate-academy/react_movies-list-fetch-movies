import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: [...data],
  };

  addMovie = (newMovie) => {
    if (this.state.movies.some(movie => movie.imdbID === newMovie.imdbID)) {
      return;
    }

    this.setState(state => (
      { movies: [...state.movies, newMovie] }
    ));
  }

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={this.addMovie} movies={movies} />
        </div>
      </div>
    );
  }
}
