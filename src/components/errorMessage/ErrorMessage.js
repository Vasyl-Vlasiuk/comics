import img from './error.gif';

const ErrorMessage = () => {
  return (
    <img src={img} 
    // <img src={process.env.PUBLIC_URL + '/error.gif'} />
      style={{display: 'block', width: '250px', height: '250px', objectFit: 'contain', margin: '0 auto'}}
      alt='error img'
    />
  );
}

export default ErrorMessage;