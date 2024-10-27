require('dotenv').config();
const { ethers } = require('ethers');

// Mengambil variabel dari file .env
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS;
const AMOUNT_TO_SEND = process.env.AMOUNT_TO_SEND;

// Membuat provider menggunakan URL RPC untuk Base Network
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Membuat wallet dari kunci pribadi dan provider
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function sendTransaction() {
  try {
    // Menentukan jumlah token yang akan dikirim (dalam format ether)
    const amount = ethers.parseEther(AMOUNT_TO_SEND);

    // Menyusun data transaksi
    const tx = {
      to: RECIPIENT_ADDRESS,
      value: amount,
    };

    // Mengirim transaksi
    const transaction = await wallet.sendTransaction(tx);

    console.log(`Transaksi berhasil dikirim! Hash: ${transaction.hash}`);

    // Menunggu konfirmasi transaksi
    await transaction.wait();
    console.log(`Transaksi berhasil dikonfirmasi! Hash: ${transaction.hash}`);
  } catch (error) {
    console.error("Gagal mengirim transaksi:", error);
  }
}

sendTransaction();
