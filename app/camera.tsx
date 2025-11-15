import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, StatusBar } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.permissionContainer}>
          <Pressable style={styles.closeButtonPermission} onPress={() => router.back()}>
            <MaterialIcons name="close" size={28} color={colors.neutral.gray400} />
          </Pressable>

          <View style={styles.permissionContent}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="photo-camera" size={48} color={colors.primary[500]} />
            </View>

            <Text style={styles.permissionTitle}>카메라 권한 필요</Text>
            <Text style={styles.permissionDescription}>
              수업 필기를 찍어서{'\n'}5분만에 복습 끝내기
            </Text>

            <Pressable style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>카메라 권한 허용</Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          setPhoto(photo.uri);
          console.log('Photo taken:', photo.uri);
          // 과목 선택 화면으로 이동
          router.push({
            pathname: '/subject-select',
            params: { photoUri: photo.uri },
          });
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('오류', '사진 촬영에 실패했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <MaterialIcons name="close" size={32} color={colors.neutral.white} />
          </Pressable>
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-ios" size={32} color={colors.neutral.white} />
          </Pressable>

          <Pressable style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </Pressable>

          <View style={styles.placeholder} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.black,
    margin: 0,
    padding: 0,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.neutral.white,
  },
  closeButtonPermission: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  permissionContent: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  permissionButton: {
    width: '100%',
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionButtonText: {
    color: colors.neutral.white,
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.neutral.white,
    borderWidth: 3,
    borderColor: colors.neutral.black,
  },
  placeholder: {
    width: 56,
    height: 56,
  },
});
