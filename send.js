require('dotenv').config();
const { ethers } = require('ethers');

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS;
const AMOUNT_TO_SEND = process.env.AMOUNT_TO_SEND;
const MAX_TRANSACTIONS_PER_HOUR = 200; // Batas transaksi per jam

// Membuat provider dan wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Fungsi untuk mengirim satu transaksi
async function sendTransaction() {
  try {
    const amount = ethers.parseEther(AMOUNT_TO_SEND);

    const tx = {
      to: RECIPIENT_ADDRESS,
      value: amount,
    };

    const transaction = await wallet.sendTransaction(tx);
    console.log(`Transaksi berhasil dikirim! Hash: ${transaction.hash}`);

    await transaction.wait();
    console.log(`Transaksi dikonfirmasi! Hash: ${transaction.hash}`);
  } catch (error) {
    console.error("Gagal mengirim transaksi:", error);
  }
}

// Fungsi untuk menjadwalkan pengiriman transaksi
function scheduleTransactions() {
  let transactionCount = 0;

  const intervalId = setInterval(async () => {
    if (transactionCount >= MAX_TRANSACTIONS_PER_HOUR) {
      console.log("Batas transaksi per jam tercapai, menghentikan pengiriman.");
      clearInterval(intervalId);
      return;
    }

    await sendTransaction();
    transactionCount++;
    console.log(`Transaksi ke-${transactionCount} dikirim.`);

  }, 3600 / MAX_TRANSACTIONS_PER_HOUR * 1000); // Menghitung jeda waktu dalam milidetik
}

// Memulai pengiriman berkala
scheduleTransactions();
