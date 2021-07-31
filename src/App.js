import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

const filmKey = 'film';

export class App extends Component {
  filmFromServer = JSON.parse(window.localStorage.getItem(filmKey))

  state = {
    movies: this.filmFromServer || data,
  };

  addMovie = (movie) => {
    const { movies } = this.state;

    if (!movie) {
      return;
    }

    const includesMovieInList
      = movies.some(film => film.imdbId === movie.imdbId);

    if (!includesMovieInList) {
      this.setState(state => ({
        movies: [...state.movies, movie],
      }),
      () => {
        const stringifyMovies = JSON.stringify(this.state.movies);

        window.localStorage.setItem(filmKey, stringifyMovies);
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
