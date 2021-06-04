import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
    isNewMovieAlreadyInList: false,
  };

  resetMovieAlreadyInList = () => {
    this.setState({ isNewMovieAlreadyInList: false });
  }

  addMovie = (newMovie) => {
    const { movies } = this.state;

    if (movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      this.setState({ isNewMovieAlreadyInList: true });

      return;
    }

    this.setState(state => ({
      movies: state.movies.concat(newMovie),
    }));

    this.resetMovieAlreadyInList();
  }

  render() {
    const { movies, isNewMovieAlreadyInList } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            addMovie={this.addMovie}
            resetMovieAlreadyInList={this.resetMovieAlreadyInList}
            isNewMovieAlreadyInList={isNewMovieAlreadyInList}
          />
        </div>
      </div>
    );
  }
}
