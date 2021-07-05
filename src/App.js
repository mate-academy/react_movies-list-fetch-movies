import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
    isMovieExists: false,
  };

  addMovie = (newMovie) => {
    const isMovieExists = !!this.state.movies
      .find(movie => movie.title === newMovie.title);

    if (!isMovieExists) {
      this.setState(state => ({
        movies: [...state.movies, newMovie],
      }));
    } else {
      this.setState(state => ({
        movies: state.movies,
        isMovieExists: true,
      }));

      setTimeout(() => {
        this.setState(state => ({
          movies: state.movies,
          isMovieExists: false,
        }));
      }, 3000);
    }
  };

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
            isExist={this.state.isMovieExists}
          />
        </div>
      </div>
    );
  }
}
