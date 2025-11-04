import { useParams } from 'react-router-dom';
import NivelCognados from '../Game/levels/NivelCognados';
import NivelCognadosMedio from '../Game/levels/NivelCognadosMedio';
import NivelCognadosDificil from '../Game/levels/NivelCognadosDificil';

const NivelCognadosWrapper = () => {
  const { dificultad } = useParams();
  
  switch(dificultad) {
    case 'facil':
      return <NivelCognados />;
    case 'medio':
      return <NivelCognadosMedio />;
    case 'dificil':
      return <NivelCognadosDificil/>; // o tu componente de difícil
    default:
      return <NivelCognados />;
  }
};

export default NivelCognadosWrapper;