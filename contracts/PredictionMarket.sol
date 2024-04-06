// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PredictionMarket {
    address public owner;
    uint256 public marketCount;

    struct Secrets {
        string sharedSecret;
        string publicKey;
    }

    mapping(uint256 => Secrets) private sharedSecret;

    enum MarketOutcome {
        NotResolved,
        Yes,
        No
    }

    struct Market {
        uint256 id;
        string question;
        uint256 totalYesVotes;
        uint256 totalNoVotes;
        uint256 totalWinnings;
        bytes[] encryptedVotes;
        MarketOutcome outcome;
        mapping(address => uint256) userVotes;
        mapping(address => uint256) userWinnings;
    }

    mapping(uint256 => Market) public markets;

    event MarketCreated(uint256 indexed id, string question);
    event VotesBought(uint256 indexed id, address indexed buyer, uint256 amount, bool prediction);
    event MarketResolved(uint256 indexed id, MarketOutcome outcome);
    event WinningsClaimed(uint256 indexed id, address indexed claimer, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier marketExists(uint256 _marketId) {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        _;
    }

    modifier marketNotResolved(uint256 _marketId) {
        require(
            markets[_marketId].outcome == MarketOutcome.NotResolved,
            "Market already resolved"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        marketCount = 0;
    }

    function createMarket(
        string memory _question,
        string memory _publicKey,
        string memory _sharedSecret
    ) external onlyOwner {
        marketCount++;
        Market storage newMarket = markets[marketCount];
        newMarket.id = marketCount;
        newMarket.question = _question;
        newMarket.outcome = MarketOutcome.NotResolved;

        Secrets storage secret = sharedSecret[marketCount];
        secret.sharedSecret = _sharedSecret;
        secret.publicKey = _publicKey;

        emit MarketCreated(marketCount, _question);
    }

    function buyVotes(
        uint256 _marketId,
        bool _prediction,
        bytes calldata _encryptedVote
    ) external payable marketExists(_marketId) marketNotResolved(_marketId) {
        require(msg.value > 0, "Amount must be greater than 0");

        Market storage market = markets[_marketId];
        address buyer = msg.sender;

        if (_prediction) {
            market.totalYesVotes += msg.value;
        } else {
            market.totalNoVotes += msg.value;
        }
        market.encryptedVotes.push(_encryptedVote);
        market.userVotes[buyer] += msg.value;
        emit VotesBought(_marketId, buyer, msg.value, _prediction);
    }

    function resolveMarket(
        uint256 _marketId,
        bool _outcome
    ) external onlyOwner marketExists(_marketId) marketNotResolved(_marketId) {
        Market storage market = markets[_marketId];
        market.totalWinnings = market.totalNoVotes + market.totalYesVotes;

        if (_outcome) {
            market.outcome = MarketOutcome.Yes;
            emit MarketResolved(_marketId, MarketOutcome.Yes);
        } else {
            market.outcome = MarketOutcome.No;
            emit MarketResolved(_marketId, MarketOutcome.No);
        }
    }

    function claimWinnings(uint256 _marketId) external marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.outcome != MarketOutcome.NotResolved, "Market not yet resolved");

        address claimer = msg.sender;
        uint256 winnings = (market.userVotes[claimer] * market.totalWinnings) /
            market.userVotes[claimer];
        market.userWinnings[claimer] += winnings;

        (bool success, ) = claimer.call{value: winnings}("");
        require(success, "Transfer failed");

        emit WinningsClaimed(_marketId, claimer, winnings);
    }
}
