import { prisma } from "../config/db.js";

exports.addReserve = async (req, res) => {
  try {
    const { userId, serviceId } = req.body;

    if (!userId || !serviceId ) {
      return res.status(409).json({ msg: "Informações insuficientes" });
    }

    const result = await prisma.Reserves.create({
      data: {
        userId,
        serviceId,
      },
    });
    return res.status(201).json({ msg: "Serviço criado com sucesso" });
  } catch (error) {
    return res.status(500).json({ mgs: "Erro no servidor" });
  }
};

exports.getReserves = async (req, res) => {
  try {
    const data = await prisma.Reserves.findMany();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

exports.getReserve = async (req, res) => {
  const { id } = req.params
  try {
    const data = await prisma.Reserves.findUnique({
      where: { id },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

exports.putReserve = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, serviceId } = req.body;

    if (!userId || !serviceId) {
      return res.status(409).json({ msg: "Informações insuficientes" });
    }

    const result = await prisma.Reserves.update({
      where: { id },
      data: { userId, serviceId },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

exports.deleteReserve = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.Reserves.delete({
      where: { id },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};
