import { prisma } from "../config/db.js";

exports.addService = async (req, res) => {
  try {
    const { name, description, price, providerId } = req.body;

    if (!name || !description || !price || !providerId ) {
      return res.status(409).json({ msg: "Informações insuficientes" });
    }

    const result = await prisma.Services.create({
      data: {
        name,
        description,
        price,
        providerId
      },
    });
    return res.status(201).json({ msg: "Serviço criado com sucesso" });
  } catch (error) {
    return res.status(500).json({ mgs: "Erro no servidor" });
  }
};

exports.getServices = async (req, res) => {
  try {
    const data = await prisma.Services.findMany();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

exports.getService = async (req, res) => {
  const { id } = req.params
  try {
    const data = await prisma.Services.findUnique({
      where: { id },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

exports.putService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, providerId } = req.body;

    if (!name || !description || !price || !providerId) {
      return res.status(409).json({ msg: "Informações insuficientes" });
    }

    const result = await prisma.Services.update({
      where: { id },
      data: { name, description, price, providerId },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.Services.delete({
      where: { id },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};
