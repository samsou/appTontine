export interface Client {
    id?: any;
    name?: string;
    firstName?: string;
    quartier?: string;
    maison?: string;
    telephone?: string;
    profession?: string;
    activiteExerce?: string;
    lieuExercice?: string;
    numCarte?: string;
    email?: string;
    date?: any;
}
export interface Compte {
    id?: any;
    idClient?: any;
    client?: Client,
    typeCompte?: string;
    montantSouscritTontine?: any;
    dateCompte?: any;
    miseTontine?: number;
    avanceTontine?: boolean;
    avanceDate?: any;
    montantAdhesion?: string;
    dateCloture?: string;
}
export interface Avance {
    id?: any;
    idCompte?: any;
    compte?: Compte;
    montant?: any;
    date?: any;
}
export interface Settings {
    id?: any;
    nbreJrAvance?: number;
}
export interface Mise {
    id?: any;
    idCompte?: any;
    idClient?: any;
    client?: Client;
    compte?: Compte;
    mise?: number;
    date?: any;
}

