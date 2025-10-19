interface User {
  name: string;
  email: string;
  nif: string;
}

interface resetPassword {
    nif: string;
  password: string;
  oldPassword: string;
}


// ✅ Função de validação do perfil
export const validateProfile = (data: User) => {
      let err: string | null = null;
    if (!data.name.trim() || !data.nif.trim() || !data.email.trim()) {
        err = "Por favor, preencha todos os campos obrigatórios.";
      return err;
    }

    // Validação de nome (sem números nem caracteres especiais)
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!nameRegex.test(data.name)) {
        err = "Por favor, sem números nem caracteres especiais.";
      return err;
    }

    // Validação de NIF (9 dígitos + 2 letras + 3 dígitos)
    const nifRegex = /^\d{9}[A-Za-z]{2}\d{3}$/;
    if (!nifRegex.test(data.nif)) {
        err = "Por favor, coloque como está no seu Bilhete de Identificação.";
      return err;
    }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        err = "Por favor, preencha um e-mail válido.";
      return err;
    }
    err = null;
    return err
  };

  // ✅ Função de validação do reset de senha
  export const validatePasswordReset = (data: resetPassword) => {
    let err: string | null = null;
    if (!data.nif.trim() || !data.oldPassword.trim() || !data.password.trim()) {
      err = "Todos os campos são obrigatórios.";
      return err;
    }
    if (data.password.length < 6) {
      err = "A nova palavra-passe deve ter pelo menos 6 caracteres.";
      return err;
    }
    err = null
    return err
  };