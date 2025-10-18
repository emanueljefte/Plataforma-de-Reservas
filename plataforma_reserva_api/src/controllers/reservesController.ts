import { Request, Response } from "express";
import { prisma } from "../config/db.js";

export const postReserve = async (req: Request, res: Response) => {
  try {
    const { userId, serviceId} = req.body;
    const { sub} = req.user!;

    if (!userId ||!serviceId) {
      return res.status(409).json({ msg: "Informações insuficientes"});
}

    if (sub!== userId) {
      return res.status(403).json({ msg: "Você não tem permissão para criar neste perfil"});
}

    const user = await prisma.users.findUnique({ where: { id: userId}});
    const service = await prisma.services.findUnique({
      where: { id: serviceId},
      include: { provider: true},
});

    if (!user ||!service ||!service.provider) {
      return res.status(404).json({ msg: "Usuário ou serviço não encontrado"});
}

    if (user.balance < service.price) {
      return res.status(403).json({ msg: "Saldo insuficiente para reservar este serviço"});
}

    const [reserve] = await prisma.$transaction([
      prisma.reserves.create({
        data: {
          userId,
          serviceId,
          price: service.price,
          status: 'confirmed',
},
}),
      prisma.users.update({
        where: { id: userId},
        data: {
          balance: { decrement: service.price},
},
}),
      prisma.users.update({
        where: { id: service.provider.id},
        data: {
          balance: { increment: service.price},
},
}),
    ]);

    return res.status(201).json({ msg: "Reserva criada com sucesso", reserve});
} catch (error) {
    return res.status(500).json({ msg: "Erro no servidor"});
}
};


export const getReserves = async (req: Request, res: Response) => {
  try {
    const { sub } = req.user!;

    const data = await prisma.reserves.findMany({
      where: { userId: sub },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const getReserve = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { sub } = req.user!;

    const data = await prisma.reserves.findUnique({
      where: { id },
    });

    if (!data) {
      return res.status(404).json({ msg: "Reserva não encontrada" });
    }

    if (data.userId !== sub) {
      return res
        .status(403)
        .json({ msg: "Você não tem permissão para acessar esta reserva" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const getUserReserves = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId)
      return res.status(401).json({ msg: "Usuário não autenticado" });

    const reserves = await prisma.reserves.findMany({
      where: { userId },
      include: { service: true },
    });

    res.status(200).json(reserves);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const getReserveHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub
    if (!userId) return res.status(401).json({ msg: "Usuário não autenticado"})

    const history = await prisma.reserves.findMany({
      where: { userId},
      include: {
        service: true
},
      orderBy: {
        date: 'desc'
}
})

    res.status(200).json(history)
} catch (error) {
    console.error("Erro ao buscar histórico:", error)
    res.status(500).json({ msg: "Erro no servidor"})
}
}

export const putReserve = async (req: Request, res: Response) => {
  try {
    const { id} = req.params;
    const { userId, serviceId} = req.body;
    const { sub} = req.user!;

    if (!userId ||!serviceId) {
      return res.status(409).json({ msg: "Informações insuficientes"});
}

    if (sub!== userId) {
      return res.status(403).json({ msg: "Você não tem permissão para atualizar neste perfil"});
}

    const existingReserve = await prisma.reserves.findUnique({
      where: { id},
      include: { service: { include: { provider: true}}},
});

    if (!existingReserve) {
      return res.status(404).json({ msg: "Reserva não encontrada"});
}

    const newService = await prisma.services.findUnique({
      where: { id: serviceId},
      include: { provider: true},
});

    if (!newService ||!newService.provider) {
      return res.status(404).json({ msg: "Novo serviço não encontrado"});
}

    const user = await prisma.users.findUnique({ where: { id: userId}});
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado"});
}

    const priceDiff = newService.price - existingReserve.price;

    if (priceDiff> 0 && user.balance < priceDiff) {
      return res.status(403).json({ msg: "Saldo insuficiente para atualizar para este serviço"});
}

    const [updatedReserve] = await prisma.$transaction([
      prisma.reserves.update({
        where: { id},
        data: {
          serviceId,
          price: newService.price,
          status: 'confirmed',
},
}),
      prisma.users.update({
        where: { id: userId},
        data: {
          balance: { decrement: priceDiff> 0? priceDiff: 0},
},
}),
      prisma.users.update({
        where: { id: newService.provider.id},
        data: {
          balance: { increment: priceDiff> 0? priceDiff: 0},
},
}),
    ]);

    return res.status(200).json({ msg: "Reserva atualizada com sucesso", updatedReserve});
} catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    return res.status(500).json({ msg: "Erro no servidor"});
}
};


export const deleteReserve = async (req: Request, res: Response) => {
  try {
    const { id} = req.params;
    const { sub} = req.user!;

    const check = await prisma.reserves.findUnique({
      where: { id},
});

    if (!check) {
      return res.status(404).json({ msg: "Reserva não encontrada"});
}

    if (sub!== check.userId) {
      return res.status(403).json({ msg: "Você não tem permissão para cancelar esta reserva"});
}

    if (check.status === 'cancelled') {
      return res.status(400).json({ msg: "Reserva já está cancelada"});
}

    const result = await prisma.reserves.update({
      where: { id},
      data: {
        status: 'cancelled',
},
});

    res.status(200).json({ msg: "Reserva cancelada com sucesso", result});
} catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    res.status(500).json({ msg: "Erro no servidor"});
}
};

