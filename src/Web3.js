import abi from "./abi/abi.js";

// 0x7B447DE2049B579eF411031a02d5b852EB4927AC

const blockchain = new Promise((res, rej) => {
  // Specify to user that they need to use metamask
  // Detect if metamask is available if not we notify user
  if (typeof window.ethereum == "undefined") {
    rej("You should install Metamask to use it");
  }

  // Web3 instance
  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(
    abi,
    "0x7B447DE2049B579eF411031a02d5b852EB4927AC"
  );

  // Get my metamask address
  web3.eth.requestAccounts().then((accounts) => {
    console.log("==> My account is:", accounts[0]);
  });

  // Get the current supply of nft tokens
  web3.eth.requestAccounts().then((accounts) => {
    contract.methods
      .totalSupply()
      .call({ from: accounts[0] })
      .then((supply) => {
        console.log("Current supply of nft tokens is:", supply);
      });
  });

  // Get the maximum supply of nft tokens
  web3.eth.requestAccounts().then((accounts) => {
    contract.methods
      .maxSupply()
      .call({ from: accounts[0] })
      .then((maxSupply) => {
        console.log("Maximum supply of nft tokens is:", maxSupply);
      });
  });

  // Get your buildings made in the metaverse
  web3.eth.requestAccounts().then((accounts) => {
    contract.methods
      .getOwnerMetaverseBuildings()
      .call({ from: accounts[0] })
      .then((buildings) => {
        console.log("=> Your buildings:", buildings);
      });
  });

  // Get all buildings made in the metaverse
  web3.eth.requestAccounts().then((accounts) => {
    contract.methods
      .totalSupply()
      .call({ from: accounts[0] })
      .then((supply) => {
        contract.methods
          .getBuildings()
          .call({ from: accounts[0] })
          .then((data) => {
            res({ supply, buildings: data });
          });
      });
  });
});

export default blockchain;
