// lib/data.ts — 2026 World Cup fixtures in Singapore Time (SGT = UTC+8)

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  group: string;
  date: string;
  time: string;
  venue: string;
}

export const MATCHES: Match[] = [
  // GROUP A
  { id:'A1', homeTeam:'Mexico', awayTeam:'South Africa', homeFlag:'MX', awayFlag:'ZA', group:'A', date:'2026-06-12', time:'03:00', venue:'Estadio Azteca, Mexico City' },
  { id:'A2', homeTeam:'South Korea', awayTeam:'Czechia', homeFlag:'KR', awayFlag:'CZ', group:'A', date:'2026-06-12', time:'10:00', venue:'Estadio Akron, Guadalajara' },
  { id:'A3', homeTeam:'Czechia', awayTeam:'South Africa', homeFlag:'CZ', awayFlag:'ZA', group:'A', date:'2026-06-19', time:'00:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'A4', homeTeam:'Mexico', awayTeam:'South Korea', homeFlag:'MX', awayFlag:'KR', group:'A', date:'2026-06-19', time:'09:00', venue:'Estadio Akron, Guadalajara' },
  { id:'A5', homeTeam:'Czechia', awayTeam:'Mexico', homeFlag:'CZ', awayFlag:'MX', group:'A', date:'2026-06-25', time:'09:00', venue:'Estadio Azteca, Mexico City' },
  { id:'A6', homeTeam:'South Africa', awayTeam:'South Korea', homeFlag:'ZA', awayFlag:'KR', group:'A', date:'2026-06-25', time:'09:00', venue:'Estadio BBVA, Monterrey' },
  // GROUP B
  { id:'B1', homeTeam:'Canada', awayTeam:'Bosnia & Herz.', homeFlag:'CA', awayFlag:'BA', group:'B', date:'2026-06-13', time:'03:00', venue:'BMO Field, Toronto' },
  { id:'B2', homeTeam:'Qatar', awayTeam:'Switzerland', homeFlag:'QA', awayFlag:'CH', group:'B', date:'2026-06-14', time:'03:00', venue:"Levi's Stadium, San Francisco" },
  { id:'B3', homeTeam:'Switzerland', awayTeam:'Bosnia & Herz.', homeFlag:'CH', awayFlag:'BA', group:'B', date:'2026-06-19', time:'03:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'B4', homeTeam:'Canada', awayTeam:'Qatar', homeFlag:'CA', awayFlag:'QA', group:'B', date:'2026-06-19', time:'06:00', venue:'BC Place, Vancouver' },
  { id:'B5', homeTeam:'Bosnia & Herz.', awayTeam:'Qatar', homeFlag:'BA', awayFlag:'QA', group:'B', date:'2026-06-25', time:'03:00', venue:'Lumen Field, Seattle' },
  { id:'B6', homeTeam:'Switzerland', awayTeam:'Canada', homeFlag:'CH', awayFlag:'CA', group:'B', date:'2026-06-25', time:'03:00', venue:'BC Place, Vancouver' },
  // GROUP C
  { id:'C1', homeTeam:'Brazil', awayTeam:'Morocco', homeFlag:'BR', awayFlag:'MA', group:'C', date:'2026-06-14', time:'06:00', venue:'MetLife Stadium, New York' },
  { id:'C2', homeTeam:'Haiti', awayTeam:'Scotland', homeFlag:'HT', awayFlag:'SCO', group:'C', date:'2026-06-14', time:'09:00', venue:'Gillette Stadium, Foxborough' },
  { id:'C3', homeTeam:'Scotland', awayTeam:'Morocco', homeFlag:'SCO', awayFlag:'MA', group:'C', date:'2026-06-20', time:'06:00', venue:'Gillette Stadium, Foxborough' },
  { id:'C4', homeTeam:'Brazil', awayTeam:'Haiti', homeFlag:'BR', awayFlag:'HT', group:'C', date:'2026-06-20', time:'08:30', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'C5', homeTeam:'Scotland', awayTeam:'Brazil', homeFlag:'SCO', awayFlag:'BR', group:'C', date:'2026-06-25', time:'06:00', venue:'Hard Rock Stadium, Miami' },
  { id:'C6', homeTeam:'Morocco', awayTeam:'Haiti', homeFlag:'MA', awayFlag:'HT', group:'C', date:'2026-06-25', time:'06:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  // GROUP D
  { id:'D1', homeTeam:'USA', awayTeam:'Paraguay', homeFlag:'US', awayFlag:'PY', group:'D', date:'2026-06-13', time:'09:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'D2', homeTeam:'Australia', awayTeam:'Turkiye', homeFlag:'AU', awayFlag:'TR', group:'D', date:'2026-06-14', time:'12:00', venue:'BC Place, Vancouver' },
  { id:'D3', homeTeam:'USA', awayTeam:'Australia', homeFlag:'US', awayFlag:'AU', group:'D', date:'2026-06-20', time:'03:00', venue:'Lumen Field, Seattle' },
  { id:'D4', homeTeam:'Turkiye', awayTeam:'Paraguay', homeFlag:'TR', awayFlag:'PY', group:'D', date:'2026-06-20', time:'11:00', venue:"Levi's Stadium, San Francisco" },
  { id:'D5', homeTeam:'Turkiye', awayTeam:'USA', homeFlag:'TR', awayFlag:'US', group:'D', date:'2026-06-26', time:'10:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'D6', homeTeam:'Paraguay', awayTeam:'Australia', homeFlag:'PY', awayFlag:'AU', group:'D', date:'2026-06-26', time:'10:00', venue:"Levi's Stadium, San Francisco" },
  // GROUP E
  { id:'E1', homeTeam:'Germany', awayTeam:'Curacao', homeFlag:'DE', awayFlag:'CW', group:'E', date:'2026-06-15', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'E2', homeTeam:'Ivory Coast', awayTeam:'Ecuador', homeFlag:'CI', awayFlag:'EC', group:'E', date:'2026-06-15', time:'07:00', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'E3', homeTeam:'Germany', awayTeam:'Ivory Coast', homeFlag:'DE', awayFlag:'CI', group:'E', date:'2026-06-21', time:'04:00', venue:'BMO Field, Toronto' },
  { id:'E4', homeTeam:'Ecuador', awayTeam:'Curacao', homeFlag:'EC', awayFlag:'CW', group:'E', date:'2026-06-21', time:'08:00', venue:'Arrowhead Stadium, Kansas City' },
  { id:'E5', homeTeam:'Curacao', awayTeam:'Ivory Coast', homeFlag:'CW', awayFlag:'CI', group:'E', date:'2026-06-26', time:'04:00', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'E6', homeTeam:'Ecuador', awayTeam:'Germany', homeFlag:'EC', awayFlag:'DE', group:'E', date:'2026-06-26', time:'04:00', venue:'MetLife Stadium, New York' },
  // GROUP F
  { id:'F1', homeTeam:'Netherlands', awayTeam:'Japan', homeFlag:'NL', awayFlag:'JP', group:'F', date:'2026-06-15', time:'04:00', venue:'AT&T Stadium, Dallas' },
  { id:'F2', homeTeam:'Sweden', awayTeam:'Tunisia', homeFlag:'SE', awayFlag:'TN', group:'F', date:'2026-06-15', time:'10:00', venue:'Estadio BBVA, Monterrey' },
  { id:'F3', homeTeam:'Netherlands', awayTeam:'Sweden', homeFlag:'NL', awayFlag:'SE', group:'F', date:'2026-06-21', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'F4', homeTeam:'Tunisia', awayTeam:'Japan', homeFlag:'TN', awayFlag:'JP', group:'F', date:'2026-06-21', time:'12:00', venue:'Estadio BBVA, Monterrey' },
  { id:'F5', homeTeam:'Japan', awayTeam:'Sweden', homeFlag:'JP', awayFlag:'SE', group:'F', date:'2026-06-26', time:'07:00', venue:'AT&T Stadium, Dallas' },
  { id:'F6', homeTeam:'Tunisia', awayTeam:'Netherlands', homeFlag:'TN', awayFlag:'NL', group:'F', date:'2026-06-26', time:'07:00', venue:'Arrowhead Stadium, Kansas City' },
  // GROUP G
  { id:'G1', homeTeam:'Belgium', awayTeam:'Egypt', homeFlag:'BE', awayFlag:'EG', group:'G', date:'2026-06-16', time:'03:00', venue:'Lumen Field, Seattle' },
  { id:'G2', homeTeam:'Iran', awayTeam:'New Zealand', homeFlag:'IR', awayFlag:'NZ', group:'G', date:'2026-06-16', time:'09:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'G3', homeTeam:'Belgium', awayTeam:'Iran', homeFlag:'BE', awayFlag:'IR', group:'G', date:'2026-06-22', time:'03:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'G4', homeTeam:'New Zealand', awayTeam:'Egypt', homeFlag:'NZ', awayFlag:'EG', group:'G', date:'2026-06-22', time:'09:00', venue:'BC Place, Vancouver' },
  { id:'G5', homeTeam:'Egypt', awayTeam:'Iran', homeFlag:'EG', awayFlag:'IR', group:'G', date:'2026-06-27', time:'11:00', venue:'Lumen Field, Seattle' },
  { id:'G6', homeTeam:'New Zealand', awayTeam:'Belgium', homeFlag:'NZ', awayFlag:'BE', group:'G', date:'2026-06-27', time:'11:00', venue:'BC Place, Vancouver' },
  // GROUP H
  { id:'H1', homeTeam:'Spain', awayTeam:'Cape Verde', homeFlag:'ES', awayFlag:'CV', group:'H', date:'2026-06-16', time:'00:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'H2', homeTeam:'Saudi Arabia', awayTeam:'Uruguay', homeFlag:'SA', awayFlag:'UY', group:'H', date:'2026-06-16', time:'06:00', venue:'Hard Rock Stadium, Miami' },
  { id:'H3', homeTeam:'Spain', awayTeam:'Saudi Arabia', homeFlag:'ES', awayFlag:'SA', group:'H', date:'2026-06-22', time:'00:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'H4', homeTeam:'Uruguay', awayTeam:'Cape Verde', homeFlag:'UY', awayFlag:'CV', group:'H', date:'2026-06-22', time:'06:00', venue:'Hard Rock Stadium, Miami' },
  { id:'H5', homeTeam:'Cape Verde', awayTeam:'Saudi Arabia', homeFlag:'CV', awayFlag:'SA', group:'H', date:'2026-06-27', time:'08:00', venue:'NRG Stadium, Houston' },
  { id:'H6', homeTeam:'Uruguay', awayTeam:'Spain', homeFlag:'UY', awayFlag:'ES', group:'H', date:'2026-06-27', time:'08:00', venue:'Estadio Akron, Guadalajara' },
  // GROUP I
  { id:'I1', homeTeam:'France', awayTeam:'Senegal', homeFlag:'FR', awayFlag:'SN', group:'I', date:'2026-06-17', time:'03:00', venue:'MetLife Stadium, New York' },
  { id:'I2', homeTeam:'Iraq', awayTeam:'Norway', homeFlag:'IQ', awayFlag:'NO', group:'I', date:'2026-06-17', time:'06:00', venue:'Gillette Stadium, Foxborough' },
  { id:'I3', homeTeam:'France', awayTeam:'Iraq', homeFlag:'FR', awayFlag:'IQ', group:'I', date:'2026-06-23', time:'05:00', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'I4', homeTeam:'Norway', awayTeam:'Senegal', homeFlag:'NO', awayFlag:'SN', group:'I', date:'2026-06-23', time:'08:00', venue:'MetLife Stadium, New York' },
  { id:'I5', homeTeam:'Norway', awayTeam:'France', homeFlag:'NO', awayFlag:'FR', group:'I', date:'2026-06-27', time:'03:00', venue:'Gillette Stadium, Foxborough' },
  { id:'I6', homeTeam:'Senegal', awayTeam:'Iraq', homeFlag:'SN', awayFlag:'IQ', group:'I', date:'2026-06-27', time:'03:00', venue:'BMO Field, Toronto' },
  // GROUP J
  { id:'J1', homeTeam:'Argentina', awayTeam:'Algeria', homeFlag:'AR', awayFlag:'DZ', group:'J', date:'2026-06-17', time:'09:00', venue:'Arrowhead Stadium, Kansas City' },
  { id:'J2', homeTeam:'Austria', awayTeam:'Jordan', homeFlag:'AT', awayFlag:'JO', group:'J', date:'2026-06-17', time:'12:00', venue:"Levi's Stadium, San Francisco" },
  { id:'J3', homeTeam:'Argentina', awayTeam:'Austria', homeFlag:'AR', awayFlag:'AT', group:'J', date:'2026-06-23', time:'01:00', venue:'AT&T Stadium, Dallas' },
  { id:'J4', homeTeam:'Jordan', awayTeam:'Algeria', homeFlag:'JO', awayFlag:'DZ', group:'J', date:'2026-06-23', time:'11:00', venue:"Levi's Stadium, San Francisco" },
  { id:'J5', homeTeam:'Algeria', awayTeam:'Austria', homeFlag:'DZ', awayFlag:'AT', group:'J', date:'2026-06-28', time:'10:00', venue:'Arrowhead Stadium, Kansas City' },
  { id:'J6', homeTeam:'Jordan', awayTeam:'Argentina', homeFlag:'JO', awayFlag:'AR', group:'J', date:'2026-06-28', time:'10:00', venue:'AT&T Stadium, Dallas' },
  // GROUP K
  { id:'K1', homeTeam:'Portugal', awayTeam:'DR Congo', homeFlag:'PT', awayFlag:'CD', group:'K', date:'2026-06-18', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'K2', homeTeam:'Uzbekistan', awayTeam:'Colombia', homeFlag:'UZ', awayFlag:'CO', group:'K', date:'2026-06-18', time:'10:00', venue:'Estadio Azteca, Mexico City' },
  { id:'K3', homeTeam:'Portugal', awayTeam:'Uzbekistan', homeFlag:'PT', awayFlag:'UZ', group:'K', date:'2026-06-24', time:'01:00', venue:'Estadio Akron, Guadalajara' },
  { id:'K4', homeTeam:'Colombia', awayTeam:'DR Congo', homeFlag:'CO', awayFlag:'CD', group:'K', date:'2026-06-24', time:'10:00', venue:"Levi's Stadium, San Francisco" },
  { id:'K5', homeTeam:'Colombia', awayTeam:'Portugal', homeFlag:'CO', awayFlag:'PT', group:'K', date:'2026-06-28', time:'07:30', venue:'Hard Rock Stadium, Miami' },
  { id:'K6', homeTeam:'DR Congo', awayTeam:'Uzbekistan', homeFlag:'CD', awayFlag:'UZ', group:'K', date:'2026-06-28', time:'07:30', venue:'Mercedes-Benz Stadium, Atlanta' },
  // GROUP L
  { id:'L1', homeTeam:'England', awayTeam:'Croatia', homeFlag:'ENG', awayFlag:'HR', group:'L', date:'2026-06-18', time:'04:00', venue:'AT&T Stadium, Dallas' },
  { id:'L2', homeTeam:'Ghana', awayTeam:'Panama', homeFlag:'GH', awayFlag:'PA', group:'L', date:'2026-06-18', time:'07:00', venue:'BMO Field, Toronto' },
  { id:'L3', homeTeam:'England', awayTeam:'Ghana', homeFlag:'ENG', awayFlag:'GH', group:'L', date:'2026-06-24', time:'04:00', venue:'Gillette Stadium, Foxborough' },
  { id:'L4', homeTeam:'Panama', awayTeam:'Croatia', homeFlag:'PA', awayFlag:'HR', group:'L', date:'2026-06-24', time:'07:00', venue:'BMO Field, Toronto' },
  { id:'L5', homeTeam:'Panama', awayTeam:'England', homeFlag:'PA', awayFlag:'ENG', group:'L', date:'2026-06-28', time:'05:00', venue:'MetLife Stadium, New York' },
  { id:'L6', homeTeam:'Croatia', awayTeam:'Ghana', homeFlag:'HR', awayFlag:'GH', group:'L', date:'2026-06-28', time:'05:00', venue:'Lincoln Financial Field, Philadelphia' },
  // ROUND OF 32 — Jun 28-Jul 3 ET, converted to SGT (ET+12h)
  { id:'R32_1',  homeTeam:'South Africa', awayTeam:'Canada',         homeFlag:'ZA', awayFlag:'CA',  group:'R32', date:'2026-06-29', time:'03:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'R32_2',  homeTeam:'Brazil',       awayTeam:'Japan',          homeFlag:'BR', awayFlag:'JP',  group:'R32', date:'2026-06-30', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'R32_3',  homeTeam:'Germany',      awayTeam:'Paraguay',       homeFlag:'DE', awayFlag:'PY',  group:'R32', date:'2026-06-30', time:'04:30', venue:'Gillette Stadium, Foxborough' },
  { id:'R32_4',  homeTeam:'Netherlands',  awayTeam:'Morocco',        homeFlag:'NL', awayFlag:'MA',  group:'R32', date:'2026-06-30', time:'09:00', venue:'Estadio BBVA, Monterrey' },
  { id:'R32_5',  homeTeam:'Ivory Coast',  awayTeam:'Norway',         homeFlag:'CI', awayFlag:'NO',  group:'R32', date:'2026-07-01', time:'01:00', venue:'AT&T Stadium, Dallas' },
  { id:'R32_6',  homeTeam:'France',       awayTeam:'Sweden',         homeFlag:'FR', awayFlag:'SE',  group:'R32', date:'2026-07-01', time:'05:00', venue:'MetLife Stadium, New York' },
  { id:'R32_7',  homeTeam:'Mexico',       awayTeam:'Ecuador',        homeFlag:'MX', awayFlag:'EC',  group:'R32', date:'2026-07-01', time:'09:00', venue:'Estadio Azteca, Mexico City' },
  { id:'R32_8',  homeTeam:'England',      awayTeam:'DR Congo',       homeFlag:'ENG',awayFlag:'CD',  group:'R32', date:'2026-07-02', time:'00:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'R32_9',  homeTeam:'Belgium',      awayTeam:'Senegal',        homeFlag:'BE', awayFlag:'SN',  group:'R32', date:'2026-07-02', time:'04:00', venue:'Lumen Field, Seattle' },
  { id:'R32_10', homeTeam:'USA',          awayTeam:'Bosnia & Herz.', homeFlag:'US', awayFlag:'BA',  group:'R32', date:'2026-07-02', time:'08:00', venue:"Levi's Stadium, San Francisco" },
  { id:'R32_11', homeTeam:'Spain',        awayTeam:'Austria',        homeFlag:'ES', awayFlag:'AT',  group:'R32', date:'2026-07-03', time:'03:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'R32_12', homeTeam:'Portugal',     awayTeam:'Croatia',        homeFlag:'PT', awayFlag:'HR',  group:'R32', date:'2026-07-03', time:'07:00', venue:'BMO Field, Toronto' },
  { id:'R32_13', homeTeam:'Switzerland',  awayTeam:'Algeria',        homeFlag:'CH', awayFlag:'DZ',  group:'R32', date:'2026-07-03', time:'11:00', venue:'BC Place, Vancouver' },
  { id:'R32_14', homeTeam:'Australia',    awayTeam:'Egypt',          homeFlag:'AU', awayFlag:'EG',  group:'R32', date:'2026-07-04', time:'02:00', venue:'AT&T Stadium, Dallas' },
  { id:'R32_15', homeTeam:'Argentina',    awayTeam:'Cape Verde',     homeFlag:'AR', awayFlag:'CV',  group:'R32', date:'2026-07-04', time:'06:00', venue:'Hard Rock Stadium, Miami' },
  { id:'R32_16', homeTeam:'Colombia',     awayTeam:'Ghana',          homeFlag:'CO', awayFlag:'GH',  group:'R32', date:'2026-07-04', time:'09:30', venue:'Arrowhead Stadium, Kansas City' },
  // ROUND OF 16 — Jul 4-7 ET, converted to SGT (ET+12h)
  { id:'R16_1', homeTeam:'Canada',      awayTeam:'Morocco',   homeFlag:'CA', awayFlag:'MA',  group:'R16', date:'2026-07-05', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'R16_2', homeTeam:'Paraguay',    awayTeam:'France',    homeFlag:'PY', awayFlag:'FR',  group:'R16', date:'2026-07-05', time:'05:00', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'R16_3', homeTeam:'Brazil',      awayTeam:'Norway',    homeFlag:'BR', awayFlag:'NO',  group:'R16', date:'2026-07-06', time:'04:00', venue:'MetLife Stadium, New York' },
  { id:'R16_4', homeTeam:'Mexico',      awayTeam:'England',   homeFlag:'MX', awayFlag:'ENG', group:'R16', date:'2026-07-06', time:'08:00', venue:'Estadio Azteca, Mexico City' },
  { id:'R16_5', homeTeam:'Portugal',    awayTeam:'Spain',     homeFlag:'PT', awayFlag:'ES',  group:'R16', date:'2026-07-07', time:'03:00', venue:'AT&T Stadium, Dallas' },
  { id:'R16_6', homeTeam:'USA',         awayTeam:'Belgium',   homeFlag:'US', awayFlag:'BE',  group:'R16', date:'2026-07-07', time:'08:00', venue:'Lumen Field, Seattle' },
  { id:'R16_7', homeTeam:'Argentina',   awayTeam:'Egypt',     homeFlag:'AR', awayFlag:'EG',  group:'R16', date:'2026-07-08', time:'00:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'R16_8', homeTeam:'Switzerland', awayTeam:'Colombia',  homeFlag:'CH', awayFlag:'CO',  group:'R16', date:'2026-07-08', time:'04:00', venue:'BC Place, Vancouver' },
];

export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L','R32','R16'];
