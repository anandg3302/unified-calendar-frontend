import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  calendar_source: string;
  location?: string;
  is_invite: boolean;
  invite_status?: string;
  created_at: string;
}

export interface CalendarSource {
  id: string;
  name: string;
  type: string;
  color: string;
  is_active: boolean;
}

interface CalendarState {
  events: CalendarEvent[];
  calendarSources: CalendarSource[];
  selectedSources: string[];
  viewMode: 'day' | 'week' | 'month';
  selectedDate: Date;
  isLoading: boolean;
  fetchEvents: () => Promise<void>;
  fetchCalendarSources: () => Promise<void>;
  toggleSource: (sourceId: string) => void;
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
  setSelectedDate: (date: Date) => void;
  createEvent: (eventData: any) => Promise<void>;
  updateEvent: (eventId: string, eventData: any) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  respondToInvite: (eventId: string, status: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  calendarSources: [],
  selectedSources: ['google', 'apple', 'outlook'],
  viewMode: 'month',
  selectedDate: new Date(),
  isLoading: false,

  fetchEvents: async () => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem('auth_token');
      const { selectedSources } = get();
      
      const response = await axios.get(`${API_URL}/api/events`, {
        params: {
          calendar_sources: selectedSources.join(',')
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({ events: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching events:', error);
      set({ isLoading: false });
    }
  },

  fetchCalendarSources: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      const response = await axios.get(`${API_URL}/api/calendar-sources`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({ calendarSources: response.data });
    } catch (error) {
      console.error('Error fetching calendar sources:', error);
    }
  },

  toggleSource: (sourceId: string) => {
    const { selectedSources } = get();
    const newSources = selectedSources.includes(sourceId)
      ? selectedSources.filter(id => id !== sourceId)
      : [...selectedSources, sourceId];
    
    set({ selectedSources: newSources });
    get().fetchEvents();
  },

  setViewMode: (mode: 'day' | 'week' | 'month') => {
    set({ viewMode: mode });
  },

  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
  },

  createEvent: async (eventData: any) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      await axios.post(`${API_URL}/api/events`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await get().fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  updateEvent: async (eventId: string, eventData: any) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      await axios.put(`${API_URL}/api/events/${eventId}`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await get().fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  deleteEvent: async (eventId: string) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      await axios.delete(`${API_URL}/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await get().fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  respondToInvite: async (eventId: string, status: string) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      await axios.patch(`${API_URL}/api/events/${eventId}/respond`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      await get().fetchEvents();
    } catch (error) {
      console.error('Error responding to invite:', error);
      throw error;
    }
  }
}));