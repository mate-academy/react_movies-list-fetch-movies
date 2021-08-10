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
    const inTheList = this.state.movies
      .some(filmItem => filmItem.title === movie.title);

    if (inTheList) {
      this.setState(state => ({
        movies: [...state.movies, movie],
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
          <FindMovie
            addMovie={addMovie}
          />
        </div>
      </div>
    );
  }
}
