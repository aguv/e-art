import { Route, Switch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Web3 from 'web3'
import Layout from './components/layout/Layout';
import SingleView from './components/SingleView';
import HomePage from './components/HomePage';
import Artwork from "../src/abis/Artwork.json"


function App() {
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState(null)
  const [artworks, setArtowrks] = useState([])
  const [totalSupply, setTotalSupply] = useState(0)

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
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      setContract(contract)
      console.log(contract)
      // const totalSupply = await contract.methods.totalSupply().call()
      // setTotalSupply(totalSupply)

      for (var i = 1; i <= totalSupply; i++) {
        const artwork = await contract.methods.artworks(i - 1).call()
        setArtowrks([...artworks, artwork])
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  const mint = (artwork) => {
    contract.methods.mint(artwork).send({ from: account })
      .once('receipt', (receipt) => {
        setArtowrks([...artworks, artwork])
      })
  }

  return (
    <div className='bg-secondary w-auto min-h-screen'>
      <Layout />
      <Switch>
        <Route path='/product/:id' render={({ match }) => <SingleView id={match.params.id} />} />
        <Route path='/' exact render={() => <HomePage mint={mint} />} />
      </Switch>
    </div>
  );
}

export default App;
