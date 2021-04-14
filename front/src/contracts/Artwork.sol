// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

 contract Artwork is ERC721 {
  string[] public artworks;
  mapping(string => bool) _artworkExists;

  constructor() public ERC721("Artwork", "ARTWORK") {
  }
  
  function mint(string memory _artwork) public {
    require(!_artworkExists[_artwork]); 
    artworks.push(_artwork);
    uint _id = artworks.length - 1; //id del token, representado por la última posición del arreglo artworks (string de nombres)
    _mint(msg.sender, _id); //crea el token con el address del sender (quien deploya) y con el id del token
    _artworkExists[_artwork] = true; //vincula a la variable _artworkExists con _artwork (string con boolean)
  }
}
