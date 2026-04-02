export const verificarAdmin = (req, res, next) => {
  try {
    if (!req.session.usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    if (req.session.usuario.tipo !== "admin") {
      return res.status(403).json({ erro: "Apenas admin pode acessar" });
    }

    next();

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro na verificação de admin" });
  }
};