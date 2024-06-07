import { formatDistance, parseISO } from 'date-fns';
import { differenceInDays } from 'date-fns/esm';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
    value
  );

export const compareRef = (o1, o2) => {
  if (o1 && o2) {
    o1 = o1.current ?? o1;
    o2 = o2.current ?? o2;
    return stringify(o1) === stringify(o2);
  }
  return o1 === o2;
};

export const stringify = (e) => {
  if (e) {
    e = e.current ?? e;
    return String(e.tagName).toLowerCase() + '#' + e.id + '.' + e.className;
  }
  return null;
};
