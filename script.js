import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAdress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawAllButton = document.getElementById("withdrawAllButton");
const p_conectar = document.getElementById("p_conectar");
const p_balance = document.getElementById("p_balance");
const p_withdraw = document.getElementById("p_withdraw");
const p_withdrawAll = document.getElementById("p_withdrawAll");
const p_fund = document.getElementById("p_fund");
const withdrawButton = document.getElementById("withdrawButton");




async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("connected");
    connectButton.innerHTML = "Connected";
   /* connectButton.style.backgroundColor = "lightgreen";*/
    p_conectar.innerHTML = "Cartera conectada con éxito";
    p_conectar.style.color = "lightgreen";
  } else {
    console.log("Instala Metamask");
  }
}

withdrawAllButton.addEventListener("click", () => {
  withdrawAll();
});

balanceButton.addEventListener("click", () => {
  getBalance();
});

connectButton.addEventListener("click", () => {
   
  connect();
});

fundButton.addEventListener("click", () => {
    

  fund();
});

withdrawButton.addEventListener("click", () => {
  withdraw();
});

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAdress);
    console.log(ethers.utils.formatEther(balance));
    p_balance.innerHTML = `El dinero total es  ${ethers.utils.formatEther(balance)} ETH`;
  }
}

async function fund(ethAmount) {
  console.log(`funding with ${ethAmount}...`);
  ethAmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAdress, abi, signer);
    
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount)
      });
      await listenForTransactionToBeMine(transactionResponse, provider);
      console.log("done");
      p_fund.innerHTML= "Dinero agregado con éxito";
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionToBeMine(transactionResponse, provider) {
  console.log(`mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function withdrawAll() {
    console.log("withdrawing");
  if (typeof window.ethereum !== "undefined") {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAdress, abi, signer);
    try {
      
      const transactionResponse = await contract.withdrawAll();
      await listenForTransactionToBeMine(transactionResponse, provider);
      p_withdrawAll.innerHTML = "Dinero retirado con éxito";

    } catch (error) {
      console.log(error);
    }
  }
}

async function withdraw() {
  
  let amountToWithdraw = document.getElementById("withdrawInput").value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAdress, abi, signer);
    
    try {
      const transactionResponse = await contract.withdraw(
       ethers.utils.parseEther(amountToWithdraw)
      );
      await listenForTransactionToBeMine(transactionResponse, provider);
      
      p_withdraw.innerHTML= "Dinero retirado con éxito";
    } catch (error) {
      console.log(error);
    }
  }
}



