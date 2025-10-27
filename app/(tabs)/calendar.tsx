import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useCalendarStore } from '../../stores/calendarStore';
import { format, parseISO, startOfDay, isSameDay } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CALENDAR_COLORS = {
  google: '#4285F4',
  apple: '#FF3B30',
  outlook: '#0078D4',
  local: '#34C759'
};

export default function CalendarScreen() {
  const router = useRouter();
  const { 
    events, 
    calendarSources, 
    selectedSources, 
    selectedDate,
    isLoading,
    appleConnected,
    fetchEvents, 
    fetchCalendarSources,
    toggleSource,
    setSelectedDate
  } = useCalendarStore();
   
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCalendarSources();
    fetchEvents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(new Date(day.dateString));
  };

  // Filter events for selected date
const selectedDateEvents = Array.isArray(events)
  ? events.filter(event => isSameDay(parseISO(event.start_time), selectedDate))
  : [];

  // Create marked dates for calendar
 const markedDates = Array.isArray(events)
  ? events.reduce((acc: any, event) => {
      const dateStr = format(parseISO(event.start_time), 'yyyy-MM-dd');
      if (!acc[dateStr]) {
        acc[dateStr] = { marked: true, dots: [] };
      }
      return acc;
    }, {})
  : {};


  // Mark selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  markedDates[selectedDateStr] = {
    ...markedDates[selectedDateStr],
    selected: true,
    selectedColor: '#4285F4'
  };

  return (
    <View style={styles.container}>
      {/* Calendar Source Filters */}
      <ScrollView 
        horizontal 
        style={styles.filtersContainer}
        showsHorizontalScrollIndicator={false}
      >
        {calendarSources.map(source => (
          <TouchableOpacity
            key={source.id}
            style={[
              styles.filterChip,
              selectedSources.includes(source.id) && {
                backgroundColor: source.color
              }
            ]}
            onPress={() => toggleSource(source.id)}
          >
            <View 
              style={[
                styles.filterDot, 
                { backgroundColor: source.color }
              ]} 
            />
            <Text style={[
              styles.filterText,
              selectedSources.includes(source.id) && styles.filterTextActive
            ]}>
              {source.name}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Apple Calendar Connection Status */}
        {appleConnected && (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedSources.includes('apple') && {
                backgroundColor: '#FF3B30'
              }
            ]}
            onPress={() => toggleSource('apple')}
          >
            <Ionicons name="logo-apple" size={12} color="#FF3B30" />
            <Text style={[
              styles.filterText,
              selectedSources.includes('apple') && styles.filterTextActive
            ]}>
              Apple
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Calendar */}
      <Calendar
        current={format(selectedDate, 'yyyy-MM-dd')}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#4285F4',
          arrowColor: '#4285F4',
          monthTextColor: '#333',
          textMonthFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18
        }}
      />

      {/* Events List for Selected Date */}
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>
          {format(selectedDate, 'MMMM d, yyyy')}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-event')}
        >
          <Ionicons name="add" size={24} color="#4285F4" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.eventsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && !refreshing ? (
          <ActivityIndicator size="large" color="#4285F4" style={styles.loader} />
        ) : selectedDateEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No events for this day</Text>
          </View>
        ) : (
          selectedDateEvents.map(event => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventCard,
                { borderLeftColor: CALENDAR_COLORS[event.calendar_source as keyof typeof CALENDAR_COLORS] }
              ]}
              onPress={() => router.push(`/event-details?id=${event.id}`)}
            >
              <View style={styles.eventTime}>
                <Text style={styles.eventTimeText}>
                  {format(parseISO(event.start_time), 'HH:mm')}
                </Text>
                <Text style={styles.eventTimeText}>
                  {format(parseISO(event.end_time), 'HH:mm')}
                </Text>
              </View>
              
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.description && (
                  <Text style={styles.eventDescription} numberOfLines={1}>
                    {event.description}
                  </Text>
                )}
                {event.location && (
                  <View style={styles.eventLocation}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.eventLocationText}>{event.location}</Text>
                  </View>
                )}
                
                {/* Invite Status Badge */}
                {event.is_invite && (
                  <View style={[
                    styles.inviteBadge,
                    event.invite_status === 'accepted' && styles.inviteBadgeAccepted,
                    event.invite_status === 'declined' && styles.inviteBadgeDeclined
                  ]}>
                    <Text style={styles.inviteBadgeText}>
                      {event.invite_status === 'pending' && 'Invite Pending'}
                      {event.invite_status === 'accepted' && 'Accepted'}
                      {event.invite_status === 'declined' && 'Declined'}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0'
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  filterText: {
    fontSize: 14,
    color: '#666'
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600'
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  eventsList: {
    flex: 1
  },
  loader: {
    marginTop: 32
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999'
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  eventTime: {
    marginRight: 12,
    alignItems: 'center',
    minWidth: 60
  },
  eventTimeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  eventContent: {
    flex: 1
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  eventLocationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  inviteBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#FFA500'
  },
  inviteBadgeAccepted: {
    backgroundColor: '#4CAF50'
  },
  inviteBadgeDeclined: {
    backgroundColor: '#F44336'
  },
  inviteBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600'
  }
});