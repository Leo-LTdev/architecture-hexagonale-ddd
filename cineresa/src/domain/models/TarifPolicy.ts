enum TarifPolicy {
    STUDENT = "STUDENT",
    NORMAL = "NORMAL",
    SENIOR = "SENIOR",
    CHILD = "CHILD",
}

/**
 *     
 * // calcul du prix (en centimes)
    let unit = s.price;
    if (data.tariff === "STUDENT") unit = Math.round(unit * 0.7);
    let total = unit * seats;
    if (seats >= 4) total = Math.round(total * 0.9);

 * 
 */



export default TarifPolicy;