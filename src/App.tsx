import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { MoviesCard } from './components/interfaces';

export class App extends Component {
  state = {
    movies: data,
    hasAlready: false,
  };

  addFilm = (newFilm: MoviesCard): void => {
    this.setState({ hasAlready: false });
    const { movies } = this.state;

    const hasAlready = movies
      .some(movie => movie.imdbId === newFilm.imdbId);

    if (!hasAlready) {
      this.setState({ movies: [...data, newFilm] });
    } else {
      this.setState({ hasAlready: true });
    }
  };

  render() {
    const { movies, hasAlready } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie hasAlready={hasAlready} addFilm={this.addFilm} />
        </div>
      </div>
    );
  }
}
