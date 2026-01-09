import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-viem";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ignition";
import "@nomicfoundation/hardhat-ignition-viem";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
