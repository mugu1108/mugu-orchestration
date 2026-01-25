#!/usr/bin/env node

/**
 * JavaScriptファイル保存後の自動フォーマットフック
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

    // Prettierが利用可能かチェック
    try {
      execSync('npx prettier --version', { stdio: 'ignore' });
    } catch {
      // Prettierがインストールされていない場合はスキップ
      return;
    }

    console.log(\`📝 フォーマット中: \${path.basename(filePath)}\`);

    // Prettierでフォーマット
    try {
      execSync(\`npx prettier --write "\${filePath}"\`, {
        stdio: 'ignore',
      });
      console.log('✅ フォーマット完了');
    } catch (error) {
      console.error('⚠️ フォーマット失敗:', error.message);
    }
  } catch (error) {
    // エラーは無視（フォーマットの失敗は致命的ではない）
  }
}

main();
