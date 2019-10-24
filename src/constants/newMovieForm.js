import { composeValidators, required, url } from '../utils/validators';

export const FORM_CONFIG = {
  title: {
    validate: required,
    label: 'Title',
    placeholder: 'Input film title',
  },
  description: {
    validate: null,
    label: 'Description',
    placeholder: 'Input film description',
  },
  imgUrl: {
    validate: composeValidators(url, required),
    label: 'Image url',
    placeholder: 'Paste image url',
  },
  imdbUrl: {
    validate: composeValidators(url, required),
    label: 'IMDB url',
    placeholder: 'Paste IMDB url',
  },
  imdbId: {
    validate: required,
    label: 'IMDB id',
    placeholder: 'Enter IMDB id',
  },
};

export const CONTROLS_NAMES = Object.keys(FORM_CONFIG);
