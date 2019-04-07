export interface Client {
    id?: any;
    code?:any;
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
    isFraisOk?:boolean;
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
    etatDemande?:string;
    deposit?:number;
    depositRetire?:boolean;
    fini?:boolean;
    date?:Date;
    motif?:any;
}
export interface Avance {
    id?: any;
    idCompte?: any;
    compte?: Compte;
    montant?: any;
    date?: any;
}
export interface Echeance {
  id?: any;
  num?: number;
  idCompte?: any;
  compte?: Compte;
  nominal?: any;
  interet?: any;
  date?: any;
  payer?:any;
  datePayer?:any;
}
export interface Settings {
    id?: any;
    nbreJrAvance?: number;
    fraisTenueDeCompte?: any;
    fraisOuvertureDeCompte?:any;
    codeSecretInstitution?:any;
    numOrdreClient?:any;

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

export interface Depot {
  id?: any;
  idCompte?: any;
  idClient?: any;
  client?: Client;
  compte?: Compte;
  montant?: number;
  date?: any;
  nameDeposant?:any;
  numCarteDeposant?:any;
  phoneDeposant?:any;
}

export interface Retrait {
  id?: any;
  idCompte?: any;
  idClient?: any;
  client?: Client;
  compte?: Compte;
  montant?: number;
  date?: any;
  nameRetirant?:any;
  numCarteRetirant?:any;
  phoneRetirant?:any;
}

