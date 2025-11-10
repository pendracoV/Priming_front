import { useParams } from 'react-router-dom';
import NivelParesMinimos from '../Game/levels/NivelParesMinimos';
import NivelParesMinimosMedio from '../Game/levels/NivelParesMinimosMedio';
// import NivelParesMinimosDificil from '../Game/levels/NivelParesMinimosDificil';

const NivelParesMininimosWrapper = () => {
  const { dificultad } = useParams();
  
  switch(dificultad) {
    case 'facil':
      return <NivelParesMinimos />;
    case 'medio':
      return <NivelParesMinimosMedio />;
    case 'dificil':
      return <NivelParesMinimos />; // TODO: Cambiar a NivelParesMinimosDificil cuando esté listo
    default:
      return <NivelParesMinimos />;
  }
};

export default NivelParesMininimosWrapper;