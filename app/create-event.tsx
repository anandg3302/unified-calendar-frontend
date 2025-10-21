import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCalendarStore } from '../stores/calendarStore';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const CALENDAR_SOURCES = [
  { id: 'google', name: 'Google Calendar', color: '#4285F4' },
  { id: 'apple', name: 'Apple Calendar', color: '#FF3B30' },
  { id: 'outlook', name: 'Outlook Calendar', color: '#0078D4' }
];

export default function CreateEventScreen() {
  const router = useRouter();
  const { createEvent } = useCalendarStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [calendarSource, setCalendarSource] = useState('google');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 60 * 60 * 1000)); // 1 hour later
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (endDate <= startDate) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    setIsLoading(true);
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        calendar_source: calendarSource,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString()
      });
      
      Alert.alert('Success', 'Event created successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Event title"
            value={title}
            onChangeText={setTitle}
            editable={!isLoading}
          />
        </View>

        {/* Calendar Source */}
        <View style={styles.field}>
          <Text style={styles.label}>Calendar</Text>
          <View style={styles.sourcesContainer}>
            {CALENDAR_SOURCES.map(source => (
              <TouchableOpacity
                key={source.id}
                style={[
                  styles.sourceChip,
                  calendarSource === source.id && {
                    backgroundColor: source.color,
                    borderColor: source.color
                  }
                ]}
                onPress={() => setCalendarSource(source.id)}
                disabled={isLoading}
              >
                <View 
                  style={[
                    styles.sourceDot, 
                    { backgroundColor: source.color }
                  ]} 
                />
                <Text style={[
                  styles.sourceText,
                  calendarSource === source.id && styles.sourceTextActive
                ]}>
                  {source.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Time */}
        <View style={styles.field}>
          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
            disabled={isLoading}
          >
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.dateText}>
              {format(startDate, 'MMM d, yyyy HH:mm')}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                  if (selectedDate >= endDate) {
                    setEndDate(new Date(selectedDate.getTime() + 60 * 60 * 1000));
                  }
                }
              }}
            />
          )}
        </View>

        {/* End Time */}
        <View style={styles.field}>
          <Text style={styles.label}>End Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
            disabled={isLoading}
          >
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.dateText}>
              {format(endDate, 'MMM d, yyyy HH:mm')}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="datetime"
              is24Hour={true}
              display="default"
              minimumDate={startDate}
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Add location"
            value={location}
            onChangeText={setLocation}
            editable={!isLoading}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.createButton]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Event</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    padding: 16
  },
  field: {
    marginBottom: 24
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9'
  },
  textArea: {
    minHeight: 100
  },
  sourcesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9'
  },
  sourceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  sourceText: {
    fontSize: 14,
    color: '#666'
  },
  sourceTextActive: {
    color: '#fff',
    fontWeight: '600'
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9'
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f0f0f0'
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666'
  },
  createButton: {
    backgroundColor: '#4285F4'
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  }
});