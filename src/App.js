import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
    isMovieInList: false,
  };

  addMovie = (movie) => {
    this.setState((state) => {
      const isMovieInTheList = state.movies
        .some(film => film.imdbId === movie.imdbId);

      return (isMovieInTheList) ? {
        movies: state.movies, isMovieInList: true,
      } : {
        movies: [...state.movies, movie,
        ],
        isMovieInList: false,
      };
    });
  }

  render() {
    const { movies, isMovieInList } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            addMovie={this.addMovie}
            isMovieInList={isMovieInList}
          />
        </div>
      </div>
    );
  }
}
