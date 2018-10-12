export function formatDate(date, ftm) {
  if (/(y+)/.test(ftm)) {
    ftm = ftm.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };

  for (let key in o) {
    if (RegExp(`(${key})`).test(ftm)) {
      let str = o[key] + '';
      ftm = ftm.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return ftm;
}

export function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
