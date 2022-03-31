import { request } from "../../../Services/CallAPI";

export const GET_EDIT_DELETE_DATA = async () => {
	let config = {
		method: "post",
		url: `/AllBoughtAssets`,
	};
	return await request(config);
};

//  DELETE API
export const DELETE_ITEM = async (AssetID) => {
	let config = {
		method: "post",
		url: `/DeleteAsset/${AssetID}`,
	};
	return await request(config);
};

//  Insert or update
export const INSERT_UPDATE = async (Data) => {
	let config = {
		method: "post",
		url: `/AssetsTransactions`,
		data: Data,
	};
	return await request(config);
};

//  Insert or update
export const GET_ASSETS_LOOK_UP = async (Data) => {
	let config = {
		method: "post",
		url: `/Assets`,
	};
	return await request(config);
};

// getting next Number

export const GET_NEXT_NUMBER = async (Data) => {
	let config = {
		method: "post",
		url: `/NewAssetTransactionNextNumber`,
	};
	return await request(config);
};
