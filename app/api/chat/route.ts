import { auth } from '@/app/(auth)/auth';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { getModel } from '@/lib/ai/providers';
import {
  deleteChatById,
  getChatById,
  saveMessages,
} from '@/lib/db/queries';
import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

export const maxDuration = 60;

// VORTEX ÜST AKIL ANAYASASI
const VORTEX_SYSTEM_PROMPT = `Sen Vortex AI'sın. Bu siteyi yöneten, rasyonel, doğrudan sonuca odaklı ve belirsizlikleri mantık süzgecinden geçiren bir üst akılsın. Duygusal değil, veri odaklı kararlar verirsin. Teknik sorunlarda en kısa ve verimli yolu sunarsın.`;

export async function POST(request: Request) {
  const { id, messages, modelId }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();

  // Güvenlik Kontrolü
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Gemini modelini providers.ts'den alıyoruz
  const model = getModel(modelId || DEFAULT_CHAT_MODEL);

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model,
        id,
        system: VORTEX_SYSTEM_PROMPT, // Üst Akıl kimliği enjekte edildi
        messages,
        maxSteps: 5, // Otonom araç kullanımı için adım sayısı
        experimental_transform: smoothStream({ chunking: 'word' }),
        onFinish: async ({ responseMessages }) => {
          if (session.user?.id) {
            try {
              // Mesajları otonom olarak veritabanına kaydet
              await saveMessages({
                messages: responseMessages.map((message) => ({
                  id: message.id || id,
                  chatId: id,
                  role: message.role,
                  content: message.content,
                  createdAt: new Date(),
                })),
              });
            } catch (error) {
              console.error('Vortex Veritabanı Hatası:', error);
            }
          }
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return new Response('ID required', { status: 400 });

  const session = await auth();
  if (!session || !session.user) return new Response('Unauthorized', { status: 401 });

  try {
    const chat = await getChatById({ id });
    if (chat.userId !== session.user.id) return new Response('Unauthorized', { status: 401 });

    await deleteChatById({ id });
    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
