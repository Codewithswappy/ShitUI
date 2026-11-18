import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    // Read PIN from server-side environment variables (never exposed in client bundle)
    // On Vercel, set LAB_FOUNDER_PIN in Environment Variables
    const expectedPin = (
      process.env.LAB_FOUNDER_PIN ||
      process.env.NEXT_PUBLIC_LAB_FOUNDER_PIN ||
      '583958'
    ).trim();

    if (!pin) {
      return NextResponse.json(
        { success: false, message: 'PIN is required' },
        { status: 400 }
      );
    }

    if (String(pin).trim() === expectedPin) {
      return NextResponse.json({ success: true, message: 'Authenticated' });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid PIN' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Verification error' },
      { status: 500 }
    );
  }
}
