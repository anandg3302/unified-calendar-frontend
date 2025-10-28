import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

const GOLD = '#FFD700';
const BG = '#0A0A0A';
const CARD = '#1E1E1E';
const TEXT = '#FFFFFF';
const MUTED = '#EAEAEA99';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || 'Anand Gupta');
  const [email, setEmail] = useState(user?.email || 'user@example.com');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const saveProfile = () => {
    Alert.alert('Profile Updated', 'Your profile changes have been saved.');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(250)} style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
      </Animated.View>

      {/* Profile Form */}
      <Animated.View entering={FadeInDown.duration(300)} style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor={MUTED}
          />
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor={MUTED}
          />
        </View>

        <Text style={styles.label}>Phone</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Optional"
            placeholderTextColor={MUTED}
          />
        </View>

        <Text style={styles.label}>Change Password</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="New password"
            placeholderTextColor={MUTED}
          />
        </View>

        <Pressable style={styles.primaryBtn} onPress={saveProfile}>
          <Text style={styles.primaryText}>Save Changes</Text>
        </Pressable>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#F87171" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: { color: TEXT, fontSize: 22, fontWeight: '800' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A'
  },
  avatarTxt: { color: TEXT, fontWeight: '700', fontSize: 14 },
  card: {
    marginHorizontal: 16,
    marginTop: 6,
    padding: 16,
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2A2A'
  },
  label: { color: MUTED, fontSize: 12, marginTop: 10, marginBottom: 6 },
  inputWrap: {
    backgroundColor: '#151515',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  input: { color: TEXT, fontSize: 14 },
  primaryBtn: {
    backgroundColor: GOLD,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 16
  },
  primaryText: { color: '#000', fontWeight: '800', fontSize: 16 },
  logoutBtn: {
    marginTop: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3A3A3A'
  },
  logoutText: { color: '#F87171', fontWeight: '700' },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: MUTED,
    marginTop: 20
  }
});
