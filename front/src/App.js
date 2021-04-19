import { Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import Layout from "./components/layout/Layout";
import SingleView from "./components/SingleView";
import HomePage from "./components/HomePage";
import Artwork from "./abis/contracts/Artwork.json";
import ArbitrableTokenList from './kleros-interaction/build/contracts/ArbitrableTokenList.json';

import PopupForm from "./components/PopupForm";
// import getURLsFromPinata from './utils/getURLsFromPinata';
import {getTokensFromPinata} from './store/nfts';

function App() {
  //va a recibir la data de la cta conectada a MetaMask a través de un pedido asíncrono a la blockchain
  const [accounts, setAccount] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [artworkName, setArtworkName] = useState(""); //va a ser el nombre string con el que vamos a mintear el token en el contract
  const [popup, setPopup] = useState(false);
  
  
  const ethereum = window.ethereum;
  const web3 = new Web3(ethereum);

  const pinata_api_key = window.env && window.env.API_KEY || '57ecdfed78a90325fe05'
  const pinata_secret_api_key = window.env &&  window.env.API_SECRET || '8b2dfb5638f06233d9d91283e662c3883f8dffb4bc59324596d70768b20e6d40'
  

  const [render, setRender] = useState(false)
  
  const dispatch = useDispatch()
  const urls = useSelector(state=>state.nfts)
  
  useEffect(()=> {
    dispatch(getTokensFromPinata({pinata_api_key,pinata_secret_api_key}))
  },[render])


  
  useEffect(() => {
 

    (async () => {
      await loadWeb3();
      await getBlockChainData();
      await interactArtwork();
      // await mint('QmYasLHeFsRRY51xbBo6JfA2HegBEXhM3WL85S3Xfixr5d');
    })();
  }, []);

  const getBlockChainData = async () => {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  };
  
  const [localContract, setLocalContract] = useState("");
  const [artbitrableInstance, setArbitrableInstance] = useState({})
  
  const interactArtwork = async () => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Artwork.networks[networkId];
    const abi = Artwork.abi;
    const artworkInstance = new web3.eth.Contract(abi, deployedNetwork.address);

    
    setLocalContract(artworkInstance);
    
    

    const deployedNetwork2 = ArbitrableTokenList.networks[networkId];
    const abi2 = ArbitrableTokenList.abi;
    const arbitrableTokenListInstance = new web3.eth.Contract(abi2, deployedNetwork2.address);
    setArbitrableInstance(
      { instance: arbitrableTokenListInstance,
        abi: abi2
      })
    
    
  };
   

  function reRender () {
    setRender(state=>!state)
  }


  const mint = async (hash) => {
     // if (localContract) {
      const receipt = await localContract.methods
        .mint(hash)
        .send({ from: accounts });
      return receipt;
    
    //} 
  };

  const loadWeb3 = async () => {
    if (ethereum) {
      await window.ethereum.enable();
    } else if (web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const handlePopup = () => {
    setPopup((popUp) => !popUp);
  };

  return (
    <div className="bg-secondary w-auto min-h-full pb-20">
      <Layout  handlePopup={handlePopup} /* handleWallet={handleWallet}  */ />
      {popup ? (
        <PopupForm
          pinata_api_key={pinata_api_key}
          pinata_secret_api_key={pinata_secret_api_key}
          mint={mint}
          reRender={reRender}
          walletAccount={accounts}
          handlePopup={handlePopup}
        />
      ) : null}
      <Switch>
        <Route
          path="/product/:hash"
          render={({ match }) => <SingleView web3={web3} currentAccount={accounts} artworkAddress={localContract._address} arbitrableInstance={artbitrableInstance} hash={match.params.hash} />}
        />
        <Route path="/" exact render={() => <HomePage />} />
      </Switch>
    </div>
  );
}

export default App;
