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
    if (this.state.movies.find(element => element.imdbId === movie.imdbID)) {
      return;
    }

    this.setState(prevState => ({
      movies: [...prevState.movies,
        {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        }],
    }));
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
