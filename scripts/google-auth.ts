/**
 * Google OAuth 2.0 Refresh Token 取得スクリプト
 *
 * 使い方:
 *   1. Google Cloud Console で OAuth 2.0 クライアントID（デスクトップアプリ）を作成
 *   2. .env に GOOGLE_CLIENT_ID と GOOGLE_CLIENT_SECRET を設定
 *   3. npx tsx scripts/google-auth.ts を実行
 *   4. ブラウザで認証 → 表示される refresh token を .env の GOOGLE_REFRESH_TOKEN に設定
 */

import { config } from 'dotenv';
import { google } from 'googleapis';
import { createServer } from 'http';

config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_PORT = 3000;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/tasks.readonly',
];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('GOOGLE_CLIENT_ID と GOOGLE_CLIENT_SECRET を .env に設定してください');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

console.log('ブラウザで以下のURLを開いてください:\n');
console.log(authUrl);
console.log('\n認証待機中...');

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/callback')) return;

  const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);
  const code = url.searchParams.get('code');

  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>エラー: 認証コードがありません</h1>');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>認証成功！ターミナルを確認してください。</h1>');

    console.log('\n=== 認証成功 ===\n');
    console.log('以下を .env に追加してください:\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('\n================\n');
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>トークン取得に失敗しました</h1>');
    console.error('トークン取得エラー:', error);
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(REDIRECT_PORT, () => {
  console.log(`コールバックサーバーを localhost:${REDIRECT_PORT} で起動しました`);
});
