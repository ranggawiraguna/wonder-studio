import { id as idLocale } from 'date-fns/locale';
import { format } from 'date-fns';

const moneyFormatter = (value) => {
  const money = Array.from(value.toString().split('').reverse()).join('');

  let text = [];

  for (let i = 1; i <= Math.floor(money.length / 3) + 1; i++) {
    if (money.length > (i - 1) * 3 + 3) {
      text = [...text, money.substring((i - 1) * 3, (i - 1) * 3 + 3), '.'];
    } else if (money.length === (i - 1) * 3 + 3) {
      text.push(money.substring((i - 1) * 3, (i - 1) * 3 + 3));
    } else {
      text.push(money.substring(Math.floor(money.length / 3) * 3, money.length));
    }
  }

  return `Rp. ${[...text.join('').split('').reverse()].join('')}`;
};

const dateFormatter = (date, stringFormat) => {
  let value = '';
  try {
    value = format(date ? date : new Date(), stringFormat, { locale: idLocale });
  } catch (e) {
    value = format(date ? dateConverter(date) : new Date(), stringFormat, { locale: idLocale });
  }

  return value;
};

const dateConverter = (value) => {
  try {
    return value.toDate();
  } catch (_) {
    return new Date();
  }
};

const stringCapitalize = (text) => {  
  return text.toString().length > 0
    ? text
        .split(' ')
        .map((_) => (_.toString().length > 0 ? _[0].toUpperCase() + (_.length > 1 ? _.substring(1) : '') : ''))
        .join(' ')
    : '';
};

export { moneyFormatter, dateFormatter, dateConverter, stringCapitalize };
