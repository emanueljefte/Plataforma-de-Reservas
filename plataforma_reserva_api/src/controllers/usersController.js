import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const rolePermissions = {
  Provider: ['create', 'read', 'update', 'delete'],
  Client: ['create', 'read', 'update', 'delete'],
}

export const register = async (req, res) => {
  try {
    const { name, nif, email, password, user_role } = req.body;
    console.log(req.body);
    
    if (!name || !nif || !email || !password || !user_role) return res.status(409).json({ msg: "Informações insuficientes" });
    
    if (user_role !== 'Client' || user_role !== 'Provider') return res.status(409).json({msg: "Tipo de Usuário desconhecido"})
    const checkNif = await prisma.users.findUnique({
      where: { nif },
    });
    if (checkNif)
      return res.status(409).json({ msg: "NIF já em uso" });
    const checkEmail = await prisma.users.findUnique({
      where: { email },
    });
    if (checkEmail)
      return res.status(409).json({ msg: "Email já em uso" });
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await prisma.users.create({
      data: {
        name,
        nif,
        email,
        password: hashPassword,
        user_role,
      },
    });
    return res.status(201).json({ msg: "Usuário criado com sucesso" });
  } catch (error) {
    return res.status(500).json({ msg: "Erro no servidor", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(409).json({ msg: "Informações insuficientes" });
    const check = await prisma.users.findUnique({
      where: { email },
    });
    if (!check)
      return res.status(401).json({ msg: "Usuário não cadastrado" });
    const response = await bcrypt.compare(password, check.password);
    if (!response)
      return res.status(401).json({ msg: "Falha na autenticação" });
    const permissions = rolePermissions[check.user_role] || []
    const token = jwt.sign(
      {
        sub: check.id,
        role: check.user_role,
        permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
     
    return res.status(200).json({
      msg: "Usuário autenticado com sucesso",
      token,
      data: {
        name: check.name,
        nif: check.nif,
        email: check.email,
        balance: check.balance,
        user_role: check.user_role
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const data = await prisma.users.findMany();
    const newData = data.map((d) => {
        const {password, ...rest} = d
        return rest
    })
    res.status(200).json(newData);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const getUserByID = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.users.findUnique({ where: { id } });

    if (!data) {
      return res.status(404).json({ msg: "ID não encontrado" });
    }

const {password, ...rest} = data
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};
export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const data = await prisma.users.findUnique({ where: { email } });

    if (!data) {
      return res.status(404).json({ msg: "Email não encontrado" });
    }

const {password, ...rest} = data
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const getUserByNif = async (req, res) => {
  const { nif } = req.params;

  try {
    const data = await prisma.users.findUnique({ where: { nif } });

    if (!data) {
      return res.status(404).json({ msg: "NIF não encontrado" });
    }

const {password, ...rest} = data
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const putUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nif, email, user_role } = req.body;


    if (req.user.sub !== id) {
  return res.status(403).json({ msg: 'Você não tem permissão para modificar este perfil'})
}
    if (!name || !nif || !email || !user_role) {
      return res.status(409).json({ msg: "Informações insuficientes" });
    }
    if (user_role !== 'Client' && user_role !== 'Provider') return res.status(409).json({msg: "Tipo de Usuário desconhecido"})

    const checkNif = await prisma.users.findUnique({
        where: {nif}
    })
    if (checkNif && checkNif.id !== id) {
        return res.status(409).json({ msg: "NIF já em uso" });
    }
    const checkEmail = await prisma.users.findUnique({
        where: {email}
    })
    if (checkEmail && checkEmail.id !== id) {
        return res.status(409).json({ msg: "Email já em uso" });
    }
    const result = await prisma.users.update({
      where: { id },
      data: { name, nif, email, user_role },
    });
    const {password, ...rest} = result
    res.status(200).json({msg:"Actualizado com sucesso", rest});
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor", error });
  }
};

export const putUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (req.user.sub !== id) {
  return res.status(403).json({ msg: 'Você não tem permissão para modificar este perfil'})
    }
    if (!password) {
      return res.status(409).json({ msg: "Informações insuficientes" });
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const result = await prisma.users.update({
      where: { id },
      data: { password: hashPassword },
    });
    res.status(200).json({msg: "Palavra Passe Actualizado com sucesso"});
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const putUserBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { balance } = req.body;

    if (req.user.sub !== id) {
  return res.status(403).json({ msg: 'Você não tem permissão para modificar este perfil'})
    }

    if (!balance) {
      return res.status(409).json({ msg: "Informações insuficientes" });
    } else if (balance < 0) {
        return res.status(409).json({ msg: "O Saldo não pode ser negativo" });
    }

    const result = await prisma.users.update({
      where: { id },
      data: { balance },
    });
    res.status(200).json({msg: "Saldo Actualizado"});
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.sub !== id) {
  return res.status(403).json({ msg: 'Você não tem permissão para modificar este perfil'})
    }
    const result = await prisma.users.delete({
      where: { id },
    });
    res.status(200).json({msg: "Usuário Eliminado com sucesso", result});
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};
