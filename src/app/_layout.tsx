import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'DuoManos' }} />
      <Stack.Screen name="traducao" options={{ title: 'Tradução ao vivo' }} />
      <Stack.Screen name="aprender" options={{ title: 'Aprender sinais' }} />
      <Stack.Screen name="texto-libras" options={{ title: 'Texto para Libras' }} />
    </Stack>
  );
}
