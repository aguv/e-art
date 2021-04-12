import { Route, Switch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Web3 from 'web3'
import Layout from './components/layout/Layout';
import SingleView from './components/SingleView';
import HomePage from './components/HomePage';
import Artwork from "../src/abis/Artwork.json"
import PopupForm from './components/PopupForm';

function App() {
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState(null)
  const [artworks, setArtworks] = useState([])
  const [totalSupply, setTotalSupply] = useState(0)
  const [popup, setPopup] = useState(false)
  const [address, setAddress] = useState(null)

  useEffect(() => {
    (async () => {
      await loadWeb3()
      await loadBlockchainData()
    })()
  }, [])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  const loadBlockchainData = async () => {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    const networkId = await web3.eth.net.getId()
    const networkData = Artwork.networks[networkId]
    if (networkData) {
      const abi = Artwork.abi
      setAddress(()=> networkData.address)
      const contract = new web3.eth.Contract(abi, address)
      setContract(contract)
      // const totalSupply = await contract.methods.totalSupply().call()
      // setTotalSupply(totalSupply)

      for (var i = 1; i <= totalSupply; i++) {
        const artwork = await contract.methods.artworks(i - 1).call()
        setArtworks([...artworks, artwork])

      }
      console.log(contract, 'CONTRACT')
    } else {
      console.log(networkId)
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  const handlePopup = () => {
    
    setPopup(popUp => !popUp);
  }

  const mint = (artwork) => {
    console.log(contract, 123123123)
    contract.methods.mint(artwork).send({ from: account })
      .once('receipt', (receipt) => {
        setArtworks([...artworks, artwork])
      })
    }
    useEffect(()=> {
      // contract address 0x650A2F4e3334DaD5Bc90Be53E4deF31EE7866297
      // account 0x1dA1c6b78da655ef89903Dd97697d98fE3c9dE01
      // tx hash 0x276bbc6f1c0143dda9d3db6924f7e24285deba7382279ab0f52ff129379b9688
      console.log(artworks, 'artworks')
      console.log(contract, 'contract')
      console.log(account, 'account')
      
    }, [setArtworks, setContract, setAccount])

  return (
    <div className='bg-secondary w-auto min-h-full pb-20'>
      <Layout handlePopup={handlePopup} />
      {popup ? <PopupForm mint={mint} address={address} handlePopup={handlePopup} /> : null}
      <Switch>
        <Route path='/product/:id' render={({ match }) => <SingleView id={match.params.id} />} />
        <Route path='/' exact render={() => <HomePage mint={mint} />} />
      </Switch>
    </div>
  );
}

export default App;
