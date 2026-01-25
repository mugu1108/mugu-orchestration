#!/usr/bin/env node

/**
 * git push前の確認フック
 * - ユーザーに確認を求める
 * - プッシュする内容を表示
 */

const { execSync } = require('child_process');

async function main() {
  try {
    console.log('\n⚠️  git pushを実行しようとしています\n');

    // 現在のブランチを取得
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
    }).trim();

    console.log(\`   ブランチ: \${currentBranch}\`);

    // コミット数を取得
    try {
      const commitCount = execSync(
        \`git rev-list --count origin/\${currentBranch}..HEAD\`,
        { encoding: 'utf-8', stderr: 'ignore' }
      ).trim();

      if (commitCount && commitCount !== '0') {
        console.log(\`   プッシュするコミット数: \${commitCount}件\n\`);

        // 最新のコミットメッセージを表示
        const latestCommit = execSync('git log -1 --pretty=format:"%s"', {
          encoding: 'utf-8',
        }).trim();
        console.log(\`   最新のコミット: "\${latestCommit}"\n\`);
      }
    } catch (error) {
      // リモートブランチが存在しない場合（初回プッシュ）
      console.log('   これは初回プッシュです\n');
    }

    // masterブランチへのプッシュの場合は特別な警告
    if (currentBranch === 'master' || currentBranch === 'main') {
      console.log('🚨 メインブランチへのプッシュです！');
      console.log('   本当に実行してよろしいですか？\n');
    }

    // 変更ファイルの確認
    try {
      const changedFiles = execSync('git diff --name-only HEAD~1..HEAD', {
        encoding: 'utf-8',
      }).trim();

      if (changedFiles) {
        console.log('   変更されたファイル:');
        changedFiles.split('\n').forEach((file) => {
          console.log(\`     - \${file}\`);
        });
        console.log('');
      }
    } catch (error) {
      // エラーは無視
    }

    console.log('💡 ヒント:');
    console.log('   - コミットメッセージは明確ですか？');
    console.log('   - 機密情報が含まれていませんか？');
    console.log('   - テストは通過していますか？\n');

    console.log('✅ 確認したら、pushコマンドを続行してください');

  } catch (error) {
    console.error('⚠️ pre-git-pushフックでエラーが発生しました:', error.message);
  }
}

main();
