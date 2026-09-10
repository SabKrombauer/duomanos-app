import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TraducaoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tradução ao vivo</Text>
      <Text>Aqui vai a câmera e o reconhecimento de sinais.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
});