import React from 'react';
// provides data to components
import { ApolloProvider } from '@apollo/react-hooks';
// gets the data provided by ApolloProvider when needed
import ApolloClient from 'apollo-boost';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// provides access to page components
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// constructor fn establishes connection to GraphQL server using Apollo
// 'uniform resource identifier' and relative paths uses 'proxy' property (in package.json) to prefix HTTP requests: a front-end server setup that works in both dev and prod environments
const client = new ApolloClient({
  // retrieves token from localStorage before each request
  request: operation => {
    const token = localStorage.getItem('id_token');
    // 'setContext()' method sets HTTP headers for each request to include token (whether needed or not: if request does not require token, server-side resolver fn will not check for it)
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    });
  },
  uri: '/graphql'
});
function App() {
  return (
    // passes in client variable as props for providing access to server's API data
    // 'Router' component relays routing info to child components; content changes according to URL route
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
