import Layout from './components/layout/Layout';
import SingleView from './components/SingleView';
import HomePage from './components/HomePage';
import {Route, Switch} from 'react-router-dom';

function App() {

  return (
    <div className='bg-secondary w-auto min-h-screen'>
      <Layout />
      <Switch>
        <Route path='/product/:id' render={({match}) => <SingleView id={match.params.id}/>} />
        <Route path='/' exact render={() => <HomePage />}/>
      </Switch>
    </div>
  );
}

export default App;
