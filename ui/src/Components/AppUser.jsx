import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Items from "./../Pages/Items/Items";
import Test from "../Pages/4.SalesTab/Test";

// 0.Templetes
// ------------------------------------------------------------------------------------------------------------------------------
import Invoice from "../Templetes/Invoice/Invoice";
import AutoReport from "../Templetes/AutoReport/AutoReport";

// 1.SettingsTab
// ------------------------------------------------------------------------------------------------------------------------------
import SettingsFilePage from "../Pages/SettingsFilePage.jsx";
import PaymentTypes from "../Pages/1.SettingsTab/PaymentTypes/PaymentTypes";
import PreperingStore from "../Pages/1.SettingsTab/PreparingStores/PreparingٍٍٍStores";
import SystemSettings from "../Pages/1.SettingsTab/SystemSettings/SystemSettings";
import DatedBills from "../Pages/1.SettingsTab/DatedBills/DatedBills";
import PrepareEmailMessages from "../Pages/1.SettingsTab/PrepareEmailMessages/PrepareEmailMessages";
// 2.BasicsTab
// ------------------------------------------------------------------------------------------------------------------------------
import AccountsGuide from "../Pages/2.Basics/AccountsGuide";
import MarketersRegulations from "../Pages/2.Basics/MarketersRegulations/MarketersRegulations";
import StoreInventory from "../Pages/2.Basics/StoreInventory/StoreInventory";
import MoneyTypes from "../Pages/2.Basics/MoneyTypes/MoneyTypes";
// 3.EmployeesTab
// ------------------------------------------------------------------------------------------------------------------------------
import BounceEmployeePage from "../Pages/3.EmployeesTab/EmployeeBouce/BounceEmployeePage";
import EmployeeDiscount from "../Pages/3.EmployeesTab/EmployeeDiscount/EmployeeDiscount";
import EmployeeSalaries from "../Pages/3.EmployeesTab/EmployeeSalaries/EmployeeSalaries";
import EmployeesFile from "../Pages/3.EmployeesTab/EmployeeFile/EmployeesFile";
import SalaryDue from "../Pages/3.EmployeesTab/salaryDue/SalaryDue";

// 4.SalesTab
// ------------------------------------------------------------------------------------------------------------------------------
import MarkterSales from "../Pages/4.SalesTab/MarketerٍSales/MarketerSales";
import DiscountInvoice from "../Pages/4.SalesTab/DiscountInvoice/DiscountInvoice";
// 5.MiscellaneousTab
// ------------------------------------------------------------------------------------------------------------------------------
import ReCredit from "../Pages/5.MiscellaneousTab/ReCredit/ReCredit";
import MaterailDamage from "../Pages/5.MiscellaneousTab/MaterialDamage/MaterialDamage";
import TypesTransfer from "../Pages/5.MiscellaneousTab/TypesTransfer/TypesTransfer";

// 6.BillsTab
// ------------------------------------------------------------------------------------------------------------------------------
import CaptureReceipt from "../Pages/6.BillsTab/CaptureReceipt";

import FixedAssets from "../Pages/6.BillsTab/FixedAssets/FixedAssets";
import CreditorAccountSettlement from "../Pages/6.BillsTab/CreditorAccountSettlement";
import DebitAccountSettlement from "../Pages/6.BillsTab/DebitAccountSettlement";
import TransferBetweenStorages from "../Pages/6.BillsTab/TransferBetweenStorages";
import BuyingCharges from "../Pages/6.BillsTab/BuyingCharges/BuyingCharges";
import PublicSpendings from "../Pages/6.BillsTab/PublicSpendings";
import SpendingTransaction from "../Pages/6.BillsTab/SpendingTransaction";
import EmployeeSpendingTransaction from "../Pages/6.BillsTab/EmployeeSpendingTransaction";
import CaptureTwoAccountsSettlementReceipt from "../Pages/6.BillsTab/TwoAccountsSettlement";
import ItemDetails from "./../Pages/Items/itemDetails";
// 7.BanksTab
// ------------------------------------------------------------------------------------------------------------------------------
import AccountOpening from "./../Pages/7.BanksTab/AccountOpening/AccountOpening";
import Deposit from "./../Pages/7.BanksTab/Deposit";
import Transfer from "./../Pages/7.BanksTab/Transfer";
import Withdraw from "./../Pages/7.BanksTab/Withdraw";
import BanksCredits from "./../Pages/7.BanksTab/BanksCredits/BanksCredits";
import AccountStatement from "./../Pages/7.BanksTab/AccountStatement/AccountStatement";
// 8.FinancialReports
// ------------------------------------------------------------------------------------------------------------------------------
import SafesTransactions from "../Pages/8.FinancialReports/SafesTransactions/SafesTransactions";
import ExpenseReport from "../Pages/8.FinancialReports/ExpenseReport/ExpenseReport";
import StagnantItemsReport from "../Pages/8.FinancialReports/StagnantItemsReport/StagnantItemsReport";
import SellingMistakesReport from "../Pages/8.FinancialReports/SellingMistakesReport/SellingMistakesReport";
import ProfitsReport from "../Pages/8.FinancialReports/ProfitsReport/ProfitsReport";
import CustomersMovementsReport from "../Pages/8.FinancialReports/CustomersMovementsReport/CustomersMovementsReport";
import MarketersMovementsReport from "../Pages/8.FinancialReports/MarketersMovementsReport/MarketersMovementsReport";
import AssetsTransactionsReport from "../Pages/8.FinancialReports/AssetsTransactionsReport/AssetsTransactionsReport";
import StaffAccountsReport from "../Pages/8.FinancialReports/StaffAccountsReport/StaffAccountsReport";
import OverdueDebtsReport from "../Pages/8.FinancialReports/OverdueDebtsReport/OverdueDebtsReport";
import DebtsAgesReport from "../Pages/8.FinancialReports/DebtsAgesReport/DebtsAgesReport";
import DebtsStatement from "../Pages/FinancialReports/DebtsStatement/DebtsStatement";
// 9.MovementReports
// ------------------------------------------------------------------------------------------------------------------------------
import CategoriesAndCustomersSales from "../Pages/9.MovementReportsTab/CategoriesAndCustomersSales/CategoriesAndCustomersSales";
import CategoriesSales from "../Pages/9.MovementReportsTab/CategoriesSales/CategoriesSales";
import ReductionsMovement from "../Pages/9.MovementReportsTab/ReductionsMovement/ReductionsMovement";
import SettlementMovement from "../Pages/9.MovementReportsTab/SettlementMovement/SettlementMovement";
import PurchaseItemMovemnt from "../Pages/9.MovementReportsTab/PurchaseItemMovement/PurchaseItemMovement";
import SalesMovementsDetails from "../Pages/9.MovementReportsTab/SalesMovementsDetails/SalesMovementsDetails";
import ProfitDetialsMovement from "../Pages/9.MovementReportsTab/ProfitDetailsMovement/ProfitDetailsMovement";
import ComprehensiveReport from "../Pages/9.MovementReportsTab/ComprehensiveٌٌReport/ComprehensiveReport";
import PurchaseMovemnt from "../Pages/9.MovementReportsTab/PurchaseMovemnt/PurchaseMovemnt";
import SalesMovement from "../Pages/9.MovementReportsTab/SalesMovement/salesMovment";
import ReturnPurchaseMovement from "../Pages/9.MovementReportsTab/ReturnPurchaseMovement/ReturnPurchaseMovement";
import ReturnsSalesMovemnt from "../Pages/9.MovementReportsTab/ReturnSalesMovemnt/ReturnsSalesMovemnt";
// 10.PurchasesTab
// ------------------------------------------------------------------------------------------------------------------------------
import PurchaseInvoicesExpenses from "../Pages/10.PurchasesTab/PurchasesBill/Components/PurchaseInvoicesExpenses/PurchaseInvoicesExpenses";
import OffersBills from "../Pages/10.PurchasesTab/OffersBills/OffersBills";
// 11.ServicesTab
// ------------------------------------------------------------------------------------------------------------------------------
import PermissionsPage from "../Pages/11.ServicesTab/Permissions/PermissionsPage";
import PreparingOrdersLevel from "../Pages/11.ServicesTab/PreparingOrdersLevel/PreparingOredersLevel";
import SystemTransactionsReport from "../Pages/11.ServicesTab/SystemTransactionsReport/SystemTransactionsReport";

// 12.StoresAndItems
// ------------------------------------------------------------------------------------------------------------------------------
import ItemsValidity from "../Pages/12.StoresAndItems/ItemsValidity/ItemsValidity";
import StoresReport from "../Pages/12.StoresAndItems/StoresReports/StoresReports";
import ItemMovements from "../Pages/12.StoresAndItems/ItemMovements/ItemMovements";
import ExportsAndImports from "../Pages/12.StoresAndItems/ExportsAndImports/ExportsAndImports";
import SalesByItems from "../Pages/12.StoresAndItems/SalesByItems/SalesByItems";
import ExpireAlert from "../Pages/12.StoresAndItems/ExpireAlert/ExpireAlert";
import OverTransactions from "./../Templetes/OverTransactions/OverTransactions";
// ==============================================================================================================================
// ==============================================================================================================================
// ==============================================================================================================================

import ERPHome from "../Pages/ERP-Home/ERPHome";
import SellingPricesModifications from "../Pages/2.Basics/SellingPricesModifications/SellingPricesModifications";
import CurrencyReport from "../Pages/8.FinancialReports/CurrencyReport/CurrencyReport";
import CustomizeHomePage from "../Pages/1.SettingsTab/CustomizeHomePage/CustomizeHomePage";
import { useTranslation } from "react-i18next";
import ItemMovementWithRoute from "../Pages/12.StoresAndItems/ItemMovements/ItemMovementWithRoute";

function AppUser() {
	const history = useHistory();
	const closePageHandle = (e) => {
		history && history.goBack();
	};
	const { t, i18n } = useTranslation();
	// 12-7-2021
	return (
		<>
			{/* <nav className="navbar py-2 px-3">
                  <Button icon="close" onClick={closePageHandle} />
              </nav> */}
			<Switch>
				<ProtectedRoute path="/Home" component={ERPHome} />
				<ProtectedRoute
					path="/IncomingOrdersBill"
					component={Invoice}
					componentProps={{
						invoiceType: "IncomingOrders",
						invoiceName: "فاتورة طلبية خارجية",
						invoiceNameEn: "Incoming Orders Bill",
					}}
				/>

				<ProtectedRoute
					path="/PurchasesBill"
					component={Invoice}
					componentProps={{
						invoiceType: "Purchases",
						invoiceName: "فاتورة مشتريات",
						invoiceNameEn: "Purchases Bill",
					}}
				/>
				<ProtectedRoute
					path="/ReturnPurchasesBill"
					component={Invoice}
					componentProps={{
						invoiceType: "ReturnPurchases",
						invoiceName: "فاتورة إرجاع مشتريات",
						invoiceNameEn: "Return Purchases Bill",
					}}
				/>
				<ProtectedRoute path="/test" component={Test} />
				{/* Itemstab */}
				<ProtectedRoute path="/items" component={Items} />
				<ProtectedRoute
					path="/item-details/:id"
					component={ItemDetails}
				/>
				<ProtectedRoute
					path="/item-movement/:id"
					component={ItemMovementWithRoute}
				/>

				{/* --------------------------------------------------------------------------------------------- */}
				{/* 1.SettingsTab */}
				{/* تخصيص الواجهة */}
				<ProtectedRoute
					path="/CustomizeHomePage"
					component={CustomizeHomePage}
				/>

				{/* ملف الاعدادات */}
				<ProtectedRoute
					path="/settingsfile"
					component={SettingsFilePage}
				/>

				<ProtectedRoute path="/PaymentTypes" component={PaymentTypes} />
				<ProtectedRoute
					path="/PreperingStore"
					component={PreperingStore}
				/>
				{/* إعدادات النظام */}
				<ProtectedRoute
					path="/SystemSettings"
					component={SystemSettings}
				/>
				{/* القيد المباشر */}
				<ProtectedRoute
					path="/DirectEntry"
					component={OverTransactions}
					componentProps={{
						type: "DirectEntry",
						title: "القيد المباشر",
						titleEn: t("القيد المباشر"),
					}}
				/>
				{/* تحويل دولار */}
				<ProtectedRoute
					path="/DollarTransaction"
					component={OverTransactions}
					componentProps={{
						type: "DollarTransaction",
						title: "تحويل دولار",
						titleEn: t("تحويل دولار"),
					}}
				/>
				<ProtectedRoute path="/DatedBills" component={DatedBills} />
				{/* إعداد رسائل الإيميلات */}

				{/* --------------------------------------------------------------------------------------------- */}
				{/* 2.BasicsTab */}
				{/* ترصيد */}
				<ProtectedRoute
					path="/OldPurchases"
					component={Invoice}
					componentProps={{
						invoiceType: "OldPurchases",
						invoiceName: "فاتورة ترصيد",
						invoiceNameEn: "Old Purchases",
					}}
				/>

				{/*  دليل الحسابات */}
				<ProtectedRoute
					path="/AccountsGuide"
					component={AccountsGuide}
				/>
				{/*  لوائح المسوقين */}
				<ProtectedRoute
					path="/MarketersRegulations"
					component={MarketersRegulations}
				/>
				{/*  ملف العملات */}
				<ProtectedRoute path="/MoneyTypes" component={MoneyTypes} />
				{/*  كشف العملات */}
				<ProtectedRoute
					path="/CurrencyReport"
					component={CurrencyReport}
				/>
				<ProtectedRoute
					path="/PreparingOrdersLevel"
					component={PreparingOrdersLevel}
				/>
				<ProtectedRoute
					path="/SellingPricesModifications"
					component={SellingPricesModifications}
				/>
				<ProtectedRoute
					path="/StoreInventory"
					component={StoreInventory}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				{/* 3.EmployeesTab */}
				<ProtectedRoute
					path="/EmployeeFiles"
					component={EmployeesFile}
				/>
				<ProtectedRoute
					path="/EmployeeBounce"
					component={BounceEmployeePage}
				/>
				<ProtectedRoute
					path="/EmployeeDiscount"
					component={EmployeeDiscount}
				/>
				<ProtectedRoute
					path="/EmployeeSalary"
					component={EmployeeSalaries}
				/>
				<ProtectedRoute path="/SalaryDue" component={SalaryDue} />
				{/* --------------------------------------------------------------------------------------------- */}
				{/* 4.SalesTab */}
				{/* ارجاع المبيعات */}
				<ProtectedRoute
					path="/ReturnSalesBill"
					component={Invoice}
					componentProps={{
						invoiceType: "ReturnSales",
						invoiceName: "إرجاع مبيعات",
						invoiceNameEn: "Return Sales Bill",
					}}
				/>
				{/* فاتورة تخفيض */}
				<ProtectedRoute
					path="/DiscountBill"
					component={DiscountInvoice}
				/>
				{/* فاتورة عرض */}
				<ProtectedRoute
					path="/SalesOffersBill"
					component={Invoice}
					componentProps={{
						invoiceType: "SalesOffers",
						invoiceName: "فاتورة عرض",
						invoiceNameEn: "Sales Offers Bill",
					}}
				/>
				{/* فاتورة مبيعات */}
				<ProtectedRoute
					path="/SalesBill"
					component={Invoice}
					componentProps={{
						invoiceType: "Sales",
						invoiceName: "فاتورة مبيعات",
						invoiceNameEn: "Receipt Bill",
					}}
				/>
				{/* مبيعات المسوقين */}
				<ProtectedRoute path="/MarkterSales" component={MarkterSales} />
				{/* مبيعات نقدية */}
				<ProtectedRoute
					path="/CashSalesBill"
					component={Invoice}
					componentProps={{
						invoiceType: "CashSales",
						invoiceName: "فاتورة مبيعات نقدية",
						invoiceNameEn: "Cash Sales Bill",
					}}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				{/*5.MiscellaneousTab */}
				<ProtectedRoute path="/ReCredit" component={ReCredit} />
				<ProtectedRoute
					path="/MaterailDamage"
					component={MaterailDamage}
				/>
				{/* نقل أصناف */}
				<ProtectedRoute
					path="/TypesTransfer"
					component={TypesTransfer}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				{/* 6.BillsTab */}
				{/* إيصال قبض */}
				<ProtectedRoute
					path="/CaptureReceipt"
					component={CaptureReceipt}
				/>
				{/* الأصول الثابتة */}
				<ProtectedRoute path="/FixedAssets" component={FixedAssets} />

				{/* مصاريف شراء */}
				<ProtectedRoute
					path="/BuyingCharges"
					component={BuyingCharges}
				/>
				{/* تسوية حساب مدين */}
				<ProtectedRoute
					path="/CreditorAccountSettlement"
					component={CreditorAccountSettlement}
				/>
				<ProtectedRoute
					path="/DebitAccountSettlement"
					component={DebitAccountSettlement}
				/>
				{/* سند صرف لموظف */}
				<ProtectedRoute
					path="/EmployeeSpendingTransaction"
					component={EmployeeSpendingTransaction}
				/>
				{/* مصروفات عمومية */}
				<ProtectedRoute
					path="/PublicSpendings"
					component={PublicSpendings}
				/>
				{/* سند صرف */}
				<ProtectedRoute
					path="/SpendingTransaction"
					component={SpendingTransaction}
				/>
				<ProtectedRoute
					path="/TransferBetweenStorages"
					component={TransferBetweenStorages}
				/>
				{/* تسوية حسابين */}
				<ProtectedRoute
					path="/CaptureTwoAccountsSettlementReceipt"
					component={CaptureTwoAccountsSettlementReceipt}
				/>
				{/* شراء أصول */}
				<ProtectedRoute
					path="/BuyAssets"
					component={OverTransactions}
					componentProps={{
						type: "BuyAssets",
						title: "شراء أصول",
					}}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				{/* 7.Banks */}
				{/* فتح حساب  */}
				<ProtectedRoute
					path="/AccountOpening"
					component={AccountOpening}
				/>
				{/* إيداع */}
				<ProtectedRoute path="/Deposit" component={Deposit} />
				{/* حوالة */}
				<ProtectedRoute path="/Transfer" component={Transfer} />
				{/* سحب */}
				<ProtectedRoute path="/Withdraw" component={Withdraw} />
				{/* أرصدة المصارف */}
				<ProtectedRoute path="/BanksCredits" component={BanksCredits} />
				{/* كشف حساب */}
				<ProtectedRoute
					path="/AccountStatement"
					component={AccountStatement}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				{/* 8.Financial Reports */}
				{/* كشف بالخزينة */}
				<ProtectedRoute
					path="/SafesTransactions"
					component={SafesTransactions}
				/>
				{/* كشف بالمصروفات */}
				<ProtectedRoute
					path="/ExpenseReport"
					component={ExpenseReport}
				/>
				{/* كشف بالبضاعة الراكدة */}
				<ProtectedRoute
					path="/StagnantItemsReport"
					component={StagnantItemsReport}
				/>
				{/* كشف بأخطاء البيع */}
				<ProtectedRoute
					path="/SellingMistakesReport"
					component={SellingMistakesReport}
				/>
				{/* كشف بالأرباح */}
				<ProtectedRoute
					path="/ProfitsReport"
					component={ProfitsReport}
				/>
				{/* حركة المسوقين */}
				<ProtectedRoute
					path="/MarketersMovementsReport"
					component={MarketersMovementsReport}
				/>
				{/* حركة العملاء */}
				<ProtectedRoute
					path="/CustomersMovementsReport"
					component={CustomersMovementsReport}
				/>
				{/* حركة الأصول */}
				<ProtectedRoute
					path="/AssetsTransactionsReport"
					component={AssetsTransactionsReport}
				/>
				{/* كشف حسابات الموظفين */}
				<ProtectedRoute
					path="/StaffAccountsReport"
					component={StaffAccountsReport}
				/>
				{/* الديون المتأخرة */}
				<ProtectedRoute
					path="/OverdueDebtsReport"
					component={OverdueDebtsReport}
				/>
				{/* أعمار الديون */}
				<ProtectedRoute
					path="/DebtsAgesReport"
					component={DebtsAgesReport}
				/>
				<ProtectedRoute
					path="/DebtsStatement"
					component={DebtsStatement}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				{/*  9.MovementReports */}
				<ProtectedRoute
					path="/CategoriesAndCustomersSales"
					component={CategoriesAndCustomersSales}
				/>
				<ProtectedRoute
					path="/CategoriesSales"
					component={CategoriesSales}
				/>
				<ProtectedRoute
					path="/ReductionsMovement"
					component={ReductionsMovement}
				/>
				<ProtectedRoute
					path="/SettlementMovement"
					component={SettlementMovement}
				/>
				<ProtectedRoute
					path="/PurchaseItemMovemnt"
					component={PurchaseItemMovemnt}
				/>
				<ProtectedRoute
					path="/SalesMovementsDetails"
					component={SalesMovementsDetails}
				/>
				<ProtectedRoute
					path="/ProfitDetialsMovement"
					component={ProfitDetialsMovement}
				/>
				<ProtectedRoute
					path="/ComprehensiveReport"
					component={ComprehensiveReport}
				/>
				<ProtectedRoute path="/Purchase" component={PurchaseMovemnt} />
				<ProtectedRoute path="/Sales" component={SalesMovement} />
				<ProtectedRoute
					path="/ReturnPurchase"
					component={ReturnPurchaseMovement}
				/>
				<ProtectedRoute
					path="/ReturnSales"
					component={ReturnsSalesMovemnt}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				{/*10.PurchasesTab */}
				{/* فواتير العروض */}
				<ProtectedRoute path="/OffersBills" component={OffersBills} />
				<ProtectedRoute
					path="/PurchaseInvoicesExpenses"
					component={PurchaseInvoicesExpenses}
				/>
				{/* عرض أسعار */}
				<ProtectedRoute
					path="/PriceOffers"
					component={AutoReport}
					componentProps={{ reportKey: "عرض اسعار" }}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				{/* 11.Permissions Tab */}
				{/* الصلاحيات*/}
				<ProtectedRoute
					path="/permissions"
					component={PermissionsPage}
				/>

				<ProtectedRoute
					path="/SystemTransactionsReport"
					component={SystemTransactionsReport}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				{/* 12.StoresAndItems */}
				{/* كشف المخزون */}
				<ProtectedRoute path="/StoresReport" component={StoresReport} />
				{/* صلاحية الأصناف */}
				<ProtectedRoute
					path="/ItemsValidity"
					component={ItemsValidity}
				/>
				<ProtectedRoute
					path="/ExportsAndImports"
					component={ExportsAndImports}
				/>
				{/* المبيعات حسب الزبائن */}
				<ProtectedRoute path="/SalesByItems" component={SalesByItems} />
				{/* تنبيه الصلاحية */}
				<ProtectedRoute path="/ExpireAlert" component={ExpireAlert} />
				<ProtectedRoute
					path="/item-movement"
					component={ItemMovements}
				/>
				{/* تقرير بالأصناف الصفرية */}
				<ProtectedRoute
					path="/ZeroItems"
					component={AutoReport}
					componentProps={{ reportKey: "تقرير بالأصناف الصفرية" }}
				/>
				{/* --------------------------------------------------------------------------------------------- */}
				<Redirect from="/" exact to="/home" />
				{/* <Redirect to="/not-found" /> */}
			</Switch>
		</>
	);
}

export default AppUser;
