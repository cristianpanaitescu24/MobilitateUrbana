// Keys are stored in the DB (tags), values are shown in the UI

export const TAG_LABELS: Record<string, string> = {
  cars: "Mașini parcate",
  signs: "Semne lipsă",
  blocked: "Trotuar blocat",
  surface: "Alunecos",
  overgrown: "Vegetatie crescută",
  // add more as needed
};

export const CRITERIA_LABELS: Record<string, string> = {
  satisfaction: "Satisfacție generală",
  safety: "Siguranță",
  width: "Lățime",
  usability: "Utilizabilitate",
  accessibility: "Accesibilitate",
  modernization: "Nivel de modernizare",
};