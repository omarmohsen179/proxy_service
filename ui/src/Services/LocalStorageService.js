import config from "../config";

const { localStorageTokenKey, localStorageReadIdKey } = config;

export function setWithExpiry(key, value, ttl = 900000) {
  const now = new Date();
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  let storage1 = localStorage.getItem(localStorageTokenKey);
  let storage2 = localStorage.getItem(localStorageReadIdKey);

  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  } else if (storage1 && storage2 && now.getTime() <= item.expiry) {
    const value1 = JSON.parse(storage1);
    localStorage.removeItem(localStorageTokenKey);
    setWithExpiry(localStorageTokenKey, value1.value);
    const value2 = JSON.parse(storage2);
    localStorage.removeItem(localStorageReadIdKey);
    setWithExpiry(localStorageReadIdKey, value2.value);
  }
  return item.value;
}
