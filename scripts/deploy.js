const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ZKTippingSubscriptions to Mantle Testnet...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MNT\n");

  // USDC addresses on Mantle
  const USDC_ADDRESSES = {
    mantleMainnet: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
    mantleTestnet: process.env.PAYMENT_TOKEN_ADDRESS || "", // Deploy mock if not set
  };

  let PAYMENT_TOKEN_ADDRESS = USDC_ADDRESSES[hre.network.name] || process.env.PAYMENT_TOKEN_ADDRESS;
  
  if (!PAYMENT_TOKEN_ADDRESS || PAYMENT_TOKEN_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.log("⚠️  No USDC address found for", hre.network.name);
    console.log("ℹ️  Deploying MockERC20 (USDC) for testing...\n");
    
    // Deploy a mock USDC token for testing
    console.log("📦 Deploying MockERC20 (Test USDC)...");
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20.deploy("USD Coin", "USDC", 6);
    await mockToken.waitForDeployment();
    PAYMENT_TOKEN_ADDRESS = await mockToken.getAddress();
    
    console.log("✅ Test USDC deployed to:", PAYMENT_TOKEN_ADDRESS);
    console.log("   Token Name:", await mockToken.name());
    console.log("   Token Symbol:", await mockToken.symbol());
    console.log("   Decimals:", await mockToken.decimals());
    console.log("   💡 Use this address in your .env: PAYMENT_TOKEN_ADDRESS=" + PAYMENT_TOKEN_ADDRESS);
    console.log("");
  } else {
    console.log("💵 Using USDC at:", PAYMENT_TOKEN_ADDRESS, "\n");
  }

  // Deploy ZKTippingSubscriptions
  console.log("📦 Deploying ZKTippingSubscriptions...");
  const ZKTippingSubscriptions = await hre.ethers.getContractFactory("ZKTippingSubscriptions");
  const subscriptionContract = await ZKTippingSubscriptions.deploy(PAYMENT_TOKEN_ADDRESS);

  await subscriptionContract.waitForDeployment();
  const contractAddress = await subscriptionContract.getAddress();

  console.log("\n✅ Deployment Successful!\n");
  console.log("═══════════════════════════════════════════════════════");
  console.log("📋 Deployment Summary");
  console.log("═══════════════════════════════════════════════════════");
  console.log("Contract: ZKTippingSubscriptions");
  console.log("Address:", contractAddress);
  console.log("Payment Token (USDC):", PAYMENT_TOKEN_ADDRESS);
  console.log("Admin:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
  console.log("═══════════════════════════════════════════════════════\n");

  // Get contract details
  const admin = await subscriptionContract.admin();
  const minInterval = await subscriptionContract.MIN_INTERVAL();
  const maxInterval = await subscriptionContract.MAX_INTERVAL();
  const maxAmount = await subscriptionContract.MAX_AMOUNT();

  console.log("📊 Contract Configuration:");
  console.log("   Admin:", admin);
  console.log("   Min Interval:", Number(minInterval) / 86400, "days");
  console.log("   Max Interval:", Number(maxInterval) / 86400, "days");
  console.log("   Max Amount:", hre.ethers.formatEther(maxAmount), "tokens\n");

  console.log("🔍 View on Explorer:");
  console.log(`   https://sepolia.mantlescan.xyz/address/${contractAddress}\n`);

  console.log("💡 Next Steps:");
  console.log("   1. Save the contract address");
  console.log("   2. Update your .env file with: SUBSCRIPTION_CONTRACT_ADDRESS=" + contractAddress);
  console.log("   3. Verify the contract: bun run verify --network mantleTestnet");
  console.log("   4. Start interacting with the contract\n");

  // Save deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    contractAddress: contractAddress,
    paymentToken: PAYMENT_TOKEN_ADDRESS,
    admin: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${hre.network.name}-latest.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📁 Deployment info saved to:", `${deploymentsDir}/${hre.network.name}-latest.json\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
