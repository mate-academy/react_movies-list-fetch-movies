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
    this.setState({
      movies: newMovie,
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
            addNewMovie={this.addNewMovie}
            movies={this.state.movies}
          />
        </div>
      </div>
    );
  }
}
