const url = 'https://www.omdbapi.com/?apikey=c0013868';

export const request = (title: string) => {
  return fetch(`${url}&t=[${title}]`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Can&apos;t load, sorry');
      }

      return res.json();
    });
};
