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
    this.setState((state) => {
      const isMovieInTheList = state.movies
        .some(film => film.imdbId === movie.imdbId);

      return (isMovieInTheList) ? { movies: state.movies } : {
        movies: [...state.movies, movie,
        ],
      };
    });
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
            addMovie={this.addMovie}
          />
        </div>
      </div>
    );
  }
}
