import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addNewMovie = (movie) => {
    this.setState((state) => {
      const hadMovie = state.movies.some(el => el.imdbId === movie.imdbId);

      return {
        movies: !hadMovie
          ? [...state.movies, movie]
          : [...state.movies],
      };
    });
  }

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addNewMovie={this.addNewMovie} />
        </div>
      </div>
    );
  }
}
