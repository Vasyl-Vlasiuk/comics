// TODO sent request specific url and transform data //

import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const {loading, error, request, clearError} = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=9cfed5f125789fc4b74bb7a446f9214d';
  const _baseOffset = 210;

  // Characters
  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map((_transformCharacter));
  }

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);    //* 3.4 .getResource(url)
    return _transformCharacter(res.data.results[0]);                        //* 3.5 _transformCharacter()
  }

  const _transformCharacter = (char) => {
    const descr = char.description;

    return {
      id: char.id,
      name: char.name,
      description: !descr.length ? 'There is no character description' : 
      (descr.length > 200 ? descr.slice(0, 200) + '...' : descr),
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    }
  }

  // Comics
  const getAllComics = async (offset ) => {
    const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
    return res.data.results.map((_transformComic));
  }

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComic(res.data.results[0]);  
  }

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description || 'There is no description',
      pageCount: comic.pageCount ? `${comic.pageCount} pages` : 'No information about the number of pages',
      thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
      language: comic.textObjects[0]?.language,
      price: comic.prices.price ? `${comic.prices.price}$` : 'not available'
    }
  }

  return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic}
}

export default useMarvelService;