// ==========================
// 🔐 VERIFICAR LOGIN (SESSION)
// ==========================
// export const verificarLogin = (req, res, next) => {
//   try {
//     if (!req.session.usuario) {
//       return res.status(401).json({ erro: "Usuário não autenticado" });
//     }

//     next();

//   } catch (erro) {
//     console.error(erro);
//     res.status(500).json({ erro: "Erro na autenticação" });
//   }
// };

// ==========================
// 👑 SOMENTE ADMIN
// ==========================
// export const somenteAdmin = (req, res, next) => {
//   try {
//     if (!req.session.usuario) {
//       return res.status(401).json({ erro: "Usuário não autenticado" });
//     }

//     if (req.session.usuario.tipo !== "admin") {
//       return res.status(403).json({ erro: "Acesso negado" });
//     }

//     next();

//   } catch (erro) {
//     console.error(erro);
//     res.status(500).json({ erro: "Erro na verificação de permissão" });
//   }
// };