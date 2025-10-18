import { Request, Response } from "express";
import { prisma } from "../config/db.js";

export const postService = async (req: Request, res: Response) => {
  try {
    const { name, description, price, providerId } = req.body;
    const { sub} = req.user!

    if (!name || !description || !price || !providerId) {
      return res.status(409).json({ msg: "Informações insuficientes" });
    }

    if (sub !== providerId) {
      return res
        .status(403)
        .json({ msg: "Você não tem permissão para criar neste perfil" });
    }

    const result = await prisma.services.create({
      data: {
        name,
        description,
        price,
        providerId,
      },
    });
    return res.status(201).json({ msg: "Serviço criado com sucesso", result });
  } catch (error) {
    return res.status(500).json({ mgs: "Erro no servidor" });
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const data = await prisma.services.findMany();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const getService = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await prisma.services.findUnique({
      where: { id },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const putService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, providerId } = req.body;

        const { sub} = req.user!
    if (sub !== providerId) {
      return res
        .status(403)
        .json({ msg: "Você não tem permissão para modificar neste perfil" });
    }

    if (!name || !description || !price || !providerId) {
      return res.status(409).json({ msg: "Informações insuficientes" });
    }

    const result = await prisma.services.update({
      where: { id },
      data: { name, description, price, providerId },
    });
    res.status(200).json({ msg: "Serviço Actualizado com sucesso", result });
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sub} = req.user!
    const check = await prisma.services.findUnique({
      where: { id },
    });
    if (!check) {
    return res
      .status(409)
      .json({ msg: "ID Inexistente" });
    
  }
    if (sub !== check.providerId) {
      return res
        .status(403)
        .json({ msg: "Você não tem permissão para eliminar neste perfil" });
      }
    const result = await prisma.services.delete({
      where: { id },
    });
    res.status(200).json({ msg: "Serviço eliminado com sucesso" });
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};
