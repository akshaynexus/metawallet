import React from "react";
import ConnectWalletComponent from "../components/connectWallet";

import createReactClass from "create-react-class";

import {
  CONNECT_WALLET,
  CONNECT_WALLET_RETURNED
} from '../constants'

let emitter = require("../store/accountStore.js").default.emitter;
let dispatcher = require("../store/accountStore.js").default.dispatcher;

let ConnectWallet = createReactClass({
  getInitialState() {
    return {
      loading: false,
      error: null,
    };
  },

  componentWillMount() {
    emitter.on(CONNECT_WALLET_RETURNED, this.connectWalletReturned);
  },

  componentWillUnmount() {
    emitter.removeListener(CONNECT_WALLET_RETURNED, this.connectWalletReturned);
  },

  render() {
    return (
      <ConnectWalletComponent
        submitLogin={this.submitLogin}
        error={this.state.error}
        loading={this.state.loading}
        theme={this.props.theme}
      />
    );
  },

  submitLogin() {
    let error = false;

    if (!error) {
      this.setState({ loading: true, error: null });
      this.props.setError(null)

      this.props.startLoading()
      dispatcher.dispatch({ type: CONNECT_WALLET, content: {} });
    }
  },

  connectWalletReturned(error, data) {
    this.setState({ loading: false });
    this.props.stopLoading()
    if (error) {
      this.props.setError(error.toString())
      return this.setState({ error: error.toString() });
    }

    this.props.navigate('accounts');
  },
});


export default ConnectWallet;
