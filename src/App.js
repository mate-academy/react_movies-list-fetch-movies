import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './data/api';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
    newMovie: null,
    isError: false,
    query: '',
  };

  onSearchField = (e) => {
    this.setState({
      query: e.target.value,
      isError: false,
    });
  }

  toFindMovie = async() => {
    const { query } = this.state;

    const newMovie = await getMovie(query);

    if (newMovie.Error !== undefined) {
      this.setState({
        isError: true,
        query: '',
      });

      return;
    }

    this.setState({
      isError: false,
    });

    const movie = {
      title: newMovie.Title,
      description: newMovie.Plot,
      imgUrl: newMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
      imdbId: newMovie.imdbID,
    };

    this.setState({
      newMovie: movie,
      query: '',
    });
  }

  addMovie = () => {
    const { movies, newMovie } = this.state;

    if (!newMovie) {
      this.setState({
        isError: true,
        query: '',
      });

      return;
    }

    const duplicate = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (duplicate) {
      this.setState({ newMovie: null });

      return;
    }

    this.setState(state => ({
      movies: [
        ...state.movies,
        newMovie,
      ],
      newMovie: null,
    }));
  }

  render() {
    const { movies, query, isError, newMovie } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            onSearchField={this.onSearchField}
            toFindMovie={this.toFindMovie}
            addMovie={this.addMovie}
            query={query}
            isError={isError}
            newMovie={newMovie}
          />
        </div>
      </div>
    );
  }
}
