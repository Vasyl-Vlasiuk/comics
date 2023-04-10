import React, { useState, useEffect, useRef } from 'react';
import './charList.scss';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';

const CharList = (props) => {

  const [characters, setCharacters] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(301);
  const [charactersEnded, setCharactersEnded] = useState(false);


  const {loading, error, getAllCharacters} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, [])


  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
      .then(onCharactersLoaded)
  }

  const onCharactersLoaded = (newCharacters) => {
    let ended = false;
    if (newCharacters.length < 9) ended = true;
    
    setCharacters((characters) => [...characters, ...newCharacters]);
    setNewItemLoading(newItemLoading => false);
    setOffset(offset => offset + 9);
    setCharactersEnded(charactersEnded => ended);
  }

  const itemRefs = useRef([]);   
  
  const focusOnItem = (id) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  }

  function renderItems(arr) {
    const items = arr.map((item, i) => (
      <li 
        className="char__item"
        key={item.id} 
        tabIndex={0}
        ref={el => itemRefs.current[i] = el}
        onClick={() => {
          props.onCharSelected(item.id)
          focusOnItem(i)
        }}
      >
        <img 
          src={item.thumbnail} 
          alt="abyss"
          style={{objectFit: item.thumbnail.lastIndexOf('image_not_available') > -1 ? 'unset' : 'cover'}}
        />
        <div className="char__name">{item.name}</div>
      </li>
    ))
    
    return (
      <ul className="char__grid">
        {items}
      </ul>
    )
  }

  const items = renderItems(characters);

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}

      <button 
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{'display': charactersEnded ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  )
}


export default CharList;