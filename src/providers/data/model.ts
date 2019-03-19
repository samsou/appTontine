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
    date?: number;
    fraisOuverture?:number;
}
export interface Produit {
    id?: any;
    typeProduit?: any;
    periodicite?: any;
    montantMin?: number;
    tauxAnnuel?: number;
    fraisDossier?: number;
    fraisTenueCompte?: number;
    deposite?: number;
    montantMax?: number;
    nbreMiseAvance?: number;
    nbreMiseTotal?: number;
    nbreMisePrelever?: number;
    libelle?: string;
    nbreEcheance?: number;
    date?: number;
}
export interface Compte {
    id?: any;
    idClient?: any;
    idProduit?: any;
    produit?: Produit;
    client?: Client,
    typeCompte: string;
    montantSouscritTontine?: number;
    dateCompte?: any;
    miseTontine?: number;
    nbMiseRetirer?: number;
    avanceTontine?: boolean;
    avanceDate?: any;
    montantAvance?:number;
    montantAdhesion?: string;
    dateCloture?: number;
    montant?: number;
    montantDemande?:number;
    accordeCredit?:boolean;
    accordDate?:any;
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
    fraisTenueDeCompte?: any;
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

