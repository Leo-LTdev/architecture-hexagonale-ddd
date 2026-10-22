import DomainError from "./DomainError";

// Ressource (séance, réservation) introuvable
class NotFoundError extends DomainError {}

export default NotFoundError;
