import React from "react";
import { useLocation, useParams } from "react-router";
import ItemMovements from "./ItemMovements";

const ItemMovementWithRoute = () => {
	const { id } = useParams();
	return (
		<>
			<ItemMovements id={id} />
		</>
	);
};

export default ItemMovementWithRoute;
