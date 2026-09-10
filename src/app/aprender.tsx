import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AprenderScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Aprender sinais</Text>
      <Text>Aqui vai o avatar do VLibras.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
});