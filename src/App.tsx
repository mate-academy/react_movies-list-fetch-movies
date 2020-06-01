import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

interface State {
  movies: Movie[];
}

export class App extends Component <{}, State> {
  state = {
    movies: data,
  };

  addMovie = (newMovie: Movie) => {
    this.setState(prevState => ({
      movies: [
        ...prevState.movies,
        newMovie,
      ],
    }));
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={this.addMovie} movies={movies} />
        </div>
      </div>
    );
  }
}
