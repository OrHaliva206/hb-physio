import { MANAGER_PASS, PHYSIO_PASS } from '../config';

export function validatePassword(pwd) {
  if (pwd === MANAGER_PASS) return 'manager';
  if (pwd === PHYSIO_PASS) return 'physio';
  return null;
}
