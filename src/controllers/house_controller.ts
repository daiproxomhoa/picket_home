import csvParser from "csv-parser";
import { Request, Response } from "express";
import fs from "fs";

interface RowData {
  houseId: string;
  houseAddress: string;
}

const getTotalAddress = (mapHouses: Map<string, string[]>) => {
  mapHouses.forEach((addresses, houseId, map) => {
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      map.forEach((add, id) => {
        if (add.find((val) => val === address) && id !== houseId) {
          map.set(id, [...(map.get(id) ?? []), ...addresses]);
          map.delete(houseId);
          return;
        }
      });
    }
  });
  return mapHouses.size;
};

class HouseController {
  static async getTotalAddress(req: Request, res: Response) {
    try {
      const filePath = req.file?.path;
      if (!filePath) {
        return res
          .status(400)
          .json({ error: "No file uploaded. Please upload a CSV file." });
      } else {
        const uniqueHouseCount = await new Promise((resolve, reject) => {
          const uniqueHouses = new Map<string, string[]>();
          fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row: RowData) => {
              if (row.houseId && row.houseAddress)
                uniqueHouses.set(row.houseId, [
                  ...(uniqueHouses.get(row.houseId) ?? []),
                  row.houseAddress,
                ]);
            })
            .on("end", () => {
              fs.unlinkSync(filePath); // Delete the uploaded file after processing
              resolve(getTotalAddress(uniqueHouses));
            })
            .on("error", (error) => {
              reject(error);
            });
        });
        res.json({ uniqueHouses: uniqueHouseCount });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default HouseController;
