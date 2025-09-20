// contracts/RealEstate.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RealEstate {
    struct Transaction {
        address buyer;  // anciennement owner
        uint date;
        uint price;
    }

    struct Property {
        uint id;
        string location;
        uint price;
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

    function addProperty(string memory _location, uint _price) public onlyNotary {
        propertyCount++;
        Property storage newProperty = properties[propertyCount];
        newProperty.id = propertyCount;
        newProperty.location = _location;
        newProperty.price = _price;
        newProperty.owner = notary;       // Le notaire est le propriétaire initial
        newProperty.forSale = false;       // Pas en vente directement

        // Transaction initiale pour l'enregistrement de l'achat par le notaire
        newProperty.transactions.push(Transaction(notary, block.timestamp, _price));

        emit PropertyAdded(propertyCount, _location, _price);
    }

    function setForSale(uint _id, uint _price) public {
        require(_id > 0 && _id <= propertyCount, "Property does not exist");
        require(properties[_id].owner == msg.sender, "Vous n'etes pas le proprietaire");

        properties[_id].forSale = true;
        properties[_id].price = _price;

        emit PropertyForSale(_id, _price);
    }

    function buyProperty(uint _id) public payable {
        require(_id > 0 && _id <= propertyCount, "Property does not exist");
        Property storage prop = properties[_id];

        require(prop.forSale, "Bien non disponible a la vente");
        require(msg.value == prop.price * 1 ether, "Montant incorrect");

        address previousOwner = prop.owner;

        // Transfert des fonds à l'ancien propriétaire
        if (previousOwner != address(0)) {
            payable(previousOwner).transfer(msg.value);
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

    // Fonction de test
    function test() public pure returns (string memory) {
        return "RealEstate contract is working!";
    }
}
