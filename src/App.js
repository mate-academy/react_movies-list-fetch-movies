import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  setFilm = (film) => {
    if (!this.state.movies.some(movie => movie.imdbID === film.imdbID)) {
      this.setState(({ movies }) => ({
        movies: [...movies, film],
      }));
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
          <FindMovie setFilm={this.setFilm} />
        </div>
      </div>
    );
  }
}
