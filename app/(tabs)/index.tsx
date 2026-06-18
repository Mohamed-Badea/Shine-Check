import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppConfig } from '../_layout';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { theme, profile } = useAppConfig();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [toastConfig, setToastConfig] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#0a749b';
  const cardColor = isDark ? '#1f1f1f' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#333333';
  const inputBg = isDark ? '#252525' : '#f1f3f5';
  const inputText = isDark ? '#ffffff' : '#333333';

  const handleLogin = () => {
    if (identifier === profile.userName || identifier === profile.phone) {
      if (password === profile.pass) {
        setToastConfig({ message: 'Login Successful! Welcome back.', type: 'success' });
        setTimeout(() => {
          setToastConfig(null);
          router.push('/main');
        }, 1500);
        return;
      }
    }

    setToastConfig({ message: 'Invalid Credentials provided.', type: 'error' });
    setTimeout(() => setToastConfig(null), 2500);
  };

  const handlePhoneFilterChange = (text: string) => {
    const numbersOnly = text.replace(/[^0-9]/g, '');
    if (numbersOnly.length <= 11) {
      setIdentifier(numbersOnly);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {toastConfig && (
        <View style={[styles.alertToastContainer, toastConfig.type === 'error' ? styles.errorToastBg : styles.successToastBg]}>
          <Text style={styles.alertToastText}>{toastConfig.type === 'error' ? '❌' : '✅'} {toastConfig.message}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.brandTextWrapper}>
          <Text style={styles.brandingMainTitle}>SHINE &</Text>
          <Text style={styles.brandingMainTitle}>CHECK</Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: cardColor }]}>
          <Text style={[styles.welcomeText, { color: textColor }]}>Welcome back</Text>
          
          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput 
              style={[styles.inputField, { color: inputText }]}
              placeholder="Phone Number or UserName"
              placeholderTextColor="#999"
              value={identifier}
              onChangeText={(text) => {
                if (/^\d+$/.test(text) || text === '') {
                  handlePhoneFilterChange(text);
                } else {
                  setIdentifier(text);
                }
              }}
            />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput 
              style={[styles.inputField, { color: inputText }]}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupLinkWrapper} onPress={() => router.push('/signup')}>
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  brandTextWrapper: { alignItems: 'center', marginBottom: 35 },
  brandingMainTitle: { fontSize: 54, fontWeight: '900', color: '#ffffff', letterSpacing: 3, lineHeight: 58, textAlign: 'center' },
  alertToastContainer: { position: 'absolute', top: 60, width: width - 48, paddingVertical: 14, borderRadius: 12, zIndex: 9999, alignSelf: 'center' },
  successToastBg: { backgroundColor: '#2E7D32' },
  errorToastBg: { backgroundColor: '#D32F2F' },
  alertToastText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, textAlign: 'center' },
  formContainer: { width: width - 48, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, elevation: 8 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  inputWrapper: { borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, height: 54, justifyContent: 'center' },
  inputField: { fontSize: 16 },
  loginButton: { backgroundColor: '#0a749b', borderRadius: 12, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signupLinkWrapper: { marginTop: 20, alignItems: 'center' },
  signupText: { fontSize: 14, color: '#666' },
  signupHighlight: { color: '#0a749b', fontWeight: 'bold' },
});