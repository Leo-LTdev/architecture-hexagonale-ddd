// CinéResa — API de réservation de places de cinéma
// Version "historique" : tout est dans ce fichier. Ça marche… tant qu'on n'y touche pas.
import router from "./presentation/routes";
import express from "express";

const app = express();
app.use(express.json());
// On utilise les routes définies dans presentation/routes.ts
app.use(router);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`CinéResa legacy sur http://localhost:${PORT}`));
}

export default app;
