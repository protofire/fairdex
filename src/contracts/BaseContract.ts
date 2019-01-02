import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { EventLog } from 'web3/types';

export interface ContractOptions {
  jsonInterface: any[];
  address: Address;
  web3?: Web3;
}

export interface SubscriptionOptions<EventType> {
  event: EventType;
  filter?: object;
  fromBlock?: 'latest' | 'pending' | 'genesis' | number;
  topics?: string[];
}

abstract class BaseContract<EventType extends string = string> {
  protected contract: Contract;
  private subscriptions = new Map<EventType, any>();

  protected constructor(options: ContractOptions) {
    const web3 = options.web3 || window.web3;
    const { jsonInterface, address } = options;

    this.contract = new web3.eth.Contract(jsonInterface, address);
  }

  subscribe<T = any>(
    { event: eventName, ...options }: SubscriptionOptions<EventType>,
    callback: (result: T, log: EventLog) => void,
  ) {
    this.unsubscribe(eventName);

    const subscription = this.contract.events[eventName](options, (error, log) => {
      if (error) {
        // TODO: Handle error
      } else {
        const result: T = log.returnValues;

        if (result) {
          callback(result, log);
        }
      }
    });

    this.subscriptions.set(eventName, subscription);

    return subscription;
  }

  unsubscribe(eventName: EventType) {
    if (eventName && this.subscriptions.has(eventName)) {
      const subscription = this.subscriptions.get(eventName);

      if (typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }

      this.subscriptions.delete(eventName);
    }
  }
}

export default BaseContract;
