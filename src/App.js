import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  }

  addMovieToList = (movie) => {
    const { movies } = this.state;

    if (!movie) {
      return;
    }

    const isOnList = movies.some(
      film => film.imdbId === movie.imdbId,
    );

    if (!isOnList) {
      this.setState(state => ({ movies: [...state.movies, movie] }));
    }
  }

  render() {
    const { movies } = this.state;
    const { addMovieToList } = this;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovieToList={addMovieToList} />
        </div>
      </div>
    );
  }
}
