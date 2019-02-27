import { Injectable } from '@angular/core';
import * as Tx from 'ethereumjs-tx';
import { Buffer } from "buffer";
declare let require:any;
var Web3=require('../../assets/web3.min.js');

let token_json=require('./token.json')
@Injectable({
  providedIn: 'root'
})
export class TokenService {
public token_address:string='0xe59D7bA35De1c1B9d7f48aEa66f5020FF1A20a6d'//'0x173d355ffc79b5ed3b8d24ff06de9fbddc8434f1'//'0x0b635Ff2fFB6158dB9CBBf2B62f8cD999E6D4572';
public _web3:any;
public token_contract:any;
public private_key:string;
public account_address:string;
public bunch_logs=[];

  constructor() { 
    this._web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Vr1GWcLG0XzcdrZHWMPu'));
    this.token_contract = new this._web3.eth.Contract(token_json,this.token_address,{gaslimit:3000000});
  }

  public async transfer_logs():Promise<any>{
    let instance=this;
    return new Promise((resolve,reject)=>{
      instance.token_contract.getPastEvents('Transfer',{fromBlock:0, toBlock: 'latest'},function(error,result){
          if(!error){
            let arr=[];
            result.forEach(element => {
              arr.push(element);
            });
            instance.bunch_logs.push(arr.reverse());
            resolve(arr.reverse());
            }
            else{
              reject(error);
            }
            
        })
    }) as Promise<any>;
   }

  public async set_private_key(private_key):Promise<boolean>{
    return new Promise((resolve,reject)=>{
      let instance=this;
      instance.account_address
      instance.private_key=private_key;
      let obj=instance._web3.eth.accounts.privateKeyToAccount('0x'+instance.private_key);
      instance.account_address=obj["address"];
      if(obj["address"].length!=undefined)
       resolve(true)
       else
       resolve(false)
    }) as Promise<boolean>
  }

  public async get_account_balance():Promise<object>{
    return new Promise((resolve,reject)=>{
      let instance=this;  
      instance._web3.eth.getBalance(instance.account_address,function(err,result){
        if(err != null) {
          reject(err);
        }
        else{
          resolve(instance._web3.utils.fromWei(result,'ether'));
        }
      })
    })as Promise<object>
  }

  public async get_token_balance():Promise<number>{
    return new Promise((resolve,reject)=>{
      let instance=this;
      instance.token_contract.methods.balanceOf(instance.account_address).call(function(error, result){
        resolve(instance._web3.utils.fromWei(result,'ether'))
      })
    })as Promise<number>
  }

  public async token_transfer(receiver,tokens):Promise<number>{
    let instance = this;
    let tkns=instance._web3.utils.toWei(String(tokens),'ether');
    return new Promise((resolve, reject) => {
      instance._web3.eth.getTransactionCount(instance.account_address,function(err,result){
        var nonce = result.toString(16);
        const private_key =Buffer.from(instance.private_key,'hex');
        var contract_function = instance.token_contract.methods.transfer(receiver,tkns);
        var contract_function_abi = contract_function.encodeABI();
        var txParams = {
          nonce: '0x'+nonce,
          gasPrice: '0x4A817C800',
          gasLimit: 4000000,
          from: instance.account_address,
          to: instance.token_address,
          value: '0x00',
          data: contract_function_abi
        }
        var tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedtx = tx.serialize();
        instance._web3.eth.sendSignedTransaction('0x'+serializedtx.toString('hex'),function(err,result){
          if(err != null){
            console.log("err")
            resolve(0)
          }
          else{
            instance.hash(result).then(res =>{
              if(res == 0){
                resolve(0)
              }
              else if(res == 1) {
                resolve(1)
              }
              else if(res == 2) {
                resolve(2)
              }
            })
          }
        })
      })
    }) as Promise<number>;
  }
  public async hash(a): Promise<number> {
    let meta = this;
    return new Promise((resolve, reject) => {
      var accountInterval = setInterval(function()
      {
        meta._web3.eth.getTransactionReceipt(a,function(err,result){
          if(err != null) {
            console.log("hash err");
            resolve(0);
          }
          if(result !== null)
          {
            clearInterval(accountInterval);
            if(result.status == 0x1)
            {
              console.log("hash result.status == 0x1");
              resolve(1);
            }
            else
            {           
              console.log("hash result.status == else");
              resolve(2);
            }
          }
        })
      },100)
    }) as Promise<number>;
  }

  
  
}
