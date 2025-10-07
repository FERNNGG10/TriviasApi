import { Options } from "src/generated/prisma";
export type OptionRequest = Omit<Options, "id" | "createdAt">;
export type OptionUpdate = Partial<Options>;
