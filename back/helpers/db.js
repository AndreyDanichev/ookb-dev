import readXlsxFile from "read-excel-file/node";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "node:fs/promises";
import Items from "../models/Items.js";
import Types from "../models/Types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initBase = async () => {
  try {
    await Types.deleteMany({});
    await Items.deleteMany({});
    await readdir(path.join(__dirname, "..", "files", "categories"))
      .then(async (files) => {
        for await (const file of files) {
          const type = new Types({
            name: file.replace(".xlsx", ""),
          });
          await type.save();
        }
        return files;
      })
      .then(async (files) => {
        return await Promise.all(
          files.map(async (file) => {
            readXlsxFile(
              path.join(__dirname, "..", "files", "categories", file)
            ).then(async (data) => {
              for await (const row of data) {
                if (row.length === 1) {
                  const item = new Items({
                    name: row[0],
                    type: file.replace(".xlsx", ""),
                  });
                  await item.save();
                } else {
                  const item = new Items({
                    name: row[0],
                    latinaName: row[1],
                    type: file.replace(".xlsx", ""),
                  });
                  await item.save();
                }
              }
            });
          })
        );
      });
  } catch (e) {
    console.log(e.message);
  }
};
