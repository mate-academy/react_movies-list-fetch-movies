import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  isAlreadyAdded = movie => (!!this.state.movies.find(
    ({ imdbId }) => imdbId === movie.imdbId,
  ))

  addMovie = (movie) => {
    this.setState(state => ({
      movies: [...state.movies, movie],
    }));
  }

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            isAlreadyAdded={this.isAlreadyAdded}
            addMovie={this.addMovie}
          />
        </div>
      </div>
    );
  }
}
