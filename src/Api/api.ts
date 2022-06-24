const url = 'https://www.omdbapi.com/?apikey=66e7ad24';

export const request = (title: string) => {
  return fetch(`${url}&t=[${title}]`)
    .then(res => {
      if (!res.ok) {
        throw new Error('There were problems loading...');
      }

      return res.json();
    });
};
