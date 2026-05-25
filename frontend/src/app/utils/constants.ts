// Especialidades médicas
export const SPECIALTIES = [
  'Cardiologia',
  'Dermatologia',
  'Endocrinologia',
  'Gastroenterologia',
  'Geriatria',
  'Ginecologia',
  'Neurologia',
  'Odontologia',
  'Oftalmologia',
  'Ortopedia',
  'Otorrinolaringologia',
  'Pediatria',
  'Pneumologia',
  'Psiquiatria',
  'Reumatologia',
  'Urologia',
];

// Cidades (amostra para demonstração)
export const CITIES = [
  'São Paulo - SP',
  'Rio de Janeiro - RJ',
  'Belo Horizonte - MG',
  'Brasília - DF',
  'Curitiba - PR',
  'Porto Alegre - RS',
  'Salvador - BA',
  'Fortaleza - CE',
  'Recife - PE',
  'Manaus - AM',
  'Belém - PA',
  'Goiânia - GO',
  'Campinas - SP',
  'São Bernardo do Campo - SP',
  'Santos - SP',
];

// Horários disponíveis (00:00 - 23:00)
export const AVAILABLE_HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

// Dias da semana
export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
