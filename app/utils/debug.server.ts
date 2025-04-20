/**
 * サーバー側デバッグログユーティリティ
 * 環境変数DEBUGがtrueまたは1の場合のみコンソールに出力します
 */

// 環境変数DEBUGの値を確認
const isDebugMode = (): boolean => {
  try {
    const debugValue = process.env.DEBUG;
    return debugValue === 'true' || debugValue === '1';
  } catch (error) {
    return false;
  }
};

/**
 * デバッグモード時のみコンソールに出力する関数
 */
export const debug = {
  log: (...args: any[]): void => {
    if (isDebugMode()) {
      console.log('[SERVER:DEBUG]', ...args);
    }
  },
  info: (...args: any[]): void => {
    if (isDebugMode()) {
      console.info('[SERVER:DEBUG:INFO]', ...args);
    }
  },
  warn: (...args: any[]): void => {
    if (isDebugMode()) {
      console.warn('[SERVER:DEBUG:WARN]', ...args);
    }
  },
  error: (...args: any[]): void => {
    if (isDebugMode()) {
      console.error('[SERVER:DEBUG:ERROR]', ...args);
    }
  }
}; 