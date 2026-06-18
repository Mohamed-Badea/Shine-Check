import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppConfig } from './_layout';

const { width } = Dimensions.get('window');

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useAppConfig();

  const selectedService = params.service as 'shine' | 'check' | 'shineCheck';
  const shineOption = params.option as 'full' | 'inner' | 'outer';

  const [toastConfig, setToastConfig] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'cash'>('instapay');
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);

  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#0a749b';
  const cardColor = isDark ? '#1f1f1f' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1c2d3f';
  const labelColor = isDark ? '#bbbbbb' : '#666666';

  let itemLabel = '';
  let itemPrice = 0;
  let roadFee = 0;

  if (selectedService === 'shineCheck') {
    itemLabel = 'Shine & Check Bundle';
    itemPrice = 425; 
    roadFee = 0;    
  } else if (selectedService === 'check') {
    itemLabel = 'Check Only';
    itemPrice = 75;  
    roadFee = 50;   
  } else if (selectedService === 'shine') {
    roadFee = 50;   
    if (shineOption === 'full') {
      itemLabel = 'Shine Full';
      itemPrice = 350;
    } else if (shineOption === 'outer') {
      itemLabel = 'Shine Outer';
      itemPrice = 175;
    } else {
      itemLabel = 'Shine Inner';
      itemPrice = 175;
    }
  }

  const totalPrice = itemPrice + roadFee;

  const handleConfirmPayment = () => {
    if (paymentMethod === 'instapay' && !screenshotUploaded) {
      setToastConfig({
        message: 'Please upload a screenshot of your receipt before confirming.',
        type: 'error'
      });
      setTimeout(() => setToastConfig(null), 2500);
      return;
    }

    // 🌟 UPDATED: Unified message for both payment options upon confirmation success
    setToastConfig({
      message: '✅ request received ,we are on our way',
      type: 'success'
    });

    setTimeout(() => {
      setToastConfig(null);
      router.replace('/main');
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {toastConfig && (
        <View style={[
          styles.toastNotificationBox, 
          toastConfig.type === 'error' ? styles.errorToastBg : styles.successToastBg
        ]}>
          <Text style={styles.toastNotificationText}>{toastConfig.message}</Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.staticTopContainer}>
        <View style={styles.methodTabRow}>
          <TouchableOpacity style={[styles.methodTab, paymentMethod === 'instapay' && styles.methodTabActive]} onPress={() => setPaymentMethod('instapay')}>
            <Text style={[styles.methodTabText, paymentMethod === 'instapay' && styles.methodTabTextActive]}>Instapay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.methodTab, paymentMethod === 'cash' && styles.methodTabActive]} onPress={() => setPaymentMethod('cash')}>
            <Text style={[styles.methodTabText, paymentMethod === 'cash' && styles.methodTabTextActive]}>Cash</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.instructionCard, { backgroundColor: cardColor }]}>
          {paymentMethod === 'instapay' ? (
            <>
              <Text style={styles.instapayHeader}>Instapay Transfer</Text>
              <Text style={[styles.instructionText, { color: textColor }]}>Transfer total order amount to:</Text>
              <View style={styles.numberContainer}><Text style={styles.transferNumber}>01018075889</Text></View>
              <TouchableOpacity style={[styles.uploadBox, screenshotUploaded && styles.uploadBoxSuccess]} onPress={() => setScreenshotUploaded(!screenshotUploaded)}>
                <Text style={styles.uploadText}>{screenshotUploaded ? 'Screenshot Attached' : 'Upload Screenshot'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.instapayHeader}>Cash on Delivery</Text>
              <Text style={[styles.instructionText, { color: textColor }]}>Settle with our representative on location.</Text>
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={[styles.detailsCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Payment Details</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: labelColor }]}>{itemLabel}</Text>
            <Text style={[styles.priceValue, { color: textColor }]}>{itemPrice} EGP</Text>
          </View>
          {roadFee > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: labelColor }]}>Services & Road</Text>
              <Text style={[styles.priceValue, { color: textColor }]}>{roadFee} EGP</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: textColor }]}>Total Amount</Text>
            <Text style={styles.totalValue}>{totalPrice} EGP</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
          <Text style={styles.confirmButtonText}>
            {paymentMethod === 'instapay' ? 'I Have Transferred' : 'Confirm Cash Booking'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 20 },
  backButton: { paddingVertical: 8 },
  backButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  staticTopContainer: { paddingHorizontal: 24, marginTop: 14 },
  methodTabRow: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 14, padding: 4, marginBottom: 16 },
  methodTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  methodTabActive: { backgroundColor: '#ffffff' },
  methodTabText: { fontSize: 16, fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)' },
  methodTabTextActive: { color: '#0a749b' },
  instructionCard: { borderRadius: 20, padding: 20, alignItems: 'center' },
  instapayHeader: { fontSize: 22, fontWeight: '800', color: '#0a749b', marginBottom: 8 },
  instructionText: { fontSize: 14, textAlign: 'center', marginBottom: 12, lineHeight: 20 },
  numberContainer: { backgroundColor: '#f1f4f7', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 14 },
  transferNumber: { fontSize: 24, fontWeight: '900', color: '#1c2d3f' },
  uploadBox: { width: '100%', height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#0a749b', justifyContent: 'center', alignItems: 'center' },
  uploadBoxSuccess: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
  uploadText: { fontSize: 15, fontWeight: '600', color: '#0a749b' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
  detailsCard: { borderRadius: 20, padding: 24, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 18 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  priceLabel: { fontSize: 15, fontWeight: '500' },
  priceValue: { fontSize: 15, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#eeeeee', marginVertical: 14 },
  totalLabel: { fontSize: 16, fontWeight: '800' },
  totalValue: { fontSize: 18, color: '#0a749b', fontWeight: '800' },
  confirmButton: { backgroundColor: '#ffffff', borderRadius: 14, height: 56, alignItems: 'center', justifyContent: 'center' },
  confirmButtonText: { color: '#0a749b', fontSize: 18, fontWeight: '800' },
  toastNotificationBox: { position: 'absolute', top: 60, width: width - 48, paddingVertical: 14, borderRadius: 12, zIndex: 9999, alignSelf: 'center' },
  errorToastBg: { backgroundColor: '#D32F2F' }, 
  successToastBg: { backgroundColor: '#2E7D32' }, 
  toastNotificationText: { color: '#ffffff', fontWeight: '700', fontSize: 15, textAlign: 'center' }
});