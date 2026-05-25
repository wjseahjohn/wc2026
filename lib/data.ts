// lib/data.ts — 2026 World Cup fixtures in Singapore Time (SGT = UTC+8)
// Dates and times are the actual SGT kickoff times

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  group: string;
  date: string;   // SGT date
  time: string;   // SGT time
  venue: string;
}

export const MATCHES: Match[] = [
  // GROUP A
  { id:'A1', homeTeam:'Mexico', awayTeam:'South Africa', homeFlag:'🇲🇽', awayFlag:'🇿🇦', group:'A', date:'2026-06-12', time:'03:00', venue:'Estadio Azteca, Mexico City' },
  { id:'A2', homeTeam:'South Korea', awayTeam:'Czechia', homeFlag:'🇰🇷', awayFlag:'🇨🇿', group:'A', date:'2026-06-12', time:'10:00', venue:'Estadio Akron, Guadalajara' },
  { id:'A3', homeTeam:'Mexico', awayTeam:'South Korea', homeFlag:'🇲🇽', awayFlag:'🇰🇷', group:'A', date:'2026-06-19', time:'09:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'A4', homeTeam:'South Africa', awayTeam:'Czechia', homeFlag:'🇿🇦', awayFlag:'🇨🇿', group:'A', date:'2026-06-19', time:'06:00', venue:'Estadio BBVA, Monterrey' },
  { id:'A5', homeTeam:'Mexico', awayTeam:'Czechia', homeFlag:'🇲🇽', awayFlag:'🇨🇿', group:'A', date:'2026-06-24', time:'06:00', venue:'Estadio Azteca, Mexico City' },
  { id:'A6', homeTeam:'South Africa', awayTeam:'South Korea', homeFlag:'🇿🇦', awayFlag:'🇰🇷', group:'A', date:'2026-06-24', time:'06:00', venue:'Estadio Akron, Guadalajara' },

  // GROUP B
  { id:'B1', homeTeam:'Canada', awayTeam:'Bosnia & Herz.', homeFlag:'🇨🇦', awayFlag:'🇧🇦', group:'B', date:'2026-06-13', time:'03:00', venue:'BMO Field, Toronto' },
  { id:'B2', homeTeam:'Qatar', awayTeam:'Switzerland', homeFlag:'🇶🇦', awayFlag:'🇨🇭', group:'B', date:'2026-06-14', time:'03:00', venue:"Levi's Stadium, Santa Clara" },
  { id:'B3', homeTeam:'Canada', awayTeam:'Qatar', homeFlag:'🇨🇦', awayFlag:'🇶🇦', group:'B', date:'2026-06-20', time:'03:00', venue:'BC Place, Vancouver' },
  { id:'B4', homeTeam:'Bosnia & Herz.', awayTeam:'Switzerland', homeFlag:'🇧🇦', awayFlag:'🇨🇭', group:'B', date:'2026-06-20', time:'06:00', venue:'Arrowhead Stadium, Kansas City' },
  { id:'B5', homeTeam:'Canada', awayTeam:'Switzerland', homeFlag:'🇨🇦', awayFlag:'🇨🇭', group:'B', date:'2026-06-25', time:'06:00', venue:'Gillette Stadium, Boston' },
  { id:'B6', homeTeam:'Bosnia & Herz.', awayTeam:'Qatar', homeFlag:'🇧🇦', awayFlag:'🇶🇦', group:'B', date:'2026-06-25', time:'06:00', venue:'Lincoln Financial Field, Philadelphia' },

  // GROUP C
  { id:'C1', homeTeam:'Brazil', awayTeam:'Morocco', homeFlag:'🇧🇷', awayFlag:'🇲🇦', group:'C', date:'2026-06-14', time:'06:00', venue:'MetLife Stadium, New York' },
  { id:'C2', homeTeam:'Haiti', awayTeam:'Scotland', homeFlag:'🇭🇹', awayFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', group:'C', date:'2026-06-14', time:'09:00', venue:'Gillette Stadium, Boston' },
  { id:'C3', homeTeam:'Brazil', awayTeam:'Haiti', homeFlag:'🇧🇷', awayFlag:'🇭🇹', group:'C', date:'2026-06-20', time:'09:00', venue:'NRG Stadium, Houston' },
  { id:'C4', homeTeam:'Morocco', awayTeam:'Scotland', homeFlag:'🇲🇦', awayFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', group:'C', date:'2026-06-21', time:'03:00', venue:'MetLife Stadium, New York' },
  { id:'C5', homeTeam:'Brazil', awayTeam:'Scotland', homeFlag:'🇧🇷', awayFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', group:'C', date:'2026-06-25', time:'06:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'C6', homeTeam:'Morocco', awayTeam:'Haiti', homeFlag:'🇲🇦', awayFlag:'🇭🇹', group:'C', date:'2026-06-25', time:'06:00', venue:'Hard Rock Stadium, Miami' },

  // GROUP D
  { id:'D1', homeTeam:'USA', awayTeam:'Paraguay', homeFlag:'🇺🇸', awayFlag:'🇵🇾', group:'D', date:'2026-06-13', time:'09:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'D2', homeTeam:'Australia', awayTeam:'Turkiye', homeFlag:'🇦🇺', awayFlag:'🇹🇷', group:'D', date:'2026-06-15', time:'00:00', venue:'BC Place, Vancouver' },
  { id:'D3', homeTeam:'USA', awayTeam:'Australia', homeFlag:'🇺🇸', awayFlag:'🇦🇺', group:'D', date:'2026-06-21', time:'03:00', venue:'Lumen Field, Seattle' },
  { id:'D4', homeTeam:'Paraguay', awayTeam:'Turkiye', homeFlag:'🇵🇾', awayFlag:'🇹🇷', group:'D', date:'2026-06-21', time:'09:00', venue:'AT&T Stadium, Dallas' },
  { id:'D5', homeTeam:'USA', awayTeam:'Turkiye', homeFlag:'🇺🇸', awayFlag:'🇹🇷', group:'D', date:'2026-06-26', time:'06:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'D6', homeTeam:'Paraguay', awayTeam:'Australia', homeFlag:'🇵🇾', awayFlag:'🇦🇺', group:'D', date:'2026-06-26', time:'06:00', venue:'Arrowhead Stadium, Kansas City' },

  // GROUP E
  { id:'E1', homeTeam:'Germany', awayTeam:'Curacao', homeFlag:'🇩🇪', awayFlag:'🇨🇼', group:'E', date:'2026-06-15', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'E2', homeTeam:'Ivory Coast', awayTeam:'Ecuador', homeFlag:'🇨🇮', awayFlag:'🇪🇨', group:'E', date:'2026-06-15', time:'07:00', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'E3', homeTeam:'Germany', awayTeam:'Ivory Coast', homeFlag:'🇩🇪', awayFlag:'🇨🇮', group:'E', date:'2026-06-21', time:'06:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'E4', homeTeam:'Curacao', awayTeam:'Ecuador', homeFlag:'🇨🇼', awayFlag:'🇪🇨', group:'E', date:'2026-06-22', time:'03:00', venue:'Lumen Field, Seattle' },
  { id:'E5', homeTeam:'Germany', awayTeam:'Ecuador', homeFlag:'🇩🇪', awayFlag:'🇪🇨', group:'E', date:'2026-06-26', time:'06:00', venue:'MetLife Stadium, New York' },
  { id:'E6', homeTeam:'Curacao', awayTeam:'Ivory Coast', homeFlag:'🇨🇼', awayFlag:'🇨🇮', group:'E', date:'2026-06-26', time:'06:00', venue:'Hard Rock Stadium, Miami' },

  // GROUP F
  { id:'F1', homeTeam:'Netherlands', awayTeam:'Japan', homeFlag:'🇳🇱', awayFlag:'🇯🇵', group:'F', date:'2026-06-15', time:'04:00', venue:'AT&T Stadium, Dallas' },
  { id:'F2', homeTeam:'Sweden', awayTeam:'Tunisia', homeFlag:'🇸🇪', awayFlag:'🇹🇳', group:'F', date:'2026-06-15', time:'10:00', venue:'Estadio BBVA, Monterrey' },
  { id:'F3', homeTeam:'Netherlands', awayTeam:'Sweden', homeFlag:'🇳🇱', awayFlag:'🇸🇪', group:'F', date:'2026-06-21', time:'09:00', venue:'Gillette Stadium, Boston' },
  { id:'F4', homeTeam:'Japan', awayTeam:'Tunisia', homeFlag:'🇯🇵', awayFlag:'🇹🇳', group:'F', date:'2026-06-22', time:'06:00', venue:'NRG Stadium, Houston' },
  { id:'F5', homeTeam:'Netherlands', awayTeam:'Tunisia', homeFlag:'🇳🇱', awayFlag:'🇹🇳', group:'F', date:'2026-06-26', time:'06:00', venue:'BC Place, Vancouver' },
  { id:'F6', homeTeam:'Japan', awayTeam:'Sweden', homeFlag:'🇯🇵', awayFlag:'🇸🇪', group:'F', date:'2026-06-26', time:'06:00', venue:'Lumen Field, Seattle' },

  // GROUP G
  { id:'G1', homeTeam:'Belgium', awayTeam:'Egypt', homeFlag:'🇧🇪', awayFlag:'🇪🇬', group:'G', date:'2026-06-16', time:'01:00', venue:'Lumen Field, Seattle' },
  { id:'G2', homeTeam:'Iran', awayTeam:'New Zealand', homeFlag:'🇮🇷', awayFlag:'🇳🇿', group:'G', date:'2026-06-16', time:'04:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'G3', homeTeam:'Belgium', awayTeam:'Iran', homeFlag:'🇧🇪', awayFlag:'🇮🇷', group:'G', date:'2026-06-22', time:'03:00', venue:'Estadio Azteca, Mexico City' },
  { id:'G4', homeTeam:'Egypt', awayTeam:'New Zealand', homeFlag:'🇪🇬', awayFlag:'🇳🇿', group:'G', date:'2026-06-22', time:'06:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'G5', homeTeam:'Belgium', awayTeam:'New Zealand', homeFlag:'🇧🇪', awayFlag:'🇳🇿', group:'G', date:'2026-06-27', time:'06:00', venue:'Hard Rock Stadium, Miami' },
  { id:'G6', homeTeam:'Egypt', awayTeam:'Iran', homeFlag:'🇪🇬', awayFlag:'🇮🇷', group:'G', date:'2026-06-27', time:'06:00', venue:'Arrowhead Stadium, Kansas City' },

  // GROUP H
  { id:'H1', homeTeam:'Spain', awayTeam:'Cape Verde', homeFlag:'🇪🇸', awayFlag:'🇨🇻', group:'H', date:'2026-06-16', time:'07:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'H2', homeTeam:'Saudi Arabia', awayTeam:'Uruguay', homeFlag:'🇸🇦', awayFlag:'🇺🇾', group:'H', date:'2026-06-16', time:'10:00', venue:'Hard Rock Stadium, Miami' },
  { id:'H3', homeTeam:'Spain', awayTeam:'Saudi Arabia', homeFlag:'🇪🇸', awayFlag:'🇸🇦', group:'H', date:'2026-06-22', time:'09:00', venue:'Estadio Akron, Guadalajara' },
  { id:'H4', homeTeam:'Cape Verde', awayTeam:'Uruguay', homeFlag:'🇨🇻', awayFlag:'🇺🇾', group:'H', date:'2026-06-23', time:'03:00', venue:'Lumen Field, Seattle' },
  { id:'H5', homeTeam:'Spain', awayTeam:'Uruguay', homeFlag:'🇪🇸', awayFlag:'🇺🇾', group:'H', date:'2026-06-27', time:'06:00', venue:'NRG Stadium, Houston' },
  { id:'H6', homeTeam:'Cape Verde', awayTeam:'Saudi Arabia', homeFlag:'🇨🇻', awayFlag:'🇸🇦', group:'H', date:'2026-06-27', time:'06:00', venue:'AT&T Stadium, Dallas' },

  // GROUP I
  { id:'I1', homeTeam:'France', awayTeam:'Senegal', homeFlag:'🇫🇷', awayFlag:'🇸🇳', group:'I', date:'2026-06-17', time:'01:00', venue:'MetLife Stadium, New York' },
  { id:'I2', homeTeam:'FIFA PO 2', awayTeam:'Norway', homeFlag:'🌐', awayFlag:'🇳🇴', group:'I', date:'2026-06-17', time:'04:00', venue:'Gillette Stadium, Boston' },
  { id:'I3', homeTeam:'France', awayTeam:'FIFA PO 2', homeFlag:'🇫🇷', awayFlag:'🌐', group:'I', date:'2026-06-23', time:'03:00', venue:'NRG Stadium, Houston' },
  { id:'I4', homeTeam:'Senegal', awayTeam:'Norway', homeFlag:'🇸🇳', awayFlag:'🇳🇴', group:'I', date:'2026-06-23', time:'09:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'I5', homeTeam:'France', awayTeam:'Norway', homeFlag:'🇫🇷', awayFlag:'🇳🇴', group:'I', date:'2026-06-28', time:'06:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'I6', homeTeam:'Senegal', awayTeam:'FIFA PO 2', homeFlag:'🇸🇳', awayFlag:'🌐', group:'I', date:'2026-06-28', time:'06:00', venue:'BC Place, Vancouver' },

  // GROUP J
  { id:'J1', homeTeam:'Argentina', awayTeam:'Algeria', homeFlag:'🇦🇷', awayFlag:'🇩🇿', group:'J', date:'2026-06-17', time:'07:00', venue:'Arrowhead Stadium, Kansas City' },
  { id:'J2', homeTeam:'Austria', awayTeam:'Jordan', homeFlag:'🇦🇹', awayFlag:'🇯🇴', group:'J', date:'2026-06-17', time:'10:00', venue:"Levi's Stadium, Santa Clara" },
  { id:'J3', homeTeam:'Argentina', awayTeam:'Austria', homeFlag:'🇦🇷', awayFlag:'🇦🇹', group:'J', date:'2026-06-23', time:'06:00', venue:'AT&T Stadium, Dallas' },
  { id:'J4', homeTeam:'Algeria', awayTeam:'Jordan', homeFlag:'🇩🇿', awayFlag:'🇯🇴', group:'J', date:'2026-06-24', time:'03:00', venue:'Estadio Azteca, Mexico City' },
  { id:'J5', homeTeam:'Argentina', awayTeam:'Jordan', homeFlag:'🇦🇷', awayFlag:'🇯🇴', group:'J', date:'2026-06-28', time:'06:00', venue:'Hard Rock Stadium, Miami' },
  { id:'J6', homeTeam:'Algeria', awayTeam:'Austria', homeFlag:'🇩🇿', awayFlag:'🇦🇹', group:'J', date:'2026-06-28', time:'06:00', venue:'MetLife Stadium, New York' },

  // GROUP K
  { id:'K1', homeTeam:'Portugal', awayTeam:'FIFA PO 1', homeFlag:'🇵🇹', awayFlag:'🌐', group:'K', date:'2026-06-18', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'K2', homeTeam:'Uzbekistan', awayTeam:'Colombia', homeFlag:'🇺🇿', awayFlag:'🇨🇴', group:'K', date:'2026-06-18', time:'04:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'K3', homeTeam:'Portugal', awayTeam:'Uzbekistan', homeFlag:'🇵🇹', awayFlag:'🇺🇿', group:'K', date:'2026-06-24', time:'03:00', venue:'Estadio Akron, Guadalajara' },
  { id:'K4', homeTeam:'FIFA PO 1', awayTeam:'Colombia', homeFlag:'🌐', awayFlag:'🇨🇴', group:'K', date:'2026-06-24', time:'09:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'K5', homeTeam:'Portugal', awayTeam:'Colombia', homeFlag:'🇵🇹', awayFlag:'🇨🇴', group:'K', date:'2026-06-29', time:'06:00', venue:'Gillette Stadium, Boston' },
  { id:'K6', homeTeam:'Uzbekistan', awayTeam:'FIFA PO 1', homeFlag:'🇺🇿', awayFlag:'🌐', group:'K', date:'2026-06-29', time:'06:00', venue:'Lincoln Financial Field, Philadelphia' },

  // GROUP L
  { id:'L1', homeTeam:'England', awayTeam:'Croatia', homeFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayFlag:'🇭🇷', group:'L', date:'2026-06-18', time:'06:00', venue:'AT&T Stadium, Dallas' },
  { id:'L2', homeTeam:'Ghana', awayTeam:'Panama', homeFlag:'🇬🇭', awayFlag:'🇵🇦', group:'L', date:'2026-06-18', time:'10:00', venue:'Estadio BBVA, Monterrey' },
  { id:'L3', homeTeam:'England', awayTeam:'Ghana', homeFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayFlag:'🇬🇭', group:'L', date:'2026-06-24', time:'06:00', venue:'Arrowhead Stadium, Kansas City' },
  { id:'L4', homeTeam:'Croatia', awayTeam:'Panama', homeFlag:'🇭🇷', awayFlag:'🇵🇦', group:'L', date:'2026-06-25', time:'03:00', venue:'BC Place, Vancouver' },
  { id:'L5', homeTeam:'England', awayTeam:'Panama', homeFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayFlag:'🇵🇦', group:'L', date:'2026-06-29', time:'06:00', venue:"Levi's Stadium, Santa Clara" },
  { id:'L6', homeTeam:'Croatia', awayTeam:'Ghana', homeFlag:'🇭🇷', awayFlag:'🇬🇭', group:'L', date:'2026-06-30', time:'03:00', venue:'Estadio Azteca, Mexico City' },
];

export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];
