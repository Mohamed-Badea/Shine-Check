import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppConfig } from './_layout';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();
  const { theme, updateProfile } = useAppConfig();
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState(''); 
  const [password, setPassword] = useState('');
  const [toastConfig, setToastConfig] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#0a749b';
  const cardColor = isDark ? '#1f1f1f' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#333333';
  const inputBg = isDark ? '#252525' : '#f1f3f5';
  const inputText = isDark ? '#ffffff' : '#333333';

  const handleRegister = () => {
    const structuralParts = userName.trim().split(/\s+/);
    if (structuralParts.length < 2) {
      setToastConfig({ message: 'Name must contain at least 2 parts (First and Last name).', type: 'error' });
      setTimeout(() => setToastConfig(null), 2500);
      return;
    }

    if (phone.length !== 11 || !phone.startsWith('01')) {
      setToastConfig({ message: 'Invalid phone string length parameters.', type: 'error' });
      setTimeout(() => setToastConfig(null), 2500);
      return;
    }

    updateProfile('userName', userName);
    updateProfile('phone', phone);
    updateProfile('pass', password);

    setToastConfig({ message: 'Account Created Successfully!', type: 'success' });
    setTimeout(() => {
      setToastConfig(null);
      router.replace('/main'); 
    }, 1500); 
  };

  const handlePhoneFormatChange = (text: string) => {
    const numbersOnly = text.replace(/[^0-9]/g, '');
    if (numbersOnly.length <= 11) {
      setPhone(numbersOnly);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {toastConfig && (
        <View style={[styles.successToastBox, toastConfig.type === 'error' ? styles.errorToastBg : styles.successToastBg]}>
          <Text style={styles.successToastText}>{toastConfig.type === 'error' ? '❌' : '✅'} {toastConfig.message}</Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Up</Text>
        <View style={{ width: 60 }} /> 
      </View>

      <View style={styles.brandTextWrapper}>
        <Text style={styles.brandingMainTitle}>SHINE &</Text>
        <Text style={styles.brandingMainTitle}>CHECK</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={[styles.formCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.formTitle, { color: textColor }]}>Create Your Account</Text>

          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput 
              style={[styles.inputField, { color: inputText }]}
              placeholder="UserName"
              placeholderTextColor="#999"
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput 
              style={[styles.inputField, { color: inputText }]}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handlePhoneFormatChange}
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

          <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
            <Text style={styles.submitButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 20 },
  backButton: { paddingVertical: 8, paddingHorizontal: 12 },
  backButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  brandTextWrapper: { alignItems: 'center', marginTop: 40, marginBottom: 15 },
  brandingMainTitle: { fontSize: 54, fontWeight: '900', color: '#ffffff', letterSpacing: 3, lineHeight: 58, textAlign: 'center' },
  successToastBox: { position: 'absolute', top: 60, width: width - 48, paddingVertical: 14, borderRadius: 12, zIndex: 9999, alignSelf: 'center' },
  successToastBg: { backgroundColor: '#2E7D32' },
  errorToastBg: { backgroundColor: '#D32F2F' },
  successToastText: { color: '#ffffff', fontWeight: '700', fontSize: 15, textAlign: 'center' },
  scrollContainer: { flexGrow: 1, justifyContent: 'flex-end' },
  formCard: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40, width: width },
  formTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  inputWrapper: { borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, height: 54, justifyContent: 'center' },
  inputField: { fontSize: 16 },
  submitButton: { backgroundColor: '#0a749b', borderRadius: 12, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});