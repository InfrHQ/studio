function getLocalData() {
  let userData = localStorage.getItem('userData');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
}

function setLocalData(key, data) {
  let userData = getLocalData();
  if (userData) {
    userData[key] = data;
    localStorage.setItem('userData', JSON.stringify(userData));
  } else {
    localStorage.setItem('userData', JSON.stringify({ key: data }));
  }
}

function removeLocalData() {
  localStorage.removeItem('userData');
}

export { getLocalData, setLocalData, removeLocalData };
