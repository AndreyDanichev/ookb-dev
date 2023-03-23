// import model
import Items from "../models/Items.js";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { unlink } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workerPath = join(__dirname, "..", "helpers", "workers", "xlsx.js");

export const createDocument = async (req, res) => {
  try {
    const items = req.body;
    const result = (await Items.find({ name: { $in: items.items } })).map(
      (e, idx) => {
        return {
          index: idx + 1,
          name: e.latinaName ? e.latinaName : e.name,
        };
      }
    );
    const data = {
      department: items.department,
      items: [...result],
    };
    const worker = new Worker(workerPath, { workerData: data });

    worker.on("message", async (msg) => {
      await res.download(msg);
      setTimeout(() => {
        unlink(msg);
      }, 1000);
    });

    worker.on("error", (error) => {
      console.log(error);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
