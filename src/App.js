import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  hasMovie = movieId => this.state.movies.find(
    movie => movie.imdbId === movieId,
  );

  addMovie = (newMovie) => {
    this.setState(state => ({
      movies: [
        ...state.movies,
        newMovie,
      ],
    }));
  }

  render() {
    const { movies } = this.state;
    const { hasMovie, addMovie } = this;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            onHasMovie={hasMovie}
            onAddMovie={addMovie}
          />
        </div>
      </div>
    );
  }
}
