import { useNavigate } from 'react-router-dom';
import './NotFound.scss';

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
  };

  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};

export default NotFound;