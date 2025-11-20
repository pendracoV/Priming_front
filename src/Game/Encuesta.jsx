import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { GlobalStyle } from "../styles/styles";
import GameBackground from "../components/GameBackground";
import fondoEncuesta from "../../public/images/Background.png";
import Loading from "../components/Loading";
import Modal from "../components/Modal";

const API_URL = import.meta.env.VITE_API_URL || "";

/* ============================
   ESTILOS
   ============================ */

const PageWrapper = styled.div`
  height: 100vh;
  overflow: hidden; /* La pantalla no scrollea */
`;

const Container = styled.div`
  background: rgba(0, 0, 0, 0.85);
  padding: 2.5rem;
  border-radius: 15px;
  max-width: 900px;
  margin: 2rem auto;
  color: #f4f4f4;
  font-family: "Manrope", sans-serif;
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* SOLO el contenedor hace scroll */
  max-height: 75vh;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: #fc7500 #333;
`;

const Header = styled.div`
  text-align: center;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  color: #f4f4f4;
  font-weight: 700;
`;

const SuccessBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid rgba(76, 175, 80, 0.3);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  color: #fc7500;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  user-select: none;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  resize: vertical;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-family: inherit;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PrimaryButton = styled.button`
  background: #fc7500;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #e56700;
  }
`;

/* ============================
   COMPONENTE PRINCIPAL
   ============================ */

const Encuesta = () => {
  const [loading, setLoading] = useState(true);
  const [ninoInfo, setNinoInfo] = useState(null);
  const [encuestaId, setEncuestaId] = useState(null);
  const [progreso, setProgreso] = useState(null);

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    resumen_examen_mental: "",
    antecedentes_clinicos: "",
    diagnostico_aprendizaje: "",
    problemas_academicos: "",
    problemas_lectoescritura: "",
    evaluacion_pretest: "",
    evaluacion_postest: "",
    observaciones_sesion: "",
    observacion_conductual: "",
    recomendaciones: "",
    indicadores_logro: "",
  });

  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  const loadData = async () => {
    try {
      const currentNinoStr = localStorage.getItem("currentNino");
      if (!currentNinoStr) return navigate("/ninos-list");

      const nino = JSON.parse(currentNinoStr);
      setNinoInfo(nino);

      const token = localStorage.getItem("token");

      // Buscar encuesta asociada al niño
      const res = await fetch(`${API_URL}/encuestas/nino/${nino.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setEncuestaId(data[0].id);
        }
      }

      // Cargar progreso del juego
      const type = localStorage.getItem(`lastGameType_${nino.id}`);
      const diff = localStorage.getItem(`lastDifficulty_${nino.id}`);
      const lvl = localStorage.getItem(`lastLevel_${nino.id}`);
      const score = localStorage.getItem(`accumulatedScore_${nino.id}`);

      if (type && diff && lvl) {
        setProgreso({
          game_type: type,
          difficulty: diff,
          current_level: parseInt(lvl),
          accumulated_score: parseInt(score || 0),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     GUARDAR REPORTE CLÍNICO
     ============================ */

  const handleSubmit = async () => {
    if (!encuestaId) {
      return setModal({
        open: true,
        title: "Error",
        message: "No existe encuesta asociada.",
      });
    }

    const token = localStorage.getItem("token");

    const body = {
      nino_id: ninoInfo.id,
      ...formData,
      ...(progreso || {}),
      last_played: new Date().toISOString(),
    };

    const res = await fetch(`${API_URL}/encuestas/${encuestaId}/resultados`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setModal({
        open: true,
        title: "Éxito",
        message: "Reporte guardado correctamente.",
        onConfirm: () => navigate("/ninos-list"),
      });
    } else {
      setModal({
        open: true,
        title: "Error",
        message: "Hubo un problema al guardar el reporte.",
      });
    }
  };

  /* ============================
     CARGANDO
     ============================ */

  if (loading) {
    return (
      <PageWrapper>
        <GlobalStyle />
        <Navbar />
        <GameBackground backgroundImage={fondoEncuesta}>
          <Loading />
        </GameBackground>
      </PageWrapper>
    );
  }

  /* ============================
     RENDER
     ============================ */

  return (
    <PageWrapper>
      <GlobalStyle />
      <Navbar />

      <GameBackground maxWidth="1200px" backgroundImage={fondoEncuesta}>
        <Container>
          <Header>
            <Title>📋 Reporte Clínico</Title>
            <SuccessBadge>
              <span>✓</span> Datos cargados correctamente
            </SuccessBadge>
          </Header>

          <ContentGrid>
            {/* Información del estudiante */}
            <Card>
              <h3 style={{ color: "#fc7500", marginBottom: "1rem" }}>
                👤 Información del Estudiante
              </h3>
              <p><b>Nombre:</b> {ninoInfo?.nombre}</p>
              <p><b>Edad:</b> {ninoInfo?.edad}</p>
              <p><b>Grado:</b> {ninoInfo?.grado}</p>
              <p><b>Colegio:</b> {ninoInfo?.colegio}</p>
              <p><b>Encuesta:</b> {encuestaId || "No encontrada"}</p>
            </Card>

            {/* Progreso del juego */}
            {progreso && (
              <Card>
                <h3 style={{ color: "#fc7500", marginBottom: "1rem" }}>
                  🎮 Progreso del Juego
                </h3>
                <p><b>Tipo:</b> {progreso.game_type}</p>
                <p><b>Dificultad:</b> {progreso.difficulty}</p>
                <p><b>Nivel:</b> {progreso.current_level}</p>
                <p><b>Puntaje:</b> {progreso.accumulated_score}</p>
              </Card>
            )}

            {/* Formulario dinámico */}
            {Object.keys(formData).map((key) => (
              <Card key={key}>
                <CardTitle onClick={() => toggleSection(key)}>
                  {key.replace(/_/g, " ").toUpperCase()}
                  <span>{openSection === key ? "▲" : "▼"}</span>
                </CardTitle>

                {openSection === key && (
                  <TextArea
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  />
                )}
              </Card>
            ))}
          </ContentGrid>

          <ButtonContainer>
            <PrimaryButton onClick={handleSubmit}>
              💾 Guardar Reporte Clínico
            </PrimaryButton>
          </ButtonContainer>
        </Container>
      </GameBackground>

      <Modal
        isOpen={modal.open}
        title={modal.title}
        onClose={() => setModal({ ...modal, open: false })}
        onConfirm={modal.onConfirm || (() => setModal({ ...modal, open: false }))}
      >
        <p>{modal.message}</p>
      </Modal>
    </PageWrapper>
  );
};

export default Encuesta;
