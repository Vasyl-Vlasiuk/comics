import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = (props) => {
  const [char, setChar] = useState(null);
  const {loading, error, getCharacter, clearError} = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId])

  const updateChar = () => {
    const { charId } = props;

    if (!charId) {
      // eslint-disable-next-line
      return;
    }

    clearError();

    getCharacter(charId)
      .then(onCharLoaded)
  }

  const onCharLoaded = (char) => {
    setChar(char)
  }

  const skeleton = char || loading || error ? null : <Skeleton />;
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  )
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  const navigate = useNavigate();

  const goComic = (comic) => {
    const comicId = comic.split('/').pop();
    navigate(`/comics/${comicId}`)
  }

  return (
    <>
      <div className="char__basics">
        <img 
          src={thumbnail}
          alt={name} 
          style={{objectFit: thumbnail.lastIndexOf('image_not_available') > -1 ? 'contain' : 'cover'}}
        />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : 'There is no comics with this character'}
      
        {comics.map((item, i) => (
          <li 
            key={i} 
            className="char__comics-item"
            onClick={() => goComic(item.resourceURI)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </>
  )
}

export default CharInfo;