import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.8);
  padding: 30px 20px 20px;
  margin-top: auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #fc7500 0%, #ff9500 50%, #fc7500 100%);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  color: #f4f4f4;
`;

const SectionTitle = styled.h3`
  color: #f4f4f4;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 2px;
    bottom: -8px;
    left: 0;
    background-color: #fc7500;
  }
  
  @media (max-width: 768px) {
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  span {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
    color: #f4f4f4;
    transition: color 0.3s ease;
    
    &:hover {
      color: #fc7500;
    }
    
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #f4f4f4;
  margin-bottom: 15px;
`;

const Highlight = styled.span`
  color: #fc7500;
  font-weight: 600;
`;

const BottomBar = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const Copyright = styled.p`
  color: #f4f4f4;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 400;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <SectionTitle>PRIMING</SectionTitle>
          <Description>
            Plataforma educativa interactiva diseñada para niños de <Highlight>5 a 7 años</Highlight>, 
            enfocada en el aprendizaje de cognados y pares mínimos a través de juegos divertidos y educativos.
          </Description>

        </FooterSection>

        <FooterSection>
          <SectionTitle>Contacto</SectionTitle>
          <ContactInfo>
            <span>
              📧 soporte@priming.edu.co
            </span>
            <span>
              📱 +57 (1) 234-5678
            </span>
            <span>
              🌐 www.priming.edu.co
            </span>
            <span>
              📍 Bogotá, Colombia
            </span>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <BottomBar>
        <Copyright>
          © 2025 PRIMING - Plataforma Educativa Interactiva. Todos los derechos reservados.
        </Copyright>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;