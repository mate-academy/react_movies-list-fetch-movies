import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addMovie = (e, movie) => {
    e.preventDefault();

    const { movies } = this.state;

    if (movies.some(m => m.imdbId === movie.imdbId)) {
      return;
    }

    const newMovie = movie;

    this.setState(state => ({ movies: state.movies.concat(newMovie) }));
  }

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie onAdd={this.addMovie} />
        </div>
      </div>
    );
  }
}
