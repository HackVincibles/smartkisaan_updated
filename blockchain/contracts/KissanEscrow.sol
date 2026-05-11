// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KissanEscrow
 * @dev Handles secure payments and AI-score based fund release for Smart Kissan.
 */
contract KissanEscrow {
    enum OrderStatus { Pending, Paid, PickedUp, Delivered, Completed, Disputed, Refunded }

    struct Order {
        address farmer;
        address buyer;
        uint256 amount;
        uint256 aiScore; 
        OrderStatus status;
        string imageCID; 
    }

    mapping(uint256 => Order) public orders;
    address public oracle; // Platform backend
    
    event PaymentReceived(uint256 orderId, uint256 amount);
    event DeliveryConfirmed(uint256 orderId, uint256 aiScore);
    event FundsReleased(uint256 orderId, uint256 farmerAmount, uint256 buyerRefund);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call this");
        _;
    }

    constructor() {
        oracle = msg.sender;
    }

    /**
     * @dev Called by the backend (Oracle) after Razorpay payment is confirmed.
     * @param _farmer The farmer's wallet address.
     * @param _buyer The buyer's wallet address (or a platform-generated ID).
     * @param _orderId The internal marketplace order ID.
     */
    function createOrder(address _farmer, address _buyer, uint256 _orderId) external payable onlyOracle {
        require(msg.value > 0, "Funding required for escrow");
        orders[_orderId] = Order({
            farmer: _farmer,
            buyer: _buyer,
            amount: msg.value,
            aiScore: 0,
            status: OrderStatus.Paid,
            imageCID: ""
        });
        emit PaymentReceived(_orderId, msg.value);
    }

    function confirmDelivery(uint256 _orderId, uint256 _aiScore, string memory _imageCID) external onlyOracle {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Paid || order.status == OrderStatus.PickedUp, "Invalid status");
        
        order.aiScore = _aiScore;
        order.imageCID = _imageCID;
        order.status = OrderStatus.Delivered;

        emit DeliveryConfirmed(_orderId, _aiScore);

        // Conditional Release Logic
        if (_aiScore >= 80) {
            _releaseFunds(_orderId, order.amount, 0);
        } else if (_aiScore < 60) {
            order.status = OrderStatus.Disputed;
        } else {
            // 60-80% gray zone: partial release (e.g., 70% to farmer, 30% refund)
            uint256 farmerAmount = (order.amount * _aiScore) / 100;
            uint256 buyerRefund = order.amount - farmerAmount;
            _releaseFunds(_orderId, farmerAmount, buyerRefund);
        }
    }

    function resolveDispute(uint256 _orderId, uint256 _farmerAmount, uint256 _buyerRefund) external onlyOracle {
        require(orders[_orderId].status == OrderStatus.Disputed, "Not disputed");
        _releaseFunds(_orderId, _farmerAmount, _buyerRefund);
    }

    function _releaseFunds(uint256 _orderId, uint256 _farmerAmount, uint256 _buyerRefund) internal {
        Order storage order = orders[_orderId];
        if (_farmerAmount > 0) payable(order.farmer).transfer(_farmerAmount);
        if (_buyerRefund > 0) payable(order.buyer).transfer(_buyerRefund);
        order.status = (_buyerRefund == order.amount) ? OrderStatus.Refunded : OrderStatus.Completed;
        emit FundsReleased(_orderId, _farmerAmount, _buyerRefund);
    }
}
