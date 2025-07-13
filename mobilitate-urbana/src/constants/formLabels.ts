// constants/formLabels.ts

export const criteria = [
  'satisfaction',
  'safety',
  'width',
  'usability',
  'accessibility',
  'modernization',
] as const;

export type CriterionKey = typeof criteria[number];

export const criteriaLabels: Record<CriterionKey, string> = {
  satisfaction: 'Satisfacție generală',
  safety: 'Siguranță',
  width: 'Lățime',
  usability: 'Utilizabilitate',
  accessibility: 'Accesibilitate',
  modernization: 'Nivel de modernizare',
};

export const issuesInitial = {
  cars: false,
  signs: false,
  pavement: false,
  stairs: false,
  nature: false,
};

export const issueLabels: Record<keyof typeof issuesInitial, string> = {
  cars: 'Mașini parcate',
  signs: 'Semne de circulație',
  pavement: 'Gropi sau denivelări',
  stairs: 'Prezența scărilor/treptelor',
  nature: 'Natură neîngrijită',
};