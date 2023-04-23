import { Order } from "../../types/Order";
import { OrdersBoards } from "../OrdersBoard";
import { Container } from "./styles";
export function Orders() {
    //const orders: Order[] = [];
    return (
        <Container>
           <OrdersBoards icon="🕑" title="Fila de espera" />
           <OrdersBoards icon="👨‍🍳" title="Em preparação" />
           <OrdersBoards icon="✅" title="Finalizados" />
        </Container>
    );
}
