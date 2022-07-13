//SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.0;


// OpenZeppelin imports 
import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.4.2/access/Ownable.sol"; // control who owns these nfts
import "@openzeppelin/contracts@4.4.2/utils/Counters.sol"; // set counter of how many nft's are created inside the metaverse

// Address: 0x7B447DE2049B579eF411031a02d5b852EB4927AC

// Creation of the Metaverse smart contract and Nft tokens
contract Metaverse is ERC721, Ownable {
    
    constructor() ERC721("META", "SH") {}

    // Counters to regulate the current amount (the supply) of nft Tokens minted
    using Counters for Counters.Counter;
    Counters.Counter private supply;

    // Total number of nft available for creation
    uint256 public maxSupply = 100;

    // Cost to be paid for each nft token
    uint256 public cost = 1 ether;

    // Owner and its properties in the metaverse
    mapping(address => Building []) NFTOwners;

    // Metaverse buildings
    struct Building {
        string name;
        int8 w;
        int8 h;
        int8 d;
        int8 x;
        int8 y;
        int8 z;
    }

    // List of Metaverse Buildings
    Building[] public buildings;


    // Obtaining the buildings made in the metaverse
    function getBuildings() public view returns (Building [] memory) // view: doesn't cost any gas 
    {
        return buildings;
    }

    // Current supply of nft tokens 
    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    // Creation of the Buildings as a NFT Token in the Metaverse
    function mint(string memory _building_name, int8 _w, int8 _h, int8 _d, int8 _x, int8 _y, int8 _z) public payable {
        require(supply.current() <= maxSupply, "Max supply exceeded!");
        require(msg.value >= cost, "Insufficient funds!");
        supply.increment();
        _safeMint(msg.sender, supply.current()); // give the current object to its owner
       Building memory _newBuild = Building(_building_name, _w, _h, _d, _x, _y, _z); // declare new structure
       buildings.push(_newBuild); // add it to the list
       NFTOwners[msg.sender].push(_newBuild);
    }


       // user have to pay to be able to create nft in your metaverse
       // where is the money ? where that funds go ?
       // => when someone pay you smart contract, you need to extract the funds from the smart contract

       // Extraction of ethers from the smart contract to the owner (Withdraw)
       function Withdraw() external payable onlyOwner{ 
            address payable _owner = payable(owner());
            _owner.transfer(address(this).balance);
       }

       // Obtain user's Metaverse buildings
       // If i click i have mine properties
       function getOwnerMetaverseBuildings() public view returns (Building [] memory){
           return NFTOwners[msg.sender];
       }
}