import { serviceFactory } from './baseService';

export interface AgreementSection {
    id: number;
    title: string;
    content: string;
    type: string;
    agreements: Agreement[];
}

export interface Agreement {
    id: number;
    title: string;
    agreement_section: number;
    description: string;
}

const END_POINT = "/api/common/";

const agreementSections = {
    ...serviceFactory<AgreementSection>(END_POINT + 'aggreement-section/'),
};

const aggreements = {
    ...serviceFactory<Agreement>(END_POINT + "aggreement/"),
}

const agreementService = {
    agreementSections: agreementSections,
    agreements: aggreements,
};

export default agreementService;