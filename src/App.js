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
    const { movies } = this.state;

    if (!movie) {
      return;
    }

    const sameMovies = movies
      .some(prevMovie => prevMovie.imdbId === movie.imdbId);

    if (!sameMovies) {
      this.setState(state => ({
        movies: [...state.movies, movie],
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
          <FindMovie addMovie={this.addMovie} />
        </div>
      </div>
    );
  }
}
