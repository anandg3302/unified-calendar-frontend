import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={48} color="#4285F4" />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Calendars</Text>
        
        <View style={styles.calendarItem}>
          <View style={[styles.calendarDot, { backgroundColor: '#4285F4' }]} />
          <View style={styles.calendarInfo}>
            <Text style={styles.calendarName}>Google Calendar</Text>
            <Text style={styles.calendarStatus}>Connected</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        </View>

        <View style={styles.calendarItem}>
          <View style={[styles.calendarDot, { backgroundColor: '#FF3B30' }]} />
          <View style={styles.calendarInfo}>
            <Text style={styles.calendarName}>Apple Calendar</Text>
            <Text style={styles.calendarStatus}>Connected</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        </View>

        <View style={styles.calendarItem}>
          <View style={[styles.calendarDot, { backgroundColor: '#0078D4' }]} />
          <View style={styles.calendarInfo}>
            <Text style={styles.calendarName}>Outlook Calendar</Text>
            <Text style={styles.calendarStatus}>Connected</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="time-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Sync Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="color-palette-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Theme</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#F44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  email: {
    fontSize: 14,
    color: '#666'
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 8
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  calendarDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12
  },
  calendarInfo: {
    flex: 1
  },
  calendarName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2
  },
  calendarStatus: {
    fontSize: 12,
    color: '#666'
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F44336'
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginLeft: 8
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 24
  }
});