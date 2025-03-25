import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price with AED currency
export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-AE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' AED';
}

// Calculate days between two dates
export function daysBetween(start: Date, end: Date) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay));
  return diffDays;
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

// Get remaining time until a date
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function getTimeRemaining(endtime: Date): TimeRemaining {
  const total = endtime.getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

// Generate a random confirmation code
export function generateConfirmationCode() {
  return `DS-${Math.floor(10000 + Math.random() * 90000)}-LX`;
}
