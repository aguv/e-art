// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract Artwork is ERC721, IERC721Enumerable {
  string[] public artworks;
  mapping(string => bool) _artworkExists;

  constructor() ERC721("Artwork", "ARTWORK") {
  }

  function mint(string memory _artwork) public {
    require(!_artworkExists[_artwork]);
    artworks.push(_artwork);
    uint _id = artworks.length - 1;
    _mint(msg.sender, _id);
    _artworkExists[_artwork] = true;
  }
}
