import { useEffect } from "react";
import closeIcon from "../../assets/images/close-icon.svg";
import { Order } from "../../types/Order";
import { formatCurrency } from "../../utils/formatCurrency";
import { Overlay, ModalBody, OrderDetails, Actions } from "./styles";

interface IOrderModalProps {
    visible: boolean;
    order: Order | null;
    onClose: () => void;
    onCancelOrder: () => Promise<void>;
    isLoading: boolean;
    onChangeOrderStatus: () => void;
}
export function OrderModal({
    visible,
    order,
    onClose,
    onCancelOrder,
    isLoading,
    onChangeOrderStatus,
}: IOrderModalProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);
    if (!visible || !order) {
        return null;
    }
    const total = order.products.reduce((total, { product, quantity }) => {
        return total + product.price * quantity;
    }, 0);
    return (
        <Overlay>
            <ModalBody>
                <header>
                    <strong>Mesa {order.table}</strong>
                    <button type="button" onClick={onClose}>
                        <img src={closeIcon} alt="ícone para fechar modal" />
                    </button>
                </header>
                <div className="status-container">
                    <small>Status do pedido</small>
                    <div>
                        <span>{order.status === "WAITING" && "🕑"}</span>
                        <span>{order.status === "IN_PRODUCTION" && "👨‍🍳"}</span>
                        <span>{order.status === "DONE" && "✅"}</span>

                        <strong>
                            {order.status === "WAITING" && "Fila de espera"}
                            {order.status === "IN_PRODUCTION" &&
                                "Em preparação"}
                            {order.status === "DONE" && "Pronto"}
                        </strong>
                    </div>
                </div>
                <OrderDetails>
                    <strong>Itens</strong>
                    <div className="order-itens">
                        {order.products.map(({ _id, product, quantity }) => (
                            <div className="item" key={_id}>
                                <img
                                    width="56"
                                    height="28.51"
                                    src={`http://localhost:3001/uploads/${product.imagePath}`}
                                    alt={product.name}
                                />
                                <span className="quantity">{quantity}x</span>
                                <div className="product-details">
                                    <strong>{product.name}</strong>
                                    <span>{formatCurrency(product.price)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="total">
                        <span>Total</span>
                        <strong>{formatCurrency(total)}</strong>
                    </div>
                </OrderDetails>
                <Actions>
                    {order.status !== "DONE" && (
                        <button
                            onClick={onChangeOrderStatus}
                            disabled={isLoading}
                            type="button"
                            className="primary"
                        >
                            <span>
                                {order.status === "WAITING" && "👨‍🍳"}
                                {order.status === "IN_PRODUCTION" && "✅"}
                            </span>
                            <span>
                                {order.status === "WAITING" &&
                                    "Iniciar produção"}
                                {order.status === "IN_PRODUCTION" && "Concluir Pedido"}
                            </span>
                        </button>
                    )}
                    <button
                        onClick={onCancelOrder}
                        disabled={isLoading}
                        type="button"
                        className="secondary"
                    >
                        Cancelar pedido
                    </button>
                </Actions>
            </ModalBody>
        </Overlay>
    );
}
