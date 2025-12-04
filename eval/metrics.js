#!/usr/bin/env node

/**
 * SSDD L3 ドキュメント品質メトリクス算出スクリプト
 *
 * Usage:
 *   node metrics.js <l3-file-path>
 *   node metrics.js outputs/F-xxx.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// メトリクス基準値
const THRESHOLDS = {
  acceptanceCriteria: { min: 2, max: 7, warn: 10 },
  emptyTables: { max: 0 },
  ambiguousTerms: { max: 2, warn: 5 },
  todoMarkers: { warn: 5 }
};

// 曖昧表現パターン
const AMBIGUOUS_PATTERNS = [
  /適切に/g,
  /迅速に/g,
  /十分な?/g,
  /必要に応じて/g,
  /適宜/g,
  /など$/gm,
  /等$/gm,
];

// 単純CRUD機能では不要なセクション
const UNNECESSARY_SECTIONS_FOR_CRUD = [
  '状態遷移',
  'シーケンス',
  'CLI'
];

/**
 * L3ドキュメントを解析してメトリクスを算出
 */
function analyzeL3Document(content, options = {}) {
  const metrics = {
    // 基本メトリクス
    acceptanceCriteriaCount: countPattern(content, /#### AC-?\d+/g),
    sectionCount: countPattern(content, /^## \d+\./gm),
    emptyTableCount: countEmptyTables(content),
    todoMarkerCount: countPattern(content, /<!-- TODO:/g),
    totalLines: content.split('\n').length,

    // 品質メトリクス
    ambiguousTermCount: countAmbiguousTerms(content),

    // 構造メトリクス
    hasStateTransition: /### \d+\.\d+ 状態遷移/.test(content),
    hasSequenceDiagram: /### \d+\.\d+ シーケンス/.test(content),
    hasCLISection: /### \d+\.\d+ CLI/.test(content),

    // 整合性（オプション）
    referencedTechnologies: extractTechnologies(content),
  };

  return metrics;
}

/**
 * パターンの出現回数をカウント
 */
function countPattern(content, pattern) {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

/**
 * 空テーブル（プレースホルダーのみ）をカウント
 */
function countEmptyTables(content) {
  // [xxx] 形式のプレースホルダーが含まれるテーブル行を検出
  const placeholderRows = content.match(/\|[^|]*\[[^\]]+\][^|]*\|/g) || [];
  return placeholderRows.length;
}

/**
 * 曖昧表現をカウント
 */
function countAmbiguousTerms(content) {
  let count = 0;
  for (const pattern of AMBIGUOUS_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) count += matches.length;
  }
  return count;
}

/**
 * 言及されている技術を抽出
 */
function extractTechnologies(content) {
  const techPatterns = [
    /React/gi, /Vue/gi, /Angular/gi,
    /Express/gi, /Fastify/gi, /NestJS/gi,
    /PostgreSQL/gi, /MySQL/gi, /MongoDB/gi, /SQLite/gi,
    /Prisma/gi, /TypeORM/gi,
    /TypeScript/gi, /JavaScript/gi,
  ];

  const found = new Set();
  for (const pattern of techPatterns) {
    if (pattern.test(content)) {
      found.add(pattern.source.replace(/\\?i?g?i?$/g, ''));
    }
  }
  return Array.from(found);
}

/**
 * メトリクスを評価してレポートを生成
 */
function evaluateMetrics(metrics, options = {}) {
  const results = {
    metrics,
    evaluations: [],
    passed: true,
    summary: ''
  };

  // AC数の評価
  const acEval = evaluateRange(
    metrics.acceptanceCriteriaCount,
    THRESHOLDS.acceptanceCriteria,
    'AC数'
  );
  results.evaluations.push(acEval);
  if (acEval.status === 'fail') results.passed = false;

  // 空テーブルの評価
  const emptyTableEval = evaluateMax(
    metrics.emptyTableCount,
    THRESHOLDS.emptyTables,
    '空テーブル'
  );
  results.evaluations.push(emptyTableEval);
  if (emptyTableEval.status === 'fail') results.passed = false;

  // 曖昧表現の評価
  const ambiguousEval = evaluateMax(
    metrics.ambiguousTermCount,
    THRESHOLDS.ambiguousTerms,
    '曖昧表現'
  );
  results.evaluations.push(ambiguousEval);
  if (ambiguousEval.status === 'fail') results.passed = false;

  // 単純CRUD向け: 不要セクションの評価
  if (options.expectSimpleCrud) {
    if (metrics.hasStateTransition) {
      results.evaluations.push({
        name: '状態遷移セクション',
        value: 'あり',
        status: 'warn',
        message: '単純CRUDには不要な可能性'
      });
    }
    if (metrics.hasSequenceDiagram) {
      results.evaluations.push({
        name: 'シーケンス図',
        value: 'あり',
        status: 'warn',
        message: '単純CRUDには不要な可能性'
      });
    }
  }

  // サマリー生成
  const passCount = results.evaluations.filter(e => e.status === 'pass').length;
  const warnCount = results.evaluations.filter(e => e.status === 'warn').length;
  const failCount = results.evaluations.filter(e => e.status === 'fail').length;

  results.summary = `PASS: ${passCount}, WARN: ${warnCount}, FAIL: ${failCount}`;

  return results;
}

function evaluateRange(value, threshold, name) {
  if (value < threshold.min) {
    return { name, value, status: 'warn', message: `${threshold.min}以上推奨` };
  }
  if (threshold.warn && value > threshold.warn) {
    return { name, value, status: 'fail', message: `${threshold.warn}以下にすべき` };
  }
  if (value > threshold.max) {
    return { name, value, status: 'warn', message: `${threshold.max}以下推奨` };
  }
  return { name, value, status: 'pass', message: 'OK' };
}

function evaluateMax(value, threshold, name) {
  if (value > (threshold.warn || threshold.max)) {
    return { name, value, status: 'fail', message: `${threshold.max}以下にすべき` };
  }
  if (value > threshold.max) {
    return { name, value, status: 'warn', message: `${threshold.max}以下推奨` };
  }
  return { name, value, status: 'pass', message: 'OK' };
}

/**
 * レポートをターミナルに出力
 */
function printReport(results, filePath) {
  const statusIcon = {
    pass: '✅',
    warn: '⚠️',
    fail: '❌'
  };

  console.log('');
  console.log('┌─────────────────────────────────────────────────┐');
  console.log('│  📊 SSDD L3 品質評価レポート                    │');
  console.log('├─────────────────────────────────────────────────┤');
  console.log(`│  ファイル: ${path.basename(filePath).padEnd(35)}│`);
  console.log('├─────────────────────────────────────────────────┤');

  for (const ev of results.evaluations) {
    const icon = statusIcon[ev.status];
    const line = `${icon} ${ev.name}: ${ev.value} (${ev.message})`;
    console.log(`│  ${line.padEnd(45)}│`);
  }

  console.log('├─────────────────────────────────────────────────┤');
  const overallIcon = results.passed ? '✅' : '❌';
  console.log(`│  総合: ${overallIcon} ${results.summary.padEnd(38)}│`);
  console.log('└─────────────────────────────────────────────────┘');
  console.log('');

  // 詳細メトリクス
  console.log('詳細メトリクス:');
  console.log(`  - 総行数: ${results.metrics.totalLines}`);
  console.log(`  - セクション数: ${results.metrics.sectionCount}`);
  console.log(`  - TODOマーカー: ${results.metrics.todoMarkerCount}`);
  console.log(`  - 言及技術: ${results.metrics.referencedTechnologies.join(', ') || 'なし'}`);
  console.log('');
}

/**
 * メイン処理
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node metrics.js <l3-file-path>');
    console.error('Example: node metrics.js outputs/F-20251129-003.md');
    process.exit(1);
  }

  const filePath = args[0];
  const options = {
    expectSimpleCrud: args.includes('--simple-crud')
  };

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const metrics = analyzeL3Document(content, options);
  const results = evaluateMetrics(metrics, options);

  printReport(results, filePath);

  // JSON出力（CI用）
  if (args.includes('--json')) {
    const jsonPath = filePath.replace(/\.md$/, '-metrics.json');
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    console.log(`JSON出力: ${jsonPath}`);
  }

  process.exit(results.passed ? 0 : 1);
}

main();
