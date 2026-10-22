import DomainError from "./DomainError";

// Donnée d'entrée invalide (email, nombre de places...)
class ValidationError extends DomainError {}

export default ValidationError;
