import React, { useState, useMemo, useCallback } from 'react';
import { Upload, DollarSign, MapPin, Users, TrendingUp } from 'lucide-react';

// Simple built-in CSV parser (no external dependencies needed)
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.replace(/"/g, '').trim());
    return headers.reduce((obj, h, i) => { obj[h] = values[i] || ''; return obj; }, {});
  }).filter(row => Object.values(row).some(v => v));
}

// Embedded tournament data
const RAW_EVENTS = [
  { match: 1, group: 'A', date: '2026-06-12', event: 'Mexico vs Canada', city: 'Mexico City', stadium: 'Azteca', pMin: 45, p25: 120, p50: 185, ticketQty: 2800, visits7d: 1200, trans7d: 89 },
  { match: 2, group: 'A', date: '2026-06-13', event: 'Argentina vs Peru', city: 'Miami', stadium: 'Inter Miami', pMin: 65, p25: 180, p50: 310, ticketQty: 1950, visits7d: 890, trans7d: 67 },
  { match: 3, group: 'A', date: '2026-06-14', event: 'Argentina vs Mexico', city: 'Los Angeles', stadium: 'SoFi', pMin: 95, p25: 320, p50: 580, ticketQty: 3200, visits7d: 2100, trans7d: 145 },
  { match: 4, group: 'A', date: '2026-06-15', event: 'Canada vs Peru', city: 'Dallas', stadium: 'Cotton Bowl', pMin: 35, p25: 90, p50: 145, ticketQty: 1850, visits7d: 620, trans7d: 42 },
  { match: 5, group: 'A', date: '2026-06-17', event: 'Mexico vs Peru', city: 'Kansas City', stadium: 'Arrowhead', pMin: 55, p25: 160, p50: 250, ticketQty: 2100, visits7d: 940, trans7d: 71 },
  { match: 6, group: 'A', date: '2026-06-17', event: 'Canada vs Argentina', city: 'Vancouver', stadium: 'BC Place', pMin: 85, p25: 240, p50: 420, ticketQty: 2650, visits7d: 1450, trans7d: 103 },
  { match: 7, group: 'B', date: '2026-06-12', event: 'France vs Netherlands', city: 'Paris', stadium: 'Stade de France', pMin: 120, p25: 380, p50: 680, ticketQty: 2200, visits7d: 1800, trans7d: 132 },
  { match: 8, group: 'B', date: '2026-06-13', event: 'Uruguay vs Egypt', city: 'Monterrey', stadium: 'BBVA', pMin: 40, p25: 110, p50: 180, ticketQty: 1600, visits7d: 540, trans7d: 38 },
  { match: 9, group: 'B', date: '2026-06-14', event: 'France vs Egypt', city: 'Houston', stadium: 'NRG', pMin: 85, p25: 250, p50: 450, ticketQty: 2400, visits7d: 1320, trans7d: 95 },
  { match: 10, group: 'B', date: '2026-06-15', event: 'Netherlands vs Uruguay', city: 'New York', stadium: 'MetLife', pMin: 75, p25: 220, p50: 380, ticketQty: 2900, visits7d: 1650, trans7d: 118 },
  { match: 11, group: 'B', date: '2026-06-17', event: 'France vs Uruguay', city: 'Philadelphia', stadium: 'Lincoln', pMin: 100, p25: 300, p50: 540, ticketQty: 2100, visits7d: 1280, trans7d: 92 },
  { match: 12, group: 'B', date: '2026-06-17', event: 'Netherlands vs Egypt', city: 'Seattle', stadium: 'Lumen', pMin: 65, p25: 190, p50: 330, ticketQty: 1950, visits7d: 890, trans7d: 63 },
  { match: 13, group: 'C', date: '2026-06-12', event: 'Spain vs Costa Rica', city: 'Boston', stadium: 'Gillette', pMin: 80, p25: 240, p50: 420, ticketQty: 2100, visits7d: 1150, trans7d: 82 },
  { match: 14, group: 'C', date: '2026-06-13', event: 'Brazil vs Serbia', city: 'Miami', stadium: 'Hard Rock', pMin: 110, p25: 340, p50: 620, ticketQty: 2800, visits7d: 1950, trans7d: 140 },
  { match: 15, group: 'C', date: '2026-06-14', event: 'Spain vs Serbia', city: 'New York', stadium: 'MetLife', pMin: 95, p25: 280, p50: 500, ticketQty: 2500, visits7d: 1420, trans7d: 102 },
  { match: 16, group: 'C', date: '2026-06-15', event: 'Brazil vs Costa Rica', city: 'Philadelphia', stadium: 'Lincoln', pMin: 85, p25: 250, p50: 440, ticketQty: 2200, visits7d: 1280, trans7d: 92 },
  { match: 17, group: 'C', date: '2026-06-17', event: 'Spain vs Brazil', city: 'Boston', stadium: 'Gillette', pMin: 140, p25: 420, p50: 750, ticketQty: 3100, visits7d: 2200, trans7d: 158 },
  { match: 18, group: 'C', date: '2026-06-17', event: 'Serbia vs Costa Rica', city: 'Dallas', stadium: 'Cotton Bowl', pMin: 45, p25: 130, p50: 220, ticketQty: 1700, visits7d: 620, trans7d: 45 },
  { match: 19, group: 'D', date: '2026-06-12', event: 'England vs Scotland', city: 'Atlanta', stadium: 'Mercedes-Benz', pMin: 100, p25: 300, p50: 540, ticketQty: 2600, visits7d: 1580, trans7d: 113 },
  { match: 20, group: 'D', date: '2026-06-13', event: 'USA vs Wales', city: 'Los Angeles', stadium: 'SoFi', pMin: 75, p25: 220, p50: 380, ticketQty: 2800, visits7d: 1620, trans7d: 116 },
  { match: 21, group: 'D', date: '2026-06-14', event: 'England vs Wales', city: 'Dallas', stadium: 'Cotton Bowl', pMin: 110, p25: 330, p50: 600, ticketQty: 2900, visits7d: 1750, trans7d: 125 },
  { match: 22, group: 'D', date: '2026-06-15', event: 'USA vs Scotland', city: 'San Francisco', stadium: 'Levi', pMin: 85, p25: 250, p50: 440, ticketQty: 2400, visits7d: 1380, trans7d: 99 },
  { match: 23, group: 'D', date: '2026-06-17', event: 'England vs USA', city: 'Kansas City', stadium: 'Arrowhead', pMin: 125, p25: 380, p50: 680, ticketQty: 3200, visits7d: 2100, trans7d: 150 },
  { match: 24, group: 'D', date: '2026-06-17', event: 'Wales vs Scotland', city: 'Vancouver', stadium: 'BC Place', pMin: 55, p25: 160, p50: 280, ticketQty: 1950, visits7d: 840, trans7d: 60 },
  { match: 25, group: 'E', date: '2026-06-11', event: 'Argentina vs Iceland', city: 'Atlanta', stadium: 'Mercedes-Benz', pMin: 65, p25: 190, p50: 330, ticketQty: 2400, visits7d: 1280, trans7d: 92 },
  { match: 26, group: 'E', date: '2026-06-12', event: 'Germany vs Japan', city: 'Houston', stadium: 'NRG', pMin: 85, p25: 250, p50: 440, ticketQty: 2200, visits7d: 1150, trans7d: 82 },
  { match: 27, group: 'E', date: '2026-06-13', event: 'Argentina vs Japan', city: 'Las Vegas', stadium: 'Allegiant', pMin: 75, p25: 220, p50: 380, ticketQty: 2100, visits7d: 980, trans7d: 70 },
  { match: 28, group: 'E', date: '2026-06-14', event: 'Germany vs Iceland', city: 'Denver', stadium: 'Mile High', pMin: 55, p25: 160, p50: 280, ticketQty: 1850, visits7d: 720, trans7d: 51 },
  { match: 29, group: 'E', date: '2026-06-16', event: 'Germany vs Argentina', city: 'Boston', stadium: 'Gillette', pMin: 130, p25: 400, p50: 720, ticketQty: 3000, visits7d: 2050, trans7d: 147 },
  { match: 30, group: 'E', date: '2026-06-16', event: 'Japan vs Iceland', city: 'Chicago', stadium: 'Soldier Field', pMin: 45, p25: 130, p50: 220, ticketQty: 1750, visits7d: 640, trans7d: 46 },
  { match: 31, group: 'F', date: '2026-06-11', event: 'Portugal vs Hungary', city: 'Kansas City', stadium: 'Arrowhead', pMin: 70, p25: 210, p50: 370, ticketQty: 2300, visits7d: 1100, trans7d: 79 },
  { match: 32, group: 'F', date: '2026-06-12', event: 'Belgium vs Morocco', city: 'Vancouver', stadium: 'BC Place', pMin: 80, p25: 240, p50: 420, ticketQty: 2000, visits7d: 950, trans7d: 68 },
  { match: 33, group: 'F', date: '2026-06-13', event: 'Portugal vs Morocco', city: 'New York', stadium: 'MetLife', pMin: 95, p25: 280, p50: 500, ticketQty: 2600, visits7d: 1420, trans7d: 102 },
  { match: 34, group: 'F', date: '2026-06-14', event: 'Belgium vs Hungary', city: 'Atlanta', stadium: 'Mercedes-Benz', pMin: 75, p25: 220, p50: 380, ticketQty: 2200, visits7d: 1150, trans7d: 82 },
  { match: 35, group: 'F', date: '2026-06-16', event: 'Belgium vs Portugal', city: 'Las Vegas', stadium: 'Allegiant', pMin: 110, p25: 330, p50: 600, ticketQty: 2800, visits7d: 1650, trans7d: 118 },
  { match: 36, group: 'F', date: '2026-06-16', event: 'Morocco vs Hungary', city: 'Los Angeles', stadium: 'SoFi', pMin: 55, p25: 160, p50: 280, ticketQty: 1900, visits7d: 820, trans7d: 59 },
  { match: 37, group: 'G', date: '2026-06-11', event: 'France vs Jamaica', city: 'New York', stadium: 'MetLife', pMin: 100, p25: 300, p50: 540, ticketQty: 2700, visits7d: 1580, trans7d: 113 },
  { match: 38, group: 'G', date: '2026-06-12', event: 'Italy vs Albania', city: 'Boston', stadium: 'Gillette', pMin: 85, p25: 250, p50: 440, ticketQty: 2100, visits7d: 1150, trans7d: 82 },
  { match: 39, group: 'G', date: '2026-06-13', event: 'France vs Albania', city: 'Philadelphia', stadium: 'Lincoln', pMin: 95, p25: 280, p50: 500, ticketQty: 2400, visits7d: 1320, trans7d: 94 },
  { match: 40, group: 'G', date: '2026-06-14', event: 'Italy vs Jamaica', city: 'Dallas', stadium: 'Cotton Bowl', pMin: 70, p25: 210, p50: 370, ticketQty: 2000, visits7d: 950, trans7d: 68 },
  { match: 41, group: 'G', date: '2026-06-16', event: 'Italy vs France', city: 'Las Vegas', stadium: 'Allegiant', pMin: 130, p25: 400, p50: 720, ticketQty: 3100, visits7d: 2100, trans7d: 150 },
  { match: 42, group: 'G', date: '2026-06-16', event: 'Albania vs Jamaica', city: 'Houston', stadium: 'NRG', pMin: 45, p25: 130, p50: 220, ticketQty: 1700, visits7d: 620, trans7d: 45 },
  { match: 43, group: 'H', date: '2026-06-11', event: 'Spain vs Costa Rica', city: 'Los Angeles', stadium: 'SoFi', pMin: 90, p25: 270, p50: 480, ticketQty: 2600, visits7d: 1450, trans7d: 104 },
  { match: 44, group: 'H', date: '2026-06-12', event: 'Germany vs Chile', city: 'Denver', stadium: 'Mile High', pMin: 75, p25: 220, p50: 380, ticketQty: 2200, visits7d: 1050, trans7d: 75 },
  { match: 45, group: 'H', date: '2026-06-13', event: 'Spain vs Chile', city: 'San Francisco', stadium: 'Levi', pMin: 85, p25: 250, p50: 440, ticketQty: 2400, visits7d: 1280, trans7d: 92 },
  { match: 46, group: 'H', date: '2026-06-14', event: 'Germany vs Costa Rica', city: 'Chicago', stadium: 'Soldier Field', pMin: 65, p25: 190, p50: 330, ticketQty: 2000, visits7d: 920, trans7d: 66 },
  { match: 47, group: 'H', date: '2026-06-16', event: 'Spain vs Germany', city: 'Miami', stadium: 'Hard Rock', pMin: 140, p25: 420, p50: 750, ticketQty: 3200, visits7d: 2150, trans7d: 154 },
  { match: 48, group: 'H', date: '2026-06-16', event: 'Chile vs Costa Rica', city: 'Monterrey', stadium: 'BBVA', pMin: 45, p25: 130, p50: 220, ticketQty: 1750, visits7d: 640, trans7d: 46 },
  { match: 49, group: 'I', date: '2026-06-10', event: 'Brazil vs Serbia', city: 'Monterrey', stadium: 'BBVA', pMin: 100, p25: 300, p50: 540, ticketQty: 2700, visits7d: 1580, trans7d: 113 },
  { match: 50, group: 'I', date: '2026-06-11', event: 'Switzerland vs Cameroon', city: 'Vancouver', stadium: 'BC Place', pMin: 65, p25: 190, p50: 330, ticketQty: 2000, visits7d: 920, trans7d: 66 },
  { match: 51, group: 'I', date: '2026-06-12', event: 'Brazil vs Cameroon', city: 'Houston', stadium: 'NRG', pMin: 85, p25: 250, p50: 440, ticketQty: 2400, visits7d: 1320, trans7d: 94 },
  { match: 52, group: 'I', date: '2026-06-13', event: 'Switzerland vs Serbia', city: 'New York', stadium: 'MetLife', pMin: 75, p25: 220, p50: 380, ticketQty: 2300, visits7d: 1200, trans7d: 86 },
  { match: 53, group: 'I', date: '2026-06-15', event: 'Brazil vs Switzerland', city: 'Philadelphia', stadium: 'Lincoln', pMin: 110, p25: 330, p50: 600, ticketQty: 2900, visits7d: 1750, trans7d: 125 },
  { match: 54, group: 'I', date: '2026-06-15', event: 'Serbia vs Cameroon', city: 'Dallas', stadium: 'Cotton Bowl', pMin: 45, p25: 130, p50: 220, ticketQty: 1800, visits7d: 680, trans7d: 49 },
  { match: 55, group: 'J', date: '2026-06-10', event: 'Poland vs Mexico', city: 'Atlanta', stadium: 'Mercedes-Benz', pMin: 80, p25: 240, p50: 420, ticketQty: 2500, visits7d: 1380, trans7d: 99 },
  { match: 56, group: 'J', date: '2026-06-11', event: 'Argentina vs Saudi Arabia', city: 'Los Angeles', stadium: 'SoFi', pMin: 70, p25: 210, p50: 370, ticketQty: 2200, visits7d: 1050, trans7d: 75 },
  { match: 57, group: 'J', date: '2026-06-12', event: 'Poland vs Saudi Arabia', city: 'Boston', stadium: 'Gillette', pMin: 55, p25: 160, p50: 280, ticketQty: 1900, visits7d: 820, trans7d: 59 },
  { match: 58, group: 'J', date: '2026-06-13', event: 'Argentina vs Mexico', city: 'Las Vegas', stadium: 'Allegiant', pMin: 125, p25: 380, p50: 680, ticketQty: 3100, visits7d: 2050, trans7d: 147 },
  { match: 59, group: 'J', date: '2026-06-15', event: 'Argentina vs Poland', city: 'Kansas City', stadium: 'Arrowhead', pMin: 105, p25: 320, p50: 580, ticketQty: 2700, visits7d: 1520, trans7d: 109 },
  { match: 60, group: 'J', date: '2026-06-15', event: 'Mexico vs Saudi Arabia', city: 'Chicago', stadium: 'Soldier Field', pMin: 65, p25: 190, p50: 330, ticketQty: 2100, visits7d: 1000, trans7d: 72 },
  { match: 61, group: 'K', date: '2026-06-10', event: 'Netherlands vs Senegal', city: 'Kansas City', stadium: 'Arrowhead', pMin: 85, p25: 250, p50: 440, ticketQty: 2300, visits7d: 1200, trans7d: 86 },
  { match: 62, group: 'K', date: '2026-06-11', event: 'Ecuador vs Qatar', city: 'Vancouver', stadium: 'BC Place', pMin: 50, p25: 145, p50: 250, ticketQty: 1850, visits7d: 750, trans7d: 54 },
  { match: 63, group: 'K', date: '2026-06-12', event: 'Netherlands vs Qatar', city: 'Houston', stadium: 'NRG', pMin: 75, p25: 220, p50: 380, ticketQty: 2200, visits7d: 1100, trans7d: 79 },
  { match: 64, group: 'K', date: '2026-06-13', event: 'Ecuador vs Senegal', city: 'Seattle', stadium: 'Lumen', pMin: 60, p25: 175, p50: 300, ticketQty: 1950, visits7d: 880, trans7d: 63 },
  { match: 65, group: 'K', date: '2026-06-15', event: 'Netherlands vs Ecuador', city: 'Boston', stadium: 'Gillette', pMin: 95, p25: 280, p50: 500, ticketQty: 2600, visits7d: 1450, trans7d: 104 },
  { match: 66, group: 'K', date: '2026-06-15', event: 'Senegal vs Qatar', city: 'Denver', stadium: 'Mile High', pMin: 40, p25: 115, p50: 200, ticketQty: 1700, visits7d: 640, trans7d: 46 },
  { match: 67, group: 'L', date: '2026-06-09', event: 'Portugal vs Tunisia', city: 'Kansas City', stadium: 'Arrowhead', pMin: 70, p25: 210, p50: 370, ticketQty: 2200, visits7d: 1050, trans7d: 75 },
  { match: 68, group: 'L', date: '2026-06-10', event: 'Belgium vs Canada', city: 'Vancouver', stadium: 'BC Place', pMin: 80, p25: 240, p50: 420, ticketQty: 2400, visits7d: 1280, trans7d: 92 },
  { match: 69, group: 'L', date: '2026-06-11', event: 'Belgium vs Tunisia', city: 'Los Angeles', stadium: 'SoFi', pMin: 85, p25: 250, p50: 440, ticketQty: 2500, visits7d: 1380, trans7d: 99 },
  { match: 70, group: 'L', date: '2026-06-12', event: 'Portugal vs Canada', city: 'Seattle', stadium: 'Lumen', pMin: 75, p25: 220, p50: 380, ticketQty: 2200, visits7d: 1150, trans7d: 82 },
  { match: 71, group: 'L', date: '2026-06-14', event: 'Belgium vs Portugal', city: 'Denver', stadium: 'Mile High', pMin: 110, p25: 330, p50: 600, ticketQty: 2800, visits7d: 1650, trans7d: 118 },
  { match: 72, group: 'L', date: '2026-06-14', event: 'Canada vs Tunisia', city: 'Chicago', stadium: 'Soldier Field', pMin: 50, p25: 145, p50: 250, ticketQty: 1900, visits7d: 820, trans7d: 59 },
];

const INVENTORY = {
  1: { qty: 85, sold: 34, cost: 12750 },
  2: { qty: 62, sold: 28, cost: 8680 },
  3: { qty: 110, sold: 67, cost: 18700 },
  4: { qty: 48, sold: 18, cost: 4320 },
  5: { qty: 75, sold: 41, cost: 10500 },
  7: { qty: 95, sold: 52, cost: 14250 },
  8: { qty: 52, sold: 19, cost: 4160 },
  9: { qty: 88, sold: 48, cost: 11000 },
  10: { qty: 110, sold: 65, cost: 17600 },
  11: { qty: 92, sold: 51, cost: 13800 },
  12: { qty: 78, sold: 35, cost: 9360 },
  13: { qty: 82, sold: 40, cost: 11480 },
  14: { qty: 105, sold: 61, cost: 16050 },
  15: { qty: 98, sold: 58, cost: 15680 },
  16: { qty: 88, sold: 48, cost: 12320 },
  17: { qty: 115, sold: 72, cost: 18400 },
  19: { qty: 105, sold: 56, cost: 15750 },
  20: { qty: 112, sold: 68, cost: 18480 },
  21: { qty: 125, sold: 78, cost: 20625 },
  22: { qty: 98, sold: 52, cost: 13720 },
  23: { qty: 135, sold: 85, cost: 24300 },
  24: { qty: 78, sold: 41, cost: 11700 },
  25: { qty: 92, sold: 48, cost: 12880 },
  26: { qty: 88, sold: 45, cost: 11000 },
  27: { qty: 82, sold: 42, cost: 10250 },
  28: { qty: 68, sold: 35, cost: 8160 },
  29: { qty: 125, sold: 78, cost: 20000 },
  30: { qty: 65, sold: 32, cost: 6500 },
  31: { qty: 85, sold: 44, cost: 11900 },
  32: { qty: 78, sold: 40, cost: 10920 },
  33: { qty: 105, sold: 61, cost: 15750 },
  34: { qty: 92, sold: 48, cost: 12880 },
  35: { qty: 115, sold: 68, cost: 18400 },
  36: { qty: 78, sold: 38, cost: 9360 },
  37: { qty: 110, sold: 65, cost: 17600 },
  38: { qty: 88, sold: 48, cost: 12320 },
  39: { qty: 98, sold: 58, cost: 14700 },
  40: { qty: 82, sold: 42, cost: 9840 },
  41: { qty: 135, sold: 82, cost: 24300 },
  42: { qty: 65, sold: 31, cost: 6500 },
  43: { qty: 108, sold: 62, cost: 15840 },
  44: { qty: 92, sold: 48, cost: 11000 },
  45: { qty: 102, sold: 56, cost: 14280 },
  46: { qty: 82, sold: 42, cost: 9840 },
  47: { qty: 142, sold: 88, cost: 25560 },
  48: { qty: 68, sold: 33, cost: 6800 },
  49: { qty: 118, sold: 70, cost: 18900 },
  50: { qty: 82, sold: 43, cost: 10920 },
  51: { qty: 105, sold: 59, cost: 13125 },
  52: { qty: 95, sold: 51, cost: 12350 },
  53: { qty: 128, sold: 75, cost: 20480 },
  54: { qty: 68, sold: 34, cost: 6800 },
  55: { qty: 105, sold: 58, cost: 15750 },
  56: { qty: 92, sold: 48, cost: 12880 },
  57: { qty: 78, sold: 40, cost: 9360 },
  58: { qty: 135, sold: 85, cost: 24300 },
  59: { qty: 115, sold: 65, cost: 18400 },
  60: { qty: 88, sold: 47, cost: 11000 },
  61: { qty: 95, sold: 51, cost: 12350 },
  62: { qty: 68, sold: 35, cost: 8160 },
  63: { qty: 92, sold: 48, cost: 11000 },
  64: { qty: 78, sold: 41, cost: 9360 },
  65: { qty: 108, sold: 62, cost: 15840 },
  66: { qty: 65, sold: 32, cost: 6500 },
  67: { qty: 92, sold: 48, cost: 12880 },
  68: { qty: 105, sold: 58, cost: 15750 },
  69: { qty: 108, sold: 61, cost: 15840 },
  70: { qty: 92, sold: 49, cost: 12880 },
  71: { qty: 125, sold: 73, cost: 20000 },
  72: { qty: 78, sold: 39, cost: 9360 },
};

const SENTIMENT = {
  'Spain': 10,
  'Argentina': 10,
  'France': 10,
  'England': 10,
  'Brazil': 10,
  'Portugal': 10,
  'Germany': 10,
  'Netherlands': 7,
  'Belgium': 7,
  'Croatia': 8,
  'Colombia': 8,
  'Uruguay': 8,
  'Switzerland': 7,
  'Mexico': 10,
  'USA': 10,
  'Canada': 10,
  'Italy': 8,
  'Japan': 6,
  'South Korea': 6,
  'Morocco': 6,
  'Senegal': 3,
  'Ecuador': 7,
  'Tunisia': 3,
  'Panama': 6,
  'Jamaica': 4,
  'Albania': 4,
  'Qatar': 4,
  'Saudi Arabia': 5,
  'Costa Rica': 5,
  'Chile': 5,
  'Cameroon': 5,
  'Hungary': 5,
};

const GROUPS = {
  'A': ['Mexico', 'Canada', 'Argentina', 'Peru'],
  'B': ['France', 'Netherlands', 'Uruguay', 'Egypt'],
  'C': ['Spain', 'Brazil', 'Serbia', 'Costa Rica'],
  'D': ['England', 'USA', 'Scotland', 'Wales'],
  'E': ['Germany', 'Argentina', 'Japan', 'Iceland'],
  'F': ['Belgium', 'Portugal', 'Morocco', 'Hungary'],
  'G': ['France', 'Italy', 'Albania', 'Jamaica'],
  'H': ['Spain', 'Germany', 'Chile', 'Costa Rica'],
  'I': ['Brazil', 'Switzerland', 'Serbia', 'Cameroon'],
  'J': ['Argentina', 'Poland', 'Mexico', 'Saudi Arabia'],
  'K': ['Netherlands', 'Ecuador', 'Senegal', 'Qatar'],
  'L': ['Belgium', 'Portugal', 'Canada', 'Tunisia'],
};

const VENUES = {
  'Mexico City': ['Match 1', 'Match 16'],
  'Miami': ['Match 2', 'Match 14', 'Match 47'],
  'Los Angeles': ['Match 3', 'Match 20', 'Match 43', 'Match 56'],
  'Dallas': ['Match 4', 'Match 21', 'Match 40', 'Match 54'],
  'Kansas City': ['Match 5', 'Match 23', 'Match 31', 'Match 55', 'Match 61'],
  'Vancouver': ['Match 6', 'Match 8', 'Match 32', 'Match 50', 'Match 62', 'Match 68'],
  'Houston': ['Match 9', 'Match 26', 'Match 51', 'Match 63'],
  'New York': ['Match 10', 'Match 33', 'Match 37', 'Match 52'],
  'Philadelphia': ['Match 11', 'Match 34', 'Match 39', 'Match 53'],
  'Seattle': ['Match 12', 'Match 70'],
  'Boston': ['Match 13', 'Match 29', 'Match 38', 'Match 57', 'Match 65'],
  'Denver': ['Match 28', 'Match 44', 'Match 66', 'Match 71'],
  'Las Vegas': ['Match 27', 'Match 35', 'Match 41', 'Match 58'],
  'San Francisco': ['Match 22', 'Match 45'],
  'Chicago': ['Match 30', 'Match 46', 'Match 60', 'Match 72'],
  'Monterrey': ['Match 8', 'Match 23', 'Match 29', 'Match 48', 'Match 49'],
};

export default function FIFASalesHub() {
  const [mode, setMode] = useState('overview');
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [selectedTeam, setSelectedTeam] = useState('Spain');
  const [selectedVenue, setSelectedVenue] = useState('Los Angeles');
  const [priceRange, setPriceRange] = useState([0, 800]);
  const [uploadedData, setUploadedData] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'match', direction: 'asc' });

  const filteredEvents = useMemo(() => {
    let result = RAW_EVENTS;

    if (mode === 'team-path') {
      result = result.filter(e => e.group === selectedGroup);
    } else if (mode === 'venue') {
      result = result.filter(e => e.city === selectedVenue);
    } else if (mode === 'price') {
      result = result.filter(e => e.p50 >= priceRange[0] && e.p50 <= priceRange[1]);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortConfig.direction === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [mode, selectedGroup, selectedVenue, priceRange, sortConfig]);

  const portfolioStats = useMemo(() => {
    const stats = { totalQty: 0, soldQty: 0, realizedPL: 0, floorValue: 0 };
    Object.values(INVENTORY).forEach(inv => {
      stats.totalQty += inv.qty;
      stats.soldQty += inv.sold;
      stats.realizedPL += (inv.qty - inv.sold) > 0 ? 0 : inv.cost;
    });
    filteredEvents.forEach(event => {
      if (INVENTORY[event.match]) {
        const inv = INVENTORY[event.match];
        const unsold = inv.qty - inv.sold;
        stats.floorValue += unsold * event.p25;
      }
    });
    return stats;
  }, [filteredEvents]);

  const handleFileUpload = useCallback(e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const data = parseCSV(evt.target.result);
      if (!data.length) return;
      if (data[0]?.['Match #'] !== undefined && data[0]?.['Price Min'] !== undefined) {
        setUploadedData({ type: 'discovery', data });
      } else if (data[0]?.['Total Qty'] !== undefined) {
        setUploadedData({ type: 'inventory', data });
      } else if (data[0]?.['Unit Cost'] !== undefined) {
        setUploadedData({ type: 'event-by-event', data });
      } else {
        setUploadedData({ type: 'unknown', data });
      }
    };
    reader.readAsText(file);
  }, []);

  const handleSort = column => {
    const direction = sortConfig.key === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: column, direction });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            FIFA 2026 Sales Hub
          </h1>
          <p className="text-slate-400">Real-time ticket market intelligence & portfolio management</p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { id: 'overview', label: 'Portfolio Overview', icon: TrendingUp },
            { id: 'team-path', label: 'Team Path Tracker', icon: Users },
            { id: 'venue', label: 'Venue Scout', icon: MapPin },
            { id: 'price', label: 'Price Hunter', icon: DollarSign }
          ].map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-4 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  mode === m.id
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200'
                    : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon size={18} />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Control Panels */}
        {mode === 'team-path' && (
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <label className="text-sm text-slate-400 mb-2 block">Select Group</label>
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
            >
              {Object.keys(GROUPS).map(g => (
                <option key={g} value={g}>Group {g} - {GROUPS[g].join(', ')}</option>
              ))}
            </select>
          </div>
        )}

        {mode === 'venue' && (
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <label className="text-sm text-slate-400 mb-2 block">Select Venue</label>
            <select
              value={selectedVenue}
              onChange={e => setSelectedVenue(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
            >
              {Object.keys(VENUES).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        )}

        {mode === 'price' && (
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <label className="text-sm text-slate-400 mb-4 block">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="800"
              value={priceRange[1]}
              onChange={e => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        )}

        {/* File Upload */}
        <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <Upload size={16} />
            <span>Upload CSV (Discovery / Inventory / Event Data)</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {uploadedData.type && (
            <p className="text-xs text-green-400 mt-2">✓ {uploadedData.type} CSV loaded ({uploadedData.data?.length} rows)</p>
          )}
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Total Tickets</div>
            <div className="text-2xl font-bold text-cyan-400">{portfolioStats.totalQty}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Sold</div>
            <div className="text-2xl font-bold text-green-400">{portfolioStats.soldQty}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Realized P&L</div>
            <div className="text-2xl font-bold text-amber-400">${portfolioStats.realizedPL.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Floor Value (P25)</div>
            <div className="text-2xl font-bold text-blue-400">${portfolioStats.floorValue.toLocaleString()}</div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/30">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/80 border-b border-slate-700">
              <tr>
                {['match', 'event', 'date', 'city', 'pMin', 'p25', 'p50', 'sentiment'].map(col => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="px-4 py-3 text-left font-semibold text-cyan-400 cursor-pointer hover:bg-slate-700/30"
                  >
                    {col.toUpperCase()} ↕
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.match} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="px-4 py-3 font-semibold text-cyan-300">#{event.match}</td>
                  <td className="px-4 py-3">{event.event}</td>
                  <td className="px-4 py-3 text-slate-400">{event.date}</td>
                  <td className="px-4 py-3 text-slate-300">{event.city}</td>
                  <td className="px-4 py-3 text-green-400">${event.pMin}</td>
                  <td className="px-4 py-3 text-blue-400">${event.p25}</td>
                  <td className="px-4 py-3 text-amber-400 font-semibold">${event.p50}</td>
                  <td className="px-4 py-3">{SENTIMENT[event.event.split(' vs ')[0]] || SENTIMENT[event.event.split(' vs ')[1]] || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
