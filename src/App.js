import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addMovieToTheList = (movie) => {
    if (movie !== null) {
      if (!this.state.movies.find(film => film.imdbId === movie.imdbId)) {
        this.setState(state => ({
          movies: [...state.movies, movie],
        }));
      }
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
          <FindMovie addMovieToTheList={this.addMovieToTheList} />
        </div>
      </div>
    );
  }
}
