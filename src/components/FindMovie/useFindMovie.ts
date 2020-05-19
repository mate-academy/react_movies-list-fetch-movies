import React, { useCallback, useState } from 'react';
import axios from 'axios';
import API_URL from '../../api/api';

export const useFindMovie = ({ addMovie, usedMovieError }: FindMovieProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imdbUrl, setImdbUrl] = useState('');
  const [imdbId, setImdbId] = useState('');
  const [error, setError] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  const [isPreviewReady, setPreviewReady] = useState(false);
  const [isFilmAdded, setAddingStatus] = useState(false);

  const saveInputValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
      setError(false);
      setErrorTitle(false);
    }, [],
  );

  const handleSearch = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    axios.get(`${API_URL}&t=${searchInput.split(' ').join('+')}`)
      .then(res => {
        if (res.data.Error) {
          setError(true);

          return;
        }

        const {
          Title, Plot, Poster, imdbID,
        } = res.data;

        setTitle(Title);
        setDescription(Plot);
        setImgUrl(Poster);
        setImdbUrl(`https://www.imdb.com/title/${imdbID}`);
        setImdbId(imdbID);
        setPreviewReady(true);
        setAddingStatus(false);
      });
  }, [searchInput]);

  const onBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'movie-title') {
      if (searchInput.length === 0
        || searchInput.trim() === '') {
        setErrorTitle(true);
      } else {
        setErrorTitle(false);
      }
    }
  }, [searchInput]);

  const handleAddingMovie = useCallback(() => {
    if (!error && title.trim().length > 0) {
      addMovie({
        title, description, imgUrl, imdbUrl, imdbId,
      });
      setSearchInput('');
      setTitle('');
      setDescription('');
      setImgUrl('');
      setImdbUrl('');
      setImdbId('');
      setAddingStatus(true);
      setPreviewReady(false);
    }
  }, [addMovie, title, description, imgUrl, imdbUrl, imdbId, error]);

  return {
    searchInput,
    error,
    saveInputValue,
    handleSearch,
    onBlur,
    handleAddingMovie,
    usedMovieError,
    errorTitle,
    isPreviewReady,
    isFilmAdded,
    title,
    description,
    imgUrl,
    imdbUrl,
    imdbId,
  };
};
