import { Subject } from 'rxjs/Subject';

import { Client, Compte, Produit, Settings } from './model';

const entities: string[] = ['produits', 'clients', 'tontines', 'epargnes', 'credits', 'parametres', 'recettes'];
let ressources = [];
let tabs = ['tontines', 'epargnes', 'credits', 'parametres', 'recettes'];
let index, see;
entities.forEach(element => {
    index = tabs.indexOf(element);
    see = 'Voir';
    if (index !== -1 && element !== 'recettes') see = 'Gérer';
    ressources.push({
        name: `${see} les ${element}`,
        code: `tontine/api/${element}`
    });
    if (index === -1) {
        ressources.push({
            name: `Créer les ${element}`,
            code: `tontine/api/${element}/create`
        });
        ressources.push({
            name: `Editer les ${element}`,
            code: `tontine/api/${element}/edit`
        });
        ressources.push({
            name: `Supprimer les ${element}`,
            code: `tontine/api/${element}/delete`
        });
    }
});
export const RESSOURCES = ressources;


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
    depots: any[] = [];
    retraits: any[] = [];
    TONTINE: Compte[] = [];
    CREDIT: Compte[] = [];
    EPARGNE: Compte[] = [];
    RECETTES: any[] = [];
    settings: Settings = {
        nbreJrAvance: 15,
        fraisTenueDeCompte: "200"
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
        return 'GALA';
    }
    menusStats: any[] = [
        { 'libelle': 'Statistiques', code: 'STATS', icon: 'pie' },
        { 'libelle': 'Etats', code: 'AUDITS', icon: 'pulse' }
    ];
    menus: any[] = [
        {
            'libelle': 'Produits',
            code: 'PRODUITS',
            ressource: 'tontine/api/produits',
            icon: 'bookmarks'
        },
        {
            'libelle': 'Clients',
            code: 'CLIENTS',
            ressource: 'tontine/api/clients',
            icon: 'person'
        },
        {
            'libelle': 'Tontine',
            code: 'TONTINES',
            icon: 'folder',
            ressource: 'tontine/api/tontines',
            'breadcrumbs': [
                {
                    'libelle': 'Les Comptes Tontines'
                    , code: 'TONTINES',
                    ressource: 'tontine/api/tontines',
                },
                {
                    'libelle': 'Créer un Compte'
                    , code: 'CREATE_TONTINE',
                    ressource: 'tontine/api/tontines',
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
            ressource: 'tontine/api/epargnes',
            'breadcrumbs': [
                {
                    'libelle': 'Les Comptes Epargne'
                    , code: 'EPARGNE',
                    ressource: 'tontine/api/epargnes'
                },
                {
                    'libelle': 'Créer un Compte'
                    , code: 'CREATE_EPARGNE',
                    ressource: 'tontine/api/epargnes',
                },
                {
                    'libelle': 'Dépôts'
                    , code: 'DEPOT_EPARGNE',
                    ressource: 'tontine/api/epargnes',
                },
                {
                    'libelle': 'Retraits'
                    , code: 'RETRAIT_EPARGNE',
                    ressource: 'tontine/api/epargnes',
                }
            ]
        },

        {
          'libelle': 'Crédit',
          code: 'CREDIT',
          icon: 'paper',
          ressource: 'tontine/api/credits',
          'breadcrumbs': [
              {
                  'libelle': 'Les Comptes Crédits'
                  , code: 'CREDIT',
                  ressource: 'tontine/api/credits'
              },
              {
                  'libelle': 'Créer un Compte'
                  , code: 'CREATE_CREDIT',
                  ressource: 'tontine/api/credits',
              },
              {
                  'libelle': 'Les Demandes'
                  , code: 'DEMANDE_CREDIT',
                  ressource: 'tontine/api/credits',
              },
          ]
        },
        {
            'libelle': 'Nos recettes',
            code: 'RECETTES',
            icon: 'card',
            ressource: 'tontine/api/recettes',
        },
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
