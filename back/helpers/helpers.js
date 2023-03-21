import { dirname } from "path";
import { fileURLToPath } from "url";

export const currentDir = (path) => {
  return dirname(fileURLToPath(path));
};
