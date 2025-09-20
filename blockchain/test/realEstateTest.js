const RealEstate = artifacts.require("RealEstate");

contract("RealEstate", (accounts) => {
  let realEstateInstance;
  const notary = accounts[1];
  const buyer = accounts[2];
  const initialPrice = 5; // 5 ETH

  before(async () => {
    realEstateInstance = await RealEstate.deployed();
  });

  describe("Déploiement et configuration de base", () => {
    it("should deploy successfully", async () => {
      assert(realEstateInstance.address !== "", "Le contrat n'est pas déployé");
    });

    it("should set the correct notary", async () => {
      const deployedNotary = await realEstateInstance.notary();
      assert.equal(deployedNotary, notary, "Notaire incorrect");
    });

    it("should return test message", async () => {
      const message = await realEstateInstance.test();
      assert.equal(message, "RealEstate contract is working!", "Message test incorrect");
    });
  });

  describe("Gestion des propriétés", () => {
    it("should add a property by notary", async () => {
      await realEstateInstance.addProperty("Paris, Champs-Élysées", initialPrice, { from: notary });
      
      const propertyCount = await realEstateInstance.getPropertyCount();
      assert.equal(propertyCount.toString(), "1", "Nombre de propriétés incorrect");

      const property = await realEstateInstance.getProperty(1);
      assert.equal(property[1], "Paris, Champs-Élysées", "Localisation incorrecte");
      assert.equal(property[2].toString(), initialPrice.toString(), "Prix incorrect");
      assert.equal(property[3], notary, "Propriétaire initial incorrect");
      assert.equal(property[4], false, "Propriété ne devrait pas être en vente initialement");
    });

    it("should not allow non-notary to add property", async () => {
      try {
        await realEstateInstance.addProperty("Lyon, Bellecour", 3, { from: buyer });
        assert.fail("Non-notaire a pu ajouter une propriété");
      } catch (error) {
        assert(error.message.includes("revert"), "Erreur non attrapée pour non-notaire");
      }
    });
  });

  describe("Transactions", () => {
    it("should set property for sale", async () => {
      await realEstateInstance.setForSale(1, initialPrice, { from: notary });

      const property = await realEstateInstance.getProperty(1);
      assert.equal(property[4], true, "Propriété pas en vente");
    });

    it("should buy a property", async () => {
      const priceInWei = web3.utils.toWei(initialPrice.toString(), "ether");

      await realEstateInstance.buyProperty(1, { from: buyer, value: priceInWei });

      const property = await realEstateInstance.getProperty(1);
      assert.equal(property[3], buyer, "Propriétaire incorrect après achat");
      assert.equal(property[4], false, "Propriété toujours en vente après achat");
    });

    it("should get transaction history", async () => {
      const transactions = await realEstateInstance.getTransactionHistory(1);
      assert.equal(transactions.length, 2, "Historique des transactions incorrect"); 
      // Transaction initiale + achat par buyer
    });
  });

  describe("Tests de sécurité", () => {
    it("should not allow buying with wrong amount", async () => {
      await realEstateInstance.addProperty("Marseille, Vieux-Port", 10, { from: notary });

      try {
        await realEstateInstance.buyProperty(2, {
          from: buyer,
          value: web3.utils.toWei("1", "ether") // Montant incorrect
        });
        assert.fail("Achat avec montant incorrect accepté");
      } catch (error) {
        assert(error.message.includes("revert"), "Erreur non attrapée pour montant incorrect");
      }
    });

    it("should not allow buying unavailable property", async () => {
      try {
        await realEstateInstance.buyProperty(999, {
          from: buyer,
          value: web3.utils.toWei("5", "ether")
        });
        assert.fail("Achat d'une propriété inexistante accepté");
      } catch (error) {
        assert(error.message.includes("revert"), "Erreur non attrapée pour propriété inexistante");
      }
    });
  });
});
