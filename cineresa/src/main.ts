import { buildApp, defaultAdapters } from "./container";

const PORT = process.env.PORT || 3000;

buildApp(defaultAdapters()).listen(PORT, () => console.log(`CinéResa sur http://localhost:${PORT}`));
