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
    if (this.state.movies
      .every(presentMovie => presentMovie.imdbId !== movie.imdbId)) {
      this.setState(prevState => ({
        movies: [...prevState.movies, movie],
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
