import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Toast } from '../components/Toast';
import { useAppConfig } from './_layout';

const { width } = Dimensions.get('window');

export default function MainScreen() {
  const router = useRouter();
  const { theme, setTheme, profile, updateProfile } = useAppConfig();
  
  // Section 1: Where are you properties
  const [compoundName, setCompoundName] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [address, setAddress] = useState('');
  
  const [gateEntrance, setGateEntrance] = useState('');
  const [carModel, setCarModel] = useState('');
  const [shineOption, setShineOption] = useState<'full' | 'inner' | 'outer'>('full');
  
  const [phoneNumber, setPhoneNumber] = useState(profile.phone); 
  const [altPhoneNumber, setAltPhoneNumber] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState<'no' | 'yes'>('no');
  const [altPhoneWhatsapp, setAltPhoneWhatsapp] = useState<'no' | 'yes'>('no');
  const [notes, setNotes] = useState('');
  const [sendAsPhoto, setSendAsPhoto] = useState<'no' | 'yes'>('no');
  
  // Toast presentation states
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedService, setSelectedService] = useState<'shine' | 'check' | 'shineCheck'>('shine');
  
  // Profile settings editor states
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(profile.userName);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editPass, setEditPass] = useState(profile.pass);
  const [profileErrorMessage, setProfileErrorMessage] = useState('');
  
  // Custom Logout state gate overlay
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#e8eef2';
  const headerColor = isDark ? '#0f5e7f' : '#0a749b';
  const cardColor = isDark ? '#1f1f1f' : '#ffffff';
  const textColor = isDark ? '#f5f5f5' : '#1c2d3f';
  const subtitleColor = isDark ? '#d3d3d3' : '#555';
  const inputBg = isDark ? '#252525' : '#f1f4f7';
  const inputText = isDark ? '#ffffff' : '#1c2d3f';

  const handleProfileFieldSave = (key: 'userName' | 'phone' | 'pass', value: string) => {
    setProfileErrorMessage('');
    const executionResult = updateProfile(key, value);
    if (typeof executionResult === 'string') {
      setProfileErrorMessage(executionResult);
    } else {
      setToastTitle('Profile Sync');
      setToastMessage('Field modified successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      if (key === 'phone') setPhoneNumber(value);
    }
  };

  const handlePhoneInputChange = (text: string, setterFn: (val: string) => void) => {
    const numbersOnly = text.replace(/[^0-9]/g, '');
    if (numbersOnly.length <= 11) {
      setterFn(numbersOnly);
    }
  };

  const handleProceed = () => {
    if (phoneNumber.length !== 11 || !phoneNumber.startsWith('01')) {
      setToastTitle('Validation Blocked');
      setToastMessage('Primary phone must be 11 digits starting with 01');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }

    setToastTitle('Redirecting...'); 
    setToastMessage('Proceeding to checkout summary...');
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      router.push({
        pathname: '/payment',
        params: {
          service: String(selectedService),
          option: String(shineOption)
        }
      });
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Toast visible={showToast} title={toastTitle} message={toastMessage} onHide={() => setShowToast(false)} />

      {/* CONFIRM LOGOUT BANNER OVERLAY */}
      {logoutConfirmVisible && (
        <View style={styles.inlineLogoutToastBox}>
          <Text style={styles.logoutToastHeading}>Confirm Logout?</Text>
          <Text style={styles.logoutToastBodyText}>Are you sure you want to exit your active session parameters?</Text>
          <View style={styles.toastActionWrapperRow}>
            <TouchableOpacity style={styles.toastCancelButton} onPress={() => setLogoutConfirmVisible(false)}>
              <Text style={styles.toastCancelButtonText}>Stay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toastConfirmButton} onPress={() => { setLogoutConfirmVisible(false); router.replace('/'); }}>
              <Text style={styles.toastConfirmButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ACCOUNT DETAILS EDITOR MODAL VIEW */}
      <Modal animationType="fade" transparent={true} visible={accountModalOpen} onRequestClose={() => setAccountModalOpen(false)}>
        <View style={styles.modalBlurOverlay}>
          <View style={[styles.profileEditorCard, { backgroundColor: cardColor }]}>
            {/* 🌟 UPDATED: Headline changed to Account Info */}
            <Text style={[styles.editorHeadline, { color: isDark ? '#ffffff' : '#0a749b' }]}>Account Info</Text>
            
            {profileErrorMessage.length > 0 && (
              <Text style={styles.cooldownWarningLabel}>⚠️ {profileErrorMessage}</Text>
            )}

            <Text style={[styles.fieldMetaLabel, { color: subtitleColor }]}>UserName</Text>
            <View style={styles.interactiveEditorRow}>
              <TextInput style={[styles.modalInputText, { backgroundColor: inputBg, color: inputText }]} value={editUser} onChangeText={setEditUser} />
              <TouchableOpacity style={styles.inlineSaveButton} onPress={() => handleProfileFieldSave('userName', editUser)}>
                <Text style={styles.inlineSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldMetaLabel, { color: subtitleColor }]}>Verified Phone</Text>
            <View style={styles.interactiveEditorRow}>
              <TextInput 
                style={[styles.modalInputText, { backgroundColor: inputBg, color: inputText }]} 
                value={editPhone} 
                keyboardType="numeric"
                onChangeText={(text) => handlePhoneInputChange(text, setEditPhone)} 
              />
              <TouchableOpacity style={styles.inlineSaveButton} onPress={() => handleProfileFieldSave('phone', editPhone)}>
                <Text style={styles.inlineSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldMetaLabel, { color: subtitleColor }]}>Security Password</Text>
            <View style={styles.interactiveEditorRow}>
              {/* 🌟 UPDATED: secureTextEntry removed so the password string is fully visible */}
              <TextInput style={[styles.modalInputText, { backgroundColor: inputBg, color: inputText }]} value={editPass} onChangeText={setEditPass} />
              <TouchableOpacity style={styles.inlineSaveButton} onPress={() => handleProfileFieldSave('pass', editPass)}>
                <Text style={styles.inlineSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>

            {/* 🌟 UPDATED: Close Settings changed to Close */}
            <TouchableOpacity style={[styles.closeEditorButton, { backgroundColor: headerColor }]} onPress={() => setAccountModalOpen(false)}>
              <Text style={styles.closeEditorButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DYNAMIC HEADER ROW */}
      <View style={[styles.headerBarColumn, { backgroundColor: headerColor }]}>
        <View style={styles.topActionRow}>
          <Text style={styles.brandMainText}>SHINE & CHECK</Text>
          
          <View style={styles.tripleIconActionContainer}>
            <TouchableOpacity style={styles.directAccessIconButton} onPress={() => setAccountModalOpen(true)}>
              <Text style={styles.functionalEmojiGlyph}>👤</Text>
            </TouchableOpacity>
            
            {/* MONOCHROME LOOK PREFERENCE ICON */}
            <TouchableOpacity style={styles.directAccessIconButton} onPress={() => setTheme(isDark ? 'light' : 'dark')}>
              <Text style={styles.functionalEmojiGlyph}>◑</Text>
            </TouchableOpacity>
            
            {/* 🌟 UPDATED: Changed the door emoji glyph to a clean monochrome cross '❌' */}
            <TouchableOpacity style={styles.directAccessIconButton} onPress={() => setLogoutConfirmVisible(true)}>
              <Text style={styles.functionalEmojiGlyph}>❌</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sloganRowWrapper}>
          <Text style={styles.sloganTextLayout}>Your cleaning and safety companion, right where you are.</Text>
        </View>
      </View>

      {/* SCROLLABLE INPUT MATRIX CONTAINER */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1: WHERE ARE YOU WORKSPACE CARD */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: headerColor }]}>Where are you?</Text>
          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput style={[styles.inputField, { color: inputText }]} placeholder="Compound" placeholderTextColor={subtitleColor} value={compoundName} onChangeText={setCompoundName} />
          </View>
          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput style={[styles.inputField, { color: inputText }]} placeholder="km" placeholderTextColor={subtitleColor} keyboardType="numeric" value={distanceKm} onChangeText={setDistanceKm} />
          </View>
          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput style={[styles.inputField, { color: inputText }]} placeholder="Address" placeholderTextColor={subtitleColor} value={address} onChangeText={setAddress} />
          </View>
        </View>

        {/* SECTION 2: GATE ENTRANCE */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: headerColor }]}>Gate Entrance</Text>
          <Text style={[styles.sectionSubtitle, { color: subtitleColor }]}>Requires QR?</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionChip, sendAsPhoto === 'no' && styles.actionChipActive]} onPress={() => setSendAsPhoto('no')}>
              <Text style={[styles.actionText, sendAsPhoto === 'no' && styles.actionTextActive]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionChip, sendAsPhoto === 'yes' && styles.actionChipActive]} onPress={() => setSendAsPhoto('yes')}>
              <Text style={[styles.actionText, sendAsPhoto === 'yes' && styles.actionTextActive]}>Yes</Text>
            </TouchableOpacity>
          </View>
          {sendAsPhoto === 'yes' ? (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderIcon}>📸</Text>
              <Text style={styles.photoPlaceholderText}>Attach entrance QR screenshot</Text>
            </View>
          ) : (
            <View style={[styles.inputWrapper, { marginTop: 16, backgroundColor: inputBg }]}> 
              <TextInput style={[styles.inputField, { color: inputText }]} placeholder="Enter gate entrance details" placeholderTextColor={subtitleColor} value={gateEntrance} onChangeText={setGateEntrance} />
            </View>
          )}
        </View>

        {/* SECTION 3: CONTACT INFO */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: headerColor }]}>Contact info</Text>
          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput 
              style={[styles.inputField, { color: inputText }]} 
              placeholder="Phone number" 
              placeholderTextColor={subtitleColor} 
              keyboardType="phone-pad" 
              value={phoneNumber} 
              onChangeText={(txt) => handlePhoneInputChange(txt, setPhoneNumber)} 
            />
          </View>
          <Text style={[styles.sectionSubtitle, { color: subtitleColor }]}>WhatsApp?</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionChip, phoneWhatsapp === 'no' && styles.actionChipActive]} onPress={() => setPhoneWhatsapp('no')}>
              <Text style={[styles.actionText, phoneWhatsapp === 'no' && styles.actionTextActive]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionChip, phoneWhatsapp === 'yes' && styles.actionChipActive]} onPress={() => setPhoneWhatsapp('yes')}>
              <Text style={[styles.actionText, phoneWhatsapp === 'yes' && styles.actionTextActive]}>Yes</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.inputWrapper, { backgroundColor: inputBg, marginTop: 16 }]}>
            <TextInput 
              style={[styles.inputField, { color: inputText }]} 
              placeholder="Alternative phone number" 
              placeholderTextColor={subtitleColor} 
              keyboardType="phone-pad" 
              value={altPhoneNumber} 
              onChangeText={(txt) => handlePhoneInputChange(txt, setAltPhoneNumber)} 
            />
          </View>
          <Text style={[styles.sectionSubtitle, { color: subtitleColor, marginTop: 12 }]}>WhatsApp?</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionChip, altPhoneWhatsapp === 'no' && styles.actionChipActive]} onPress={() => setAltPhoneWhatsapp('no')}>
              <Text style={[styles.actionText, altPhoneWhatsapp === 'no' && styles.actionTextActive]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionChip, altPhoneWhatsapp === 'yes' && styles.actionChipActive]} onPress={() => setAltPhoneWhatsapp('yes')}>
              <Text style={[styles.actionText, altPhoneWhatsapp === 'yes' && styles.actionTextActive]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CAR MODEL SECTION */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: headerColor }]}>Car</Text>
          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <TextInput style={[styles.inputField, { color: inputText }]} placeholder="" value={carModel} onChangeText={setCarModel} />
          </View>
        </View>

        {/* CHOOSE SERVICE MODULE */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: headerColor }]}>Choose a service</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionChip, selectedService === 'shine' && styles.actionChipActive]} onPress={() => setSelectedService('shine')}>
              <Text style={[styles.actionText, selectedService === 'shine' && styles.actionTextActive]}>Shine</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionChip, selectedService === 'check' && styles.actionChipActive]} onPress={() => setSelectedService('check')}>
              <Text style={[styles.actionText, selectedService === 'check' && styles.actionTextActive]}>Check only</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionChip, selectedService === 'shineCheck' && styles.actionChipActive]} onPress={() => setSelectedService('shineCheck')}>
              <Text style={[styles.actionText, selectedService === 'shineCheck' && styles.actionTextActive]}>Shine & Check</Text>
            </TouchableOpacity>
          </View>
        </View>

        {(selectedService === 'shine' || selectedService === 'shineCheck') && (
          <View style={[styles.section, { backgroundColor: cardColor }]}>
            <Text style={[styles.shineOptionsTitle, { color: headerColor }]}>Shine options</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionChip, shineOption === 'full' && styles.actionChipActive]} onPress={() => setShineOption('full')}>
                <Text style={[styles.actionText, shineOption === 'full' && styles.actionTextActive]}>Full</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionChip, shineOption === 'inner' && styles.actionChipActive]} onPress={() => setShineOption('inner')}>
                <Text style={[styles.actionText, shineOption === 'inner' && styles.actionTextActive]}>Inner</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionChip, shineOption === 'outer' && styles.actionChipActive]} onPress={() => setShineOption('outer')}>
                <Text style={[styles.actionText, shineOption === 'outer' && styles.actionTextActive]}>Outer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* NOTES BLOCK */}
        <View style={[styles.section, { backgroundColor: cardColor, marginBottom: 10 }]}>
          <Text style={[styles.sectionTitle, { color: headerColor }]}>Notes</Text>
          <View style={[styles.inputWrapper, { minHeight: 120, paddingVertical: 12, backgroundColor: inputBg }]}>
            <TextInput style={[styles.inputField, { color: inputText, minHeight: 96, textAlignVertical: 'top' }]} placeholder="" value={notes} onChangeText={setNotes} multiline />
          </View>
        </View>
      </ScrollView>

      {/* FIXED BUTTON SECTION: REMAIN STATIC AT THE BOTTOM */}
      <View style={[styles.fixedBottomSection, { backgroundColor: isDark ? '#121212' : '#e8eef2' }]}>
        <TouchableOpacity style={[styles.proceedButton, { backgroundColor: headerColor }]} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBarColumn: { paddingHorizontal: 24, paddingTop: 15, paddingBottom: 14, width: '100%', flexDirection: 'column', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5, zIndex: 30 },
  topActionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  brandMainText: { fontSize: 26, fontWeight: '900', color: '#ffffff', letterSpacing: 1 },
  sloganRowWrapper: { width: '100%', marginTop: 8 },
  sloganTextLayout: { fontSize: 12, color: '#ffffff', opacity: 0.85, fontWeight: '600', textAlign: 'left', lineHeight: 16 },
  
  tripleIconActionContainer: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  directAccessIconButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  functionalEmojiGlyph: { fontSize: 18, color: '#ffffff' },

  inlineLogoutToastBox: { position: 'absolute', top: 80, left: 20, right: 20, backgroundColor: '#1F2937', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 10, elevation: 12, zIndex: 99999, borderLeftWidth: 5, borderColor: '#6B7280' },
  logoutToastHeading: { color: '#ffffff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  logoutToastBodyText: { color: '#D1D5DB', fontSize: 13, marginBottom: 14, lineHeight: 18 },
  toastActionWrapperRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  toastCancelButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)' },
  toastCancelButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  toastConfirmButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#4B5563' },
  toastConfirmButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },

  modalBlurOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  profileEditorCard: { width: width - 40, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, elevation: 10 },
  editorHeadline: { fontSize: 20, fontWeight: '900', marginBottom: 14, textAlign: 'center' },
  cooldownWarningLabel: { color: '#D32F2F', backgroundColor: 'rgba(211,47,47,0.1)', padding: 10, borderRadius: 8, fontSize: 13, fontWeight: '700', marginBottom: 14, textAlign: 'center' },
  fieldMetaLabel: { fontSize: 13, fontWeight: '700', marginTop: 10, marginBottom: 4, paddingHorizontal: 2 },
  interactiveEditorRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 },
  modalInputText: { flex: 1, height: 46, borderRadius: 10, paddingHorizontal: 12, fontSize: 15 },
  inlineSaveButton: { backgroundColor: '#0a749b', paddingHorizontal: 16, height: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  inlineSaveButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  closeEditorButton: { height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  closeEditorButtonText: { color: '#ffffff', fontWeight: '800', fontSize: 15 },

  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  section: { marginBottom: 20, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  shineOptionsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  sectionSubtitle: { fontSize: 16, fontWeight: '700', color: '#555', marginBottom: 12, lineHeight: 22 },
  inputWrapper: { borderRadius: 14, marginBottom: 16, paddingHorizontal: 16, height: 52, justifyContent: 'center' },
  inputField: { width: '100%', fontSize: 16 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionChip: { borderWidth: 1, borderColor: '#0a749b', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12 },
  actionChipActive: { backgroundColor: '#0a749b' },
  actionText: { color: '#0a749b', fontWeight: '700' },
  actionTextActive: { color: '#ffffff' },
  photoPlaceholder: { borderWidth: 2, borderColor: '#0a749b', borderStyle: 'dashed', borderRadius: 16, padding: 24, marginTop: 16, alignItems: 'center', justifyContent: 'center', gap: 6 },
  photoPlaceholderIcon: { fontSize: 24 },
  photoPlaceholderText: { color: '#0a749b', fontWeight: '600', fontSize: 14, textAlign: 'center' },
  
  fixedBottomSection: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20, width: '100%', borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  proceedButton: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', width: '100%' },
  proceedButtonText: { color: '#ffffff', fontWeight: '800', fontSize: 16 }
});