import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ToastProps {
  message: string;
  title?: string;
  visible: boolean;
  type?: 'success' | 'error';
  onHide?: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  title,
  type = 'success',
  visible, 
  onHide, 
  duration = 3000 
}) => {
  const displayTitle = title ?? (type === 'error' ? 'Error!' : 'Success!');
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, opacity, duration, onHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity, backgroundColor: type === 'error' ? '#ff4d4f' : '#0a749b' }]}> 
      <View style={styles.content}>
        <Text style={[styles.title, type === 'error' && styles.titleError]}>{displayTitle}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#0a749b',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 999,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#CCFF00',
    marginBottom: 4,
  },
  titleError: {
    color: '#ffffff',
  },
  message: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
});
