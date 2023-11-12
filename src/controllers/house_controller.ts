import csvParser from "csv-parser";
import { Request, Response } from "express";
import fs from "fs";

interface RowData {
  houseId: string;
  houseAddress: string;
}

const getTotalAddress = (mapHouses: RowData[]) => {
  let uniqueHousesTmp = new Map<string, string[]>();

  mapHouses.forEach((house: RowData) => {
    const tmp = uniqueHousesTmp.get(house.houseId);
    if (tmp) {
      uniqueHousesTmp.set(house.houseId, [...tmp, house.houseAddress]);
    } else {
      let isExisted = false;
      uniqueHousesTmp.forEach((list, k) => {
        if (
          list.find(
            (val) =>
              val.includes(house.houseAddress) ||
              house.houseAddress?.includes(val)
          )
        ) {
          uniqueHousesTmp.set(k, [...list, house.houseAddress]);
          isExisted = true;
        }
      });
      if (!isExisted) {
        uniqueHousesTmp.set(house.houseId, [house.houseAddress]);
      }
    }
  });
  console.log("uniqueHousesTmp", uniqueHousesTmp);

  return uniqueHousesTmp.size;
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
          const uniqueHouses: RowData[] = [];

          fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row: RowData) => {
              row.houseId && uniqueHouses.push(row);
            })
            .on("end", () => {
              fs.unlinkSync(filePath); // Delete the uploaded file after processing
              console.log("sd", uniqueHouses);

              resolve(
                getTotalAddress(
                  uniqueHouses.sort(
                    (a, b) => Number(a.houseId) - Number(b.houseId)
                  )
                )
              );
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
