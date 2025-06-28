import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useData } from '../../contexts/DataContext';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

export const AppointmentCalendar: React.FC = () => {
  const { appointments, customers, services } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateString);
  };

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'in-progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Calendar</h1>
          <p className="text-gray-600">Visual overview of all scheduled appointments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(day => {
              const dayAppointments = getAppointmentsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    relative p-2 min-h-[80px] border border-gray-200 cursor-pointer hover:bg-gray-50
                    ${isSelected ? 'bg-indigo-50 border-indigo-300' : ''}
                    ${isTodayDate ? 'bg-blue-50 border-blue-300' : ''}
                    ${!isSameMonth(day, currentDate) ? 'text-gray-400 bg-gray-50' : ''}
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-sm font-medium mb-1">
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map(apt => (
                      <div
                        key={apt.id}
                        className={`text-xs px-1 py-0.5 rounded text-white truncate ${getStatusColor(apt.status)}`}
                        title={`${customers.find(c => c.id === apt.customerId)?.name} - ${apt.time}`}
                      >
                        {apt.time}
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
          </div>

          {selectedDate && (
            <div className="space-y-4">
              {selectedDateAppointments.length > 0 ? (
                selectedDateAppointments.map(appointment => {
                  const customer = customers.find(c => c.id === appointment.customerId);
                  const service = services.find(s => s.id === appointment.serviceId);
                  
                  return (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium">{appointment.time}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {customer?.name || 'Unknown Customer'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {service?.name} - {service?.duration}min
                        </p>
                        <p className="text-sm text-gray-500">
                          ${appointment.totalAmount.toFixed(2)}
                        </p>
                        {appointment.notes && (
                          <p className="text-xs text-gray-500 mt-2">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No appointments scheduled for this date</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { status: 'pending', label: 'Pending' },
            { status: 'confirmed', label: 'Confirmed' },
            { status: 'in-progress', label: 'In Progress' },
            { status: 'completed', label: 'Completed' },
            { status: 'cancelled', label: 'Cancelled' }
          ].map(({ status, label }) => (
            <div key={status} className="flex items-center">
              <div className={`w-3 h-3 rounded ${getStatusColor(status)} mr-2`} />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};