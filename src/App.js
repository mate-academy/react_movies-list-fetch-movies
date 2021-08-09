import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addNewMovie = (newMovie) => {
    if (!this.state.movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      this.setState(prevState => ({
        movies: [...prevState.movies, newMovie],
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
          <FindMovie
            onSubmit={this.addNewMovie}
          />
        </div>
      </div>
    );
  }
}
