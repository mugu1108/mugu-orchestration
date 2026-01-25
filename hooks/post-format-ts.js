#!/usr/bin/env node

/**
 * TypeScriptファイル保存後の自動フォーマットと型チェックフック
 */

const { execSync } = require('child_process');
const path = require('path');

async function main() {
  try {
    // 環境変数からファイルパスを取得
    const filePath = process.env.HOOK_FILE_PATH;

    if (!filePath) {
      return;
    }

    console.log(\`📝 処理中: \${path.basename(filePath)}\`);

    // 1. Prettierでフォーマット
    try {
      execSync('npx prettier --version', { stdio: 'ignore' });
      execSync(\`npx prettier --write "\${filePath}"\`, { stdio: 'ignore' });
      console.log('  ✓ フォーマット完了');
    } catch {
      // Prettierがない場合はスキップ
    }

    // 2. TypeScript型チェック（エラーがあれば表示）
    try {
      execSync('npx tsc --version', { stdio: 'ignore' });
      execSync(\`npx tsc --noEmit "\${filePath}"\`, {
        stdio: 'pipe',
        encoding: 'utf-8',
      });
      console.log('  ✓ 型チェック完了');
    } catch (error) {
      if (error.stdout && error.stdout.includes('error TS')) {
        console.log('  ⚠️ 型エラーが検出されました');
        // エラーの詳細は表示しない（長すぎる可能性があるため）
      }
    }
  } catch (error) {
    // エラーは無視
  }
}

main();
