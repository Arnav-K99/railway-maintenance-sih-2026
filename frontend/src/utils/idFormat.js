// Presentation-layer ID simplification utility
// Maps long database IDs into concise identifiers for clean UI presentation:
// TASK-000005 -> T1, AST-120005 -> A1, etc.

const TASK_MAP = {
  'TASK-000005': 'T1',
  'TASK-000004': 'T2',
  'TASK-000210': 'T3',
  'TASK-000315': 'T4',
  'TASK-000018': 'T5',
  'TASK-000031': 'T6',
  'TASK-000044': 'T7',
  'TASK-000421': 'T8',
  'TASK-000214': 'T9',
  'TASK-000388': 'T10',
  'TASK-000892': 'T11',
  'TASK-000109': 'T12',
  'TASK-000512': 'T13',
  'TASK-000951': 'T14',
  'TASK-000012': 'T15',
  'TASK-000028': 'T16',
};

const ASSET_MAP = {
  'AST-120005': 'A1',
  'AST-120004': 'A2',
  'AST-120002': 'A3',
  'AST-120003': 'A4',
  'AST-120018': 'A5',
  'AST-120031': 'A6',
  'AST-120044': 'A7',
  'AST-120421': 'A8',
  'AST-120214': 'A9',
  'AST-120388': 'A10',
  'AST-120892': 'A11',
  'AST-120109': 'A12',
  'AST-120012': 'A15',
  'AST-120028': 'A16',
};

export const formatTaskId = (id) => {
  if (!id) return '';
  if (TASK_MAP[id]) return TASK_MAP[id];
  // Fallback: extract digits
  const match = id.match(/\d+/);
  if (match) {
    return `T${parseInt(match[0], 10)}`;
  }
  return id;
};

export const formatAssetId = (id) => {
  if (!id) return '';
  if (ASSET_MAP[id]) return ASSET_MAP[id];
  const match = id.match(/\d+/);
  if (match) {
    return `A${parseInt(match[0], 10) % 1000}`;
  }
  return id;
};

export const formatBlockId = (id) => {
  if (!id) return '';
  // Convert BLK-009637 to B9637
  return id.replace(/BLK-0*/g, 'B');
};
