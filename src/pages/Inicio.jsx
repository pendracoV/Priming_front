import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import Navbar from '../components/Navbar';

// Estilos globales para eliminar márgenes y bordes blancos
const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: #1a1a1a;
  }
  
  * {
    box-sizing: border-box;
  }
`;

// Animaciones
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Componentes Styled
const Container = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
  width: 100%;
  color: #f4f4f4;
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding-top: 70px; /* Espacio para el navbar fijo */
  margin: 0;
  scroll-behavior: smooth;
  overflow-x: hidden; /* Evitar scroll horizontal */
`;

const Hero = styled.section`
  padding: 4rem 0 6rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(252, 117, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(252, 117, 0, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(252, 117, 0, 0.05) 0%, transparent 50%);
    animation: ${pulse} 8s ease-in-out infinite;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  color: #fc7500;
  font-size: 4rem;
  margin-bottom: 1rem;
  font-weight: 800;
  animation: ${fadeInDown} 1s ease;
  text-shadow: 0 4px 20px rgba(252, 117, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: #f4f4f4;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 1s ease 0.2s both;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Description = styled.p`
  color: rgba(244, 244, 244, 0.8);
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.8;
  animation: ${fadeInUp} 1s ease 0.4s both;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #fc7500 0%, #e56700 100%);
  color: white;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  font-family: 'Manrope', sans-serif;
  box-shadow: 0 8px 25px rgba(252, 117, 0, 0.4);
  animation: ${fadeInUp} 1s ease 0.6s both;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 12px 35px rgba(252, 117, 0, 0.6);
  }
  
  &:active {
    transform: translateY(-2px) scale(1.02);
  }
`;

const Section = styled.section`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  color: #fc7500;
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  font-weight: 700;
  animation: ${fadeInUp} 0.8s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #fc7500, #e56700);
    border-radius: 2px;
    animation: ${shimmer} 2s infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Card = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  transition: all 0.4s ease;
  animation: ${fadeInUp} 0.8s ease;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
  animation-fill-mode: forwards;
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: rgba(252, 117, 0, 0.5);
    box-shadow: 0 15px 40px rgba(252, 117, 0, 0.2);
    background: rgba(252, 117, 0, 0.05);
  }
  
  h3 {
    color: #fc7500;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  p {
    color: rgba(244, 244, 244, 0.9);
    line-height: 1.8;
  }
`;

const ConceptBox = styled.div`
  background: linear-gradient(135deg, rgba(252, 117, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
  border: 1px solid rgba(252, 117, 0, 0.3);
  border-radius: 20px;
  padding: 2.5rem;
  margin: 3rem 0;
  animation: ${slideIn} 0.8s ease;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 30px rgba(252, 117, 0, 0.2);
  }
  
  h3 {
    color: #fc7500;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #f4f4f4;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 2rem 0;
  }
`;

const HighlightSection = styled.div`
  background: linear-gradient(135deg, #fc7500 0%, #e56700 100%);
  padding: 5rem 2rem;
  text-align: center;
  margin: 0;
  width: 100%;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: ${float} 20s linear infinite;
  }
  
  h2 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    font-weight: 700;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.95);
    font-size: 1.2rem;
    max-width: 900px;
    margin: 0 auto;
    line-height: 1.8;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const HighlightContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 3rem;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
`;

const StatItem = styled.div`
  text-align: center;
  animation: ${pulse} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  
  .stat-number {
    font-size: 3.5rem;
    font-weight: 800;
    display: block;
    margin-bottom: 0.5rem;
    color: white;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  .stat-label {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const GameModesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GameCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  animation: ${fadeInUp} 0.8s ease;
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 50px rgba(252, 117, 0, 0.3);
  }
`;

const GameHeader = styled.div`
  background: linear-gradient(135deg, #fc7500 0%, #e56700 100%);
  padding: 2rem;
  text-align: center;
  
  h3 {
    color: white;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  
  p {
    color: rgba(255, 255, 255, 0.95);
    font-size: 1.1rem;
  }
`;

const GameBody = styled.div`
  padding: 2rem;
  
  p {
    color: #f4f4f4;
    line-height: 1.8;
    margin-bottom: 1rem;
  }
`;

const DifficultyLevels = styled.div`
  margin-top: 2rem;
`;

const Difficulty = styled.div`
  background: rgba(252, 117, 0, 0.05);
  border-left: 4px solid #fc7500;
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(252, 117, 0, 0.1);
    transform: translateX(10px);
  }
  
  strong {
    color: #fc7500;
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  
  span {
    color: rgba(244, 244, 244, 0.8);
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 1rem 0 1rem 3rem;
    position: relative;
    font-size: 1.1rem;
    line-height: 1.8;
    color: #f4f4f4;
    animation: ${slideIn} 0.5s ease;
    animation-delay: ${props => props.delay || '0s'};
    opacity: 0;
    animation-fill-mode: forwards;
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #fc7500;
      font-size: 2rem;
      font-weight: bold;
    }
    
    strong {
      color: #fc7500;
    }
  }
`;

const ContactSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  max-width: 800px;
  margin: 5rem auto;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease;
  
  h3 {
    color: #fc7500;
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin: 3rem auto;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ContactButton = styled.a`
  background: linear-gradient(135deg, #444 0%, #333 100%);
  color: white;
  text-decoration: none;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #555 0%, #444 100%);
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(252, 117, 0, 0.3);
    color: #fc7500;
  }
`;

const Footer = styled.footer`
  background: #1a1a1a;
  padding: 3rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  margin: 0;
  
  p {
    color: rgba(244, 244, 244, 0.6);
    margin: 0.5rem 0;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const TechStack = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  
  span {
    color: rgba(244, 244, 244, 0.5);
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
  }
`;

// Componente Principal
const Inicio = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <GlobalStyle />
      <Navbar />
      <Container>
        <Hero>
          <HeroContent>
            <Title>PRIMING</Title>
          <Subtitle>Preparación Lingüística para la Primera Infancia</Subtitle>
          <Description>
            Revolucionando el aprendizaje del inglés en niños de 5 a 7 años mediante 
            neurociencia cognitiva y gamificación interactiva
          </Description>
          <CTAButton onClick={() => handleScrollToSection('concepto')}>
            Descubre la Metodología
          </CTAButton>
        </HeroContent>
      </Hero>

      <Section id="concepto">
        <SectionTitle>¿Qué es PRIMING?</SectionTitle>
        
        <ConceptBox>
          <h3>El Poder del Efecto Priming</h3>
          <p>
            El <strong>priming</strong> o "preparación cognitiva" es un fenómeno neurocientífico 
            donde la exposición previa a ciertos estímulos influye en la respuesta posterior del 
            cerebro. En educación, esto significa que podemos preparar el cerebro de los niños 
            para facilitar el aprendizaje de un segundo idioma de manera natural e implícita.
          </p>
        </ConceptBox>

        <ConceptBox>
          <h3>Memoria Implícita y Aprendizaje</h3>
          <p>
            A diferencia del aprendizaje tradicional que requiere esfuerzo consciente, el priming 
            activa la <strong>memoria implícita</strong>: el niño aprende sin darse cuenta, de 
            forma automática y sin necesidad de memorización forzada. Los estímulos previos crean 
            conexiones neuronales que facilitan el reconocimiento y producción del inglés posteriormente.
          </p>
        </ConceptBox>

        <Grid>
          <Card delay="0s">
            <h3>Activación Cognitiva</h3>
            <p>
              Mediante la exposición repetida a estímulos auditivos en inglés, se activan redes 
              neuronales que preparan al cerebro para el procesamiento del idioma.
            </p>
          </Card>
          <Card delay="0.2s">
            <h3>Aprendizaje Natural</h3>
            <p>
              Similar a cómo los niños aprenden su lengua materna, el priming permite la adquisición 
              del inglés de forma intuitiva y sin traducción.
            </p>
          </Card>
          <Card delay="0.4s">
            <h3>Procesamiento Rápido</h3>
            <p>
              El efecto priming acelera la velocidad de procesamiento lingüístico, permitiendo 
              respuestas más rápidas y fluidas en inglés.
            </p>
          </Card>
        </Grid>
      </Section>

      <HighlightSection>
        <HighlightContent>
          <h2>Ventana Crítica de Aprendizaje</h2>
          <p>
            La primera infancia (5-7 años) es el período ideal para el aprendizaje de idiomas. 
            El cerebro infantil tiene una <strong>plasticidad neuronal excepcional</strong> que 
            facilita la adquisición de nuevos sonidos y estructuras lingüísticas.
          </p>
          <StatsContainer>
            <StatItem delay="0s">
              <span className="stat-number">80%</span>
              <span className="stat-label">Del desarrollo cerebral<br/>antes de los 6 años</span>
            </StatItem>
            <StatItem delay="0.3s">
              <span className="stat-number">3x</span>
              <span className="stat-label">Más rápido aprenden<br/>los niños vs. adultos</span>
            </StatItem>
            <StatItem delay="0.6s">
              <span className="stat-number">100%</span>
              <span className="stat-label">Natural: sin traducción<br/>ni memorización forzada</span>
            </StatItem>
          </StatsContainer>
        </HighlightContent>
      </HighlightSection>

      <Section>
        <SectionTitle>Metodología de Juego</SectionTitle>
        
        <GameModesGrid>
          <GameCard>
            <GameHeader>
              <h3>Mundo Cognados</h3>
              <p>Palabras que suenan similar en español e inglés</p>
            </GameHeader>
            <GameBody>
              <p>
                <strong>Concepto:</strong> Los cognados son palabras transparentes que comparten 
                sonido y significado entre idiomas. Entre el 30-40% de las palabras en inglés tienen 
                un cognado en español (ejemplo: animal-animal, music-música).
              </p>
              
              <p>
                <strong>Beneficio pedagógico:</strong> Facilita la comprensión al aprovechar 
                conocimientos previos del español, reduciendo la carga cognitiva y aumentando 
                la confianza del niño.
              </p>
              
              <DifficultyLevels>
                <Difficulty>
                  <strong>Nivel Fácil (10 niveles)</strong>
                  <span>1 indicador + 16 seleccionables | 3 minutos | Entrenamiento: 10 repeticiones</span>
                </Difficulty>
                <Difficulty>
                  <strong>Nivel Medio (5 niveles)</strong>
                  <span>2 indicadores + 9 seleccionables | 2:30 min | Entrenamiento: 5 rep c/u</span>
                </Difficulty>
                <Difficulty>
                  <strong>Nivel Difícil (5 niveles)</strong>
                  <span>3 indicadores + 9 seleccionables | 1:30 min | Entrenamiento: 5 rep c/u</span>
                </Difficulty>
              </DifficultyLevels>
            </GameBody>
          </GameCard>

          <GameCard>
            <GameHeader>
              <h3>Mundo Pares Mínimos</h3>
              <p>Palabras con pronunciación similar en inglés</p>
            </GameHeader>
            <GameBody>
              <p>
                <strong>Concepto:</strong> Pares de palabras que se diferencian por un solo sonido 
                (ship/sheep, bit/beat). Esencial para desarrollar discriminación auditiva y 
                pronunciación precisa.
              </p>
              
              <p>
                <strong>Beneficio pedagógico:</strong> Entrena el oído del niño para distinguir 
                sonidos que no existen en español, mejorando significativamente la comprensión 
                auditiva y pronunciación.
              </p>
              
              <DifficultyLevels>
                <Difficulty>
                  <strong>Nivel Fácil</strong>
                  <span>1 indicador + 16 seleccionables | 3 minutos | Entrenamiento auditivo intensivo</span>
                </Difficulty>
                <Difficulty>
                  <strong>Nivel Medio (5 niveles)</strong>
                  <span>2 indicadores + 9 seleccionables | 2:30 min | Discriminación dual</span>
                </Difficulty>
                <Difficulty>
                  <strong>Nivel Difícil (5 niveles)</strong>
                  <span>3 indicadores + 9 seleccionables | 1:30 min | Alta complejidad auditiva</span>
                </Difficulty>
              </DifficultyLevels>
            </GameBody>
          </GameCard>
        </GameModesGrid>
      </Section>

      <Section>
        <SectionTitle>Sistema de Gamificación</SectionTitle>
        
        <Grid>
          <Card delay="0s">
            <h3>Sistema de Monedas</h3>
            <p>
              <strong>Inicio:</strong> 200 monedas<br/>
              <strong>Acierto:</strong> +10 monedas<br/>
              <strong>Error:</strong> -10 monedas<br/>
              <strong>Meta:</strong> 80% de aciertos mínimo
            </p>
          </Card>
          <Card delay="0.2s">
            <h3>Entrenamiento Previo</h3>
            <p>
              Cada nivel inicia con una fase de entrenamiento donde el niño escucha repetidamente 
              el audio correcto, preparando su cerebro mediante efecto priming.
            </p>
          </Card>
          <Card delay="0.4s">
            <h3>Tiempo Limitado</h3>
            <p>
              Desafíos cronometrados que aumentan la dificultad progresivamente, manteniendo la 
              atención y motivación del niño.
            </p>
          </Card>
          <Card delay="0.6s">
            <h3>Refuerzo Auditivo</h3>
            <p>
              Los indicadores pueden reproducirse en cualquier momento, reforzando el aprendizaje 
              mediante repetición espaciada.
            </p>
          </Card>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Beneficios Científicamente Comprobados</SectionTitle>
        
        <BenefitsList>
          <li delay="0s">
            <strong>Mejora de la retención:</strong> Al exponer a los niños a conceptos relevantes 
            antes del aprendizaje formal, se activan redes cognitivas que facilitan la codificación 
            y recuperación de información.
          </li>
          <li delay="0.1s">
            <strong>Incremento de fluidez cognitiva:</strong> El priming aumenta la agilidad mental 
            al preparar y enfocar la atención antes de realizar tareas cognitivas complejas.
          </li>
          <li delay="0.2s">
            <strong>Desarrollo de conciencia fonológica:</strong> Los pares mínimos ayudan a los 
            niños a distinguir sutilezas entre sonidos, desarrollando mayor comprensión de sonidos 
            únicos del inglés.
          </li>
          <li delay="0.3s">
            <strong>Transferencia de conocimientos:</strong> Los cognados facilitan la conexión 
            entre español e inglés, ayudando a transferir conocimientos a situaciones nuevas.
          </li>
          <li delay="0.4s">
            <strong>Motivación intrínseca:</strong> El priming despierta la curiosidad y entusiasmo 
            mediante estímulos emocionalmente atractivos, aumentando la participación activa.
          </li>
          <li delay="0.5s">
            <strong>Plasticidad neuronal:</strong> Durante la primera infancia, el cerebro crea 
            conexiones neuronales con mayor facilidad, permitiendo un aprendizaje más profundo y duradero.
          </li>
          <li delay="0.6s">
            <strong>Pronunciación nativa:</strong> La exposición temprana a sonidos del inglés 
            permite desarrollar acentos más naturales y comprensión auditiva superior.
          </li>
          <li delay="0.7s">
            <strong>Ventaja académica futura:</strong> Los niños que aprenden inglés temprano 
            muestran mejor rendimiento en múltiples áreas cognitivas, incluyendo resolución de 
            problemas y concentración selectiva.
          </li>
        </BenefitsList>
      </Section>

      <Section>
        <SectionTitle>Características del Sistema</SectionTitle>
        
        <Grid>
          <Card delay="0s">
            <h3>Seguimiento Personalizado</h3>
            <p>
              Registro detallado de cada niño (nombre, edad, grado, colegio, jornada) y seguimiento 
              de su progreso individual.
            </p>
          </Card>
          <Card delay="0.2s">
            <h3>Evaluadores Certificados</h3>
            <p>
              Sistema de login para evaluadores (estudiantes, docentes, egresados) con código de 
              identificación único.
            </p>
          </Card>
          <Card delay="0.4s">
            <h3>Encuestas de Caracterización</h3>
            <p>
              Recopilación de datos importantes como tipo de voz utilizada, nivel alcanzado y 
              puntajes obtenidos.
            </p>
          </Card>
          <Card delay="0.6s">
            <h3>Manejo de Sesiones</h3>
            <p>
              El sistema recuerda el progreso: al reingresar, el niño continúa desde su último 
              nivel completado.
            </p>
          </Card>
          <Card delay="0.8s">
            <h3>Panel Administrativo</h3>
            <p>
              CRUD completo para gestión de usuarios y administración de encuestas de caracterización.
            </p>
          </Card>
          <Card delay="1s">
            <h3>Reportes Exportables</h3>
            <p>
              Descarga de encuestas y resultados en formatos PDF y Excel para análisis posterior.
            </p>
          </Card>
        </Grid>
      </Section>

      <HighlightSection>
        <HighlightContent>
          <h2>Fundamentación Pedagógica</h2>
          <p>
            PRIMING se fundamenta en décadas de investigación neurocientífica y pedagógica. 
            Combinamos el poder del priming con el método comunicativo, donde los niños aprenden 
            inglés de la misma forma que adquirieron su lengua materna: a través de la exposición 
            significativa, la repetición contextualizada y el juego. Las emociones positivas durante 
            el juego liberan dopamina y serotonina, sustancias que mejoran la memoria y la capacidad 
            de aprendizaje.
          </p>
        </HighlightContent>
      </HighlightSection>

      <Section>
        <ContactSection>
          <h3>Recursos y Contacto</h3>
          <p style={{ color: 'rgba(244, 244, 244, 0.8)', marginBottom: '2rem' }}>
            Obtén más información sobre el proyecto PRIMING o descarga el manual de usuario
          </p>
          
          <ContactGrid>
            <ContactButton href="mailto:priming@educacion.edu.co">
              📧 Correo Electrónico
            </ContactButton>
            <ContactButton href="/manual-usuario.pdf" download>
              📖 Manual de Usuario
            </ContactButton>
          </ContactGrid>
        </ContactSection>
      </Section>

      <Footer>
        <h3 style={{ color: '#fc7500', marginBottom: '1rem', fontSize: '1.5rem' }}>
          PRIMING - Preparación Lingüística para la Primera Infancia
        </h3>
        <p>Transformando el futuro de los niños, un sonido a la vez</p>
        
        <TechStack>
          <span>React</span>
          <span>Styled Components</span>
          <span>JavaScript</span>
          <span>PostgreSQL</span>
          <span>Render</span>
          <span>GitHub</span>
        </TechStack>
        
        <p style={{ marginTop: '2rem' }}>© 2025 PRIMING. Todos los derechos reservados.</p>
      </Footer>
      </Container>
    </>
  );
};

export default Inicio;