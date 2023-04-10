import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {

  const [сomicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(15);
  const [comicsEnded, setComicsEnded] = useState(false);
  
  const {loading, error, getAllComics} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onCharactersLoaded)
  }

  const onCharactersLoaded = (newComics) => {
    let ended = false;
    if (newComics.length < 8) ended = true;
    
    setComicsList((comics) => [...comics, ...newComics]);
    setNewItemLoading(newComics => false);
    setOffset(offset => offset + 8);
    setComicsEnded(comicsEnded => ended);
  }

  function renderComics(arr) {
    const comics = arr.map((item, i) => (
      <li key={i} className="comics__item">
        <Link to={`/comics/${item.id}`}>
          <img src={item.thumbnail} alt="ultimate war" className="comics__item-img" />
          <div className="comics__item-name">{item.title}</div>
          <div className="comics__item-price">{item.price}$</div>
        </Link>
      </li>
    ))
    
    return <ul className="comics__grid">{comics}</ul>
  }

  const comics = renderComics(сomicsList);
  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      {comics}

      <button 
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{'display': comicsEnded ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

export default ComicsList;