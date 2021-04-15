import { Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import Web3 from "web3"; //importando la libreria --> provee un objeto para interactuar con el provider a eth y los contratos
import Layout from "./components/layout/Layout";
import SingleView from "./components/SingleView";
import HomePage from "./components/HomePage";
import Artwork from "./abis/contracts/Artwork.json";
import PopupForm from "./components/PopupForm";

function App() {
  //va a recibir la data de la cta conectada a MetaMask a través de un pedido asíncrono a la blockchain
  const [accounts, setAccount] = useState("");
  const [loaded, setLoaded] = useState(false)
  const [artworkName, setArtworkName] = useState(""); //va a ser el nombre string con el que vamos a mintear el token en el contract
  const [popup, setPopup] = useState(false);
  const [localContract, setLocalContract] = useState("");
  const [addressLocalContract, setAddressLocalContract] = useState("");

  const ethereum = window.ethereum; //conexión entre el objeto window y ethereum
  const web3 = new Web3(ethereum); //nueva instancia de web3 conectada a ethereum

  //PEDIDOS ASÍNCRONOS A ETH A TRAVÉS DE WEB3

  //Para generar una nueva instancia del contrato e interactuar con ella se necesitan 2 parámetros del json: ABI Y ADDRESS
  const interactArtwork = async () => {
    const networkId = await web3.eth.net.getId(); //el id de la red a la que fue deployada el contrato --> tmb esta en el json del contrato
    console.log(networkId, "networkID");
    const deployedNetwork = Artwork.networks[networkId];
    const abi = Artwork.abi;
    const artworkInstance = new web3.eth.Contract(abi, deployedNetwork.address); //ACÁ LLAMAMOS A Contract --> CONSTRUCTOR DE WEB3 CON LOS DATOS DE NUESTRO CONTRATO como parámetro
  console.log(artworkInstance, "ADENTRO DE INTERACT");
    setLocalContract(artworkInstance);
    setAddressLocalContract(deployedNetwork.address);
    console.log(deployedNetwork.address, "address del contrato");

  };

  console.log(localContract, "lo llamo acá afuera y existe");
  console.log(
    addressLocalContract,
    "la llamo afuera y me devuelve el address del contrato"
  );

  const mint = async () => {
/* 
    console.log(Object.keys(localContract.__proto__));
    console.log(localContract.methods.mint("aaba").call({from: "0xF3A84803557DBcDf7260bc45bE7D444fb21aEeA6"  })
    .then((result) => console.log(result)))  */

//console.log(accounts)
/* console.log(localContract, "ADENTRO DE MINTTTTT")
      await localContract.methods
      .mint("ab")
      .send({ from: "0xF3A84803557DBcDf7260bc45bE7D444fb21aEeA6" })
      .once("receipt", (receipt) => {
         setArtworkName(artworkName); 
      });   */

if(localContract) {
  const receipt = await localContract.methods.mint("1").send({from: accounts})
  console.log(receipt, "RECEIPTTTTTTT WTF")
  return receipt
}




    
    
  };
  

  const getBlockChainData = async () => {
    const accounts = await web3.eth.getAccounts(); //esta sintaxis hace pedidos asíncronos a la blockchain a través de la api de web3
    setAccount(accounts[0]);
    console.log(accounts);
  };

  const loadWeb3 = async () => {
    if (ethereum) {
      //chequeo si existe la variable que declaré en la línea 18
      await window.ethereum.enable();
      console.log("carga web3");
    } else if (web3) {
      //chequeo si existe la instancia de web3 que declaré como variable en la L.19
      web3 = new Web3(window.web3.currentProvider); //establezco que es el currrentProvider aka Metamask
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  //console.log(localContract, "LLLEEEEGA")
  useEffect(() => {
  //  if(localContract) {
    //  console.log("llega a este if con localContract")
      //(async() => await mint()) ()
      
   // } 

    (async() => {
      await loadWeb3();
      await getBlockChainData();
      await interactArtwork()
      await mint()
      
     
    }) () 
  }, []);

    /*   useEffect(() => {

    (async () => {
      await mint();
    })();
  }, [localContract]);  */ 

  const handlePopup = () => {
    setPopup((popUp) => !popUp);
  };

  return (
    <div className="bg-secondary w-auto min-h-full pb-20">
      <Layout handlePopup={handlePopup} /* handleWallet={handleWallet}  */ />
      {popup ? (
        <PopupForm
           mint={mint} 
          walletAccount={accounts}
          handlePopup={handlePopup}
        />
      ) : null}
      <Switch>
        <Route
          path="/product/:id"
          render={({ match }) => <SingleView id={match.params.id} />}
        />
        <Route path="/" exact render={() => <HomePage /* mint={mint} */ />} />
      </Switch>
    </div>
  );
}

export default App;