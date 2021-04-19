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
    if (!this.state.movies.find(item => movie.imdbID === item.imdbId)) {
      const newMovie = {
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      };

      this.setState(state => ({
        movies: [newMovie, ...state.movies],
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
          <FindMovie addMovie={this.addMovie} />
        </div>
      </div>
    );
  }
}
