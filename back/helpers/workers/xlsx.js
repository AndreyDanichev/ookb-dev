import XlsxTemplate from "xlsx-template";
import { parentPort, workerData } from "worker_threads";
import { basename, join } from "path";
import { currentDir } from "../helpers.js";
import { readFile, writeFile, readdir } from "fs/promises";

const __dirname = currentDir(import.meta.url);
const templatesFolder = join(__dirname, "..", "..", "files", "templates");

const template = (await readdir(templatesFolder))[0];
const tmpFile = Date.now() + template;

try {
  await readFile(join(templatesFolder, template)).then(async (file) => {
    const template = new XlsxTemplate(file);

    template.substitute(1, workerData);

    const data = await template.generate({ type: "uint8array" });

    await writeFile(join(templatesFolder, tmpFile), data).then(() => {
      parentPort.postMessage(join(templatesFolder, tmpFile));
    });
  });
} catch (error) {
  console.log(error);
}
