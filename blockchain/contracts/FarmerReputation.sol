// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FarmerReputation
 * @dev Mints non-transferable Soulbound Tokens (SBTs) for high-quality farmers.
 */
contract FarmerReputation {
    struct Badge {
        string name;
        string imageURI; // IPFS URI
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public farmerBadges;
    address public owner;
    uint256 public nextBadgeId;

    event BadgeMinted(address indexed farmer, uint256 badgeId, string name);

    constructor() {
        owner = msg.sender;
    }

    function mintBadge(address _farmer, string memory _name, string memory _uri) external {
        require(msg.sender == owner, "Only owner can mint");
        uint256 badgeId = nextBadgeId++;
        badges[badgeId] = Badge(_name, _uri);
        farmerBadges[_farmer].push(badgeId);
        emit BadgeMinted(_farmer, badgeId, _name);
    }

    function getFarmerBadges(address _farmer) external view returns (uint256[] memory) {
        return farmerBadges[_farmer];
    }
}
