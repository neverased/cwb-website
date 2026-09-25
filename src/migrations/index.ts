import * as migration_20260908_185117_initial_cms from './20260908_185117_initial_cms';
import * as migration_20260925_193029_client_quotes from './20260925_193029_client_quotes';

export const migrations = [
  {
    up: migration_20260908_185117_initial_cms.up,
    down: migration_20260908_185117_initial_cms.down,
    name: '20260908_185117_initial_cms',
  },
  {
    up: migration_20260925_193029_client_quotes.up,
    down: migration_20260925_193029_client_quotes.down,
    name: '20260925_193029_client_quotes'
  },
];
