import { LOCAL_STORAGE_KEY } from './../constants/Defined';



export const getLocalStorageKey = (keyString, withoutPrefix = false) => {
  return !withoutPrefix ? `${LOCAL_STORAGE_KEY.PREFIX}:${keyString}` : keyString
}

export const get = (key, withoutPrefix = false) => {
  if (typeof localStorage === 'undefined') return
  const storageKey = getLocalStorageKey(key, withoutPrefix);
  const stringData = localStorage.getItem(storageKey);
  const numberRegex = RegExp('^[1-9.]+$');
  const jsonRegex = RegExp('^[\\[|\\{].*[\\]|\\}]$');
  if (stringData === 'true' || stringData === 'false') {
    return stringData === 'true'
  } else if (stringData === 'null') {
    return null;
  } else if (stringData === 'undefined') {
    return undefined;
  } else if (numberRegex.test(stringData)) {
    return Number(stringData)
  } else if (jsonRegex.test(stringData)) {
    try {
      const data = JSON.parse(stringData);
      return data;
    } catch (error) {
      return stringData
    }
  } else {
    return stringData
  }
}

export const set = (key, data, withoutPrefix = false) => {
  if (typeof localStorage === 'undefined') return
  const storageKey = getLocalStorageKey(key, withoutPrefix);
  let stringData = undefined;
  try {
    if (typeof data === 'object') {
      stringData = JSON.stringify(data)
    } else {
      stringData = String(data);
    }
  } catch (error) {
    stringData = data
  }
  return localStorage.setItem(storageKey, stringData);
}

export const remove = (key, withoutPrefix = false) => localStorage.removeItem(getLocalStorageKey(key, withoutPrefix))

const LocalStorage = {
  get, set, remove
}

export default LocalStorage