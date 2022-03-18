export class Perfisica {

    constructor(
        public rfiscalfisica: string,
        public rfcfisica: string,
        public nombrefisica: string,
        public apellidop: string,
        public apellidom: string,
        public fnacimiento: string,
        public nidentificacion: string,
        public correofisica: string,
        public CURP?: string,
        public IMSS?: string,
        public genero?: string,
        public nacionalidad?: string,
        public pnacimiento?: string,
        public lnacimiento?: string,
        public estadocivil?: string,
        public tidentificacion?: string,
        public telfijofisica?: string,
        public telmovilfisica ?: string,
        public FIELfisica ?: boolean
    ) { }

}

export class PerMoral {

    constructor(
        public rfiscalmoral: string,
        public rfcmoral: string,
        public nombremoral: string,
        public rug?: string,
        public telfijomoral?: string,
        public telmovilmoral?: string,
        public correomoral?: string,
        public correoempresamoral?: string,
        public aprincipal ?: string,
        public FIELmoral ?: boolean
    ) {}
}

export class ContribuyenteFisica {

    constructor(
        public tipo: string,
        public banco?: string,
        public ncuentafisica?: string,
        public clabefisica?: string,
        public cbfisica?: string
    ) {}
}

export class ContribuyenteMoral {

    constructor(
        public tipo: string,
        public banco?: string,
        public ncuentamoral?: string,
        public clabemoral?: string,
        public cbmoral?: string
    ) {}
}

export class DocumentoPropiedad {

    constructor(
        public idcontribuyente: string,
        public tescritura: string,
        public descritura: string,
        public nescritura?: string,
        public lescritura?: string,
        public fescritura?: string,
        public rug?: string,
        public aescritura?: string
    ) {}
}

export class poliza {

    constructor(
        public ar_date?: string,
        public attached?: string,
        public balance?: string,
        public created_at?: string,
        public extra1?: string,
        public extra2?: string,
        public extra3?: string,
        public folio?: string,
        public id?: string,
        public status?: string,
        public total_credit?: string,
        public total_debit?: string,
        public updated_at?: string,
    ) {}
}