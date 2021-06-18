import { BigInt } from "@graphprotocol/graph-ts"
import { Phantom, Transfer } from '../generated/Phantom/Phantom'
import { Trade, TradeCount, Owner } from '../generated/schema'


export function handleTransfer(event: Transfer): void {
  let transfer = Trade.load(event.params._from.toHex())

  if (transfer == null) {
    transfer = new Trade(event.params._from.toHex())
  }

  transfer.taker = event.params._to
  transfer.value = event.params._value
  transfer.save()

  let tradecount = TradeCount.load('singleton')

  if (tradecount == null) {
    tradecount = new TradeCount('singleton')
    tradecount.count = 1
  }
  else {
    tradecount.count = tradecount.count + 1
  }

  tradecount.save()

  let contract = Phantom.bind(event.address)

  let owner = Owner.load(event.params._from.toHex())

  if (owner == null) {
    owner = new Owner(event.params._from.toHex())
  }

  owner.balance = contract.balanceOf(event.params._from)
  owner.save()
  
}
 