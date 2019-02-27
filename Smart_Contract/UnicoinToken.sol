pragma solidity ^0.4.18;
import './StandardToken.sol'; 
contract UnicoinToken is StandardToken { 

  // Token details
  string public constant name = "Unicoin Token";
  string public constant symbol = "UNI";

  // 18 decimal places, the same as ETH.
  uint8 public constant decimals = 18;
  uint _totalSupply;
  
  constructor() public{
      
      _totalSupply = 1000000 * 10**uint(decimals);
      balances[msg.sender] = _totalSupply;
      emit Transfer(address(0), msg.sender, _totalSupply);

  }   
  
  function totalSupply() public view returns(uint256){
      return _totalSupply;
  }
  
}