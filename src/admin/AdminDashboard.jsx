// src/admin/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import API_URL from '../api/config';
import { AuthContext } from '../context/AuthContext';
import { Users, UserCheck, Shield, TrendingUp, Award, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

// ----------------------------------------------------------------------
// ESTILOS DEL DASHBOARD
// ----------------------------------------------------------------------

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #212529;
`;

const Subtitle = styled.p`
  color: #6C757D;
  margin-bottom: 25px;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: #6C757D;
`;

const StatNumber = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: #212529;
`;

const IconWrapper = styled.div`
  background-color: ${({ color }) => color || '#0090E7'};
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
  padding: 25px;
`;

const ChartTitle = styled.h2`
  font-size: 1.1rem;
  color: #212529;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const ChartSubtitle = styled.p`
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #6c757d;
  text-align: center;
  padding: 20px 0;
`;

const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1.2rem;
  margin-top: 1.5rem;
`;

const PodiumColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PodiumName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.3rem;
  text-align: center;
`;

const PodiumBar = styled.div`
  width: ${({ width }) => width || '70px'};
  height: ${({ height }) => height || '80px'};
  border-radius: 10px 10px 0 0;
  background: ${({ color }) => color || '#0090E7'};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.75rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.12);
`;

const PodiumPlace = styled.div`
  margin-top: 0.3rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
`;

// Colores combinados para los charts
const studentColors = ['#0090E7', '#28a745', '#6C63FF', '#FFB703', '#F94144'];

// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    niños: 0,
    evaluadores: 0,
    administradores: 0,
  });

  const [loading, setLoading] = useState(true);

  // Guardamos usuarios para reutilizar en analíticas
  const [userList, setUserList] = useState([]);

  // Estados para analíticas calculadas en el front
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [dailyMetrics, setDailyMetrics] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [topEvaluadores, setTopEvaluadores] = useState([]);

  // Cargar estadísticas básicas de usuarios
  useEffect(() => {
    let mounted = true;

    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        const usuarios = res.data || [];

        setUserList(usuarios);
        setStats({
          niños: usuarios.filter((u) => u.tipo_usuario === 'niño').length,
          evaluadores: usuarios.filter((u) => u.tipo_usuario === 'evaluador').length,
          administradores: usuarios.filter((u) => u.tipo_usuario === 'administrador').length,
        });
      } catch (err) {
        console.error('Error obteniendo estadísticas de usuarios:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserStats();
    return () => {
      mounted = false;
    };
  }, []);

  // Cargar analíticas de resultados usando SOLO endpoints existentes
  useEffect(() => {
    if (!userList || userList.length === 0) return;

    let mounted = true;

    const fetchAnalyticsFromExistingEndpoints = async () => {
      try {
        setAnalyticsLoading(true);
        const token = localStorage.getItem('token');

        // 1) Tomamos todos los usuarios niño
        const ninos = userList.filter((u) => u.tipo_usuario === 'niño');
        if (ninos.length === 0) {
          if (mounted) {
            setDailyMetrics([]);
            setTopStudents([]);
            setTopEvaluadores([]);
          }
          return;
        }

        // 2) Para cada niño pedimos /encuestas/admin/usuario/:usuario_id
        const requests = ninos.map((nino) =>
          axios
            .get(`${API_URL}/encuestas/admin/usuario/${nino.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => ({ nino, encuestas: res.data || [] }))
            .catch((err) => {
              console.error(`Error obteniendo encuestas de usuario ${nino.id}`, err);
              return { nino, encuestas: [] };
            })
        );

        const results = await Promise.all(requests);
        if (!mounted) return;

        // 3) Aplanar todos los resultados_encuesta con contexto
        const allResultados = [];
        results.forEach(({ nino, encuestas }) => {
          encuestas.forEach((enc) => {
            const encuestaFecha = enc.fecha;
            const evaluadorNombre = enc.evaluador_nombre || null;
            const evaluadorId = enc.evaluador_id || null;
            const ninoNombre = enc.nino_nombre || nino.nombre;
            const edad =
              nino.edad || nino.age || enc.nino_edad || null; // usamos lo que venga disponible

            (enc.resultados || []).forEach((res) => {
              allResultados.push({
                ...res,
                encuestaFecha,
                evaluadorNombre,
                evaluadorId,
                ninoNombre,
                ninoUsuarioId: nino.id,
                edad,
              });
            });
          });
        });

        // Si no hay resultados, vaciamos
        if (allResultados.length === 0) {
          setDailyMetrics([]);
          setTopStudents([]);
          setTopEvaluadores([]);
          return;
        }

        // -------------------------------
        // A) Evolución diaria: puntaje, nivel, edad
        // -------------------------------
        const byDate = {};

        allResultados.forEach((res) => {
          const baseFecha = res.last_played || res.encuestaFecha;
          if (!baseFecha) return;

          const d = new Date(baseFecha);
          if (Number.isNaN(d.getTime())) return;

          const key = d.toISOString().slice(0, 10); // YYYY-MM-DD

          if (!byDate[key]) {
            byDate[key] = {
              scoreSum: 0,
              levelSum: 0,
              ageSum: 0,
              ageCount: 0,
              count: 0,
            };
          }

          const score = Number(res.accumulated_score || 0);
          const level = Number(res.current_level || 0);
          const age = res.edad != null ? Number(res.edad) : null;

          byDate[key].scoreSum += score;
          byDate[key].levelSum += level;
          byDate[key].count += 1;

          if (age != null && !Number.isNaN(age)) {
            byDate[key].ageSum += age;
            byDate[key].ageCount += 1;
          }
        });

        const daily = Object.entries(byDate)
          .map(([date, agg]) => ({
            date,
            avgScore: agg.count ? Math.round((agg.scoreSum / agg.count) * 10) / 10 : 0,
            avgLevel: agg.count ? Math.round((agg.levelSum / agg.count) * 10) / 10 : 0,
            avgAge:
              agg.ageCount > 0
                ? Math.round((agg.ageSum / agg.ageCount) * 10) / 10
                : 0,
          }))
          .sort((a, b) => (a.date < b.date ? -1 : 1));

        // -------------------------------
        // B) Top 5 estudiantes por puntaje
        // -------------------------------
        const byStudent = {};

        allResultados.forEach((res) => {
          const key = res.ninoUsuarioId;
          if (!byStudent[key]) {
            byStudent[key] = {
              nombre: res.ninoNombre || 'Sin nombre',
              edad: res.edad || null,
              totalScore: 0,
              levelSum: 0,
              count: 0,
            };
          }

          const score = Number(res.accumulated_score || 0);
          const level = Number(res.current_level || 0);

          byStudent[key].totalScore += score;
          byStudent[key].levelSum += level;
          byStudent[key].count += 1;
        });

        const topStudentsArr = Object.values(byStudent)
          .map((s) => ({
            ...s,
            avgLevel: s.count ? Math.round((s.levelSum / s.count) * 10) / 10 : 0,
          }))
          .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
          .slice(0, 5);

        // -------------------------------
        // C) Top 3 evaluadores por nº de resultados
        // -------------------------------
        const byEval = {};

        allResultados.forEach((res) => {
          const key = res.evaluadorNombre || `ID-${res.evaluadorId || 'desconocido'}`;
          if (!byEval[key]) {
            byEval[key] = {
              nombre: res.evaluadorNombre || key,
              totalResultados: 0,
            };
          }
          byEval[key].totalResultados += 1;
        });

        const topEvalArr = Object.values(byEval)
          .sort((a, b) => (b.totalResultados || 0) - (a.totalResultados || 0))
          .slice(0, 3);

        // Guardar en estado
        setDailyMetrics(daily);
        setTopStudents(topStudentsArr);
        setTopEvaluadores(topEvalArr);
      } catch (err) {
        console.error('Error calculando analíticas en el dashboard:', err);
        setDailyMetrics([]);
        setTopStudents([]);
        setTopEvaluadores([]);
      } finally {
        if (mounted) setAnalyticsLoading(false);
      }
    };

    fetchAnalyticsFromExistingEndpoints();

    return () => {
      mounted = false;
    };
  }, [userList]);

  const chartData = [
    { name: 'Niños', cantidad: stats.niños, color: '#0090E7' },
    { name: 'Evaluadores', cantidad: stats.evaluadores, color: '#28a745' },
    { name: 'Administradores', cantidad: stats.administradores, color: '#6C63FF' },
  ];

  // Ordenar evaluadores por cantidad, para el podio
  const sortedEvaluadores = [...topEvaluadores].sort(
    (a, b) => (b.totalResultados || 0) - (a.totalResultados || 0)
  );

  // Alturas relativas del podio
  const maxResultados = sortedEvaluadores[0]?.totalResultados || 1;

  const getPodiumHeight = (valor) => {
    const base = 70;   // mínimo
    const extra = 60;  // máximo añadido
    return `${base + (extra * (valor / maxResultados))}px`;
  };

  return (
    <PageContainer>
      <Title>Bienvenido, {user?.nombre || 'Administrador'} 👋</Title>
      <Subtitle>Desde aquí puedes visualizar el estado general de la plataforma y el rendimiento de los estudiantes.</Subtitle>

      {loading ? (
        <LoadingText>Cargando estadísticas de usuarios...</LoadingText>
      ) : (
        <>
          {/* Tarjetas principales */}
          <CardsContainer>
            <Card>
              <CardLeft>
                <StatLabel>Niños</StatLabel>
                <StatNumber>{stats.niños}</StatNumber>
              </CardLeft>
              <IconWrapper color="#0090E7">
                <Users size={24} />
              </IconWrapper>
            </Card>

            <Card>
              <CardLeft>
                <StatLabel>Evaluadores</StatLabel>
                <StatNumber>{stats.evaluadores}</StatNumber>
              </CardLeft>
              <IconWrapper color="#28a745">
                <UserCheck size={24} />
              </IconWrapper>
            </Card>

            <Card>
              <CardLeft>
                <StatLabel>Administradores</StatLabel>
                <StatNumber>{stats.administradores}</StatNumber>
              </CardLeft>
              <IconWrapper color="#6C63FF">
                <Shield size={24} />
              </IconWrapper>
            </Card>
          </CardsContainer>

          {/* Distribución de usuarios */}
          <ChartContainer style={{ marginTop: '2rem' }}>
            <ChartTitle>Distribución de usuarios</ChartTitle>
            <ChartSubtitle>Vista rápida del tipo de usuarios registrados en el sistema.</ChartSubtitle>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6C757D" />
                <YAxis stroke="#6C757D" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Bloque de analíticas de juego y resultados */}
          <ChartsGrid>
            {/* 1) Gráfica de evolución diaria */}
            <ChartContainer>
              <ChartTitle>
                Evolución diaria de desempeño <TrendingUp size={18} style={{ marginLeft: 6 }} />
              </ChartTitle>
              <ChartSubtitle>
                Promedio de puntaje, nivel y edad de los niños por día de actividad.
              </ChartSubtitle>

              {analyticsLoading ? (
                <LoadingText>Cargando datos de evolución diaria...</LoadingText>
              ) : dailyMetrics.length === 0 ? (
                <LoadingText>No hay datos suficientes para mostrar la evolución.</LoadingText>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis dataKey="date" stroke="#6C757D" />
                    <YAxis stroke="#6C757D" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        fontSize: '0.8rem',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      name="Puntaje promedio"
                      stroke="#0090E7"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgLevel"
                      name="Nivel promedio"
                      stroke="#28a745"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgAge"
                      name="Edad promedio"
                      stroke="#FFB703"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>

            {/* 2) Podio evaluadores */}
            <ChartContainer>
              <ChartTitle>
                Top 3 evaluadores por actividad <Award size={18} style={{ marginLeft: 6 }} />
              </ChartTitle>
              <ChartSubtitle>
                Evaluadores con mayor número de resultados de encuesta registrados.
              </ChartSubtitle>

              {analyticsLoading ? (
                <LoadingText>Cargando ranking de evaluadores...</LoadingText>
              ) : sortedEvaluadores.length === 0 ? (
                <LoadingText>No hay evaluaciones registradas todavía.</LoadingText>
              ) : (
                <PodiumContainer>
                  {/* Segundo lugar */}
                  {sortedEvaluadores[1] && (
                    <PodiumColumn>
                      <PodiumName>{sortedEvaluadores[1].nombre}</PodiumName>
                      <PodiumBar
                        color="#C0C0C0"
                        height={getPodiumHeight(sortedEvaluadores[1].totalResultados)}
                      >
                        {sortedEvaluadores[1].totalResultados}
                      </PodiumBar>
                      <PodiumPlace>🥈 2°</PodiumPlace>
                    </PodiumColumn>
                  )}

                  {/* Primer lugar */}
                  {sortedEvaluadores[0] && (
                    <PodiumColumn>
                      <PodiumName>{sortedEvaluadores[0].nombre}</PodiumName>
                      <PodiumBar
                        color="#FFD700"
                        height={getPodiumHeight(sortedEvaluadores[0].totalResultados)}
                        width="80px"
                      >
                        {sortedEvaluadores[0].totalResultados}
                      </PodiumBar>
                      <PodiumPlace>🥇 1°</PodiumPlace>
                    </PodiumColumn>
                  )}

                  {/* Tercer lugar */}
                  {sortedEvaluadores[2] && (
                    <PodiumColumn>
                      <PodiumName>{sortedEvaluadores[2].nombre}</PodiumName>
                      <PodiumBar
                        color="#CD7F32"
                        height={getPodiumHeight(sortedEvaluadores[2].totalResultados)}
                      >
                        {sortedEvaluadores[2].totalResultados}
                      </PodiumBar>
                      <PodiumPlace>🥉 3°</PodiumPlace>
                    </PodiumColumn>
                  )}
                </PodiumContainer>
              )}
            </ChartContainer>
          </ChartsGrid>

          {/* 3) Bloque Top 5 estudiantes (3 charts combinados) */}
          <ChartsGrid style={{ marginTop: '1.5rem' }}>
            {/* a) Barras por puntaje */}
            <ChartContainer>
              <ChartTitle>
                Top 5 estudiantes por puntaje <BarChart3 size={18} style={{ marginLeft: 6 }} />
              </ChartTitle>
              <ChartSubtitle>
                Puntaje total alcanzado por los estudiantes con mejor rendimiento.
              </ChartSubtitle>

              {analyticsLoading ? (
                <LoadingText>Cargando ranking de estudiantes...</LoadingText>
              ) : topStudents.length === 0 ? (
                <LoadingText>No hay aún datos de puntajes registrados.</LoadingText>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topStudents}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="nombre" stroke="#6C757D" />
                    <YAxis stroke="#6C757D" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        fontSize: '0.8rem',
                      }}
                    />
                    <Bar dataKey="totalScore" name="Puntaje total" radius={[8, 8, 0, 0]}>
                      {topStudents.map((_, idx) => (
                        <Cell key={idx} fill={studentColors[idx % studentColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>

            {/* b) Pie: distribución del puntaje entre ellos */}
            <ChartContainer>
              <ChartTitle>Distribución de puntaje entre el Top 5</ChartTitle>
              <ChartSubtitle>Qué proporción del puntaje global aporta cada estudiante.</ChartSubtitle>

              {analyticsLoading ? (
                <LoadingText>Cargando distribución...</LoadingText>
              ) : topStudents.length === 0 ? (
                <LoadingText>Sin datos suficientes.</LoadingText>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        fontSize: '0.8rem',
                      }}
                    />
                    <Legend />
                    <Pie
                      data={topStudents}
                      dataKey="totalScore"
                      nameKey="nombre"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {topStudents.map((_, idx) => (
                        <Cell key={idx} fill={studentColors[idx % studentColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </ChartsGrid>

          {/* 4) Tercer chart relacionado: edad vs nivel del Top 5 */}
          <ChartContainer style={{ marginTop: '1.5rem' }}>
            <ChartTitle>Perfil del Top 5: edad y nivel promedio</ChartTitle>
            <ChartSubtitle>
              Comparación entre la edad de los estudiantes Top 5 y su nivel promedio en el juego.
            </ChartSubtitle>

            {analyticsLoading ? (
              <LoadingText>Cargando perfil del Top 5...</LoadingText>
            ) : topStudents.length === 0 ? (
              <LoadingText>No hay datos suficientes para este análisis.</LoadingText>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topStudents}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="nombre" stroke="#6C757D" />
                  <YAxis stroke="#6C757D" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      fontSize: '0.8rem',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="edad"
                    name="Edad"
                    radius={[8, 8, 0, 0]}
                  >
                    {topStudents.map((_, idx) => (
                      <Cell key={idx} fill={studentColors[idx % studentColors.length]} />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="avgLevel"
                    name="Nivel promedio"
                    radius={[8, 8, 0, 0]}
                  >
                    {topStudents.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={studentColors[(idx + 2) % studentColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </>
      )}
    </PageContainer>
  );
}
