#!/usr/bin/env node

/**
 * console.log警告フック
 * - コードにconsole.logが残っている場合に警告
 */

const fs = require('fs');

async function main() {
  try {
    // 環境変数からファイルパスを取得
    const filePath = process.env.HOOK_FILE_PATH;

    if (!filePath) {
      return;
    }

    // ファイルを読み込み
    const content = fs.readFileSync(filePath, 'utf-8');

    // console.logを検索
    const consoleLogPattern = /console\.(log|debug|info|warn|error)\(/g;
    const matches = content.match(consoleLogPattern);

    if (matches && matches.length > 0) {
      console.log('\n⚠️  console文が検出されました');
      console.log(`   ファイル: ${filePath}`);
      console.log(`   検出数: ${matches.length}件`);
      console.log('');
      console.log('💡 ヒント:');
      console.log('   - 本番環境用のコードからconsole文を削除してください');
      console.log('   - デバッグが必要な場合は適切なロガーを使用してください');
      console.log('');
    }
  } catch (error) {
    // エラーは無視
  }
}

main();
