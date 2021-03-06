import fetch from 'node-fetch';
import Web3 from 'web3';

import {
  ERROR,
  STORE_UPDATED,
  CONNECT_WALLET,
  CONNECT_WALLET_RETURNED,
} from '../constants'

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      account: null,
    }

    this.registerDispatchers();
  }

  registerDispatchers = () => {
    dispatcher.register(
      payload => {
        switch (payload.type) {
          case CONNECT_WALLET:
            this.connectWallet(payload);
            break;
          default: {
          }
        }
      });
  };

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    return emitter.emit(STORE_UPDATED);
  };

  connectWallet = payload => {
    const ethEnabled = () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
      }
      return false;
    }

    if(ethEnabled()) {

      const that = this

      window.ethereum.on('accountsChanged', function (accounts) {
        let acc = that.getStore('account')
        if(!acc) {
          acc = {
            address: accounts[0],
            web3: window.web3
          }
        } else {
          acc.address = accounts[0]
        }

        that.setStore({ account: acc });
      })

      window.web3.eth.getAccounts(function(error, accounts) {
        const account = {
          address: accounts[0],
          web3: window.web3
        }

        console.log(account)

        that.setStore({ account: account });
        emitter.emit(CONNECT_WALLET_RETURNED, null, account)
      });
    } else {
      emitter.emit(CONNECT_WALLET_RETURNED, "Metamask isn't enabled. Please install and enable Metamask to connect.", null);
    }
  };
}

const store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
