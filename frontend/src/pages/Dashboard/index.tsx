import React, { useState, useCallback, useEffect, useMemo } from 'react'
import {isToday, format, parseISO,isAfter} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import DayPicker,{DayModifiers} from 'react-day-picker'
import 'react-day-picker/lib/style.css'

import {Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Calendar,
  Section,
  Appointment,
} from './styles'
import { FiPower, FiClock } from 'react-icons/fi'


import profileImg from './96d1cf16-71c2-47dc-a313-1b1ddaa637fb.jpg'
import logoImg from '../../assets/logo.svg'
import { useAuth } from '../../hooks/auth'
import api from '../../services/api'
import { Link } from 'react-router-dom'

interface MonthDayAvailabilityItem{
  day:number,
  available:boolean
}
interface Appointment{
  id:string
  date:string
  hourFormatted:string
  user:{
    name:string
    avatar_url:string
  }

}

const Dashboard: React.FC = () => {
  const {signUp,user} = useAuth()
  const [selectedDate,setSelectedDate] = useState(new Date())
  const [currentMonth,setCurrentMonth] = useState(new Date())
  const [monthAvailability,setMonthAvailability] = useState<MonthDayAvailabilityItem[]>([])
  const [appointments,setAppointments] = useState<Appointment[]>([])
  const handleDateChange = useCallback((day:Date,modifiers:DayModifiers)=>{
    if(modifiers.available){
      setSelectedDate(day)
    }
  },[])
  const handleMonthChange = useCallback((month:Date)=>{
    setCurrentMonth(month)
  },[])

  useEffect(()=>{
    api.get(`/providers/${user.id}/month-availability`,{
      
      params:{
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth()+1
      }
    }).then(response=>{
      setMonthAvailability(response.data)
    })
  },[currentMonth,user.id])

  useEffect(()=>{
    api.get<Appointment[]>('appointments/me',{
      params:{
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth()+1,
        day: selectedDate.getDate()
      }
    }).then(response=>{
      const appointmentsFormatted = response.data.map(appointment=>{
        return {
          ...appointment,
          hourFormatted: format(parseISO(appointment.date),'HH:mm')
        }
      })
      setAppointments(appointmentsFormatted)
      
    })
  },[selectedDate])

  const disabledDays = useMemo(()=>{
    const dates = monthAvailability
    .filter(monthDay=>monthDay.available === false)
    .map(monthDay=>{
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      return  new Date(year,month,monthDay.day)
    })
    return dates
  },[currentMonth,monthAvailability])
  
  const selectedDateAsText = useMemo(()=>{
    return format(selectedDate,"'dia' dd 'de' MMMM",{
      locale:ptBR
    })
  },[selectedDate])
  const selectedWeekDay = useMemo(()=>{
    return format(selectedDate,"cccc",{
      locale:ptBR
    })
  },[selectedDate])

  const morningAppointments = useMemo(()=>{
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() <12
    })
  },[appointments])

  const afternoonAppointments = useMemo(()=>{
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >=12
    })
  },[appointments])

  const nextAppointment = useMemo(()=>{
    return appointments.find(appointment => isAfter(parseISO(appointment.date),new Date()))
  },[appointments])

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="go barber"/>
          <Profile>
            <img src={user.avatar_url || profileImg} alt="perfil"/>
            <div>
              <span>Bem-vindo</span>
              <Link to='/profile'>
              <strong>{user.name}</strong>
              </Link> 
            </div>
          </Profile>
          <button onClick={signUp} ><FiPower/></button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}-feira</span>
          </p>
          {isToday(selectedDate) && nextAppointment &&(
             <NextAppointment>
             <strong>Agendamento a seguir</strong>
             <div>
               <img src={nextAppointment.user.avatar_url || profileImg} alt={nextAppointment.user.name}/>
               <strong>{nextAppointment.user.name} </strong>
               <span>
                 <FiClock/>
                 {nextAppointment.hourFormatted}
               </span>
             </div>
           </NextAppointment>
          )}
          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste periodo</p>
            )}
            {morningAppointments.map(appointment=>(
              <Appointment key={appointment.id}>
                <span>
                  <FiClock/>
                  {appointment.hourFormatted}
                </span>
                <div>
                <img src={appointment.user.avatar_url || profileImg} alt={appointment.user.name}/>
                <strong>{appointment.user.name} </strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento neste periodo</p>
            )}
            {afternoonAppointments.map(appointment=>(
              <Appointment key={appointment.id}>
                <span>
                  <FiClock/>
                  {appointment.hourFormatted}
                </span>
                <div>
                <img src={appointment.user.avatar_url || profileImg} alt={appointment.user.name}/>
                <strong>{appointment.user.name} </strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D','S','T','Q','Q','S','S']}
            fromMonth={new Date()}
            disabledDays={[
              {daysOfWeek:[0,6]},...disabledDays
            ]}
            modifiers={{
              available:{
                daysOfWeek:[1,2,3,4,5]
              }
            }}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
            months={[
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
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  )
}

export default Dashboard
