/* eslint-disable no-undef */ // Avoid the linter considering truffle elements as undef.
const {
  expectThrow
} = require('openzeppelin-solidity/test/helpers/expectThrow')
const {
  increaseTime
} = require('openzeppelin-solidity/test/helpers/increaseTime')

const ArbitrableTransaction = artifacts.require('./ArbitrableTransaction.sol')
const CentralizedArbitrator = artifacts.require('./CentralizedArbitrator.sol')

contract('ArbitrableTransaction', function(accounts) {
  const payer = accounts[0]
  const payee = accounts[1]
  const arbitrator = accounts[2]
  const other = accounts[3]
  const amount = 1000
  const timeout = 100
  const arbitrationFee = 20
  const gasPrice = 5000000000
  const metaEvidenceUri = 'https://kleros.io'

  // Constructor
  it('Should put 1000 wei in the contract', async () => {
    const arbitrableTransaction = await ArbitrableTransaction.new(
      0x0,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    assert.equal(
      web3.eth.getBalance(arbitrableTransaction.address),
      1000,
      "The contract hasn't received the wei correctly."
    )

    const amountSending = await arbitrableTransaction.amount()
    assert.equal(
      amountSending.toNumber(),
      1000,
      "The contract hasn't updated its amount correctly."
    )
  })

  // Pay
  it('Should pay the payee', async () => {
    const initialPayeeBalance = web3.eth.getBalance(payee)
    const arbitrableTransaction = await ArbitrableTransaction.new(
      0x0,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await arbitrableTransaction.pay({ from: payer })
    const newPayeeBalance = web3.eth.getBalance(payee)
    assert.equal(
      newPayeeBalance.toString(),
      initialPayeeBalance.plus(1000).toString(),
      "The payee hasn't been paid properly"
    )
  })

  it('Should not pay the payee', async () => {
    const arbitrableTransaction = await ArbitrableTransaction.new(
      0x0,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await expectThrow(arbitrableTransaction.pay({ from: payee }))
  })

  // Reimburse
  it('Should reimburse 507 to the payer', async () => {
    const arbitrableTransaction = await ArbitrableTransaction.new(
      0x0,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    const payerBalanceBeforeReimbursment = web3.eth.getBalance(payer)
    await arbitrableTransaction.reimburse(507, { from: payee })
    const newPayerBalance = web3.eth.getBalance(payer)
    const newContractBalance = web3.eth.getBalance(
      arbitrableTransaction.address
    )
    const newAmount = await arbitrableTransaction.amount()

    assert.equal(
      newPayerBalance.toString(),
      payerBalanceBeforeReimbursment.plus(507).toString(),
      'The payer has not been reimbursed correctly'
    )
    assert.equal(
      newContractBalance.toNumber(),
      493,
      'Bad amount in the contract'
    )
    assert.equal(newAmount.toNumber(), 493, 'Amount not updated correctly')
  })

  it('Should reimburse 1000 (all) to the payer', async () => {
    const arbitrableTransaction = await ArbitrableTransaction.new(
      0x0,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    const payerBalanceBeforeReimbursment = web3.eth.getBalance(payer)
    await arbitrableTransaction.reimburse(1000, { from: payee })
    const newPayerBalance = web3.eth.getBalance(payer)
    const newContractBalance = web3.eth.getBalance(
      arbitrableTransaction.address
    )
    const newAmount = await arbitrableTransaction.amount()

    assert.equal(
      newPayerBalance.toString(),
      payerBalanceBeforeReimbursment.plus(1000).toString(),
      'The payer has not been reimbursed correctly'
    )
    assert.equal(newContractBalance.toNumber(), 0, 'Bad amount in the contract')
    assert.equal(newAmount.toNumber(), 0, 'Amount not updated correctly')
  })

  it('Should fail if we try to reimburse more', async () => {
    const arbitrableTransaction = await ArbitrableTransaction.new(
      0x0,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await expectThrow(arbitrableTransaction.reimburse(1003, { from: payee }))
  })

  it('Should fail if the payer to it', async () => {
    const arbitrableTransaction = await ArbitrableTransaction.new(
      0x0,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await expectThrow(arbitrableTransaction.reimburse(1000, { from: payer }))
  })

  // executeRuling
  it('Should reimburse the payer (including arbitration fee) when the arbitrator decides so', async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await arbitrableTransaction.payArbitrationFeeByPartyA({
      from: payer,
      value: arbitrationFee
    })
    await arbitrableTransaction.payArbitrationFeeByPartyB({
      from: payee,
      value: arbitrationFee
    })
    const payerBalanceBeforeReimbursment = web3.eth.getBalance(payer)
    await centralizedArbitrator.giveRuling(0, 1, { from: arbitrator })
    const newPayerBalance = web3.eth.getBalance(payer)
    assert.equal(
      newPayerBalance.toString(),
      payerBalanceBeforeReimbursment.plus(1020).toString(),
      'The payer has not been reimbursed correctly'
    )
  })

  it('Should pay the payee and reimburse him the arbitration fee when the arbitrator decides so', async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )

    await arbitrableTransaction.payArbitrationFeeByPartyA({
      from: payer,
      value: arbitrationFee
    })
    await arbitrableTransaction.payArbitrationFeeByPartyB({
      from: payee,
      value: arbitrationFee
    })
    const payeeBalanceBeforePay = web3.eth.getBalance(payee)
    await centralizedArbitrator.giveRuling(0, 2, { from: arbitrator })
    const newPayeeBalance = web3.eth.getBalance(payee)
    assert.equal(
      newPayeeBalance.toString(),
      payeeBalanceBeforePay.plus(1020).toString(),
      'The payee has not been paid properly'
    )
  })

  it('It should do nothing if the arbitrator decides so', async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await arbitrableTransaction.payArbitrationFeeByPartyA({
      from: payer,
      value: arbitrationFee
    })
    await arbitrableTransaction.payArbitrationFeeByPartyB({
      from: payee,
      value: arbitrationFee
    })
    const payeeBalanceBeforePay = web3.eth.getBalance(payee)
    const payerBalanceBeforeReimbursment = web3.eth.getBalance(payer)
    await centralizedArbitrator.giveRuling(0, 0, { from: arbitrator })
    const newPayeeBalance = web3.eth.getBalance(payee)
    const newPayerBalance = web3.eth.getBalance(payer)
    assert.equal(
      newPayeeBalance.toString(),
      payeeBalanceBeforePay.toString(),
      "The payee got wei while it shouldn't"
    )
    assert.equal(
      newPayerBalance.toString(),
      payerBalanceBeforeReimbursment.toString(),
      "The payer got wei while it shouldn't"
    )
  })

  it('Should reimburse the payer in case of timeout of the payee', async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await arbitrableTransaction.payArbitrationFeeByPartyA({
      from: payer,
      value: arbitrationFee
    })
    await increaseTime(timeout + 1)
    const payerBalanceBeforeReimbursment = web3.eth.getBalance(payer)
    const tx = await arbitrableTransaction.timeOutByPartyA({
      from: payer,
      gasPrice: gasPrice
    })
    const txFee = tx.receipt.gasUsed * gasPrice
    const newPayerBalance = web3.eth.getBalance(payer)
    assert.equal(
      newPayerBalance.toString(),
      payerBalanceBeforeReimbursment
        .plus(1020)
        .minus(txFee)
        .toString(),
      'The payer has not been reimbursed correctly'
    )
  })

  it("Shouldn't work before timeout for the payer", async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await expectThrow(
      arbitrableTransaction.timeOutByPartyA({ from: payer, gasPrice: gasPrice })
    )
    await arbitrableTransaction.payArbitrationFeeByPartyA({
      from: payer,
      value: arbitrationFee
    })
    await increaseTime(1)
    await expectThrow(
      arbitrableTransaction.timeOutByPartyA({ from: payer, gasPrice: gasPrice })
    )
  })

  it('Should pay and reimburse the payee in case of timeout of the payer', async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await arbitrableTransaction.payArbitrationFeeByPartyB({
      from: payee,
      value: arbitrationFee
    })
    await increaseTime(timeout + 1)
    const payeeBalanceBeforeReimbursment = web3.eth.getBalance(payee)
    const tx = await arbitrableTransaction.timeOutByPartyB({
      from: payee,
      gasPrice: gasPrice
    })
    const txFee = tx.receipt.gasUsed * gasPrice
    const newPayeeBalance = web3.eth.getBalance(payee)
    assert.equal(
      newPayeeBalance.toString(),
      payeeBalanceBeforeReimbursment
        .plus(1020)
        .minus(txFee)
        .toString(),
      'The payee has not been paid correctly'
    )
  })

  it("Shouldn't work before timeout for the payee", async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await expectThrow(
      arbitrableTransaction.timeOutByPartyB({ from: payee, gasPrice: gasPrice })
    )
    await arbitrableTransaction.payArbitrationFeeByPartyB({
      from: payee,
      value: arbitrationFee
    })
    await increaseTime(1)
    await expectThrow(
      arbitrableTransaction.timeOutByPartyB({ from: payee, gasPrice: gasPrice })
    )
  })

  // submitEvidence
  it('Should create events when evidence is submitted by the payer', async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await arbitrableTransaction.payArbitrationFeeByPartyA({
      from: payer,
      value: arbitrationFee
    })
    await arbitrableTransaction.payArbitrationFeeByPartyB({
      from: payee,
      value: arbitrationFee
    })
    const tx = await arbitrableTransaction.submitEvidence('ipfs:/X', {
      from: payer
    })
    assert.equal(tx.logs[0].event, 'Evidence')
    assert.equal(tx.logs[0].args._arbitrator, centralizedArbitrator.address)
    assert.equal(tx.logs[0].args._party, payer)
    assert.equal(tx.logs[0].args._evidence, 'ipfs:/X')
  })

  it('Should create events when evidence is submitted by the payee', async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await arbitrableTransaction.payArbitrationFeeByPartyA({
      from: payer,
      value: arbitrationFee
    })
    await arbitrableTransaction.payArbitrationFeeByPartyB({
      from: payee,
      value: arbitrationFee
    })
    const tx = await arbitrableTransaction.submitEvidence('ipfs:/X', {
      from: payee
    })
    assert.equal(tx.logs[0].event, 'Evidence')
    assert.equal(tx.logs[0].args._arbitrator, centralizedArbitrator.address)
    assert.equal(tx.logs[0].args._party, payee)
    assert.equal(tx.logs[0].args._evidence, 'ipfs:/X')
  })

  it('Should fail if someone else try to submit', async () => {
    const centralizedArbitrator = await CentralizedArbitrator.new(
      arbitrationFee,
      { from: arbitrator }
    )
    const arbitrableTransaction = await ArbitrableTransaction.new(
      centralizedArbitrator.address,
      timeout,
      payee,
      0x0,
      metaEvidenceUri,
      { from: payer, value: amount }
    )
    await arbitrableTransaction.payArbitrationFeeByPartyA({
      from: payer,
      value: arbitrationFee
    })
    await arbitrableTransaction.payArbitrationFeeByPartyB({
      from: payee,
      value: arbitrationFee
    })
    await expectThrow(
      arbitrableTransaction.submitEvidence('ipfs:/X', { from: other })
    )
  })
})
