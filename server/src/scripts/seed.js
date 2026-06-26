const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopmind';

const categories = ['Electronics', 'Clothing', 'Home', 'Sports', 'Books'];

const products = [
  { name: 'Bluetooth Kulaklık', description: 'Kablosuz aktif gürültü önleyici kulaklık', category: 'Electronics', price: 249.99, stock: 50, specs: { battery: '30 saat', bluetooth: '5.3' } },
  { name: 'Akıllı Saat Pro', description: 'Su geçirmez akıllı saat kalp atışı monitörlü', category: 'Electronics', price: 399.99, stock: 30, specs: { screen: '1.4 inç', water: '5 ATM' } },
  { name: 'USB-C Hub 7-in-1', description: '7 portlu USB-C çoklayıcı', category: 'Electronics', price: 49.99, stock: 100, specs: { ports: '7', usb: '3.0' } },
  { name: 'Mekanik Klavye RGB', description: 'Mekanik anahtarlı RGB aydınlatmalı gaming klavye', category: 'Electronics', price: 189.99, stock: 40, specs: { switch: 'Blue', layout: 'Full' } },
  { name: 'Kablosuz Fare', description: 'Ergonomik kablosuz fare 6 düğmeli', category: 'Electronics', price: 79.99, stock: 80, specs: { dpi: '4000', battery: '12 ay' } },
  { name: '4K Monitor 27"', description: '27 inç 4K IPS monitör HDR destekli', category: 'Electronics', price: 549.99, stock: 15, specs: { resolution: '3840x2160', panel: 'IPS' } },
  { name: 'Laptop Standı', description: 'Alüminyum ayarlanabilir laptop standı', category: 'Electronics', price: 39.99, stock: 60, specs: { material: 'Aluminum', height: 'Adjustable' } },
  { name: 'Webcam HD 1080p', description: 'Full HD webcam otomatik odaklı', category: 'Electronics', price: 69.99, stock: 45 },
  { name: 'Taşınabilir SSD 1TB', description: 'USB-C taşınabilir SSD 1TB depolama', category: 'Electronics', price: 129.99, stock: 35, specs: { capacity: '1TB', speed: '1050MB/s' } },
  { name: 'Akıllı Termostat', description: 'Wi-Fi akıllı termostat enerji tasarruflu', category: 'Electronics', price: 89.99, stock: 25 },
  { name: 'Pamuklu Tişört', description: 'Organik pamuklu günlük tişört', category: 'Clothing', price: 29.99, stock: 200, specs: { material: 'Cotton', sizes: 'S-2XL' } },
  { name: 'Kot Pantolon', description: 'Rahat kesim kot pantolon stretch kumaş', category: 'Clothing', price: 69.99, stock: 80, specs: { material: 'Denim', fit: 'Regular' } },
  { name: 'Spor Ayakkabı', description: 'Hafif koşu ayakkabısı nefes alabilir taban', category: 'Clothing', price: 149.99, stock: 50, specs: { sole: 'Rubber', closure: 'Lace' } },
  { name: 'Deri Cüzdan', description: 'El yapımı deri cüzdan 12 kartlık', category: 'Clothing', price: 59.99, stock: 40, specs: { material: 'Leather', slots: '12' } },
  { name: 'Hırka', description: 'Yün karışımlı hırka düğmeli ön', category: 'Clothing', price: 89.99, stock: 35 },
  { name: 'Kış Mont', description: 'Su geçirmez kış mont termal astarlı', category: 'Clothing', price: 199.99, stock: 30, specs: { waterproof: 'Yes', fill: 'Down' } },
  { name: 'Şapka', description: 'Pamuklu snapback şapka tek beden', category: 'Clothing', price: 19.99, stock: 150 },
  { name: 'Spor Çorap (3\'lü)', description: 'Pamuklu spor çorap 3lü paket', category: 'Clothing', price: 14.99, stock: 300 },
  { name: 'Güneş Gözlüğü', description: 'Polarize güneş gözlüğü UV400 koruma', category: 'Clothing', price: 49.99, stock: 60 },
  { name: 'Takım Elbise', description: 'Slim fit takım elbise 2 parça', category: 'Clothing', price: 299.99, stock: 20 },
  { name: 'Mutfak Robotu', description: 'Çok fonksiyonlu mutfak robotu 1000W', category: 'Home', price: 189.99, stock: 25, specs: { power: '1000W', capacity: '2L' } },
  { name: 'Kahve Makinesi', description: 'Filtre kahve makinesi 12 fincan', category: 'Home', price: 79.99, stock: 40, specs: { capacity: '12 cups', type: 'Drip' } },
  { name: 'Battaniye', description: 'Mikrofiber yumuşak battaniye 150x200', category: 'Home', price: 39.99, stock: 80 },
  { name: 'Masa Lambası', description: 'LED masa lambası ayarlanabilir parlaklık', category: 'Home', price: 44.99, stock: 55 },
  { name: 'Yastık Seti', description: 'Bellek köpük yastık 2li set', category: 'Home', price: 59.99, stock: 45 },
  { name: 'Perde Seti', description: 'Karartma perde seti 2 parça', category: 'Home', price: 34.99, stock: 60 },
  { name: 'Halı 80x150', description: 'El dokuması halı 80x150 cm', category: 'Home', price: 89.99, stock: 20 },
  { name: 'Dekoratif Vazo', description: 'Seramik dekoratif vazo 30cm', category: 'Home', price: 24.99, stock: 70 },
  { name: 'Saklama Kutusu Seti', description: 'Saklama kutusu seti 5 parça', category: 'Home', price: 49.99, stock: 90 },
  { name: 'Mum Seti', description: 'El yapımı soya mumu seti 3lü', category: 'Home', price: 29.99, stock: 50 },
  { name: 'Yoga Matı', description: 'Kaymaz yoga matı 6mm kalınlık', category: 'Sports', price: 34.99, stock: 60 },
  { name: 'Dambıl Seti', description: 'Ayarlanabilir dambıl seti 2x10kg', category: 'Sports', price: 89.99, stock: 30 },
  { name: 'Koşu Bandı', description: 'Elektrikli koşu bandı 12 program', category: 'Sports', price: 599.99, stock: 10 },
  { name: 'Spor Şişesi', description: 'Paslanmaz çelik spor şişesi 750ml', category: 'Sports', price: 19.99, stock: 120 },
  { name: 'Direnç Bandı Seti', description: 'Direnç bantları seti 5 seviye', category: 'Sports', price: 24.99, stock: 80 },
  { name: 'Bisiklet Kaskı', description: 'Havalandırmalı bisiklet kaskı ayarlanabilir', category: 'Sports', price: 49.99, stock: 35 },
  { name: 'İp Atla', description: 'Hızlı ip atlama rulmanlı', category: 'Sports', price: 12.99, stock: 100 },
  { name: 'Futbol Topu', description: 'Deri futbol topu 5 numara', category: 'Sports', price: 39.99, stock: 40 },
  { name: 'Tenis Raketi', description: 'Karbon fiber tenis raketi', category: 'Sports', price: 129.99, stock: 20 },
  { name: 'Yüzme Gözlüğü', description: 'Antibakteriyel yüzme gözlüğü UV koruma', category: 'Sports', price: 16.99, stock: 70 },
  { name: 'Suç ve Ceza', description: 'Dostoyevski klasik roman', category: 'Books', price: 14.99, stock: 50 },
  { name: 'Savaş ve Barış', description: 'Tolstoy başyapıtı 2 cilt', category: 'Books', price: 29.99, stock: 30 },
  { name: '1984', description: 'George Orwell distopik romanı', category: 'Books', price: 12.99, stock: 60 },
  { name: 'Yapay Zeka: Modern Yaklaşım', description: 'AI ders kitabı 4. basım', category: 'Books', price: 89.99, stock: 25 },
  { name: 'Clean Code', description: 'Robert Martin yazılım prensipleri', category: 'Books', price: 39.99, stock: 40 },
  { name: 'Sistem Tasarımı', description: 'Büyük ölçekli sistem tasarımı rehberi', category: 'Books', price: 44.99, stock: 35 },
  { name: 'Veri Yapıları ve Algoritmalar', description: 'CLRS algoritma kitabı', category: 'Books', price: 59.99, stock: 20 },
  { name: 'Nutuk', description: 'Atatürk\'ün Nutuk eseri tam metin', category: 'Books', price: 19.99, stock: 45 },
  { name: 'Küçük Prens', description: 'Antoine de Saint-Exupéry klasik', category: 'Books', price: 9.99, stock: 100 },
  { name: 'Python ile Makine Öğrenmesi', description: 'Python ML uygulamalı rehber', category: 'Books', price: 49.99, stock: 30 },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Product.deleteMany({});
  const created = await Product.insertMany(products);
  console.log(`Seeded ${created.length} products`);
  await mongoose.disconnect();
}

seed().catch(console.error);
