const STORAGE_PREFIX = "kwitansiklik:";

function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const testKey = `${STORAGE_PREFIX}__test__`;
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getItem<T>(key: string): T | null {
  if (!isStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify(value),
    );
    return true;
  } catch {
    // Storage penuh (quota exceeded) atau diblokir (mis. mode private) — gagal senyap.
    return false;
  }
}

export function removeItem(key: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // diblokir — tidak ada yang bisa dilakukan, abaikan.
  }
}
