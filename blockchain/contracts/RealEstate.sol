// contracts/RealEstate.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RealEstate {
    struct Transaction {
        address buyer;
        uint date;
        uint price; // en wei
    }

    struct Property {
        uint id;
        string location;
        uint price; // en wei
        address owner;
        bool forSale;
        Transaction[] transactions;
    }

    uint public propertyCount = 0;
    mapping(uint => Property) public properties;

    address public notary;
    address public contractOwner;

    // Événements
    event PropertyAdded(uint indexed id, string location, uint price);
    event PropertyForSale(uint indexed id, uint price);
    event PropertySold(uint indexed id, address newOwner, uint price);

    modifier onlyNotary() {
        require(msg.sender == notary, "Seul le notaire peut executer cette action");
        _;
    }

    constructor(address _notary) {
        require(_notary != address(0), "Adresse notaire invalide");
        contractOwner = msg.sender;
        notary = _notary;
    }

    function addProperty(string memory _location, uint _priceWei) public onlyNotary {
        propertyCount++;
        Property storage newProperty = properties[propertyCount];
        newProperty.id = propertyCount;
        newProperty.location = _location;
        newProperty.price = _priceWei;
        newProperty.owner = notary;       
        newProperty.forSale = false;
        newProperty.transactions.push(Transaction(notary, block.timestamp, _priceWei));

        emit PropertyAdded(propertyCount, _location, _priceWei);
    }

    function setForSale(uint _id, uint _priceWei) public {
        require(_id > 0 && _id <= propertyCount, "Property does not exist");
        Property storage prop = properties[_id];
        require(prop.owner == msg.sender, "Vous n'etes pas le proprietaire");

        prop.forSale = true;
        prop.price = _priceWei;

        emit PropertyForSale(_id, _priceWei);
    }

    function buyProperty(uint _id) public payable {
        require(_id > 0 && _id <= propertyCount, "Property does not exist");
        Property storage prop = properties[_id];

        require(prop.forSale, "Bien non disponible a la vente");
        require(msg.value == prop.price, "Montant incorrect"); // comparer directement en wei

        address previousOwner = prop.owner;
        if (previousOwner != address(0)) {
            
            (bool sent, ) = previousOwner.call{value: msg.value}("");
            require(sent, "Le paiement au proprietaire a echoue");
        }

        prop.owner = msg.sender;
        prop.transactions.push(Transaction(msg.sender, block.timestamp, prop.price));
        prop.forSale = false;

        emit PropertySold(_id, msg.sender, prop.price);
    }

    function getProperty(uint _id) public view returns (uint, string memory, uint, address, bool) {
        require(_id > 0 && _id <= propertyCount, "Property does not exist");
        Property storage prop = properties[_id];
        return (prop.id, prop.location, prop.price, prop.owner, prop.forSale);
    }

    function getTransactionHistory(uint _id) public view returns (Transaction[] memory) {
        require(_id > 0 && _id <= propertyCount, "Property does not exist");
        return properties[_id].transactions;
    }

    function getPropertyCount() public view returns (uint) {
        return propertyCount;
    }

    function isNotary(address _account) public view returns (bool) {
        return _account == notary;
    }

    function test() public pure returns (string memory) {
        return "RealEstate contract is working!";
    }
}
