import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addMovie = (newMovie, setMovie) => {
    if (!newMovie) {
      return;
    }

    const wasMovieAdded = this.state.movies.some(
      movie => movie.imdbID.includes(newMovie.imdbID),
    );

    if (!wasMovieAdded) {
      this.setState(state => ({
        movies: [...state.movies, newMovie],
      }));
    }

    setMovie(null);
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
