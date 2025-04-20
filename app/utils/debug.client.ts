/**
 * クライアント側デバッグログユーティリティ
 * サーバー側の同等機能のクライアント向け実装
 */

/**
 * デバッグモード時のみコンソールに出力する関数
 */
export const debug = {
  log: (...args: any[]): void => {
    if (typeof window !== "undefined" && localStorage.getItem("DEBUG") === "true") {
      console.log('[CLIENT:DEBUG]', ...args);
    }
  },
  info: (...args: any[]): void => {
    if (typeof window !== "undefined" && localStorage.getItem("DEBUG") === "true") {
      console.info('[CLIENT:DEBUG:INFO]', ...args);
    }
  },
  warn: (...args: any[]): void => {
    if (typeof window !== "undefined" && localStorage.getItem("DEBUG") === "true") {
      console.warn('[CLIENT:DEBUG:WARN]', ...args);
    }
  },
  error: (...args: any[]): void => {
    if (typeof window !== "undefined" && localStorage.getItem("DEBUG") === "true") {
      console.error('[CLIENT:DEBUG:ERROR]', ...args);
    }
  }
}; 