import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import moviesFromServer from './api/movies.json';

export class App extends Component {
  state = {
    movies: moviesFromServer,
  };

  addNewMovies = (movies) => {
    this.setState(state => ({
      movies: [...state.movies, ...movies],
    }));
  }

  render() {
    const { movies } = this.state;
    const moviesIds = movies.map(movie => movie.imdbId);

    return (
      <div className="App">
        <header className="header">
          <h1 className="title">Movies</h1>
          <div className="controlers-block">
            <FindMovie
              moviesIds={moviesIds}
              addNewMovies={this.addNewMovies}
            />
          </div>
        </header>
        <main className="main">
          <MoviesList movies={movies} />
        </main>
      </div>
    );
  }
}
