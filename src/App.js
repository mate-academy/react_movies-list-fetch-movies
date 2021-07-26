import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addMovie = (movie) => {
    if (!this.isAlreadyInTheList(movie)) {
      this.setState(state => ({
        movies: [...state.movies, movie],
      }));
    }
  };

  isAlreadyInTheList = movie => this.state.movies
    .some(film => movie.imdbId === film.imdbId)

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie onSubmit={this.addMovie} />
        </div>
      </div>
    );
  }
}
