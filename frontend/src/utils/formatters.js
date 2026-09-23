// Centralized formatting helpers for presentation layer simplification

// Static mapping for key demonstration items, with fallback pattern for all other items
const TASK_SHORT_MAP = {
  'TASK-000005': 'T1',
  'TASK-000004': 'T2',
  'TASK-000210': 'T3',
  'TASK-000315': 'T4',
  'TASK-000421': 'T5',
  'TASK-000109': 'T6',
  'TASK-000388': 'T7',
  'TASK-000512': 'T8',
  'TASK-000018': 'T9',
  'TASK-000031': 'T10',
  'TASK-000044': 'T11',
  'TASK-000012': 'T12',
  'TASK-000028': 'T13',
  'TASK-000892': 'T14',
  'TASK-000951': 'T15',
};

const ASSET_SHORT_MAP = {
  'AST-120005': 'A1',
  'AST-120004': 'A2',
  'AST-120002': 'A3',
  'AST-120003': 'A4',
  'AST-120421': 'A5',
  'AST-120109': 'A6',
  'AST-120388': 'A7',
  'AST-120512': 'A8',
  'AST-120018': 'A9',
  'AST-120031': 'A10',
  'AST-120044': 'A11',
  'AST-120012': 'A12',
  'AST-120028': 'A13',
  'AST-120892': 'A14',
  'AST-120951': 'A15',
};

export const formatTaskId = (taskId) => {
  if (!taskId) return '';
  if (TASK_SHORT_MAP[taskId]) {
    return TASK_SHORT_MAP[taskId];
  }
  // Generic numeric fallback e.g. TASK-000123 -> T123
  const num = taskId.replace(/\D/g, '');
  const parsed = parseInt(num, 10);
  return isNaN(parsed) ? taskId : `T${parsed}`;
};

export const formatAssetId = (assetId) => {
  if (!assetId) return '';
  if (ASSET_SHORT_MAP[assetId]) {
    return ASSET_SHORT_MAP[assetId];
  }
  // Generic numeric fallback e.g. AST-120045 -> A45
  const num = assetId.replace(/\D/g, '');
  const parsed = parseInt(num.slice(-3), 10);
  return isNaN(parsed) ? assetId : `A${parsed}`;
};

export const formatBlockId = (blockId) => {
  if (!blockId) return '';
  // e.g. BLK-009637 -> B9637 or preserve
  return blockId;
};
