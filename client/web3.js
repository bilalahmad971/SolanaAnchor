const signerKeypair_json = require('../wallets/account2.json'); 
const programKeypair_json = require("../target/deploy/helloworld-keypair.json");
const bufferKeypair_json = require("../wallets/buffer.json");
const recordKeypair_json = require("../wallets/record.json");
const Anchor = require("@project-serum/anchor");
const {web3, Wallet, LangErrorCode} = require("@project-serum/anchor");
const Helloworld = require("../target/idl/helloworld.json");
const {SystemProgram} = Anchor.web3;
const {AccountClient, splitArgsAndCtx, BN} = require("@project-serum/anchor");
const fs = require('fs');
//-----------------------FUNCTIONS--------------------------
// it will return provider instance...

async function connectSolana()
{
    let _keypair = await importKeypair(signerKeypair_json);
    let _signerWallet = new Wallet(_keypair);
    const _connection = await getConnection();  
    const _provider = new Anchor.AnchorProvider
    (
        _connection, _signerWallet, "processed",
    );
    return _provider;
}


async function getConnection()
{
    const _connection =  new Anchor.web3.Connection("http://127.0.0.1:8899", "processed");  
    return _connection;
}

async function importKeypair(json_file)
{
    let _rawkey = Uint8Array.from(json_file);
    let _keypair = Anchor.web3.Keypair.fromSecretKey(_rawkey);
    console.log("Account Imported: ", _keypair.publicKey.toString());
    return _keypair;
}

async function generateKeypair()
{
   let _keypair =  Anchor.web3.Keypair.generate();
   console.log("Keypair created: ", _keypair.publicKey.toString());
   return _keypair;
}


async function getBalance(_account)
{
    const _connection = await getConnection();
    let _balance = await _connection.getBalance(_account.publicKey);
    console.log("Balance: ", _balance / 1e9);
    return _balance;
}

async function getFaucets(_account)
{
    const _connection =  getConnection();  
    const old_balance = await getBalance(_account);
    console.log("old balance: ", old_balance / 1e9);
    let tx = await _connection.requestAirdrop(_account.publicKey, web3.LAMPORTS_PER_SOL);
    console.log("Facuet TxHash: ", tx);
    const new_balance = await getBalance(_account);
    console.log("new balance: ", new_balance / 1e9);
}

async function getAccountInfo(_keypair)
{
    let _connection = await connectSolana();
    const _programInfo = await _connection.getAccountInfo(_keypair.publicKey);
    return _programInfo;
}

async function getPayer()
{
    let _payer = await importKeypair(signerKeypair_json);
    return _payer;
}


async function createTx()
{
    let tx = new web3.Transaction();
    tx.add();
}

//--------------------MAIN------------------------

async function main()
{
    // creating provider object using anchor...
    const provider = await connectSolana();
    // importing accounts from file storage, that was created using solana-cli...
    const signerKeypair = await importKeypair(signerKeypair_json);
    const programKeypair = await importKeypair(programKeypair_json);
    const recordKeypair = await importKeypair(recordKeypair_json);
    // const recordKeypair = await generateKeypair();

    // creating new Keypair for Account to store Contract data...
    // const recordKeypair = await generateKeypair();
    // setting provider in anchor workspace...
    Anchor.setProvider(provider);
    const anchorProvider = Anchor.getProvider();
    const program = new Anchor.Program(Helloworld, programKeypair.publicKey, anchorProvider);

    //----------TX-TRANSACTIONS---------------------------
    // const tx = await program.methods.initialize().rpc();
    // const tx = await program.methods.create().accounts({record: recordKeypair.publicKey, user: signerKeypair.publicKey, system_program: "4uyEyWgfZBEB64w5szdvARAxeAqofbWWWXzqsz7io7aN"}).signers([recordKeypair]).rpc();
    // const tx = await program.methods.insert({id: new BN(67), name: "bilal", student: true}).accounts({record: recordKeypair.publicKey}).rpc();
    
    //----------------READING-----------------------------
    // const record = await program.account.record.fetch(recordKeypair.publicKey);
    // console.log("id: ", record.id.toNumber());
    // console.log("name: ",  record.name);
    // console.log("student: ", record.student);
    console.log(Helloworld);
}

main();