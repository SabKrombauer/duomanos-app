import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buildSignQueue, SignStep } from '@/constants/sign-videos';

export default function TextoLibrasScreen() {
  const [texto, setTexto] = useState('');
  const [fila, setFila] = useState<SignStep[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);

  const passoAtual = fila[indiceAtual];
  const fonteVideo = passoAtual?.type === 'video' ? passoAtual.source : null;

  const player = useVideoPlayer(fonteVideo, (p) => {
    p.play();
  });

  // Detecta quando o vídeo atual termina, pra avançar pro próximo da fila
  const { status } = useEvent(player, 'statusChange', { status: player.status });

  useEffect(() => {
    if (status === 'idle' && fonteVideo && indiceAtual < fila.length - 1) {
      // vídeo terminou, avança pro próximo
      const timer = setTimeout(() => {
        setIndiceAtual((i) => i + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleRepetir = () => {
    setIndiceAtual(0);
    player.currentTime = 0;
    player.play();
  };

  const handleTraduzir = () => {
    const novaFila = buildSignQueue(texto);
    setFila(novaFila);
    setIndiceAtual(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma frase..."
          value={texto}
          onChangeText={setTexto}
        />
        <TouchableOpacity style={styles.button} onPress={handleTraduzir}>
          <Text style={styles.buttonText}>Traduzir</Text>
        </TouchableOpacity>
      </View>

      {fila.length > 0 && (
        <ScrollView horizontal style={styles.filaRow} contentContainerStyle={{ gap: 8, padding: 8 }}>
          {fila.map((passo, idx) => (
            <View
              key={idx}
              style={[
                styles.chip,
                idx === indiceAtual && styles.chipAtivo,
                passo.type === 'missing' && styles.chipFaltando,
              ]}>
              <Text style={styles.chipText}>
                {passo.type === 'video' ? passo.key : `"${passo.word}" (sem vídeo)`}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.videoArea}>
        {fonteVideo ? (
          <VideoView style={styles.video} player={player} contentFit="contain" nativeControls={false} />
        ) : (
          <Text style={styles.aviso}>
            {fila.length === 0
              ? 'Digite uma frase e toque em Traduzir'
              : 'Nenhum vídeo disponível para este trecho'}
          </Text>
        )}
      </View>

      {fila.length > 0 && (
        <TouchableOpacity style={styles.repetirButton} onPress={handleRepetir}>
          <Text style={styles.repetirButtonText}>🔁 Repetir</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  filaRow: { maxHeight: 48 },
  chip: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
  },
  chipAtivo: { backgroundColor: '#2563eb' },
  chipFaltando: { backgroundColor: '#fecaca' },
  chipText: { fontSize: 13 },
  videoArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  video: { width: '100%', height: '100%' },
  aviso: { color: '#888', fontSize: 16, textAlign: 'center', paddingHorizontal: 24 },
  repetirButton: {
    backgroundColor: '#2563eb',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  repetirButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});