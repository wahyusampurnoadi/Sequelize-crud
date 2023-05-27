const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(express.json());

const sequelize = new Sequelize("biodata_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const Biodata = sequelize.define("Biodata", {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tempat_lahir: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggal_lahir: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

app.post("/biodata", async (req, res) => {
  try {
    const { nama, tempat_lahir, tanggal_lahir, alamat } = req.body;

    const biodata = await Biodata.create({
      nama,
      tempat_lahir,
      tanggal_lahir,
      alamat,
    });

    res.status(201).json(biodata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/biodata", async (req, res) => {
  try {
    const biodatas = await Biodata.findAll();
    res.status(200).json(biodatas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/biodata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, tempat_lahir, tanggal_lahir, alamat } = req.body;

    const biodata = await Biodata.findByPk(id);
    if (!biodata) {
      return res.status(404).json({ message: "Biodata not found" });
    }

    biodata.nama = nama;
    biodata.tempat_lahir = tempat_lahir;
    biodata.tanggal_lahir = tanggal_lahir;
    biodata.alamat = alamat;

    await biodata.save();

    res.status(200).json(biodata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/biodata/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const biodata = await Biodata.findByPk(id);
    if (!biodata) {
      return res.status(404).json({ message: "Biodata not found" });
    }

    await biodata.destroy();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
