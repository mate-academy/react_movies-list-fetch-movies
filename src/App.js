import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addMovie = (newMovie) => {
    if (newMovie !== null
      && !this.state.movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      this.setState(state => ({
        movies: [...state.movies, newMovie],
      }));
    }
  }

  render() {
    const { movies } = this.state;
    const { addMovie } = this;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={addMovie} />
        </div>
      </div>
    );
  }
}
