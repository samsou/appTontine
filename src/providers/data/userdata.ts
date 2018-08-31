import { Subject } from 'rxjs/Subject';

import { Client, Compte, Settings } from './model';


export class UserData {
    ressources: any[] = [];
    agence: any = null;
    listeRessourcesState = new Subject<any>();
    private static _instance: UserData;
    currentSearch = '';
    code = '';
    currentMenu: any;
    clientsMap: any = {};
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
        { 'libelle': 'Statistiques', code: 'STATS' },
        { 'libelle': 'Audits', code: 'AUDITS' }
    ];
    menus: any[] = [
        {
            'libelle': 'Clients',
            code: 'CLIENTS'
        },
        {
            'libelle': 'Tontine',
            code: 'TONTINES',
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
