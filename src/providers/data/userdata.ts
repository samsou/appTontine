import { Subject } from 'rxjs/Subject';

import { Client, Compte, Produit, Settings } from './model';


export class UserData {
    ressources: any[] = [];
    agence: any = null;
    listeRessourcesState = new Subject<any>();
    private static _instance: UserData;
    currentSearch = '';
    code = '';
    currentMenu: any;
    clientsMap: any = {};
    produits: Produit[] = [];
    TONTINE: Compte[] = [];
    EPARGNE: Compte[] = [];
    settings: Settings = {
        nbreJrAvance: 15
    };
    private constructor() { }
    static getInstance() {
        if (!this._instance) {
            this._instance = new UserData();
        }
        return this._instance;
    }
    get clients(): Client[] {
        let clts: Client[] = [];
        for (const key in this.clientsMap) {
            clts.push(this.clientsMap[key]);
        }
        return clts.reverse();
    }
    get plateforme(): string {
        return 'Plateforme';
    }
    menusStats: any[] = [
        { 'libelle': 'Statistiques', code: 'STATS', icon: 'pie' },
        { 'libelle': 'Audits', code: 'AUDITS', icon: 'pulse' }
    ];
    menus: any[] = [
        {
            'libelle': 'Produits',
            code: 'PRODUITS',
            icon: 'bookmarks'
        },
        {
            'libelle': 'Clients',
            code: 'CLIENTS',
            icon: 'person'
        },
        {
            'libelle': 'Tontine',
            code: 'TONTINES',
            icon: 'folder',
            'breadcrumbs': [
                {
                    'libelle': 'Les comptes tontine'
                    , code: 'TONTINES'
                },
                {
                    'libelle': 'Créer un compte'
                    , code: 'CREATE_TONTINE'
                }
                /*  {
                     'libelle': 'Faire une mise'
                     , code: 'MISE'
                 }, */
                /* {
                    'libelle': 'Retraits'
                    , code: 'RETRAIT_TONTINE'
                } */
            ]
        },
        {
            'libelle': 'Epargne',
            code: 'EPARGNE',
            icon: 'paper',
            'breadcrumbs': [
                {
                    'libelle': 'Les comptes epargne'
                    , code: 'EPARGNE'
                },
                {
                    'libelle': 'Créer un Compte'
                    , code: 'CREATE_EPARGNE'
                },
                /* {
                    'libelle': 'Consulter Solde'
                }, */
                {
                    'libelle': 'Dépôts'
                    , code: 'DEPOT_EPARGNE'
                },
                {
                    'libelle': 'Retraits'
                    , code: 'RETRAIT_EPARGNE'
                }
            ]
        }
    ];
    initialize() {
        this.ressources = [];
        this.agence = null;
        this.listeRessourcesState.complete();
        UserData._instance = null;
    }
    loadData(obj) {
        if (!obj) return;
        this.ressources = obj.ressources;
        this.listeRessourcesState.next(this.ressources);
        this.agence = obj.agence;
    }
    public months: Array<string> = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aôut',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre'
    ];
}
