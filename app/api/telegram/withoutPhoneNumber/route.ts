import axios from 'axios';
import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeMarkdown(text: string) {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}

export async function POST(req: Request) {
  console.log(req);
  try {
    if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json(
        { success: false, error: 'Telegram credentials not configured' },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { id, price, district, adress, room, floor, floorBuild, square, images } = body;

    // Формируем текст сообщения с Markdown
    const message = `
      Сдается в аренду квартира *\\#${id}*\n
  📍*Район:* ${escapeMarkdown(district)}
  📬*Адрес:* ${escapeMarkdown(adress)}\n
  🔹*Комнат:* ${room}
  🔹*Этаж:* ${floor}
  🔹*Этажность:* ${floorBuild}
  🔹*Площадь:* ${square} м² \n
  💰*Цена:* ${price}\\$ \n
   @myproperty\\_uzb
    `.trim();

    // Если есть изображения - отправляем как медиагруппу с подписью
    if (Array.isArray(images) && images.length > 0) {
      const media = images.slice(0, 10).map((url, index) => ({
        type: 'photo',
        media: url,
        // Только к первой фотографии добавляем описание
        ...(index === 0 ? { caption: message, parse_mode: 'MarkdownV2' } : {}),
      }));

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`, {
        chat_id: CHAT_ID,
        media,
      });
    } else {
      // Если нет изображений - отправляем просто текст
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'MarkdownV2',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
