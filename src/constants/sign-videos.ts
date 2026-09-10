// Dicionário de sinais: mapeia cada palavra/frase (em minúsculo, sem acento)
// para o arquivo de vídeo correspondente.
//
// IMPORTANTE: os caminhos abaixo (require) precisam apontar pra vídeos
// que existem de verdade dentro de assets/videos. Comece com 2-3 vídeos
// de teste antes de gravar o banco completo.

export const signVideos: Record<string, any> = {
  'oi': require('../../assets/videos/oi_libras.mp4'),
  'bom dia': require('../../assets/videos/bom_dia_libras.mp4'),
  'qual o seu nome': require('../../assets/videos/qual_seu_nome_libras.mp4'),
  'qual e o seu sinal': require('../../assets/videos/qual_seu_sinal_libras.mp4'),

  // Conforme forem gravando os próximos, adiciona uma linha nesse
  // mesmo formato: 'frase em portugues': require('../../assets/videos/nome_do_arquivo.mp4'),
  // Exemplos que ainda faltam:
  // 'eu te amo': require('../../assets/videos/eu_te_amo_libras.mp4'),
  // 'obrigado': require('../../assets/videos/obrigado_libras.mp4'),
  // 'livro': require('../../assets/videos/livro_libras.mp4'),
  // 'ajuda': require('../../assets/videos/ajuda_libras.mp4'),
};

// Lista de chaves ordenada da mais longa pra mais curta (em número de palavras).
// Isso é importante pro "casamento guloso": tentamos achar frases inteiras
// antes de quebrar em palavras soltas (ex: "bom dia" antes de "bom" + "dia").
export const signKeysSortedByLength = Object.keys(signVideos).sort(
  (a, b) => b.split(' ').length - a.split(' ').length
);

// Remove acentos e deixa tudo minúsculo, pra facilitar a comparação
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();
}

// Tipo de cada "passo" da fila de reprodução
export type SignStep =
  | { type: 'video'; key: string; source: any }
  | { type: 'missing'; word: string };

// Quebra o texto digitado numa fila de vídeos a tocar (ou avisos de "não encontrado")
export function buildSignQueue(text: string): SignStep[] {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/).filter(Boolean);
  const queue: SignStep[] = [];

  let i = 0;
  while (i < words.length) {
    let matched = false;

    for (const key of signKeysSortedByLength) {
      const keyWords = key.split(' ');
      const slice = words.slice(i, i + keyWords.length).join(' ');
      if (slice === key) {
        queue.push({ type: 'video', key, source: signVideos[key] });
        i += keyWords.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      queue.push({ type: 'missing', word: words[i] });
      i += 1;
    }
  }

  return queue;
}