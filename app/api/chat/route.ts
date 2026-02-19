import { auth } from '@/app/(auth)/auth';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { getModel } from '@/lib/ai/providers';
import { systemPrompt } from '@/lib/ai/prompts'; // lib/ai/prompts.ts dosyasından çekiyoruz
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

export const maxDuration = 60;

export async function POST(request: Request) {
  const { id, messages, modelId }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = getModel(modelId || DEFAULT_CHAT_MODEL);

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model,
        id,
        // VORTEX ÜST AKIL DİREKTİFİ BURADA DEVREYE GİRİYOR
        system: systemPrompt, 
        messages,
        maxSteps: 5,
        experimental_transform: smoothStream({ chunking: 'word' }),
        onFinish: async ({ text, responseMessages }) => {
          if (session.user?.id) {
            try {
              // Sohbeti ve mesajları veritabanına otonom olarak kaydet
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
              console.error('Vortex Veritabanı Kayıt Hatası:', error);
            }
          }
        },
        experimental_activeBilling: {
          customer: session.user.id,
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('ID required', { status: 400 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('Error deleting chat', { status: 500 });
  }
}
