import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/Calendar';
import { AppointmentModal } from '../components/AppointmentModal';
import { ZoomControl } from '../components/ZoomControl';
import { useAuth } from '../contexts/AuthContext';
import { Appointment } from '../types';
import { appointmentsApi } from '../services/api';
import { toast } from 'sonner';

export function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    void loadAppointments();
  }, [currentUser, navigate]);

  const loadAppointments = async () => {
    if (currentUser) {
      try {
        setAppointments(await appointmentsApi.list());
      } catch {
        toast.error('Nao foi possivel carregar as consultas.');
      }
    }
  };

  const handleDateClick = (date: string) => {
    // RdN08 - Bloqueio de datas passadas
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    if (currentUser) {
      const dateAppointments = appointments.filter((appointment) => appointment.date === date);
      
      if (dateAppointments.length > 0) {
        // Mostra a primeira consulta da data
        setSelectedAppointment(dateAppointments[0]);
      } else {
        // Verifica se é data passada
        if (date < todayStr) {
          toast.error('Não é possível agendar consultas em datas passadas');
          return;
        }
        setSelectedAppointment(null);
      }
      
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const handleSaveAppointment = async (appointmentData: Partial<Appointment>) => {
    if (!currentUser || !selectedDate) return;

    try {
      const payload = {
        date: selectedDate,
        time: appointmentData.time!,
        patientId: appointmentData.patientId!,
        specialtyId: appointmentData.specialtyId!,
        locationId: appointmentData.locationId!,
      };
      if (selectedAppointment) {
        await appointmentsApi.update(selectedAppointment.id, payload);
        toast.success('Consulta atualizada com sucesso!');
      } else {
        await appointmentsApi.create(payload);
        toast.success('Consulta marcada com sucesso!');
      }

      await loadAppointments();
      setIsModalOpen(false);
    } catch {
      toast.error('Nao foi possivel salvar a consulta.');
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    
    if (window.confirm('Tem certeza que deseja desmarcar esta consulta?')) {
      try {
        await appointmentsApi.remove(selectedAppointment.id);
        toast.success('Consulta desmarcada com sucesso!');
        await loadAppointments();
        setIsModalOpen(false);
      } catch {
        toast.error('Nao foi possivel desmarcar a consulta.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const appointmentDates = appointments.map(a => a.date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">MedAgenda</h1>
            <p className="text-lg text-gray-600">Olá, {currentUser?.name}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/dependentes')}
              size="lg"
              variant="outline"
              className="h-12 gap-2"
            >
              <Users className="h-5 w-5" />
              Gerenciar Dependentes
            </Button>
            <Button 
              onClick={handleLogout}
              size="lg"
              variant="outline"
              className="h-12 gap-2"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Calendário de Consultas
          </h2>
          <p className="text-lg text-gray-600">
            Clique em uma data para agendar ou visualizar suas consultas
          </p>
        </div>

        <Calendar
          currentMonth={currentMonth}
          currentYear={currentYear}
          onMonthChange={(month, year) => {
            setCurrentMonth(month);
            setCurrentYear(year);
          }}
          onDateClick={handleDateClick}
          appointmentDates={appointmentDates}
        />

        {/* Informações adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
            <h3 className="font-semibold text-xl mb-2">Total de Consultas</h3>
            <p className="text-4xl font-bold text-blue-600">{appointments.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-200">
            <h3 className="font-semibold text-xl mb-2">Próximas Consultas</h3>
            <p className="text-4xl font-bold text-green-600">
              {appointments.filter(a => a.date >= new Date().toISOString().split('T')[0]).length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-200">
            <h3 className="font-semibold text-xl mb-2">Consultas Passadas</h3>
            <p className="text-4xl font-bold text-purple-600">
              {appointments.filter(a => a.date < new Date().toISOString().split('T')[0]).length}
            </p>
          </div>
        </div>
      </main>

      {/* Zoom Control */}
      <ZoomControl />

      {/* Appointment Modal */}
      {selectedDate && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
            setSelectedAppointment(null);
          }}
          date={selectedDate}
          appointment={selectedAppointment}
          onSave={handleSaveAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  );
}
