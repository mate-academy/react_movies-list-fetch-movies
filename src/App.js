import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

const moviesKey = 'movies';

export class App extends Component {
  moviesFromStorage = JSON.parse(window.localStorage.getItem(moviesKey));

  state = {
    movies: this.moviesFromStorage || data,
  };

  addMovie = (movie) => {
    if (movie !== null) {
      if (!this.state.movies.find(film => film.imdbId === movie.imdbId)) {
        this.setState(state => ({
          movies: [
            ...state.movies,
            movie,
          ],
        }),
        () => {
          const stringifiedMovies = JSON.stringify(this.state.movies);

          window.localStorage.setItem(moviesKey, stringifiedMovies);
        });
      }
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
