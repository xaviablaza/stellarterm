const React = window.React = require('react');
import Stellarify from '../../lib/Stellarify';
import Printify from '../../lib/Printify';
import BalancesTable from './BalancesTable.jsx';
import _ from 'lodash';

export default class AccountView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let account = this.props.d.session.account;
    let balances = [];
    account.balances.forEach(balance => {
      let balanceAsset = Stellarify.asset(balance);
      balances.push(<li key={balance.asset_issuer + balance.asset_code}>
        {balanceAsset.getCode()}: {balance.balance}
      </li>)
    })
    let balancesList = <ul>{balances}</ul>

    let trustLines = [];
    account.balances.forEach(balance => {
      let removeButton;
      if (balance.balance === '0.0000000') {
        removeButton = <button onClick={() => this.props.d.handlers.removeTrust(balance.asset_code, balance.asset_issuer)}>Remove</button>
      } else {
        removeButton = <button disabled="true">Unable to remove trust line until balance is 0</button>
      }
      if (balance.asset_type !== 'native') {
        let limit = balance.limit == '922337203685.4775807' ? 'unlimited': balance.limit;
        trustLines.push(<li key={balance.asset_issuer + balance.asset_code}>
          <span>{balance.asset_code}: Issuer: {balance.asset_issuer} Limit: {limit}</span>
          {removeButton}
        </li>)
      }
    })
    let trustLinesList = <ul>{trustLines}</ul>

    let offers = [];
    _.forIn(account.offers, offer => {
      offers.push(<li key={offer.id}>{offer.id} - {1/offer.price}<button onClick={() => this.props.d.handlers.removeOffer(offer.id)}>Remove</button></li>);
      // TODO: only show this
    })
    let offersList = <ul>{offers}</ul>
    return <BalancesTable d={this.props.d}></BalancesTable>
  }
}
