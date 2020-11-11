import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export class App extends Component {
  state = {
    movies: [],
  };

  onCklickAddMovie = (movie) => {
    this.setState(prevState => ({ movies: [...prevState.movies, movie] }));
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
            movies={movies}
            onCklickAddMovie={this.onCklickAddMovie}
          />
        </div>
      </div>
    );
  }
}
