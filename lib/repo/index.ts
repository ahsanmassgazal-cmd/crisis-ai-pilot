import { CrisisRepository } from "./types";
import { dexieRepository, DexieCrisisRepo } from "./mock/dexie";

export * from "./types";
export { dexieRepository, DexieCrisisRepo };

export const mockRepository: CrisisRepository = dexieRepository;

export function useRepo(): DexieCrisisRepo {
  return dexieRepository;
}
