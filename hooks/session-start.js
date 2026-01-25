#!/usr/bin/env node

/**
 * セッション開始時のフック
 * - 前回のコンテキストを復元
 * - パッケージマネージャーを自動検出
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SESSION_DIR = path.join(os.homedir(), '.claude', 'mugu-orchestration');
const CONTEXT_FILE = path.join(SESSION_DIR, 'last-context.json');

async function main() {
  try {
    // セッションディレクトリを作成
    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    // 前回のコンテキストを復元
    if (fs.existsSync(CONTEXT_FILE)) {
      const context = JSON.parse(fs.readFileSync(CONTEXT_FILE, 'utf-8'));
      console.log('📋 前回のセッション情報を復元しました');

      if (context.workingDirectory) {
        console.log(`   作業ディレクトリ: ${context.workingDirectory}`);
      }

      if (context.lastTask) {
        console.log(`   前回のタスク: ${context.lastTask}`);
      }

      if (context.timestamp) {
        const lastSession = new Date(context.timestamp);
        const now = new Date();
        const hoursSince = Math.floor((now - lastSession) / (1000 * 60 * 60));
        console.log(`   前回のセッション: ${hoursSince}時間前`);
      }
    }

    // パッケージマネージャーを検出
    const packageManager = detectPackageManager();
    if (packageManager) {
      console.log(`📦 パッケージマネージャー: ${packageManager}`);

      // 環境変数に設定
      process.env.PREFERRED_PACKAGE_MANAGER = packageManager;
    }

    console.log('✅ セッション開始準備が完了しました\n');

  } catch (error) {
    console.error('⚠️ セッション開始フックでエラーが発生しました:', error.message);
  }
}

/**
 * パッケージマネージャーを検出
 */
function detectPackageManager() {
  const cwd = process.cwd();

  // 優先順位: 環境変数 > ロックファイル > デフォルト

  // 1. 環境変数をチェック
  if (process.env.PREFERRED_PACKAGE_MANAGER) {
    return process.env.PREFERRED_PACKAGE_MANAGER;
  }

  // 2. ロックファイルをチェック
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(cwd, 'bun.lockb'))) {
    return 'bun';
  }
  if (fs.existsSync(path.join(cwd, 'package-lock.json'))) {
    return 'npm';
  }

  // 3. package.jsonのpackageManagerフィールドをチェック
  const packageJsonPath = path.join(cwd, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.packageManager) {
        const [manager] = packageJson.packageManager.split('@');
        return manager;
      }
    } catch (error) {
      // package.jsonの解析に失敗した場合は無視
    }
  }

  // 4. デフォルト
  return 'npm';
}

main();
