export const VALUE_DIMENSIONS = [
  'Aesthetic',
  'Altruistic',
  'Individualistic',
  'Theoretical',
  'Economic',
  'Political',
  'Regulatory',
] as const;

export type ValueDimension = (typeof VALUE_DIMENSIONS)[number];

export type TraitFormula = {
  min: number;
  max: number;
  weight: 0 | 1 | 2 | 3;
  inverse: boolean;
};

export type RoleFormula = {
  id: string;
  name: string;
  traits: Record<ValueDimension, TraitFormula>;
};

const blank = (): TraitFormula => ({ min: 0, max: 100, weight: 0, inverse: false });

const traitsFrom = (
  partial: Partial<Record<ValueDimension, Partial<TraitFormula>>>,
): Record<ValueDimension, TraitFormula> => {
  const out = {} as Record<ValueDimension, TraitFormula>;
  for (const d of VALUE_DIMENSIONS) out[d] = { ...blank(), ...(partial[d] ?? {}) };
  return out;
};

/**
 * Seed data derived from "Values Assessment System (Bradley–Terry + Percentile
 * Engine)". Ranges and weights translate the doc's arrow notation (↑ / ↑↑ /
 * ↑↑↑ / → moderate / ↓) into numeric ideal percentile windows.
 */
export const DEFAULT_ROLE_FORMULAS: RoleFormula[] = [
  {
    id: 'web-developer',
    name: 'Web Developer',
    traits: traitsFrom({
      Theoretical: { min: 70, max: 100, weight: 2 },
      Individualistic: { min: 60, max: 100, weight: 1 },
      Regulatory: { min: 0, max: 40, weight: 1, inverse: true },
      Aesthetic: { min: 40, max: 80, weight: 1 },
    }),
  },
  {
    id: 'bookkeeper',
    name: 'Bookkeeper',
    traits: traitsFrom({
      Regulatory: { min: 75, max: 100, weight: 3 },
      Economic: { min: 40, max: 80, weight: 1 },
      Theoretical: { min: 0, max: 50, weight: 1, inverse: true },
      Individualistic: { min: 0, max: 40, weight: 1, inverse: true },
    }),
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    traits: traitsFrom({
      Aesthetic: { min: 70, max: 100, weight: 2 },
      Individualistic: { min: 60, max: 100, weight: 1 },
      Theoretical: { min: 40, max: 80, weight: 1 },
      Regulatory: { min: 0, max: 40, weight: 1, inverse: true },
    }),
  },
  {
    id: 'software-backer',
    name: 'Software Backer',
    traits: traitsFrom({
      Regulatory: { min: 60, max: 100, weight: 2 },
      Altruistic: { min: 60, max: 100, weight: 2 },
      Individualistic: { min: 0, max: 40, weight: 1, inverse: true },
      Theoretical: { min: 40, max: 80, weight: 1 },
    }),
  },
  {
    id: 'devops-backend-engineer',
    name: 'DevOps Backend Engineer',
    traits: traitsFrom({
      Regulatory: { min: 60, max: 100, weight: 2 },
      Theoretical: { min: 70, max: 100, weight: 2 },
      Individualistic: { min: 0, max: 40, weight: 1, inverse: true },
      Economic: { min: 40, max: 80, weight: 1 },
    }),
  },
];
