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
    if (newMovie) {
      this.setState((state) => {
        const exists = state.movies
          .find(movie => movie.imdbId === newMovie.imdbId);

        return !exists
          ? { movies: [...state.movies, newMovie] }
          : { movies: state.movies };
      });
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
