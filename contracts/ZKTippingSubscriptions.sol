// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}

/**
 * @title ZKTippingSubscriptions
 * @notice Subscription management system with ZK-KYC verification
 * @dev Includes critical security fixes and enhanced functionality
 */
contract ZKTippingSubscriptions {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    error NotVerified();
    error AlreadyVerified();
    error InvalidAmount();
    error InvalidInterval();
    error SubscriptionInactive();
    error TooEarly();
    error NotAdmin();
    error NotCreator();
    error NullifierUsed();
    error InvalidAddress();
    error TransferFailed();
    error InsufficientAllowance();

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event UserVerified(address indexed user, bytes32 nullifier);
    event CreatorRegistered(address indexed creator);
    event Subscribed(
        address indexed subscriber,
        address indexed creator,
        uint256 amount,
        uint256 interval
    );
    event SubscriptionUpdated(
        address indexed subscriber,
        address indexed creator,
        uint256 newAmount,
        uint256 newInterval
    );
    event Charged(
        address indexed subscriber,
        address indexed creator,
        uint256 amount
    );
    event SubscriptionCancelled(
        address indexed subscriber,
        address indexed creator
    );
    event AdminTransferred(
        address indexed previousAdmin,
        address indexed newAdmin
    );

    /*//////////////////////////////////////////////////////////////
                              CONSTANTS
    //////////////////////////////////////////////////////////////*/
    uint256 public constant MIN_INTERVAL = 1 days;
    uint256 public constant MAX_INTERVAL = 365 days;
    uint256 public constant MAX_AMOUNT = 1_000_000 * 10 ** 18; // Adjust based on token decimals

    /*//////////////////////////////////////////////////////////////
                               STORAGE
    //////////////////////////////////////////////////////////////*/

    address public admin;
    IERC20 public paymentToken;

    // ZK-KYC
    mapping(address => bool) public isVerified;
    mapping(bytes32 => bool) public usedNullifiers;

    // Creator registry
    mapping(address => bool) public isCreator;

    struct Subscription {
        uint256 amount;
        uint256 interval; // seconds
        uint256 lastCharged;
        bool active;
    }

    // subscriber => creator => subscription
    mapping(address => mapping(address => Subscription)) public subscriptions;

    /*//////////////////////////////////////////////////////////////
                              MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyVerified() {
        if (!isVerified[msg.sender]) revert NotVerified();
        _;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _token) {
        if (_token == address(0)) revert InvalidAddress();
        admin = msg.sender;
        paymentToken = IERC20(_token);
    }

    /*//////////////////////////////////////////////////////////////
                         ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Transfer admin rights to a new address
     * @param newAdmin Address of the new admin
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        if (newAdmin == address(0)) revert InvalidAddress();
        address oldAdmin = admin;
        admin = newAdmin;
        emit AdminTransferred(oldAdmin, newAdmin);
    }

    /*//////////////////////////////////////////////////////////////
                         ZK-KYC VERIFICATION
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Verify a user after off-chain ZK proof verification
     * @param user Address to verify
     * @param nullifier Unique nullifier to prevent double verification
     */
    function verifyUser(address user, bytes32 nullifier) external onlyAdmin {
        if (isVerified[user]) revert AlreadyVerified();
        if (usedNullifiers[nullifier]) revert NullifierUsed();

        isVerified[user] = true;
        usedNullifiers[nullifier] = true;

        emit UserVerified(user, nullifier);
    }

    /*//////////////////////////////////////////////////////////////
                         CREATOR REGISTRATION
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Register as a content creator
     * @dev Caller must be verified first
     */
    function registerAsCreator() external onlyVerified {
        isCreator[msg.sender] = true;
        emit CreatorRegistered(msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                            SUBSCRIPTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Subscribe to a creator
     * @param creator Address of the creator
     * @param amount Amount to pay per interval
     * @param interval Time between charges in seconds
     */
    function subscribe(
        address creator,
        uint256 amount,
        uint256 interval
    ) external onlyVerified {
        if (!isCreator[creator]) revert NotCreator();
        if (amount == 0 || amount > MAX_AMOUNT) revert InvalidAmount();
        if (interval < MIN_INTERVAL || interval > MAX_INTERVAL)
            revert InvalidInterval();

        Subscription storage sub = subscriptions[msg.sender][creator];

        sub.amount = amount;
        sub.interval = interval;
        sub.lastCharged = block.timestamp;
        sub.active = true;

        emit Subscribed(msg.sender, creator, amount, interval);
    }

    /**
     * @notice Update an existing subscription
     * @param creator Address of the creator
     * @param newAmount New amount to pay per interval
     * @param newInterval New time between charges
     */
    function updateSubscription(
        address creator,
        uint256 newAmount,
        uint256 newInterval
    ) external onlyVerified {
        Subscription storage sub = subscriptions[msg.sender][creator];

        if (!sub.active) revert SubscriptionInactive();
        if (newAmount == 0 || newAmount > MAX_AMOUNT) revert InvalidAmount();
        if (newInterval < MIN_INTERVAL || newInterval > MAX_INTERVAL)
            revert InvalidInterval();

        sub.amount = newAmount;
        sub.interval = newInterval;

        emit SubscriptionUpdated(msg.sender, creator, newAmount, newInterval);
    }

    /**
     * @notice Charge a subscription
     * @param subscriber Address of the subscriber
     * @param creator Address of the creator
     * @dev Can be called by anyone (permissionless charging)
     */
    function chargeSubscription(address subscriber, address creator) external {
        Subscription storage sub = subscriptions[subscriber][creator];

        if (!sub.active) revert SubscriptionInactive();
        if (block.timestamp < sub.lastCharged + sub.interval) revert TooEarly();

        // Check allowance before attempting transfer
        uint256 allowance = paymentToken.allowance(subscriber, address(this));
        if (allowance < sub.amount) revert InsufficientAllowance();

        // CRITICAL FIX: Update state BEFORE external call (Checks-Effects-Interactions)
        sub.lastCharged = block.timestamp;

        // CRITICAL FIX: Check return value of transferFrom
        bool success = paymentToken.transferFrom(
            subscriber,
            creator,
            sub.amount
        );
        if (!success) revert TransferFailed();

        emit Charged(subscriber, creator, sub.amount);
    }

    /**
     * @notice Cancel a subscription
     * @param creator Address of the creator
     */
    function cancelSubscription(address creator) external {
        subscriptions[msg.sender][creator].active = false;
        emit SubscriptionCancelled(msg.sender, creator);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get subscription details
     * @param subscriber Address of the subscriber
     * @param creator Address of the creator
     * @return Subscription struct
     */
    function getSubscription(
        address subscriber,
        address creator
    ) external view returns (Subscription memory) {
        return subscriptions[subscriber][creator];
    }

    /**
     * @notice Check if a subscription can be charged
     * @param subscriber Address of the subscriber
     * @param creator Address of the creator
     * @return bool True if subscription can be charged
     */
    function canCharge(
        address subscriber,
        address creator
    ) external view returns (bool) {
        Subscription storage sub = subscriptions[subscriber][creator];
        if (!sub.active) return false;
        if (block.timestamp < sub.lastCharged + sub.interval) return false;

        // Check if subscriber has sufficient allowance
        uint256 allowance = paymentToken.allowance(subscriber, address(this));
        return allowance >= sub.amount;
    }

    /**
     * @notice Get time until next charge
     * @param subscriber Address of the subscriber
     * @param creator Address of the creator
     * @return uint256 Seconds until next charge (0 if can be charged now)
     */
    function timeUntilNextCharge(
        address subscriber,
        address creator
    ) external view returns (uint256) {
        Subscription storage sub = subscriptions[subscriber][creator];
        if (!sub.active) return 0;

        uint256 nextChargeTime = sub.lastCharged + sub.interval;
        if (block.timestamp >= nextChargeTime) return 0;

        return nextChargeTime - block.timestamp;
    }

    /**
     * @notice Check if subscription is active
     * @param subscriber Address of the subscriber
     * @param creator Address of the creator
     * @return bool True if subscription is active
     */
    function isSubscriptionActive(
        address subscriber,
        address creator
    ) external view returns (bool) {
        return subscriptions[subscriber][creator].active;
    }

    /**
     * @notice Get the next charge timestamp
     * @param subscriber Address of the subscriber
     * @param creator Address of the creator
     * @return uint256 Timestamp of next charge
     */
    function getNextChargeTime(
        address subscriber,
        address creator
    ) external view returns (uint256) {
        Subscription storage sub = subscriptions[subscriber][creator];
        return sub.lastCharged + sub.interval;
    }
}
