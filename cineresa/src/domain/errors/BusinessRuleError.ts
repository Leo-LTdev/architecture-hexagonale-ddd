import DomainError from "./DomainError";

// Règle métier violée (séance commencée, plus de places, annulation tardive...)
class BusinessRuleError extends DomainError {}

export default BusinessRuleError;
