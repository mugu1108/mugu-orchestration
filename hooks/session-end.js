#!/usr/bin/env node

/**
 * セッション終了時のフック
 * - セッション状態を保存
 * - 重要な情報を記録
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SESSION_DIR = path.join(os.homedir(), '.claude', 'mugu-orchestration');
const CONTEXT_FILE = path.join(SESSION_DIR, 'last-context.json');
const HISTORY_FILE = path.join(SESSION_DIR, 'session-history.jsonl');

async function main() {
  try {
    // セッションディレクトリを作成
    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    // 現在のコンテキストを保存
    const context = {
      workingDirectory: process.cwd(),
      timestamp: new Date().toISOString(),
      lastTask: process.env.LAST_TASK || null,
      packageManager: process.env.PREFERRED_PACKAGE_MANAGER || null,
    };

    // コンテキストファイルに保存
    fs.writeFileSync(CONTEXT_FILE, JSON.stringify(context, null, 2));

    // 履歴ファイルに追記（JSONL形式）
    const historyEntry = JSON.stringify({
      ...context,
      sessionId: generateSessionId(),
    });
    fs.appendFileSync(HISTORY_FILE, historyEntry + '\n');

    console.log('💾 セッション情報を保存しました');
    console.log(`   作業ディレクトリ: ${context.workingDirectory}`);
    if (context.lastTask) {
      console.log(`   最後のタスク: ${context.lastTask}`);
    }

    // 古い履歴をクリーンアップ（30日以上前のものを削除）
    cleanupOldHistory();

  } catch (error) {
    console.error('⚠️ セッション終了フックでエラーが発生しました:', error.message);
  }
}

/**
 * セッションIDを生成
 */
function generateSessionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

/**
 * 古い履歴をクリーンアップ
 */
function cleanupOldHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      return;
    }

    const lines = fs.readFileSync(HISTORY_FILE, 'utf-8').split('\n').filter(Boolean);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 30日以内のエントリーのみ保持
    const recentLines = lines.filter((line) => {
      try {
        const entry = JSON.parse(line);
        const entryDate = new Date(entry.timestamp);
        return entryDate > thirtyDaysAgo;
      } catch {
        return false;
      }
    });

    // ファイルを更新
    if (recentLines.length < lines.length) {
      fs.writeFileSync(HISTORY_FILE, recentLines.join('\n') + '\n');
      console.log(`   古い履歴を削除しました（${lines.length - recentLines.length}件）`);
    }
  } catch (error) {
    // クリーンアップの失敗は無視
  }
}

main();
