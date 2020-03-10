import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { Movie } from './utils/interfaces';

interface State {
  movies: Movie[];
}

export class App extends Component <{}, State> {
  state = {
    movies: data,
  };

  addMovie = (movie: Movie): void => {
    const { movies } = this.state;
    const isMovieExist = movies.find(film => film.imdbId === movie.imdbId);

    if (!isMovieExist) {
      this.setState(prevState => ({
        movies: [...prevState.movies, { ...movie }],
      }));
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
          <FindMovie addMovie={this.addMovie} />
        </div>
      </div>
    );
  }
}
