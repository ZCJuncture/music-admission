import Vue from 'vue';

Vue.filter('currency', (price: number) => {
  return '￥' + price.toFixed(2);
});

Vue.filter('date', (dateStr: string) => {
  const dateObj = new Date(dateStr);

  const year = dateObj.getFullYear();
  const month = addZero(dateObj.getMonth() + 1);
  const date = addZero(dateObj.getDate());

  return `${year}-${month}-${date}`;
});

Vue.filter('datetime', (dateStr: string) => {
  const dateObj = new Date(dateStr);

  const year = dateObj.getFullYear();
  const month = addZero(dateObj.getMonth() + 1);
  const date = addZero(dateObj.getDate());
  const hour = addZero(dateObj.getHours());
  const minute = addZero(dateObj.getMinutes());
  const second = addZero(dateObj.getSeconds());

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
});

function addZero(value: number) {
  if (value < 10) { return '0' + value; } else { return value; }
}
