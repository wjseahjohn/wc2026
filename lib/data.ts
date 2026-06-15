// lib/data.ts — 2026 World Cup group stage fixtures in Singapore Time (SGT = UTC+8)
// Times verified from whensport.com/events/fifa-world-cup-2026/schedule/singapore

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
  // GROUP A — Mexico, South Africa, South Korea, Czechia
  { id:'A1', homeTeam:'Mexico', awayTeam:'South Africa', homeFlag:'🇲🇽', awayFlag:'🇿🇦', group:'A', date:'2026-06-12', time:'03:00', venue:'Estadio Azteca, Mexico City' },
  { id:'A2', homeTeam:'South Korea', awayTeam:'Czechia', homeFlag:'🇰🇷', awayFlag:'🇨🇿', group:'A', date:'2026-06-12', time:'10:00', venue:'Estadio Akron, Guadalajara' },
  { id:'A3', homeTeam:'Czechia', awayTeam:'South Africa', homeFlag:'🇨🇿', awayFlag:'🇿🇦', group:'A', date:'2026-06-19', time:'00:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'A4', homeTeam:'Mexico', awayTeam:'South Korea', homeFlag:'🇲🇽', awayFlag:'🇰🇷', group:'A', date:'2026-06-19', time:'09:00', venue:'Estadio Akron, Guadalajara' },
  { id:'A5', homeTeam:'Czechia', awayTeam:'Mexico', homeFlag:'🇨🇿', awayFlag:'🇲🇽', group:'A', date:'2026-06-25', time:'09:00', venue:'Estadio Azteca, Mexico City' },
  { id:'A6', homeTeam:'South Africa', awayTeam:'South Korea', homeFlag:'🇿🇦', awayFlag:'🇰🇷', group:'A', date:'2026-06-25', time:'09:00', venue:'Estadio BBVA, Monterrey' },

  // GROUP B — Canada, Bosnia & Herz., Qatar, Switzerland
  { id:'B1', homeTeam:'Canada', awayTeam:'Bosnia & Herz.', homeFlag:'🇨🇦', awayFlag:'🇧🇦', group:'B', date:'2026-06-13', time:'03:00', venue:'BMO Field, Toronto' },
  { id:'B2', homeTeam:'Qatar', awayTeam:'Switzerland', homeFlag:'🇶🇦', awayFlag:'🇨🇭', group:'B', date:'2026-06-14', time:'03:00', venue:"Levi's Stadium, San Francisco" },
  { id:'B3', homeTeam:'Switzerland', awayTeam:'Bosnia & Herz.', homeFlag:'🇨🇭', awayFlag:'🇧🇦', group:'B', date:'2026-06-19', time:'03:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'B4', homeTeam:'Canada', awayTeam:'Qatar', homeFlag:'🇨🇦', awayFlag:'🇶🇦', group:'B', date:'2026-06-19', time:'06:00', venue:'BC Place, Vancouver' },
  { id:'B5', homeTeam:'Bosnia & Herz.', awayTeam:'Qatar', homeFlag:'🇧🇦', awayFlag:'🇶🇦', group:'B', date:'2026-06-25', time:'03:00', venue:'Lumen Field, Seattle' },
  { id:'B6', homeTeam:'Switzerland', awayTeam:'Canada', homeFlag:'🇨🇭', awayFlag:'🇨🇦', group:'B', date:'2026-06-25', time:'03:00', venue:'BC Place, Vancouver' },

  // GROUP C — Brazil, Morocco, Haiti, Scotland
  { id:'C1', homeTeam:'Brazil', awayTeam:'Morocco', homeFlag:'🇧🇷', awayFlag:'🇲🇦', group:'C', date:'2026-06-14', time:'06:00', venue:'MetLife Stadium, New York' },
  { id:'C2', homeTeam:'Haiti', awayTeam:'Scotland', homeFlag:'🇭🇹', awayFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', group:'C', date:'2026-06-14', time:'09:00', venue:'Gillette Stadium, Boston' },
  { id:'C3', homeTeam:'Scotland', awayTeam:'Morocco', homeFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', awayFlag:'🇲🇦', group:'C', date:'2026-06-20', time:'06:00', venue:'Gillette Stadium, Boston' },
  { id:'C4', homeTeam:'Brazil', awayTeam:'Haiti', homeFlag:'🇧🇷', awayFlag:'🇭🇹', group:'C', date:'2026-06-20', time:'08:30', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'C5', homeTeam:'Scotland', awayTeam:'Brazil', homeFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', awayFlag:'🇧🇷', group:'C', date:'2026-06-25', time:'06:00', venue:'Hard Rock Stadium, Miami' },
  { id:'C6', homeTeam:'Morocco', awayTeam:'Haiti', homeFlag:'🇲🇦', awayFlag:'🇭🇹', group:'C', date:'2026-06-25', time:'06:00', venue:'Mercedes-Benz Stadium, Atlanta' },

  // GROUP D — USA, Paraguay, Australia, Turkiye
  { id:'D1', homeTeam:'USA', awayTeam:'Paraguay', homeFlag:'🇺🇸', awayFlag:'🇵🇾', group:'D', date:'2026-06-13', time:'09:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'D2', homeTeam:'Australia', awayTeam:'Turkiye', homeFlag:'🇦🇺', awayFlag:'🇹🇷', group:'D', date:'2026-06-14', time:'12:00', venue:'BC Place, Vancouver' },
  { id:'D3', homeTeam:'USA', awayTeam:'Australia', homeFlag:'🇺🇸', awayFlag:'🇦🇺', group:'D', date:'2026-06-20', time:'03:00', venue:'Lumen Field, Seattle' },
  { id:'D4', homeTeam:'Turkiye', awayTeam:'Paraguay', homeFlag:'🇹🇷', awayFlag:'🇵🇾', group:'D', date:'2026-06-20', time:'11:00', venue:"Levi's Stadium, San Francisco" },
  { id:'D5', homeTeam:'Turkiye', awayTeam:'USA', homeFlag:'🇹🇷', awayFlag:'🇺🇸', group:'D', date:'2026-06-26', time:'10:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'D6', homeTeam:'Paraguay', awayTeam:'Australia', homeFlag:'🇵🇾', awayFlag:'🇦🇺', group:'D', date:'2026-06-26', time:'10:00', venue:"Levi's Stadium, San Francisco" },

  // GROUP E — Germany, Curacao, Ivory Coast, Ecuador
  { id:'E1', homeTeam:'Germany', awayTeam:'Curacao', homeFlag:'🇩🇪', awayFlag:'🇨🇼', group:'E', date:'2026-06-15', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'E2', homeTeam:'Ivory Coast', awayTeam:'Ecuador', homeFlag:'🇨🇮', awayFlag:'🇪🇨', group:'E', date:'2026-06-15', time:'07:00', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'E3', homeTeam:'Germany', awayTeam:'Ivory Coast', homeFlag:'🇩🇪', awayFlag:'🇨🇮', group:'E', date:'2026-06-21', time:'04:00', venue:'BMO Field, Toronto' },
  { id:'E4', homeTeam:'Ecuador', awayTeam:'Curacao', homeFlag:'🇪🇨', awayFlag:'🇨🇼', group:'E', date:'2026-06-21', time:'08:00', venue:'Arrowhead Stadium, Kansas City' },
  { id:'E5', homeTeam:'Curacao', awayTeam:'Ivory Coast', homeFlag:'🇨🇼', awayFlag:'🇨🇮', group:'E', date:'2026-06-26', time:'04:00', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'E6', homeTeam:'Ecuador', awayTeam:'Germany', homeFlag:'🇪🇨', awayFlag:'🇩🇪', group:'E', date:'2026-06-26', time:'04:00', venue:'MetLife Stadium, New York' },

  // GROUP F — Netherlands, Japan, Sweden, Tunisia
  { id:'F1', homeTeam:'Netherlands', awayTeam:'Japan', homeFlag:'🇳🇱', awayFlag:'🇯🇵', group:'F', date:'2026-06-15', time:'04:00', venue:'AT&T Stadium, Dallas' },
  { id:'F2', homeTeam:'Sweden', awayTeam:'Tunisia', homeFlag:'🇸🇪', awayFlag:'🇹🇳', group:'F', date:'2026-06-15', time:'10:00', venue:'Estadio BBVA, Monterrey' },
  { id:'F3', homeTeam:'Netherlands', awayTeam:'Sweden', homeFlag:'🇳🇱', awayFlag:'🇸🇪', group:'F', date:'2026-06-21', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'F4', homeTeam:'Tunisia', awayTeam:'Japan', homeFlag:'🇹🇳', awayFlag:'🇯🇵', group:'F', date:'2026-06-21', time:'12:00', venue:'Estadio BBVA, Monterrey' },
  { id:'F5', homeTeam:'Japan', awayTeam:'Sweden', homeFlag:'🇯🇵', awayFlag:'🇸🇪', group:'F', date:'2026-06-26', time:'07:00', venue:'AT&T Stadium, Dallas' },
  { id:'F6', homeTeam:'Tunisia', awayTeam:'Netherlands', homeFlag:'🇹🇳', awayFlag:'🇳🇱', group:'F', date:'2026-06-26', time:'07:00', venue:'Arrowhead Stadium, Kansas City' },

  // GROUP G — Belgium, Egypt, Iran, New Zealand
  { id:'G1', homeTeam:'Belgium', awayTeam:'Egypt', homeFlag:'🇧🇪', awayFlag:'🇪🇬', group:'G', date:'2026-06-16', time:'03:00', venue:'Lumen Field, Seattle' },
  { id:'G2', homeTeam:'Iran', awayTeam:'New Zealand', homeFlag:'🇮🇷', awayFlag:'🇳🇿', group:'G', date:'2026-06-16', time:'09:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'G3', homeTeam:'Belgium', awayTeam:'Iran', homeFlag:'🇧🇪', awayFlag:'🇮🇷', group:'G', date:'2026-06-22', time:'03:00', venue:'SoFi Stadium, Los Angeles' },
  { id:'G4', homeTeam:'New Zealand', awayTeam:'Egypt', homeFlag:'🇳🇿', awayFlag:'🇪🇬', group:'G', date:'2026-06-22', time:'09:00', venue:'BC Place, Vancouver' },
  { id:'G5', homeTeam:'Egypt', awayTeam:'Iran', homeFlag:'🇪🇬', awayFlag:'🇮🇷', group:'G', date:'2026-06-27', time:'11:00', venue:'Lumen Field, Seattle' },
  { id:'G6', homeTeam:'New Zealand', awayTeam:'Belgium', homeFlag:'🇳🇿', awayFlag:'🇧🇪', group:'G', date:'2026-06-27', time:'11:00', venue:'BC Place, Vancouver' },

  // GROUP H — Spain, Cape Verde, Saudi Arabia, Uruguay
  { id:'H1', homeTeam:'Spain', awayTeam:'Cape Verde', homeFlag:'🇪🇸', awayFlag:'🇨🇻', group:'H', date:'2026-06-16', time:'00:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'H2', homeTeam:'Saudi Arabia', awayTeam:'Uruguay', homeFlag:'🇸🇦', awayFlag:'🇺🇾', group:'H', date:'2026-06-16', time:'06:00', venue:'Hard Rock Stadium, Miami' },
  { id:'H3', homeTeam:'Spain', awayTeam:'Saudi Arabia', homeFlag:'🇪🇸', awayFlag:'🇸🇦', group:'H', date:'2026-06-22', time:'00:00', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'H4', homeTeam:'Uruguay', awayTeam:'Cape Verde', homeFlag:'🇺🇾', awayFlag:'🇨🇻', group:'H', date:'2026-06-22', time:'06:00', venue:'Hard Rock Stadium, Miami' },
  { id:'H5', homeTeam:'Cape Verde', awayTeam:'Saudi Arabia', homeFlag:'🇨🇻', awayFlag:'🇸🇦', group:'H', date:'2026-06-27', time:'08:00', venue:'NRG Stadium, Houston' },
  { id:'H6', homeTeam:'Uruguay', awayTeam:'Spain', homeFlag:'🇺🇾', awayFlag:'🇪🇸', group:'H', date:'2026-06-27', time:'08:00', venue:'Estadio Akron, Guadalajara' },

  // GROUP I — France, Senegal, Iraq, Norway
  { id:'I1', homeTeam:'France', awayTeam:'Senegal', homeFlag:'🇫🇷', awayFlag:'🇸🇳', group:'I', date:'2026-06-17', time:'03:00', venue:'MetLife Stadium, New York' },
  { id:'I2', homeTeam:'Iraq', awayTeam:'Norway', homeFlag:'🇮🇶', awayFlag:'🇳🇴', group:'I', date:'2026-06-17', time:'06:00', venue:'Gillette Stadium, Boston' },
  { id:'I3', homeTeam:'France', awayTeam:'Iraq', homeFlag:'🇫🇷', awayFlag:'🇮🇶', group:'I', date:'2026-06-23', time:'05:00', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'I4', homeTeam:'Norway', awayTeam:'Senegal', homeFlag:'🇳🇴', awayFlag:'🇸🇳', group:'I', date:'2026-06-23', time:'08:00', venue:'MetLife Stadium, New York' },
  { id:'I5', homeTeam:'Norway', awayTeam:'France', homeFlag:'🇳🇴', awayFlag:'🇫🇷', group:'I', date:'2026-06-27', time:'03:00', venue:'Gillette Stadium, Boston' },
  { id:'I6', homeTeam:'Senegal', awayTeam:'Iraq', homeFlag:'🇸🇳', awayFlag:'🇮🇶', group:'I', date:'2026-06-27', time:'03:00', venue:'BMO Field, Toronto' },

  // GROUP J — Argentina, Algeria, Austria, Jordan
  { id:'J1', homeTeam:'Argentina', awayTeam:'Algeria', homeFlag:'🇦🇷', awayFlag:'🇩🇿', group:'J', date:'2026-06-17', time:'09:00', venue:'Arrowhead Stadium, Kansas City' },
  { id:'J2', homeTeam:'Austria', awayTeam:'Jordan', homeFlag:'🇦🇹', awayFlag:'🇯🇴', group:'J', date:'2026-06-17', time:'12:00', venue:"Levi's Stadium, San Francisco" },
  { id:'J3', homeTeam:'Argentina', awayTeam:'Austria', homeFlag:'🇦🇷', awayFlag:'🇦🇹', group:'J', date:'2026-06-23', time:'01:00', venue:'AT&T Stadium, Dallas' },
  { id:'J4', homeTeam:'Jordan', awayTeam:'Algeria', homeFlag:'🇯🇴', awayFlag:'🇩🇿', group:'J', date:'2026-06-23', time:'11:00', venue:"Levi's Stadium, San Francisco" },
  { id:'J5', homeTeam:'Algeria', awayTeam:'Austria', homeFlag:'🇩🇿', awayFlag:'🇦🇹', group:'J', date:'2026-06-28', time:'10:00', venue:'Arrowhead Stadium, Kansas City' },
  { id:'J6', homeTeam:'Jordan', awayTeam:'Argentina', homeFlag:'🇯🇴', awayFlag:'🇦🇷', group:'J', date:'2026-06-28', time:'10:00', venue:'AT&T Stadium, Dallas' },

  // GROUP K — Portugal, DR Congo, Uzbekistan, Colombia
  { id:'K1', homeTeam:'Portugal', awayTeam:'DR Congo', homeFlag:'🇵🇹', awayFlag:'🇨🇩', group:'K', date:'2026-06-18', time:'01:00', venue:'NRG Stadium, Houston' },
  { id:'K2', homeTeam:'Uzbekistan', awayTeam:'Colombia', homeFlag:'🇺🇿', awayFlag:'🇨🇴', group:'K', date:'2026-06-18', time:'10:00', venue:'Estadio Azteca, Mexico City' },
  { id:'K3', homeTeam:'Portugal', awayTeam:'Uzbekistan', homeFlag:'🇵🇹', awayFlag:'🇺🇿', group:'K', date:'2026-06-24', time:'01:00', venue:'Estadio Akron, Guadalajara' },
  { id:'K4', homeTeam:'Colombia', awayTeam:'DR Congo', homeFlag:'🇨🇴', awayFlag:'🇨🇩', group:'K', date:'2026-06-24', time:'10:00', venue:"Levi's Stadium, San Francisco" },
  { id:'K5', homeTeam:'Colombia', awayTeam:'Portugal', homeFlag:'🇨🇴', awayFlag:'🇵🇹', group:'K', date:'2026-06-28', time:'07:30', venue:'Hard Rock Stadium, Miami' },
  { id:'K6', homeTeam:'DR Congo', awayTeam:'Uzbekistan', homeFlag:'🇨🇩', awayFlag:'🇺🇿', group:'K', date:'2026-06-28', time:'07:30', venue:'Mercedes-Benz Stadium, Atlanta' },

  // GROUP L — England, Croatia, Ghana, Panama
  { id:'L1', homeTeam:'England', awayTeam:'Croatia', homeFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayFlag:'🇭🇷', group:'L', date:'2026-06-18', time:'04:00', venue:'AT&T Stadium, Dallas' },
  { id:'L2', homeTeam:'Ghana', awayTeam:'Panama', homeFlag:'🇬🇭', awayFlag:'🇵🇦', group:'L', date:'2026-06-18', time:'07:00', venue:'BMO Field, Toronto' },
  { id:'L3', homeTeam:'England', awayTeam:'Ghana', homeFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayFlag:'🇬🇭', group:'L', date:'2026-06-24', time:'04:00', venue:'Gillette Stadium, Boston' },
  { id:'L4', homeTeam:'Panama', awayTeam:'Croatia', homeFlag:'🇵🇦', awayFlag:'🇭🇷', group:'L', date:'2026-06-24', time:'07:00', venue:'BMO Field, Toronto' },
  { id:'L5', homeTeam:'Panama', awayTeam:'England', homeFlag:'🇵🇦', awayFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', group:'L', date:'2026-06-28', time:'05:00', venue:'MetLife Stadium, New York' },
  { id:'L6', homeTeam:'Croatia', awayTeam:'Ghana', homeFlag:'🇭🇷', awayFlag:'🇬🇭', group:'L', date:'2026-06-28', time:'05:00', venue:'Lincoln Financial Field, Philadelphia' },
];

export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];
