import { useEffect, useState } from "react";
import { Order } from "../../types/Order";
import socketIo from "socket.io-client";
import { OrdersBoards } from "../OrdersBoard";
import { Container } from "./styles";
import { api } from "../../utils/api";
export function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);

    const waiting = orders.filter((orders) => orders.status === "WAITING");
    const inProduction = orders.filter(
        (orders) => orders.status === "IN_PRODUCTION"
    );
    const done = orders.filter((orders) => orders.status === "DONE");

    function handleCancelOrder(orderId: string) {
        setOrders((prevState) =>
            prevState.filter((order) => order._id !== orderId)
        );
    }

    function handleOrderStatusChange(orderId: string, status: Order["status"]) {
        setOrders((prevState) =>
            prevState.map((order) =>
                order._id === orderId ? { ...order, status } : order
            )
        );
    }

    useEffect(() => {
        const socket = socketIo("http://localhost:3001", {
            transports: ["websocket"],
        });
        socket.on("order@new", (order) => {
            setOrders((prevState) => prevState.concat(order));
        });
    }, []);

    useEffect(() => {
        api.get("/orders").then(({ data }) => setOrders(data));
    }, []);

    return (
        <Container>
            <OrdersBoards
                icon="🕑"
                title="Fila de espera"
                orders={waiting}
                onCancelOrder={handleCancelOrder}
                onChangeOrderStatus={handleOrderStatusChange}
            />
            <OrdersBoards
                icon="👨‍🍳"
                title="Em preparação"
                orders={inProduction}
                onCancelOrder={handleCancelOrder}
                onChangeOrderStatus={handleOrderStatusChange}
            />
            <OrdersBoards
                icon="✅"
                title="Finalizados"
                orders={done}
                onCancelOrder={handleCancelOrder}
                onChangeOrderStatus={handleOrderStatusChange}
            />
        </Container>
    );
}
