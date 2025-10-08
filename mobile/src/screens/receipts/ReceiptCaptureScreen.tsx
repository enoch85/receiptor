/**
 * Receipt Capture Scimport {
  Button,
  Portal,
  Modal,
  List,
} from 'react-native-paper';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';en
 *
 * Allows users to capture receipt photos, process them with OCR,
 * and save them to the database with automatic categorization.
 *
 * Features:
 * - Camera integration
 * - Image picker fallback
 * - Veryfi OCR processing
 * - Automatic item categorization
 * - Preview before saving
 * - Error handling
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, Card, Chip, IconButton, Divider } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { parseVeryfiReceipt, classifyItems } from '@receiptor/shared';
import type { ParsedReceipt, CategoryPrediction } from '@receiptor/shared';

import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { ReceiptsStackScreenProps } from '../../types/navigation';
import { theme } from '../../utils/theme';
import {
  processReceiptWithFallback,
  type VeryfiResponse,
} from '../../services/veryfi';

type Props = ReceiptsStackScreenProps<'ReceiptCapture'>;

type CaptureStep = 'camera' | 'processing' | 'preview' | 'saving' | 'success';

export function ReceiptCaptureScreen({ navigation }: Props) {
  const { user } = useAuth();
  const cameraRef = useRef<CameraView>(null);
  
  // Permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  
  // State
  const [step, setStep] = useState<CaptureStep>('camera');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [parsedReceipt, setParsedReceipt] = useState<ParsedReceipt | null>(null);
  const [categorizedItems, setCategorizedItems] = useState<Array<ParsedReceipt['items'][0] & { category?: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request camera permissions on mount
   */
  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, []);

  /**
   * Capture photo from camera
   */
  const handleTakePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera not ready');
      return;
    }

    try {
      setError(null);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        setImageUri(photo.uri);
        await processImage(photo.uri);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  /**
   * Pick image from gallery
   */
  const handlePickImage = async () => {
    try {
      setError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await processImage(uri);
      }
    } catch (err: any) {
      console.error('Image picker error:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  /**
   * Process image with Veryfi OCR
   */
  const processImage = async (uri: string) => {
    setStep('processing');
    setIsProcessing(true);

    try {
      // Read image as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      // Call Veryfi API
      const veryfiConfig = {
        clientId: process.env.EXPO_PUBLIC_VERYFI_CLIENT_ID || '',
        clientSecret: process.env.EXPO_PUBLIC_VERYFI_CLIENT_SECRET || '',
        username: process.env.EXPO_PUBLIC_VERYFI_USERNAME || '',
        apiKey: process.env.EXPO_PUBLIC_VERYFI_API_KEY || '',
      };

      // Check if we have credentials
      const hasCredentials = !!(
        veryfiConfig.clientId &&
        veryfiConfig.clientSecret &&
        veryfiConfig.username &&
        veryfiConfig.apiKey
      );

      // Process with real API or fallback to mock
      const veryfiResponse = await processReceiptWithFallback(
        base64,
        hasCredentials ? veryfiConfig : undefined,
        !hasCredentials // useMock if no credentials
      );

      // Parse response using shared logic
      const parsed = parseVeryfiReceipt(veryfiResponse);
      setParsedReceipt(parsed);

      // Categorize items automatically
      const categorized = classifyItems(parsed.items);
      
      // Merge categorization results with items
      const itemsWithCategories = parsed.items.map((item, index) => ({
        ...item,
        category: categorized[index]?.category || 'other',
      }));
      
      setCategorizedItems(itemsWithCategories);

      setStep('preview');
    } catch (err: any) {
      console.error('OCR processing error:', err);
      setError(err.message || 'Failed to process receipt');
      setStep('camera');
      Alert.alert('OCR Error', err.message || 'Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Save receipt to database
   */
  const handleSaveReceipt = async () => {
    if (!parsedReceipt || !user) {
      Alert.alert('Error', 'Cannot save receipt');
      return;
    }

    setStep('saving');

    try {
      // Get user's household (for now, use first household)
      // TODO: Add household selector if user belongs to multiple households
      const { data: memberData, error: memberError } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (memberError || !memberData) {
        throw new Error('No household found. Please create a household first.');
      }

      const householdId = memberData.household_id;

      // Upload image to Supabase Storage
      let imageUrl = null;
      if (imageUri) {
        const fileName = `${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(`${householdId}/${fileName}`, {
            uri: imageUri,
            type: 'image/jpeg',
            name: fileName,
          } as any);

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('receipts')
            .getPublicUrl(uploadData.path);
          imageUrl = urlData.publicUrl;
        }
      }

      // Insert receipt
      const { data: receiptData, error: receiptError } = await supabase
        .from('receipts')
        .insert({
          household_id: householdId,
          store_name: parsedReceipt.store_name,
          purchase_date: parsedReceipt.purchase_date,
          total_amount: parsedReceipt.total_amount,
          currency: parsedReceipt.currency || 'SEK',
          source: 'manual',
          image_url: imageUrl,
          raw_data: parsedReceipt,
        })
        .select()
        .single();

      if (receiptError) {
        throw receiptError;
      }

      // Insert receipt items
      const itemsToInsert = categorizedItems.map((item) => ({
        receipt_id: receiptData.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        category: item.category || 'other',
        is_organic: false, // Default value, can be enhanced later
      }));

      const { error: itemsError } = await supabase
        .from('receipt_items')
        .insert(itemsToInsert);

      if (itemsError) {
        throw itemsError;
      }

      setStep('success');
      setTimeout(() => {
        navigation.navigate('ReceiptList');
      }, 2000);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save receipt');
      Alert.alert('Save Error', err.message || 'Failed to save receipt');
      setStep('preview');
    }
  };

  /**
   * Retry capture
   */
  const handleRetry = () => {
    setImageUri(null);
    setParsedReceipt(null);
    setCategorizedItems([]);
    setError(null);
    setStep('camera');
  };

  // Permission denied
  if (cameraPermission && !cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera permission is required to scan receipts
          </Text>
          <Button mode="contained" onPress={requestCameraPermission} style={styles.button}>
            Grant Permission
          </Button>
          <Button mode="outlined" onPress={handlePickImage} style={styles.button}>
            Pick from Gallery
          </Button>
        </View>
      </View>
    );
  }

  // Camera step
  if (step === 'camera') {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back">
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraFrame} />
          </View>

          <View style={styles.cameraControls}>
            <IconButton
              icon="close"
              size={32}
              iconColor="#fff"
              onPress={() => navigation.goBack()}
            />
            
            <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <IconButton
              icon="image"
              size={32}
              iconColor="#fff"
              onPress={handlePickImage}
            />
          </View>
        </CameraView>

        <View style={styles.hint}>
          <Text style={styles.hintText}>Position receipt within frame</Text>
        </View>
      </View>
    );
  }

  // Processing step
  if (step === 'processing' || isProcessing) {
    return (
      <View style={styles.container}>
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.processingText}>Processing receipt...</Text>
          <Text style={styles.processingSubtext}>This may take a few seconds</Text>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.processingImage} />}
        </View>
      </View>
    );
  }

  // Preview step
  if (step === 'preview' && parsedReceipt) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <IconButton icon="close" onPress={handleRetry} />
          <Text style={styles.headerTitle}>Review Receipt</Text>
          <View style={{ width: 48 }} />
        </View>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>{parsedReceipt.store_name}</Text>
            <Text style={styles.cardSubtitle}>{parsedReceipt.purchase_date.toLocaleDateString()}</Text>
            <Text style={styles.totalAmount}>
              {parsedReceipt.total_amount.toFixed(2)} {parsedReceipt.currency}
            </Text>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>
          Items ({categorizedItems.length})
        </Text>

        {categorizedItems.map((item, index) => (
          <Card key={index} style={styles.itemCard}>
            <Card.Content>
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemMeta}>
                    {item.quantity > 0 && (
                      <Text style={styles.itemQuantity}>
                        {item.quantity}x
                      </Text>
                    )}
                    <Chip mode="outlined" compact>
                      {item.category?.replace('_', ' ')}
                    </Chip>
                  </View>
                </View>
                <Text style={styles.itemPrice}>
                  {item.total_price.toFixed(2)} {parsedReceipt.currency}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}

        <View style={styles.actions}>
          <Button mode="outlined" onPress={handleRetry} style={styles.actionButton}>
            Retake
          </Button>
          <Button mode="contained" onPress={handleSaveReceipt} style={styles.actionButton}>
            Save Receipt
          </Button>
        </View>
      </ScrollView>
    );
  }

  // Saving step
  if (step === 'saving') {
    return (
      <View style={styles.container}>
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.processingText}>Saving receipt...</Text>
        </View>
      </View>
    );
  }

  // Success step
  if (step === 'success') {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <IconButton icon="check-circle" size={80} iconColor={theme.colors.success} />
          <Text style={styles.successText}>Receipt Saved!</Text>
          <Text style={styles.successSubtext}>Redirecting to dashboard...</Text>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: theme.borderRadius.md,
    borderStyle: 'dashed',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
  },
  hint: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  hintText: {
    color: '#fff',
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  permissionText: {
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.textSecondary,
  },
  button: {
    marginTop: theme.spacing.md,
    width: '100%',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  processingText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  processingSubtext: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  processingImage: {
    width: 200,
    height: 300,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xl,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
  },
  cardSubtitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginVertical: theme.spacing.md,
  },
  itemCard: {
    marginBottom: theme.spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  itemQuantity: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  itemPrice: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.success,
    marginTop: theme.spacing.md,
  },
  successSubtext: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});
