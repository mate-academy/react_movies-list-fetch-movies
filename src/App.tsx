import React, { Component, ChangeEvent, FormEvent } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

const BASE_URL = 'http://www.omdbapi.com/?apikey=4709decb&t=';

interface State {
  movies: Movie[];
  isError: boolean;
  searchValue: string;
  preview: Movie;
}

export class App extends Component<{}, State> {
  state: Readonly<State> = {
    movies: data,
    isError: false,
    searchValue: '',
    preview: data[0],
  };

  changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;

    this.setState({
      searchValue: target.value.toLowerCase(),
      isError: false,
    });
  };

  findMovie = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    fetch(`${BASE_URL}${this.state.searchValue.trim()}`)
      .then(response => response.json())
      .then(dataFromServer => {
        const {
          Title,
          Plot,
          imdbID,
          Poster,
        } = dataFromServer;

        if ('Error' in dataFromServer) {
          this.setState({
            isError: true,
            preview: data[0],
          });
        } else {
          this.setState({
            preview: {
              title: Title,
              imdbId: imdbID,
              description: Plot,
              imgUrl: Poster,
              imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            },
          });
        }
      });
  };

  addMovie = () => {
    const isContain = this.state
      .movies.some(movie => {
        return movie.imdbId === this.state.preview.imdbId;
      });

    if (isContain) {
      return;
    }

    this.setState((prevState => {
      return {
        movies: [...prevState.movies, prevState.preview],
        searchValue: '',
      };
    }));
  };

  render() {
    const {
      movies,
      isError,
      searchValue,
      preview,
    } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            isError={isError}
            value={searchValue}
            findMovie={this.findMovie}
            addMovie={this.addMovie}
            changeHandler={this.changeHandler}
            preview={preview}
          />
        </div>
      </div>
    );
  }
}
