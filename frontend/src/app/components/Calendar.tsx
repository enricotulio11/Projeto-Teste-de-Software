import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { WEEKDAYS, MONTHS } from '../utils/constants';

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
  onDateClick: (date: string) => void;
  appointmentDates: string[];
}

export function Calendar({ 
  currentMonth, 
  currentYear, 
  onMonthChange, 
  onDateClick,
  appointmentDates 
}: CalendarProps) {
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  
  const days = [];
  
  // Dias vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  
  // Dias do mês
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasAppointment = appointmentDates.includes(dateStr);
    const isPast = dateStr < todayStr;
    const isToday = dateStr === todayStr;
    
    days.push(
      <button
        key={day}
        onClick={() => onDateClick(dateStr)}
        className={`
          aspect-square p-2 rounded-lg border-2 text-xl font-semibold
          transition-all hover:scale-105 hover:shadow-md
          ${hasAppointment 
            ? 'bg-blue-100 border-blue-400 text-blue-900 hover:bg-blue-200' 
            : 'bg-white border-gray-200 hover:bg-gray-50'
          }
          ${isPast && !hasAppointment ? 'opacity-50' : ''}
          ${isToday ? 'ring-2 ring-green-500' : ''}
        `}
        aria-label={`${day} de ${MONTHS[currentMonth]}`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handlePrevMonth}
          variant="outline"
          size="lg"
          className="h-12 w-12"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <h2 className="text-2xl font-bold">
          {MONTHS[currentMonth]} {currentYear}
        </h2>
        
        <Button
          onClick={handleNextMonth}
          variant="outline"
          size="lg"
          className="h-12 w-12"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {WEEKDAYS.map((day, index) => (
          <div 
            key={index} 
            className="text-center font-bold text-lg text-gray-700 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>

      {/* Legenda */}
      <div className="mt-6 flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
          <span>Com consulta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
          <span>Sem consulta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-green-500 rounded ring-2 ring-green-500"></div>
          <span>Hoje</span>
        </div>
      </div>
    </div>
  );
}
