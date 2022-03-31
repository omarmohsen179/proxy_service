import { request } from "../../../../../Services/CallAPI";

export const COST_FOR_PURCHASES = async (
    CostInvoiceNumber
) => {
    let config = {
        method: "post",
        url: `/CostsForPurchasesInvoices/${CostInvoiceNumber}`,
    };

    return await request(config);
};
export const NEXT_COST_PURCHASE_INVOICE = async (

) => {
    let config = {
        method: "post",
        url: `/NextCostPurchasesInvoicesNumber`,
    };

    return await request(config);
};
export const COST_INVOICE_TRANSACTION = async (
    CostInvoiceNumber,
    CostID,
    CostAddingType
    ) => {
        //delete 0 ,id,ehtsab 
        let config = {
            method: "post",
            url: `/CostsInvoicesTransactions/${CostInvoiceNumber}/${CostID}/${CostAddingType}`,
        };
    
        return await request(config);
    };
export const AVAILABLE_COSTS_PURCHASE_INVOICES = async (
) => {
    let config = {
        method: "post",
        url: `/AvailableCostsForPurchasesInvoices`,
    };

    return await request(config);
};
export const COSTS_FOR_COSTS_INVOICES = async (
    CostInvoiceNumber
    ) => {
        let config = {
            method: "post",
            url: `/CostsForCostsInvoices/${CostInvoiceNumber}`,
        };
    
        return await request(config);
    };

    export const MATCH_COSTS_INVOICES = async (
        CostInvoiceNumber,
        PurchaseInvoiceID
        ) => {
            // CostInvoiceNumber =0 delete 
            let config = {
                method: "post",
                url: `/MatchCostsInvoiceWithPurchaseInvoice/${CostInvoiceNumber}/${PurchaseInvoiceID}`,
            };
        
            return await request(config);
        };
     //invoiceTotal/CostsTotal
     export const APPROVE_PURCHASE_INVOICES = async (
        CostInvoiceNumber
        ) => {
            // CostInvoiceNumber =0 delete 
            let config = {
                method: "post",
                url: `/ApprovePurchaseInvoiceCost/${CostInvoiceNumber}`,
            };
        
            return await request(config);
        };