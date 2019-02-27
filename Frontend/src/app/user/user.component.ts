import { Component, OnInit ,OnDestroy} from '@angular/core';
import { TokenService } from '../service/token.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
// import Web3 from "Web3";
declare let require:any;
var Web3=require('../../assets/web3.min.js');
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit ,OnDestroy{
  public eth_address;
  public eth_balance;
  public token_balance;
  public id1;
  public success_message_1:boolean;
  public revert_error_1:boolean;
  public invalid_error_1:boolean;
  public success_message_2:boolean;
  public revert_error_2:boolean;
  public invalid_error_2:boolean;
  public users=[];
  public events=[];
  public _web3;
  public selected_address:string;
  public blocks=[];
  public id2;
  constructor(private token:TokenService,private spin:NgxSpinnerService,private route:Router) {
    console.log(Web3.version);
    
    this._web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Vr1GWcLG0XzcdrZHWMPu'));
    this.token.transfer_logs().then(res=>this.blocks=res);
    

    this.load_events();
    let instance=this;
    // setTimeout(function(){
    //   instance.Update_event();
    //   }, 5000);
    instance.eth_address=instance.token.account_address;
    instance.token.get_token_balance().then(token_bal=>instance.token_balance=token_bal);
    instance.token.get_account_balance().then(bal=>instance.eth_balance=bal);
    let data1={};
    data1["id"]="House";
    data1["address"]='0xCdd62B78b828464225E436CEd514d28647A04331';

      let data2={};
    data2["id"]="Cafeteria";
    data2["address"]='0x8c827a9a84364986123134efEF37D75a1f460962';

    let data3={};
    data3["id"]="Course";
    data3["address"]='0xbe443e281A2d02FC76c7702C6143Be660aA094B1';

    this.users.push(data1);
    this.users.push(data2);
    this.users.push(data3);
   }
   
   
   load_events()
   {
    this.token.transfer_logs().then(res=>{
      this.events.length=0;
      res.forEach(element => {
        let data={};
        data['blockNumber']=element['blockNumber'];
        data['address']=element['returnValues'][1];
        data['txhash']=element['transactionHash'];
        data['tokens']=this._web3.utils.fromWei(String(element['returnValues'][2]),'ether');
        this.events.push(data);
        this.events.reverse();
      });
    });

   }

   select_address(acc)
   {
     this.selected_address=acc;
   }


   update_balance()
   {
     let instance=this;
    instance.token.get_account_balance().then(bal=>instance.eth_balance=bal);
    instance.token.get_token_balance().then(token_bal=>instance.token_balance=token_bal);
   }

   transfer1(address,tokens)
   {
    let instance=this;
    instance.success_message_1=false;
    instance.revert_error_1=false;
    instance.invalid_error_1=false;
    if(address.trim()!='' && tokens.trim()!='')
    {
     instance.spin.show();
     instance.token.token_transfer(address,tokens).then(res=>{
       if(res==1)
       {
         instance.update_balance();
         instance.load_events();
         instance.spin.hide();
         instance.success_message_1=true;
        (document.getElementById('add1') as HTMLInputElement).value='';
        (document.getElementById('bal1') as HTMLInputElement).value='';        
       }
       else 
       {
          instance.spin.hide();
          instance.revert_error_1=true;
          (document.getElementById('add1') as HTMLInputElement).value='';
          (document.getElementById('bal1') as HTMLInputElement).value='';
          }
        })
      }
    else
       {        
        instance.invalid_error_1=true;
        (document.getElementById('add1') as HTMLInputElement).value='';
        (document.getElementById('bal1') as HTMLInputElement).value='';
        }
   }


   transfer2(tokens)
   {
      let instance=this;
      
      instance.success_message_2=false;
      instance.revert_error_2=false;
      instance.invalid_error_2=false;
    if(instance.selected_address!="Select" && tokens.trim()!='')
    {
        instance.spin.show();
        instance.token.token_transfer(instance.selected_address,tokens).then(res=>{
          if(res==1)
          {
            instance.update_balance();
            instance.load_events();
            instance.spin.hide();
            instance.success_message_2=true;
            (document.getElementById('add2') as HTMLInputElement).value='';
            (document.getElementById('bal2') as HTMLInputElement).value='';
            }
          else 
          {
              instance.spin.hide();
              instance.revert_error_2=true;
              (document.getElementById('add2') as HTMLInputElement).value='';
              (document.getElementById('bal2') as HTMLInputElement).value='';
          }
        })
   }
   else{
      
        instance.invalid_error_2=true;
        (document.getElementById('add2') as HTMLInputElement).value='';
        (document.getElementById('bal2') as HTMLInputElement).value='';
   }
  }


  logout()
  {
    this.token.private_key=undefined;
  }

  // Update_event(){ 
  //   let instance=this;
  //    instance.id2 = setInterval(function() {  
  //   instance.token.transfer_logs().then(res=>{
  //     if(instance.blocks.length!=res.length)
  //     {
  //       instance.load_events();
  //     }
  //   });
  // }, 2000);


  // }
  ngOnInit() {
    let instance=this;

    instance.id1 = setInterval(function() {          
      if(instance.token.private_key==undefined)
      {
        clearInterval(this.interval);
        instance.route.navigate(['login'])              
      }      
      // if(this.blocks.length)
    }, 100);

   
  }
   ngOnDestroy() {
       if (this.id1) { 
         clearInterval(this.id1);
       }  
       if (this.id2) { 
        clearInterval(this.id2);
      }  
      }

}
