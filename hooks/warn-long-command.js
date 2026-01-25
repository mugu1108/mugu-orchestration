#!/usr/bin/env node

/**
 * 長時間実行コマンドの警告フック
 * - npm install、docker buildなどの長時間コマンドを検出して警告
 */

async function main() {
  try {
    // 環境変数からコマンドを取得
    const command = process.env.HOOK_COMMAND;

    if (!command) {
      return;
    }

    console.log('\n⏱️  長時間実行される可能性のあるコマンドを検出しました\n');
    console.log(`   コマンド: ${command}\n`);

    // コマンド別のヒント
    if (command.includes('npm install') || command.includes('npm ci')) {
      console.log('💡 ヒント:');
      console.log('   - キャッシュが効いていれば、数秒〜数十秒で完了します');
      console.log('   - 初回は数分かかる場合があります');
      console.log('');
    } else if (command.includes('supabase')) {
      console.log('💡 ヒント:');
      console.log('   - Supabaseの起動には数十秒かかります');
      console.log('   - Dockerコンテナの起動を待っています');
      console.log('');
    } else if (command.includes('docker')) {
      console.log('💡 ヒント:');
      console.log('   - Dockerイメージのビルド/プルには時間がかかります');
      console.log('   - バックグラウンドで実行することを検討してください');
      console.log('');
    }

    console.log('📌 このコマンドの実行を続行します...\n');

  } catch (error) {
    // エラーは無視
  }
}

main();
